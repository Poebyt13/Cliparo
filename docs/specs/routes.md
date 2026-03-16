# Routes — API e Pagine

## API Routes

### Autenticazione

| Metodo | Endpoint | Rate Limit | Descrizione |
|--------|----------|-----------|-------------|
| GET/POST | `/api/auth/[...nextauth]` | — | NextAuth handler (login, callback, session, signout) |

---

### Stripe

| Metodo | Endpoint | Rate Limit | Descrizione |
|--------|----------|-----------|-------------|
| POST | `/api/stripe/checkout` | 5 req/min | Crea una Stripe Checkout Session per avviare un abbonamento |
| POST | `/api/stripe/portal` | 20 req/min | Crea una sessione Stripe Customer Portal (gestione abbonamento) |
| GET | `/api/stripe/invoices` | 20 req/min | Restituisce le ultime fatture dell'utente |
| POST | `/api/stripe/webhook` | — | Riceve eventi Stripe (non autenticato, verifica via signing secret) |

#### POST `/api/stripe/checkout`

**Auth:** richiede sessione. **Body JSON:**

```json
{ "priceId": "price_xxx" }
```

**Risposta:** `{ "url": "https://checkout.stripe.com/..." }`

Crea o riusa il `stripeCustomerId` dell'utente. Redirige alla Stripe Checkout Page.

#### POST `/api/stripe/portal`

**Auth:** richiede sessione. Nessun body.

**Risposta:** `{ "url": "https://billing.stripe.com/..." }`

Redirige al Stripe Customer Portal dove l'utente può cambiare piano, carta di pagamento o cancellare l'abbonamento.

#### GET `/api/stripe/invoices`

**Auth:** richiede sessione.

**Risposta:**
```json
{
  "invoices": [
    {
      "id": "in_xxx",
      "date": "2026-03-01T00:00:00Z",
      "amount": 900,
      "currency": "eur",
      "status": "paid",
      "pdfUrl": "https://..."
    }
  ]
}
```

#### POST `/api/stripe/webhook`

**Auth:** nessuna (verifica Stripe signature). **Body:** raw Stripe event.

**Eventi gestiti:**
- `checkout.session.completed` — primo acquisto completato
- `customer.subscription.created` — subscription creata (ignora se `status: "incomplete"`)
- `customer.subscription.updated` — rinnovo, cambio piano, cancellazione programmata
- `customer.subscription.deleted` — abbonamento terminato → downgrade a free + email

---

### User

| Metodo | Endpoint | Rate Limit | Descrizione |
|--------|----------|-----------|-------------|
| PATCH | `/api/user/profile` | 20 req/min | Aggiorna nome e/o immagine profilo |
| POST | `/api/user/setup-profile` | 20 req/min | Completamento profilo al primo login |
| GET | `/api/user/settings` | 20 req/min | Legge preferenze email |
| PATCH | `/api/user/settings` | 20 req/min | Aggiorna preferenze email |
| DELETE | `/api/user/account` | 3 req/ora | Elimina l'account (GDPR) |

#### PATCH `/api/user/profile`

**Auth:** richiede sessione. **Content-Type:** `multipart/form-data`

| Campo | Tipo | Obbligatorio | Note |
|-------|------|-------------|------|
| `name` | string | Sì | Max 255 caratteri |
| `image` | File | No | JPG o PNG, max 2MB. Upload su Cloudflare R2. |

**Risposta:** `{ "ok": true, "user": { "name": "...", "image": "https://..." } }`

Se viene caricata una nuova immagine, la vecchia viene eliminata dal bucket R2.

#### POST `/api/user/setup-profile`

Stessi parametri di `PATCH /api/user/profile`. In più, imposta `profileSetupPending: false` → l'utente non viene più reindirizzato a `/setup-profile`.

#### GET `/api/user/settings`

**Risposta:** `{ "notificationEmails": true, "marketingEmails": false }`

#### PATCH `/api/user/settings`

**Body JSON:**
```json
{
  "notificationEmails": true,
  "marketingEmails": false
}
```

#### DELETE `/api/user/account`

**Auth:** richiede sessione. Nessun body.

