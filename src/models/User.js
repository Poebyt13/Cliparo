import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ── Campi NextAuth (usati dall'adapter MongoDB) ──

    // Nome dell'utente
    name: {
      type: String,
      trim: true,
      default: null,
    },

    // Email univoco dell'utente
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      default: null,
    },

    // Immagine profilo (Google OAuth, ecc.)
    image: {
      type: String,
      default: null,
    },

    // Data di verifica email (impostata da NextAuth dopo il magic link)
    emailVerified: {
      type: Date,
      default: null,
    },

    // ── Campi SaaS ──

    // ID cliente Stripe per la gestione degli abbonamenti
    stripeCustomerId: {
      type: String,
      default: null,
    },

    // Stato dell'abbonamento (free, trial, premium)
    subscriptionStatus: {
      type: String,
      enum: ["free", "trial", "premium"],
      default: "free",
    },

    // Data di scadenza del piano corrente (null per free, data per trial e premium)
    subscriptionEnd: {
      type: Date,
      default: null,
    },

    // Flag: true ad ogni login, false dopo che l'utente completa /setup-profile
    profileSetupPending: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Aggiunge automaticamente createdAt e updatedAt
    timestamps: true,
    // Forza la collection "users" (compatibile con NextAuth adapter)
    collection: "users",
  }
);

/**
 * Modello User compatibile con NextAuth + MongoDB Adapter.
 * Include campi di autenticazione e dati SaaS (Stripe, abbonamento).
 */
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
