import { NextResponse } from "next/server";
import { checkSubscriptions } from "@/lib/subscriptionCron";

/**
 * GET /api/cron/subscriptions
 *
 * Endpoint chiamato da Vercel Cron (ogni giorno alle 08:00 UTC).
 * Controlla abbonamenti in scadenza e scaduti.
 *
 * Protetto con CRON_SECRET per evitare chiamate non autorizzate.
 * In sviluppo (NODE_ENV !== "production") la verifica è disabilitata.
 */
export async function GET(request) {
  // Verifica il secret in produzione (Vercel invia l'header Authorization)
  if (process.env.NODE_ENV === "production") {
    // Guard: se CRON_SECRET non è configurato, blocca per sicurezza
    if (!process.env.CRON_SECRET) {
      console.error("CRON_SECRET non configurato in produzione.");
      return NextResponse.json(
        { error: "Configurazione server mancante." },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
    }
  }

  try {
    const results = await checkSubscriptions();
    return NextResponse.json({ ok: true, ...results });
  } catch (error) {
    console.error("Errore cron subscriptions:", error);
    return NextResponse.json(
      { error: "Errore durante il controllo abbonamenti." },
      { status: 500 }
    );
  }
}
