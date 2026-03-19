import * as Sentry from "@sentry/nextjs";

// Inizializza Sentry solo se il DSN è configurato
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Performance monitoring — campiona il 10% delle transazioni in produzione
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Replay solo in produzione (risparmia quota)
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: process.env.NODE_ENV === "production" ? 1.0 : 0,

    // Abilita log di debug solo in sviluppo
    debug: false, //process.env.NODE_ENV !== "production",

    // Filtra errori non utili (es. errori di rete del browser)
    beforeSend(event) {
      // Ignora errori di rete generici del browser
      if (event.exception?.values?.[0]?.type === "TypeError" &&
          event.exception?.values?.[0]?.value?.includes("Failed to fetch")) {
        return null;
      }
      return event;
    },
  });
}
