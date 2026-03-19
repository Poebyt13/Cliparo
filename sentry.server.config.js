import * as Sentry from "@sentry/nextjs";

// Inizializza Sentry lato server solo se il DSN è configurato
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Performance monitoring — campiona il 10% delle transazioni in produzione
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Abilita log di debug solo in sviluppo
    debug: false, //process.env.NODE_ENV !== "production",
  });
}
