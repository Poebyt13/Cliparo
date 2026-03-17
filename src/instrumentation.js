/**
 * Eseguito da Next.js all'avvio del server (sia dev che prod).
 * Controlla le variabili d'ambiente obbligatorie e avvisa subito se mancano,
 * invece di scoprirlo a runtime al primo utilizzo.
 */
export async function register() {
  // Esegui solo nel runtime Node.js (non in Edge runtime)
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
      `  Variabili d'ambiente non configurate:\n\n` +
      missing.join("\n") +
      `\n\n  Configura le variabili mancanti nel file .env.local\n` +
      `${"─".repeat(60)}\n`
    );
  }
}
