import * as Sentry from "@sentry/nextjs";

/**
 * Inizializzazione Sentry lato client.
 *
 * Questo file viene caricato da Next.js 15+ (incluso con Turbopack).
 * Sostituisce sentry.client.config.js che non funziona con Turbopack.
 */
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Session replay solo sugli errori in produzione (nessuna registrazione normale)
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: process.env.NODE_ENV === "production" ? 1.0 : 0,

    // Disabilita log di debug
    debug: false,

    // Ignora errori di rete generici del browser (non utili)
    beforeSend(event) {
      if (
        event.exception?.values?.[0]?.type === "TypeError" &&
        event.exception?.values?.[0]?.value?.includes("Failed to fetch")
      ) {
        return null;
      }
      return event;
    },
  });
}

// Necessario per tracciare le navigazioni client-side con App Router
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
