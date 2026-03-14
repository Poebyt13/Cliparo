import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { resetDatabase } from "@/lib/resetDatabase";

/**
 * POST /api/dev/reset
 * Svuota tutte le collection del database.
 * Disponibile solo in ambiente di sviluppo.
 *
 * Sicurezza: NODE_ENV è settato automaticamente da Next.js/Vercel
 * e non può essere sovrascritto dal client. Il check è affidabile.
 */
export async function POST() {
  // Blocco di sicurezza: Next.js/Vercel settano NODE_ENV automaticamente
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Non disponibile." }, { status: 403 });
  }

  try {
    await connectToDatabase();
    await resetDatabase();
    return NextResponse.json({ ok: true, message: "Database reset completato." });
  } catch (error) {
    console.error("Errore nel reset del database:", error);
    return NextResponse.json({ error: "Errore durante il reset." }, { status: 500 });
  }
}
