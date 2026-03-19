import * as Sentry from "@sentry/nextjs";

// Inizializza Sentry per Edge Runtime solo se il DSN è configurato
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    debug: false ,//process.env.NODE_ENV !== "production",
  });
}
