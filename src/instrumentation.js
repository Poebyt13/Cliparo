/**
 * Eseguito da Next.js all'avvio del server (sia dev che prod).
 * Controlla le variabili d'ambiente obbligatorie e avvisa subito se mancano,
 * invece di scoprirlo a runtime al primo utilizzo.
 */
export async function register() {
  // Inizializza Sentry — deve essere prima di qualsiasi altro codice
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }

  // Esegui i controlli env solo nel runtime Node.js
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const required = {
    // Auth
    NEXTAUTH_SECRET: "autenticazione JWT (obbligatoria)",
    NEXTAUTH_URL: "URL base del sito (obbligatoria)",
    // Database
    MONGODB_URI: "connessione MongoDB (obbligatoria)",
    // Email — necessaria per Magic Link login e tutte le email transazionali
    RESEND_API_KEY: "invio email via Resend — Magic Link non funzionerà senza",
    EMAIL_FROM: "indirizzo mittente delle email",
    // OAuth
    GOOGLE_ID: "login con Google",
    GOOGLE_SECRET: "login con Google",
    // Stripe
    STRIPE_SECRET_KEY: "pagamenti Stripe",
    STRIPE_WEBHOOK_SECRET: "webhook Stripe",
  };

  const missing = Object.entries(required)
    .filter(([key]) => !process.env[key])
    .map(([key, desc]) => `   ⚠  ${key.padEnd(26)} — ${desc}`);

  if (missing.length > 0) {
    console.warn(
      `\n${"─".repeat(60)}\n` +
      `  Variabili d'ambiente OBBLIGATORIE non configurate:\n\n` +
      missing.join("\n") +
      `\n\n  Configura le variabili mancanti nel file .env.local\n` +
      `${"─".repeat(60)}\n`
    );
  }

  // Variabili opzionali — l'app funziona comunque, solo avvisi informativi
  const optional = {
    // Analytics
    NEXT_PUBLIC_POSTHOG_KEY: "PostHog analytics",
    NEXT_PUBLIC_POSTHOG_HOST: "PostHog host",
    NEXT_PUBLIC_GA_ID: "Google Analytics",
    // Error monitoring
    NEXT_PUBLIC_SENTRY_DSN: "Sentry error monitoring",
    // Admin
    NEXT_PUBLIC_ADMIN_EMAIL: "widget health check e pannello admin",
    // Rate limiting
    UPSTASH_REDIS_REST_URL: "rate limiting (Upstash Redis)",
    UPSTASH_REDIS_REST_TOKEN: "rate limiting (Upstash Redis)",
    // Storage
    R2_ACCOUNT_ID: "storage file (Cloudflare R2)",
    R2_ACCESS_KEY_ID: "storage file (Cloudflare R2)",
    R2_SECRET_ACCESS_KEY: "storage file (Cloudflare R2)",
    R2_BUCKET_NAME: "storage file (Cloudflare R2)",
    R2_PUBLIC_URL: "storage file (Cloudflare R2)",
    // Stripe prezzi
    NEXT_PUBLIC_STRIPE_PRICE_MONTHLY: "prezzo mensile Stripe",
    NEXT_PUBLIC_STRIPE_PRICE_YEARLY: "prezzo annuale Stripe",
    // Cron
    CRON_SECRET: "protezione route cron (obbligatorio in produzione)",
  };

  const missingOptional = Object.entries(optional)
    .filter(([key]) => !process.env[key])
    .map(([key, desc]) => `   ℹ  ${key.padEnd(36)} — ${desc}`);

  if (missingOptional.length > 0) {
    console.info(
      `\n${"─".repeat(60)}\n` +
      `  Funzionalità opzionali non configurate (l'app funziona comunque):\n\n` +
      missingOptional.join("\n") +
      `\n${"─".repeat(60)}\n`
    );
  }
}
