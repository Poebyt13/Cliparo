import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Definisci la variabile d'ambiente MONGODB_URI.");
}

// Cache globale per riutilizzare la connessione in sviluppo
let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

/**
 * Stabilisce una connessione a MongoDB utilizzando Mongoose.
 * Riusa la connessione durante lo sviluppo per evitare connessioni multiple.
 * @returns {Promise<Object>} Istanza di Mongoose connessa
 */
export default async function connectToDatabase() {
  // Ritorna la connessione già esistente
  if (cached.conn) {
    return cached.conn;
  }

  // Crea la Promise di connessione se non esiste
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Resetta la Promise in caso di errore
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
