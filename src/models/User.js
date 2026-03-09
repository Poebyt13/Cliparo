import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Email univoco dell'utente
    email: {
      type: String,
      required: [true, "Email è obbligatoria"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Inserisci un'email valida"],
    },

    // Nome dell'utente
    name: {
      type: String,
      required: [true, "Nome è obbligatorio"],
      trim: true,
    },

    // ID cliente Stripe per la gestione degli abbonamenti
    stripeCustomerId: {
      type: String,
      default: null,
    },

    // Stato dell'abbonamento (free, premium, trial)
    subscriptionStatus: {
      type: String,
      enum: ["free", "premium", "trial"],
      default: "free",
    },
  },
  {
    // Aggiunge automaticamente createdAt e updatedAt
    timestamps: true,
  }
);

/**
 * Modello User per la gestione degli utenti.
 * Contiene informazioni essenziali: email, nome, abbonamento e integrazione Stripe.
 */
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
