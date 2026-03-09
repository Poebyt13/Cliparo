import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Definisci la variabile d'ambiente MONGODB_URI.");
}

let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Riusa il client nativo in sviluppo per evitare connessioni multiple
  if (!globalThis._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI);
    globalThis._mongoClientPromise = client.connect();
  }
  clientPromise = globalThis._mongoClientPromise;
} else {
  // In produzione crea sempre un nuovo client
  const client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export default clientPromise;
