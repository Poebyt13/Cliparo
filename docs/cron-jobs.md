# Cron Jobs e Scadenza Abbonamenti

## Panoramica

La gestione delle scadenze è divisa in due sistemi:

### 1. Cron job (Vercel Cron) — solo avviso pre-scadenza
Gira ogni giorno. Cerca utenti trial/premium la cui scadenza cade tra 3 giorni e manda un'email di promemoria.

### 2. Webhook Stripe — downgrade in tempo reale
Quando un abbonamento scade, Stripe invia `customer.subscription.deleted`. Il webhook aggiorna il DB a `free` e manda l'email "piano scaduto" nello stesso momento.

### 3. Session callback — rete di sicurezza
Ad ogni accesso, il session callback verifica se `subscriptionEnd < now`. Questo copre edge case (downtime, webhook falliti) ma non è il meccanismo principale.

---

## File coinvolti

| File | Ruolo |
|---|---|
| `vercel.json` | Configura lo schedule Vercel Cron |
| `src/app/api/cron/subscriptions/route.js` | Endpoint GET chiamato da Vercel (solo avviso) |
| `src/lib/subscriptionCron.js` | Logica cron: query utenti + invio email avviso |
| `src/app/api/stripe/webhook/route.js` | Webhook: downgrade a free + email scadenza |
| `src/emails/subscriptionExpiring.jsx` | Template email "scade tra N giorni" |
| `src/emails/subscriptionExpired.jsx` | Template email "piano scaduto" |
| `src/lib/auth.js` | Session callback: rete di sicurezza on-the-fly |

---

## Variabili d'ambiente richieste

### `.env.local` (sviluppo) / Vercel Dashboard (produzione)

| Variabile | Descrizione | Esempio |
|---|---|---|
| `CRON_SECRET` | Token segreto per proteggere l'endpoint in produzione | `una-stringa-lunga-casuale` |
| `NEXTAUTH_URL` | URL base del sito — usato nel link "Rinnova piano" nelle email | `https://miodominio.com` |
| `RESEND_API_KEY` | Chiave API Resend per l'invio email | `re_xxxxxxxxxxxx` |
| `EMAIL_FROM` | Indirizzo mittente delle email | `noreply@miodominio.com` |
| `MONGODB_URI` | Stringa di connessione MongoDB | `mongodb+srv://...` |

> `CRON_SECRET` **non serve in sviluppo** — il check viene saltato automaticamente quando `NODE_ENV !== "production"`.

---

## Configurazione schedule

Il file `vercel.json` alla radice del progetto definisce quando gira il cron:

```json
{
  "crons": [
    {
      "path": "/api/cron/subscriptions",
      "schedule": "0 8 * * *"
    }
  ]
}
```

`"0 8 * * *"` = ogni giorno alle **08:00 UTC** (10:00 ora italiana in estate, 09:00 in inverno).

### Esempi di schedule alternativi

| Schedule | Quando gira |
|---|---|
| `"0 8 * * *"` | Ogni giorno alle 08:00 UTC (default) |
| `"0 6 * * *"` | Ogni giorno alle 06:00 UTC |
| `"0 8 * * 1"` | Solo il lunedì alle 08:00 UTC |
| `"0 */6 * * *"` | Ogni 6 ore |

Sintassi: `minuto ora giorno-del-mese mese giorno-della-settimana`

---

## Parametri configurabili nel codice

In `src/lib/subscriptionCron.js`:

```js
// Giorni prima della scadenza per inviare l'email di avviso
const WARNING_DAYS = 3;   // ← modifica questo numero

// URL del bottone "Rinnova piano" nelle email
const RENEW_URL = `${process.env.NEXTAUTH_URL}/pricing`;  // ← cambia "/pricing" se serve
```

---

## Deploy su Vercel

### 1. Aggiungi `CRON_SECRET` alle variabili d'ambiente

Nel pannello Vercel → **Settings → Environment Variables**:

```
CRON_SECRET = <genera una stringa casuale sicura>
```

Per generarne una da terminale:
```bash
openssl rand -base64 32
```

### 2. Assicurati che `vercel.json` sia nella root del progetto

Vercel lo legge automaticamente al deploy. Nessuna configurazione aggiuntiva necessaria.

### 3. Verifica dal pannello Vercel

Dopo il deploy: **Dashboard del progetto → Cron Jobs** — vedrai il job con lo schedule e i log delle esecuzioni passate.

---

## Test in locale

L'endpoint non richiede autenticazione in sviluppo (`NODE_ENV=development`). Chiama semplicemente:

```bash
curl http://localhost:3000/api/cron/subscriptions
```

Risposta attesa:
```json
{
  "ok": true,
  "warned": ["utente@esempio.com"],
  "errors": []
}
```

### Per testare l'avviso dei 3 giorni

Con il seed attivo, aggiorna la `subscriptionEnd` di un utente test a esattamente 3 giorni da oggi con MongoDB Compass (o shell):

```js
db.users.updateOne(
  { email: "trial@test.dev" },
  { $set: { subscriptionEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) } }
)
```

Poi esegui di nuovo il curl — l'utente apparirà in `warned`.

### Per testare il downgrade (via Stripe webhook)

Il downgrade è gestito dal webhook Stripe (`customer.subscription.deleted`), non dal cron.

Con Stripe CLI:
```bash
stripe trigger customer.subscription.deleted
```

Oppure per testare il session callback come rete di sicurezza, imposta `subscriptionEnd` a ieri nel DB:
```js
db.users.updateOne(
  { email: "premium@test.dev" },
  { $set: { subscriptionEnd: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
)
```
Al prossimo login, la sessione restituirà `subscriptionStatus: "free"`.

---

## Flusso completo

```
T - 3 giorni   →  [CRON]     email "il tuo piano scade tra 3 giorni"
T - 0          →  [WEBHOOK]  email "il tuo piano è scaduto" + DB aggiornato a free
T + qualsiasi  →  [SESSION]  rete di sicurezza: se subscriptionEnd < now → free
```

| Meccanismo | Compito | Trigger |
|---|---|---|
| Cron job | Avviso 3 giorni prima | Vercel Cron, ogni giorno alle 08:00 UTC |
| Webhook Stripe | Downgrade + email scadenza | `customer.subscription.deleted` (tempo reale) |
| Session callback | Rete di sicurezza | Ogni accesso dell'utente |
