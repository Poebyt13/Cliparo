import mongoose from "mongoose";

/**
 * Elimina tutti i documenti da ogni collection del database.
 * Utilizzata solo in sviluppo per avere un DB pulito ad ogni avvio.
 */
export async function resetDatabase() {
  // Blocco di sicurezza: non eseguire mai in produzione
  if (process.env.NODE_ENV === "production") {
    throw new Error("resetDatabase non può essere eseguita in produzione.");
  }

  try {
    const collections = await mongoose.connection.db.collections();

    // Svuota ogni collection preservando la struttura
    for (const collection of collections) {
      await collection.deleteMany({});
    }

    console.log("Database reset completato");
  } catch (error) {
    console.error("Errore durante il reset del database:", error);
    throw error;
  }
}
