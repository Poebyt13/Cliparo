# Sentry — Error Monitoring

## Cos'è

[Sentry](https://sentry.io) traccia errori e crash in produzione (e in sviluppo) con stack trace, context utente e performance monitoring. Integrato nel boilerplate via `@sentry/nextjs`.

## Struttura file

```
sentry.client.config.js   → config browser (replay, filtro errori)
sentry.server.config.js   → config server Node.js
sentry.edge.config.js     → config Edge Runtime
next.config.mjs           → wrappato con withSentryConfig
src/app/global-error.js   → cattura errori root con Sentry.captureException
```

## Setup

1. Crea un progetto su [sentry.io](https://sentry.io) (o self-hosted)
2. Copia il DSN dal progetto → Settings → Client Keys
3. Aggiungi in `.env.local`:

```env
NEXT_PUBLIC_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
```

4. (Opzionale) Per source maps in CI/CD:

```env
SENTRY_AUTH_TOKEN=sntrys_...
```

5. Riavvia il server dev — Sentry si inizializza automaticamente

## Come funziona

- **Se `NEXT_PUBLIC_SENTRY_DSN` non è configurato**: Sentry non si inizializza. Zero overhead.
- **Client**: cattura errori JS, performance, replay su errore (solo in prod).
- **Server**: cattura errori nelle API routes e server components.
- **`global-error.js`**: invia a Sentry gli errori del root layout via `Sentry.captureException`.

## Configurazione

### Performance monitoring

| Ambiente    | `tracesSampleRate` | Note                           |
|-------------|--------------------|---------------------------------|
| Development | `1.0` (100%)       | Vedi tutte le transazioni       |
| Production  | `0.1` (10%)        | Risparmia quota, dati ancora utili |

### Session Replay

| Tipo                     | Valore | Note                              |
|--------------------------|--------|-----------------------------------|
| `replaysSessionSampleRate` | `0`    | Non registra sessioni normali     |
| `replaysOnErrorSampleRate` | `1.0` (prod) | Registra replay solo quando c'è un errore |

### Filtro errori

Il `beforeSend` in `sentry.client.config.js` filtra:
- **"Failed to fetch"**: errori di rete generici del browser (non utili)

Puoi aggiungere altri filtri modificando la funzione.

## Free tier

- **~5.000 errori/mese** — ampiamente sufficiente per early-stage
- Performance monitoring: 100K transazioni/mese
- Session replay: 50 replay/mese (attivo solo su errore)

## Source Maps

Le source maps vengono caricate su Sentry solo se `SENTRY_AUTH_TOKEN` è presente. Senza token, il build funziona normalmente ma gli stack trace in Sentry saranno minificati.

Per generare un auth token: Sentry → Settings → Auth Tokens → Create New Token (scope: `project:releases`, `org:read`).
