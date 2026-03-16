# Architettura del Progetto

## Stack Tecnologico

| Layer | Tecnologia | Versione | File Config |
|-------|-----------|----------|-------------|
| Framework | Next.js (App Router) | 16.1.6 | `next.config.mjs` |
| Runtime | React | 19.2.3 | — |
| Database | MongoDB + Mongoose | 9.x | `src/lib/mongodb.js` |
| Auth | NextAuth v4 | 4.24.x | `src/lib/auth.js` |
| Pagamenti | Stripe | 20.x | `src/lib/stripe.js` |
| Email | Resend + React Email | 6.x | `src/lib/resend.js` |
| Storage | Cloudflare R2 (S3-compatibile) | — | `src/lib/r2.js` |
| Rate Limiting | Upstash Redis + Ratelimit | — | `src/lib/ratelimit.js` |
| CSS | Tailwind CSS 4 + DaisyUI 5 | 4.2 / 5.5 | `globals.css` |
| Toast | Sonner | 2.x | — |
| Deploy | Vercel | — | `vercel.json` |

---

## Struttura Directory

```
boilerplate/
├── public/                      # Asset statici (favicon, og-image, icon.svg)
├── src/
│   ├── proxy.js                 # Middleware di protezione route (Next.js proxy)
│   │
│   ├── app/                     # App Router — pagine e API
│   │   ├── layout.js            # Root layout (font, tema, providers, metadata SEO)
│   │   ├── page.js              # Landing page pubblica
│   │   ├── globals.css          # Temi DaisyUI (saas-light / saas-dark) + Tailwind
│   │   ├── not-found.js         # Pagina 404 personalizzata
│   │   ├── error.js             # Error boundary runtime (componenti)
│   │   ├── global-error.js      # Error boundary critico (crash nel root layout)
│   │   ├── sitemap.js           # Sitemap XML dinamica
│   │   ├── robots.js            # Robots.txt dinamico
│   │   │
│   │   ├── (dashboard)/         # Route group — layout con sidebar
│   │   │   ├── layout.js        # Drawer DaisyUI (sidebar desktop + hamburger mobile)
│   │   │   ├── loading.js       # Loading spinner per il gruppo
│   │   │   └── dashboard/
│   │   │       ├── layout.js    # Metadata: title "Dashboard", noindex
│   │   │       ├── page.js      # Pagina principale dashboard
│   │   │       ├── billing/     # Gestione abbonamento Stripe
│   │   │       ├── profile/     # Modifica profilo (nome + avatar R2)
│   │   │       └── settings/    # Preferenze email + zona pericolosa
│   │   │
│   │   ├── api/                 # Route handlers API
│   │   │   ├── auth/            # NextAuth endpoints
│   │   │   ├── stripe/          # Checkout, portal, webhook, invoices
│   │   │   ├── user/            # Profile, settings, account, setup-profile
│   │   │   ├── cron/            # Job giornaliero abbonamenti
│   │   │   └── dev/             # Tool di sviluppo (reset, seed, test-expire)
│   │   │
│   │   ├── auth/                # Pagine auth (signin, error)
│   │   ├── legal/               # Termini di servizio e Privacy Policy
│   │   └── setup-profile/       # Wizard completamento profilo (primo login)
│   │
│   ├── components/              # Componenti React riusabili
│   │   ├── dashboard/           # Componenti specifici dashboard (Sidebar)
│   │   └── *.jsx                # Button, Card, Input, Navbar, Footer, ecc.
│   │
│   ├── config/                  # Configurazione centralizzata
│   │   ├── site.js              # Nome, logo, tagline, URL base
│   │   ├── seo.js               # Titoli, descrizioni, OG image
│   │   └── dashboardMenu.js     # Voci menu sidebar
│   │
│   ├── emails/                  # Template email React Email
│   │   └── *.jsx                # login, welcome, payment, expiring, expired, deleted
│   │
│   ├── lib/                     # Utility server-side (connessioni, client)
│   │   ├── auth.js              # Config NextAuth completa
│   │   ├── mongodb.js           # Connessione Mongoose (con cache globale)
│   │   ├── mongoClient.js       # Client nativo MongoDB (per NextAuth adapter)
│   │   ├── stripe.js            # Istanza Stripe
│   │   ├── resend.js            # Client Resend + helper sendEmail()
│   │   ├── r2.js                # Client Cloudflare R2 (upload, delete, getKey)
│   │   ├── ratelimit.js         # Rate limiter Upstash (fail-open)
│   │   ├── subscriptionCron.js  # Logica cron abbonamenti
│   │   ├── resetDatabase.js     # Utility reset DB (dev)
│   │   └── seedUsers.js         # Utility seed utenti test (dev)
│   │
│   ├── models/                  # Schema Mongoose
│   │   └── User.js              # Modello utente (auth + SaaS + preferenze)
│   │
│   └── utils/                   # Funzioni pure client/server
│       ├── cn.js                # Classi CSS condizionali (clsx + tailwind-merge)
│       ├── fetcher.js           # Fetch utility per componenti client
│       ├── formatDate.js        # Formattazione date in italiano
│       └── formatPrice.js       # Formattazione prezzi EUR
│
├── next.config.mjs              # Config Next.js (immagini remote, security headers)
├── vercel.json                  # Config Vercel (cron, headers produzione, cache)
├── package.json                 # Dipendenze e script
└── postcss.config.mjs           # Plugin PostCSS (Tailwind)
```

