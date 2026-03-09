import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

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
        await updateUserSubscription(subscription.customer, subscription.status);
        break;
      }

      // Abbonamento cancellato
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await updateUserSubscription(subscription.customer, "canceled");
        break;
      }

      // Pagamento della fattura andato a buon fine
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          await updateUserSubscription(invoice.customer, "active");
        }
        break;
      }

      // Pagamento della fattura fallito
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          await updateUserSubscription(invoice.customer, "past_due");
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
 * Aggiorna lo stato dell'abbonamento dell'utente nel database.
 * @param {string} stripeCustomerId - ID cliente Stripe
 * @param {string} stripeStatus - Stato abbonamento restituito da Stripe
 */
async function updateUserSubscription(stripeCustomerId, stripeStatus) {
  const subscriptionStatus = SUBSCRIPTION_STATUS_MAP[stripeStatus] ?? "free";

  const user = await User.findOneAndUpdate(
    { stripeCustomerId },
    { subscriptionStatus },
    { new: true }
  );

  if (!user) {
    console.warn(`Utente con stripeCustomerId ${stripeCustomerId} non trovato.`);
  }
}
