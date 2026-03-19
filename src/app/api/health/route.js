import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

/**
 * GET /api/health
 * Restituisce lo stato di tutti i servizi integrati.
 * Accessibile solo all'admin (NEXT_PUBLIC_ADMIN_EMAIL).
 */
export async function GET() {
  // Verifica autenticazione admin
  const session = await getServerSession(authOptions);
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!session || !adminEmail || session.user?.email !== adminEmail) {
    return Response.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const services = {};

  // MongoDB — verifica connessione attiva
  try {
    const state = mongoose.connection.readyState;
    // 0 = disconnesso, 1 = connesso, 2 = connecting, 3 = disconnecting
    if (state === 1) {
      services.mongodb = { status: "ok", message: "Connesso" };
    } else {
      // Prova a importare e connettersi
      const connectToDatabase = (await import("@/lib/mongodb")).default;
      await connectToDatabase();
      services.mongodb = { status: "ok", message: "Connesso" };
    }
  } catch (err) {
    services.mongodb = { status: "error", message: err.message };
  }

  // Stripe — verifica che la chiave sia configurata e funzionante
  if (process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = (await import("@/lib/stripe")).default;
      await stripe.balance.retrieve();
      services.stripe = { status: "ok", message: "API key valida" };
    } catch (err) {
      services.stripe = { status: "error", message: err.message };
    }
  } else {
    services.stripe = { status: "not_configured", message: "STRIPE_SECRET_KEY mancante" };
  }

  // Resend — verifica che la chiave sia configurata
  if (process.env.RESEND_API_KEY) {
    services.resend = { status: "ok", message: "API key configurata" };
  } else {
    services.resend = { status: "not_configured", message: "RESEND_API_KEY mancante" };
  }

  // Cloudflare R2
  if (process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_BUCKET_NAME) {
    services.r2 = { status: "ok", message: "Configurato" };
  } else {
    services.r2 = { status: "not_configured", message: "Credenziali R2 mancanti" };
  }

  // Upstash Redis
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    services.upstash = { status: "ok", message: "Configurato" };
  } else {
    services.upstash = { status: "not_configured", message: "Credenziali Upstash mancanti" };
  }

  // PostHog
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    services.posthog = { status: "ok", message: "Configurato" };
  } else {
    services.posthog = { status: "not_configured", message: "NEXT_PUBLIC_POSTHOG_KEY mancante" };
  }

  // Google Analytics
  if (process.env.NEXT_PUBLIC_GA_ID) {
    services.googleAnalytics = { status: "ok", message: "Configurato" };
  } else {
    services.googleAnalytics = { status: "not_configured", message: "NEXT_PUBLIC_GA_ID mancante" };
  }

  // Sentry
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    services.sentry = { status: "ok", message: "Configurato" };
  } else {
    services.sentry = { status: "not_configured", message: "NEXT_PUBLIC_SENTRY_DSN mancante" };
  }

  // Calcola stato globale
  const statuses = Object.values(services).map((s) => s.status);
  const overall = statuses.includes("error")
    ? "error"
    : statuses.includes("not_configured")
      ? "partial"
      : "ok";

  return Response.json({ overall, services });
}