---

## Flusso di Autenticazione

```
Utente → /auth/signin
         │
         ├─ Magic Link (email) ─→ Resend invia email ─→ Utente clicca link
         │                                                     │
         └─ Google OAuth ────────────────────────────────────────┘
                                                                 │
                                                          NextAuth callback
                                                          signIn() ──→ MongoDB
                                                                 │
                                                          Crea/aggiorna User
                                                          (upsert atomico con
                                                           $set + setDefaultsOnInsert)
                                                                 │
                                                          profileSetupPending?
                                                          ├─ true  → /setup-profile
                                                          └─ false → /dashboard
```

**Strategia sessione:** `database` (non JWT). Le sessioni sono salvate in MongoDB. Il cookie `next-auth.session-token` (o `__Secure-` in HTTPS) viene usato per identificare la sessione.

**Callback `session()`:** arricchisce la sessione con `subscriptionStatus`, `subscriptionEnd`, `cancelAtPeriodEnd`, `needsSetup`. Controlla anche se l'abbonamento è scaduto e fa il downgrade a "free" in background.

---

## Flusso Pagamento Stripe

```
Utente (dashboard/billing) ─→ POST /api/stripe/checkout
                                     │
                                     ├─ Crea/riusa stripeCustomerId
                                     └─ Crea Checkout Session
                                              │
                                     Stripe Hosted Page
                                              │
                                     Utente paga
                                              │
                              Stripe Webhooks ─→ POST /api/stripe/webhook
                                              │
                              ┌───────────────┼───────────────────┐
                              │               │                   │
                    checkout.session   subscription.updated   subscription.deleted
                    .completed         │                     │
                    │                  Aggiorna status       Downgrade a "free"
                    Mappa status       + date               + email notifica
                    + email conferma
```

**Eventi webhook gestiti:**
- `checkout.session.completed` — primo pagamento riuscito
- `customer.subscription.created` — subscription creata (ignora se `status: "incomplete"`)
- `customer.subscription.updated` — cambio piano, rinnovo, cancellazione programmata
- `customer.subscription.deleted` — subscription terminata → downgrade a free

**Stati abbonamento:** `free` → `trial` → `premium` (e ritorno a `free` alla scadenza)

---

## Protezione Route

Il file `src/proxy.js` (middleware Next.js) protegge le route controllando il cookie di sessione:

| Condizione | Azione |
|-----------|--------|
| Autenticato + pagina auth (`/auth/signin`) | Redirect → `/dashboard` |
| Non autenticato + pagina auth | Lascia passare |
| Non autenticato + route protetta | Redirect → `/auth/signin?callbackUrl=...` |
| Autenticato + route protetta | Lascia passare |

**Route protette nel matcher:**
- `/dashboard/:path*`
- `/account/:path*`
- `/settings/:path*`
- `/setup-profile`
- `/auth/signin` (redirect inverso)

---

## Rate Limiting

Ogni endpoint API è protetto con rate limiting basato su IP tramite Upstash Redis:

| Limiter | Limite | Endpoint |
|---------|--------|----------|
| `authLimiter` | 10 req/min | Autenticazione |
| `checkoutLimiter` | 5 req/min | Stripe checkout |
| `standardLimiter` | 20 req/min | Profile, settings, portal, invoices, setup-profile |
| `destructiveLimiter` | 3 req/ora | Eliminazione account |

**Fail-open:** se Upstash Redis non è raggiungibile, le richieste passano (non bloccano). In development senza env configurate, il rate limiting è disabilitato con warning in console.

---

## Security

### Headers HTTP (next.config.mjs + vercel.json)
- `X-Frame-Options: DENY` — previene clickjacking
- `X-Content-Type-Options: nosniff` — previene MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` — limita invio referrer
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` — disabilita API sensibili
- `Strict-Transport-Security: max-age=63072000` — forza HTTPS per 2 anni

### Protezione API dev
Tutte le route `/api/dev/*` (reset, seed, test-expire) controllano `NODE_ENV === "production"` e restituiscono 403 se in produzione. Il check è affidabile perché `NODE_ENV` è settato automaticamente da Next.js/Vercel e non può essere sovrascritto dal client.

### Cron Job
Il cron `/api/cron/subscriptions` è protetto dal header `Authorization: Bearer <CRON_SECRET>` in produzione. In sviluppo il check è disabilitato.
