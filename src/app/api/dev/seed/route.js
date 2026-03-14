import { NextResponse } from "next/server";
import { seedUsers } from "@/lib/seedUsers";

/**
 * POST /api/dev/seed
 * Crea gli utenti di test nel database.
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
    const users = await seedUsers();
    return NextResponse.json({ ok: true, users });
  } catch (error) {
    console.error("Errore nel seed:", error);
    return NextResponse.json({ error: "Errore durante il seed." }, { status: 500 });
  }
}