**Regole:**
- Se l'utente ha un abbonamento attivo (premium/trial non scaduto) → **blocca** con errore 400
- Se free o scaduto → elimina tutto:
  1. Cancella il customer da Stripe (se presente)
  2. Rimuove `users`, `sessions`, `accounts` da MongoDB
  3. Invia email di conferma eliminazione

---

### Cron

| Metodo | Endpoint | Auth | Descrizione |
|--------|----------|------|-------------|
| GET | `/api/cron/subscriptions` | `CRON_SECRET` | Check giornaliero abbonamenti |

Eseguito automaticamente da Vercel Cron alle **08:00 UTC** ogni giorno.

**Operazioni:**
1. Trova abbonamenti scaduti (`subscriptionEnd < now`) → downgrade a free + email
2. Trova abbonamenti in scadenza (7 giorni) → email di avviso
3. Trova abbonamenti in scadenza (1 giorno) → email urgente

---

### Dev (solo development)

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| POST | `/api/dev/reset` | Svuota tutte le collection del database |
| POST | `/api/dev/seed` | Crea utenti di test con vari stati |
| POST | `/api/dev/test-expire` | Simula scadenza abbonamento per un email |

Tutti restituiscono **403** in produzione (`NODE_ENV === "production"`).

```bash
curl -X POST http://localhost:3000/api/dev/reset
curl -X POST http://localhost:3000/api/dev/seed
curl -X POST http://localhost:3000/api/dev/test-expire \
  -H "Content-Type: application/json" \
  -d '{"email": "utente@test.dev"}'
```

---

## Pagine

### Pubbliche

| URL | File | Descrizione |
|-----|------|-------------|
| `/` | `app/page.js` | Landing page (hero, features, pricing, FAQ, testimonials, CTA) |
| `/auth/signin` | `app/auth/signin/page.js` | Login con Magic Link + Google |
| `/auth/error` | `app/auth/error/page.js` | Errori di autenticazione NextAuth |
| `/legal/terms` | `app/legal/terms/page.js` | Termini di Servizio |
| `/legal/privacy` | `app/legal/privacy/page.js` | Privacy Policy (GDPR) |
| `/robots.txt` | `app/robots.js` | Robots.txt dinamico |
| `/sitemap.xml` | `app/sitemap.js` | Sitemap XML dinamica |

### Protette (richiedono autenticazione)

| URL | File | Titolo Tab | Descrizione |
|-----|------|-----------|-------------|
| `/dashboard` | `app/(dashboard)/dashboard/page.js` | Dashboard | Panoramica principale |
| `/dashboard/billing` | `app/(dashboard)/dashboard/billing/page.js` | Abbonamento | Gestione abbonamento Stripe |
| `/dashboard/profile` | `app/(dashboard)/dashboard/profile/page.js` | Profilo | Modifica nome e avatar |
| `/dashboard/settings` | `app/(dashboard)/dashboard/settings/page.js` | Impostazioni | Preferenze email + elimina account |
| `/setup-profile` | `app/setup-profile/page.js` | Completa il profilo | Wizard primo login |

Le pagine protette hanno `robots: { index: false, follow: false }` per evitare l'indicizzazione.

### Pagine di errore

| URL/Tipo | File | Quando appare |
|----------|------|--------------|
| 404 | `app/not-found.js` | URL non trovato |
| Errore runtime | `app/error.js` | Crash di un componente |
| Errore critico | `app/global-error.js` | Crash nel root layout |
| Errore auth | `app/auth/error/page.js` | Errore di autenticazione NextAuth |

---

## Route Protection (proxy.js)

Il middleware in `src/proxy.js` protegge le route basandosi sul cookie di sessione:

**Route nel matcher:**
```js
matcher: [
  "/dashboard/:path*",
  "/account/:path*",
  "/settings/:path*",
  "/setup-profile",
  "/auth/signin",
]
```

**Logica:**
- Non autenticato + `/dashboard/*` → redirect a `/auth/signin`
- Autenticato + `/auth/signin` → redirect a `/dashboard`
- Autenticato + `needsSetup` → la pagina dashboard redirige a `/setup-profile`
