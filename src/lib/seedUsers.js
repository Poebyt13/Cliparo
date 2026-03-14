import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

// Durata trial: 15 giorni
const TRIAL_DAYS = 15;

/**
 * Utenti di test da creare nel seed.
 * Le password non sono necessarie (login via Magic Link / Google).
 */
const SEED_USERS = [
  {
    name: "Test Free",
    email: "free@test.dev",
    subscriptionStatus: "free",
    subscriptionEnd: null,
  },
  {
    name: "Test Trial",
    email: "trial@test.dev",
    subscriptionStatus: "trial",
    subscriptionEnd: new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000),
  },
  {
    name: "Test Trial Scaduto",
    email: "trial-expired@test.dev",
    subscriptionStatus: "trial",
    subscriptionEnd: new Date(Date.now() - 24 * 60 * 60 * 1000), // ieri
  },
  {
    name: "Test Premium",
    email: "premium@test.dev",
    subscriptionStatus: "premium",
    subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // tra 30 giorni
  },
  {
    name: "Test Premium Scaduto",
    email: "premium-expired@test.dev",
    subscriptionStatus: "premium",
    subscriptionEnd: new Date(Date.now() - 24 * 60 * 60 * 1000), // ieri
  },
];

/**
 * Crea gli utenti di test nel database.
 * Usa upsert per non duplicare se già esistono.
 * Solo in ambiente di sviluppo.
 */
export async function seedUsers() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("seedUsers non può essere eseguita in produzione.");
  }

  await connectToDatabase();

  const results = [];

  for (const userData of SEED_USERS) {
    // Elimina prima per evitare duplicati, poi crea il documento fresco
    // (findOneAndUpdate con $set può omettere i campi Date esplicitamente null)
    await User.deleteOne({ email: userData.email });
    const user = await User.create({
      ...userData,
      emailVerified: new Date(),
      profileSetupPending: false,
      stripeCustomerId: null,
    });
    results.push({ email: user.email, status: user.subscriptionStatus });
  }

  console.log("Seed utenti completato:", results);
  return results;
}