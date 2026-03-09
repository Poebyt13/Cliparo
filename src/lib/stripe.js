import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Definisci la variabile d'ambiente STRIPE_SECRET_KEY.");
}

/**
 * Istanza Stripe inizializzata con la chiave segreta.
 * Riutilizzabile in tutte le route e utility del progetto.
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

export default stripe;
