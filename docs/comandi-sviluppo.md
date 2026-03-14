# Comandi Utili — Sviluppo e Test

## Avvio server

```bash
npm run dev          # Avvia Next.js in modalità sviluppo (http://localhost:3000)
npm run build        # Build di produzione
npm start            # Avvia il server di produzione (dopo build)
npm run lint         # Lint con ESLint
```

---

## Database — Reset e Seed

### Resettare il database (cancella tutte le collection)

```bash
curl -X POST http://localhost:3000/api/dev/reset
```

> ⚠️ Elimina **tutti** gli utenti, sessioni e documenti. Solo in sviluppo.

### Seed utenti di test

```bash
curl -X POST http://localhost:3000/api/dev/seed
```

Crea 5 utenti:

| Email | Piano | Scadenza |
|---|---|---|
| `free@test.dev` | free | — |
| `trial@test.dev` | trial | tra 15 giorni |
| `trial-expired@test.dev` | trial | ieri |
| `premium@test.dev` | premium | tra 30 giorni |
| `premium-expired@test.dev` | premium | ieri |

### Reset + Seed insieme

```bash
curl -s -X POST http://localhost:3000/api/dev/reset && curl -s -X POST http://localhost:3000/api/dev/seed
```

---

## Cron — Controllo scadenze

### Eseguire il cron manualmente (avviso 3 giorni prima)

```bash
curl http://localhost:3000/api/cron/subscriptions
```

Risposta:
```json
{ "ok": true, "warned": ["email@test.dev"], "errors": [] }
```

> In locale non richiede autenticazione. In produzione è protetto da `CRON_SECRET`.

### Testare l'avviso: modifica la scadenza a 3 giorni

In MongoDB Compass o shell:
```js
db.users.updateOne(
  { email: "trial@test.dev" },
  { $set: { subscriptionEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) } }
)
```
Poi riesegui il curl — l'utente apparirà in `warned`.

---

## Stripe — Test webhook in locale

### 1. Avvia il listener Stripe (in un terminale separato)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copia il `whsec_...` che stampa e mettilo in `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx
```

### 2. Simula eventi

```bash
# Abbonamento creato
stripe trigger customer.subscription.created

# Abbonamento aggiornato
stripe trigger customer.subscription.updated

# Abbonamento cancellato (downgrade a free + email scadenza)
stripe trigger customer.subscription.deleted

# Pagamento riuscito
stripe trigger invoice.payment_succeeded

# Pagamento fallito
stripe trigger invoice.payment_failed
```

## 3 TEST — Simulare la scadenza abbonamento

Simula il downgrade a free + invio email di scadenza, esattamente come farebbe Stripe in produzione:

```bash
curl -s -X POST http://localhost:3000/api/dev/test-expire \
  -H "Content-Type: application/json" \
  -d '{"email": "premium@test.dev"}'

---

## Riepilogo endpoint

| Metodo | URL | Scopo | Ambiente |
|---|---|---|---|
| POST | `/api/dev/reset` | Reset completo database | Solo dev |
| POST | `/api/dev/seed` | Crea utenti di test | Solo dev |
| GET | `/api/cron/subscriptions` | Avviso scadenza 3 giorni | Dev + Prod (con `CRON_SECRET`) |
| POST | `/api/dev/test-expire` | Simula scadenza abbonamento (downgrade + email) | Solo dev |
| GET/POST | `/api/auth/*` | NextAuth (login, sessione) | Tutti |
| POST | `/api/stripe/checkout` | Crea sessione checkout Stripe | Tutti |
| POST | `/api/stripe/webhook` | Riceve eventi da Stripe | Tutti |
| POST | `/api/user/setup-profile` | Completa profilo utente | Tutti |
