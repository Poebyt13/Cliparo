import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/resend";
import SubscriptionExpiredEmail from "@/emails/subscriptionExpired";

/**
 * Mappa gli status Stripe agli stati interni del modello User.
 */
const SUBSCRIPTION_STATUS_MAP = {
  active: "premium",
  trialing: "trial",
  canceled: "free",
  unpaid: "free",
  past_due: "free",
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
    console.error("Firma webhook non valida:", error.message);
    return NextResponse.json({ error: "Firma webhook non valida." }, { status: 400 });
  }

  try {
    await connectToDatabase();

    switch (event.type) {
      // Abbonamento creato o aggiornato
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        await updateUserSubscription(subscription.customer, subscription.status, subscription);
        break;
      }

      // Abbonamento cancellato → downgrade a free + email di notifica
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const user = await updateUserSubscription(subscription.customer, "canceled", null);

        // Invia email di notifica scadenza
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
        break;
      }

      // Pagamento della fattura andato a buon fine
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          // Recupera la subscription aggiornata per avere current_period_end
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          await updateUserSubscription(invoice.customer, subscription.status, subscription);
        }
        break;
      }

      // Pagamento della fattura fallito
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          await updateUserSubscription(invoice.customer, "past_due", null);
        }
        break;
      }

      default:
        // Evento non gestito: ignora silenziosamente
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
 * @param {string} stripeCustomerId - ID cliente Stripe
 * @param {string} stripeStatus - Stato abbonamento restituito da Stripe
 * @param {object|null} subscription - Oggetto subscription Stripe (per current_period_end)
 */
async function updateUserSubscription(stripeCustomerId, stripeStatus, subscription) {
  const subscriptionStatus = SUBSCRIPTION_STATUS_MAP[stripeStatus] ?? "free";

  // Calcola subscriptionEnd in base allo stato
  let subscriptionEnd = null;
  if (subscriptionStatus === "premium" && subscription?.current_period_end) {
    // Premium: scadenza dal periodo Stripe (timestamp in secondi → millisecondi)
    subscriptionEnd = new Date(subscription.current_period_end * 1000);
  } else if (subscriptionStatus === "trial" && subscription?.trial_end) {
    // Trial: usa trial_end di Stripe se disponibile, altrimenti +15 giorni
    subscriptionEnd = new Date(subscription.trial_end * 1000);
  } else if (subscriptionStatus === "trial") {
    // Trial senza trial_end esplicito: fallback a 15 giorni da ora
    subscriptionEnd = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
  }
  // Free → subscriptionEnd rimane null

  const user = await User.findOneAndUpdate(
    { stripeCustomerId },
    { subscriptionStatus, subscriptionEnd },
    { new: true }
  );

  if (!user) {
    console.warn(`Utente con stripeCustomerId ${stripeCustomerId} non trovato.`);
  }

  return user;
}
