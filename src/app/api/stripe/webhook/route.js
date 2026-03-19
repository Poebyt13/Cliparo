import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/resend";
import SubscriptionExpiredEmail from "@/emails/subscriptionExpired";
import PaymentConfirmationEmail from "@/emails/paymentConfirmation";
import { formatPrice } from "@/utils/formatPrice";

/**
 * Mappa gli status Stripe agli stati interni del modello User.
 */
const SUBSCRIPTION_STATUS_MAP = {
  active: "premium",
  trialing: "trial",
  canceled: "free",
  // past_due e unpaid: Stripe ritenta il pagamento automaticamente.
  // L'utente resta nel piano attivo fino a customer.subscription.deleted.
  unpaid: "premium",
  past_due: "premium",
  incomplete: "free",
  incomplete_expired: "free",
};

/**
 * POST /api/stripe/webhook
 * Riceve e processa gli eventi Stripe per mantenere sincronizzato lo stato abbonamento.
 * Richiede il webhook secret per la verifica della firma.
 */
export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Firma Stripe mancante." }, { status: 400 });
  }

  let event;

  // Verifica la firma del webhook per sicurezza
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("⚠️ Firma webhook non valida:", error.message);
    return NextResponse.json({ error: "Firma webhook non valida." }, { status: 400 });
  }

  // Log evento ricevuto per debug
  console.log(`\n🔔 Webhook ricevuto: ${event.type} (${event.id})`);

  try {
    await connectToDatabase();

    switch (event.type) {
      // Checkout completato → collega stripeCustomerId + aggiorna abbonamento
      case "checkout.session.completed": {
        const checkoutSession = event.data.object;
        const customerId = checkoutSession.customer;
        const userId = checkoutSession.metadata?.userId;

        console.log(`  checkout.session.completed → customer: ${customerId}, userId: ${userId}, subscriptionId: ${checkoutSession.subscription}`);

        if (customerId && userId) {
          // Collega stripeCustomerId se non ancora presente (safety net)
          await User.findOneAndUpdate(
            { _id: userId, stripeCustomerId: null },
            { stripeCustomerId: customerId }
          );
        }

        // Se il checkout è per un abbonamento, aggiorna subito stato + subscriptionEnd
        // (non aspettiamo customer.subscription.created che potrebbe non arrivare)
        if (checkoutSession.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            checkoutSession.subscription
          );
          console.log(`  → subscription status: ${subscription.status}, current_period_end: ${subscription.current_period_end}`);
          await updateUserSubscription(customerId, subscription.status, subscription);

          // Invia email di conferma pagamento (sempre, il pagamento va sempre confermato)
          if (userId) {
            const user = await User.findById(userId).lean();
            if (user?.email) {
              const planName = subscription.items?.data?.[0]?.price?.nickname || "Premium";
              const amount = checkoutSession.amount_total;
              try {
                await sendEmail({
                  to: user.email,
                  subject: "Pagamento confermato — Grazie per il tuo abbonamento!",
                  react: PaymentConfirmationEmail({
                    name: user.name || user.email,
                    plan: planName,
                    amount: amount ? formatPrice(amount) : "—",
                    date: new Date().toLocaleDateString("it-IT"),
                    dashboardUrl: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard`,
                  }),
                });
                console.log(`  📧 Email conferma pagamento inviata a ${user.email}`);
              } catch (err) {
                console.error("Errore invio email conferma pagamento:", err);
              }
            }
          }
        }
        break;
      }

      // Abbonamento creato o aggiornato
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subEvent = event.data.object;

        console.log(`  ${event.type} → customer: ${subEvent.customer}, status: ${subEvent.status}, cancel_at_period_end: ${subEvent.cancel_at_period_end}, current_period_end: ${subEvent.current_period_end}`);

        // Skip status che non richiedono azione:
        // - incomplete / incomplete_expired: pagamento ancora in corso o fallito.
        //   checkout.session.completed gestisce già l'attivazione con fetch esplicito.
        // - canceled: gestito da customer.subscription.deleted.
        if (["incomplete", "incomplete_expired", "canceled"].includes(subEvent.status)) {
          console.log(`  → status '${subEvent.status}': skip`);
          break;
        }

        // Il payload webhook spesso NON include current_period_end.
        // Fetch la subscription completa dall'API Stripe per avere tutti i campi.
        let subscription = subEvent;
        if (!subEvent.current_period_end && subEvent.id) {
          console.log("  → current_period_end mancante nel payload, recupero da Stripe API...");
          subscription = await stripe.subscriptions.retrieve(subEvent.id);
          console.log(`  → recuperata: status=${subscription.status}, current_period_end=${subscription.current_period_end}`);
        }

        await updateUserSubscription(subscription.customer, subscription.status, subscription);
        break;
      }

      // Abbonamento cancellato da Stripe
      case "customer.subscription.deleted": {
        const subEvent = event.data.object;

        // Fetch completo se current_period_end manca nel payload
        let subscription = subEvent;
        if (!subEvent.current_period_end && subEvent.id) {
          try {
            subscription = await stripe.subscriptions.retrieve(subEvent.id);
          } catch {
            // Se la subscription non esiste più su Stripe, usa il payload originale
            subscription = subEvent;
          }
        }

        const periodEnd = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : null;
        // L'utente ha ancora tempo pagato se current_period_end è nel futuro
        // (tolleranza di 60s per evitare race condition sui timestamp)
        const hasRemainingTime = periodEnd && periodEnd > new Date(Date.now() - 60_000);

        console.log(`  subscription.deleted → customer: ${subscription.customer}, current_period_end: ${subscription.current_period_end}, periodEnd: ${periodEnd?.toISOString()}, hasRemainingTime: ${hasRemainingTime}`);

        let user;

        if (hasRemainingTime) {
          // L'utente ha già pagato il periodo corrente: manteniamo premium + subscriptionEnd.
          // Il session callback gestirà il downgrade a free quando subscriptionEnd passa.
          user = await User.findOneAndUpdate(
            { stripeCustomerId: subscription.customer },
            { subscriptionEnd: periodEnd, cancelAtPeriodEnd: false },
            { returnDocument: "after" }
          );
          console.log(`  → periodo ancora attivo: mantenuto premium fino a ${periodEnd.toISOString()}`);
        } else {
          // Periodo scaduto o nullo → downgrade immediato a free.
          user = await updateUserSubscription(subscription.customer, "canceled", null);
          console.log("  → periodo scaduto: downgrade a free");

          // Invia email di notifica scadenza solo quando il piano è effettivamente finito
          if (user?.email) {
            const renewUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/pricing`;
            try {
              await sendEmail({
                to: user.email,
                subject: "Il tuo piano è scaduto",
                react: SubscriptionExpiredEmail({
                  name: user.name,
                  plan: "premium",
                  renewUrl,
                }),
              });
            } catch (err) {
              console.error("Errore invio email scadenza:", err);
            }
          }
        }
        break;
      }

      // Pagamento della fattura andato a buon fine
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        console.log(`  invoice.payment_succeeded → customer: ${invoice.customer}, subscriptionId: ${invoice.subscription}`);
        if (invoice.subscription) {
          // Recupera la subscription aggiornata per avere current_period_end
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          console.log(`  → subscription status: ${subscription.status}, current_period_end: ${subscription.current_period_end}`);
          await updateUserSubscription(invoice.customer, subscription.status, subscription);
        }
        break;
      }

      // Pagamento della fattura fallito
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        console.log(`  invoice.payment_failed → customer: ${invoice.customer}, subscriptionId: ${invoice.subscription}`);
        if (invoice.subscription) {
          // Recupera la subscription per preservare current_period_end
          // (NON passare null: causerebbe subscriptionEnd: null con status premium)
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          console.log(`  → subscription status: ${subscription.status}, current_period_end: ${subscription.current_period_end}`);
          await updateUserSubscription(invoice.customer, subscription.status, subscription);
        }
        break;
      }

      default:
        console.log(`  → evento non gestito, ignorato`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Errore nella gestione del webhook:", error);
    return NextResponse.json({ error: "Errore interno del server." }, { status: 500 });
  }
}

/**
 * Aggiorna lo stato dell'abbonamento e la data di scadenza dell'utente nel database.
 *
 * REGOLA CHIAVE: subscriptionEnd viene impostato a null SOLO quando lo status è "free".
 * Se lo status è "premium"/"trial" ma non abbiamo una data, NON tocchiamo subscriptionEnd
 * nel DB per evitare di sovrascrivere una data valida già presente.
 *
 * @param {string} stripeCustomerId - ID cliente Stripe
 * @param {string} stripeStatus - Stato abbonamento restituito da Stripe
 * @param {object|null} subscription - Oggetto subscription Stripe (per current_period_end)
 */
async function updateUserSubscription(stripeCustomerId, stripeStatus, subscription) {
  const subscriptionStatus = SUBSCRIPTION_STATUS_MAP[stripeStatus] ?? "free";

  // Costruisce i campi da aggiornare — subscriptionEnd solo se abbiamo un valore certo
  const updateData = { subscriptionStatus };

  // Salva il flag cancel_at_period_end (utente ha cancellato ma periodo ancora attivo)
  updateData.cancelAtPeriodEnd = subscription?.cancel_at_period_end === true;

  if (subscriptionStatus === "premium" && subscription?.current_period_end) {
    // Premium: scadenza dal periodo Stripe (timestamp in secondi → millisecondi)
    updateData.subscriptionEnd = new Date(subscription.current_period_end * 1000);
  } else if (subscriptionStatus === "trial" && subscription?.trial_end) {
    // Trial: usa trial_end di Stripe se disponibile
    updateData.subscriptionEnd = new Date(subscription.trial_end * 1000);
  } else if (subscriptionStatus === "trial") {
    // Trial senza trial_end esplicito: fallback a 15 giorni da ora
    updateData.subscriptionEnd = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
  } else if (subscriptionStatus === "free") {
    // Free → esplicitamente null
    updateData.subscriptionEnd = null;
  }
  // Se premium/trial ma senza data disponibile → NON tocchiamo subscriptionEnd
  // (preserva il valore esistente nel DB)

  console.log(`  📝 updateUserSubscription → customer: ${stripeCustomerId}, stripeStatus: "${stripeStatus}" → mapped: "${subscriptionStatus}", subscriptionEnd: ${updateData.subscriptionEnd !== undefined ? (updateData.subscriptionEnd?.toISOString() ?? "null") : "(invariato)"}`);

  const user = await User.findOneAndUpdate(
    { stripeCustomerId },
    updateData,
    { returnDocument: "after" }
  );

  if (!user) {
    console.warn(`  ⚠️ Utente con stripeCustomerId ${stripeCustomerId} non trovato.`);
  } else {
    console.log(`  ✅ DB aggiornato → status: "${user.subscriptionStatus}", end: ${user.subscriptionEnd?.toISOString() ?? "null"}`);
  }

  return user;
}
