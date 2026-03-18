# Panoramica Progetto — SaaS Boilerplate

## Cos'è

Un boilerplate completo per costruire applicazioni SaaS in Next.js. Include autenticazione, pagamenti con abbonamento, dashboard utente, email transazionali, analytics, storage file e tutte le infrastrutture necessarie per lanciare un prodotto SaaS.

L'obiettivo è: cloni il repo, personalizzi configurazione/contenuti, e hai un SaaS funzionante pronto per il lancio.

---

## Stack Tecnologico

| Layer | Tecnologia | Versione | Costo |
|-------|-----------|----------|-------|
| **Framework** | Next.js (App Router) | 16.x | Gratuito (open source) |
| **UI** | React | 19.x | Gratuito |
| **CSS** | Tailwind CSS 4 + DaisyUI 5 | 4.2 / 5.5 | Gratuito |
| **Database** | MongoDB + Mongoose | 9.x | Gratuito fino a 512MB (Atlas M0) |
| **Auth** | NextAuth v4 | 4.24.x | Gratuito |
| **Pagamenti** | Stripe | 20.x | 1.4% + €0.25/transazione |
| **Email** | Resend + React Email | 6.x | Gratuito fino a 100/giorno |
| **Storage** | Cloudflare R2 | — | Gratuito fino a 10GB |
| **Rate Limiting** | Upstash Redis | — | Gratuito fino a 10K cmd/giorno |
| **Analytics** | PostHog + Google Analytics | — | Gratuito (1M eventi/mese + GA illimitato) |
| **Toast** | Sonner | 2.x | Gratuito |
| **Deploy** | Vercel | — | Gratuito (Hobby), $20/mese (Pro per uso commerciale) |

---

## Funzionalità Incluse

### Autenticazione
- **Google OAuth** — login con un click
- **Magic Link** — login via email (Resend)
- Sessioni database (non JWT) — revocabili, sicure
- Middleware di protezione route (`proxy.js`)
- Redirect automatico: non autenticato → signin, autenticato → dashboard

### Pagamenti (Stripe)
- Checkout per abbonamenti mensili/annuali
- Customer Portal (gestione carta, cambio piano, cancellazione)
- Webhook per aggiornamenti in tempo reale dello stato abbonamento
- Storico fatture con PDF scaricabili
- Stati: `free` → `trial` → `premium` con downgrade automatico alla scadenza
- Cron job giornaliero per controllare scadenze e inviare email di avviso

### Dashboard Utente
- Layout con sidebar responsive (drawer su mobile)
- **Pagina principale** — overview
- **Profilo** — modifica nome e avatar (upload su R2)
- **Abbonamento** — stato piano, fatture, portale Stripe
- **Impostazioni** — preferenze email, eliminazione account (GDPR)
- **Setup profilo** — wizard al primo login (onboarding)
- Menu sidebar configurabile da `src/config/dashboardMenu.js`

### Landing Page
- Componenti pronti: Hero, Pricing, FAQ, Testimonials, CTA, How It Works, Video, Social Proof
- Due varianti pricing: singolo piano e due piani
- SEO ottimizzato (metadata, Open Graph, sitemap, robots.txt)

### Email Transazionali
- Template React Email pronti:
  - Magic link di login
  - Benvenuto (nuovo utente)
  - Conferma pagamento
  - Abbonamento in scadenza (7gg e 1gg)
  - Abbonamento scaduto
  - Conferma eliminazione account
- Invio tramite Resend con helper `sendEmail()`

### Analytics e Privacy
- **PostHog** — pageview, click, session replay, identificazione utente
- **Google Analytics (GA4)** — traffico e sorgenti
- **Cookie banner GDPR** — blocca tutto finché l'utente non accetta
- Analytics attivati solo dopo consenso esplicito
- Dettagli in [docs/analytics.md](analytics.md)

### Storage File
- **Cloudflare R2** — upload avatar, compatibile S3
- Upload con validazione (tipo MIME, dimensione max 2MB)
- Eliminazione automatica vecchia immagine al re-upload
- Dettagli in [docs/storage.md](storage.md)

### Sicurezza
- Rate limiting su tutte le API sensibili (Upstash Redis, fail-open)
- Security headers (X-Frame-Options, HSTS, CSP, Permissions-Policy)
- Protezione CSRF via NextAuth
- API dev bloccate in produzione (`NODE_ENV` check)
- Validazione input server-side su tutti gli endpoint

### Infrastruttura
- Validazione variabili d'ambiente all'avvio (`instrumentation.js`)
- Error boundary a tre livelli: componente (`error.js`), root (`global-error.js`), 404 (`not-found.js`)
- Utility: `cn()` (classi CSS), `fetcher()` (fetch wrapper), `formatDate()`, `formatPrice()`
- Temi light/dark automatici (DaisyUI `saas-light` / `saas-dark`)

---

## Struttura del Progetto

```
src/
├── app/                        # Pagine e API (App Router)
│   ├── layout.js               # Root layout (font, providers, SEO)
│   ├── page.js                 # Landing page
│   ├── (dashboard)/            # Gruppo route protette
│   │   └── dashboard/          # Pagine: billing, profile, settings
│   ├── api/                    # Route handlers
│   │   ├── auth/               # NextAuth
│   │   ├── stripe/             # Checkout, portal, webhook, invoices
│   │   ├── user/               # Profile, settings, account
│   │   ├── cron/               # Job giornaliero abbonamenti
│   │   └── dev/                # Reset, seed, test (solo sviluppo)
│   ├── auth/                   # Signin, error
│   ├── legal/                  # Terms, privacy
│   └── setup-profile/          # Onboarding primo login
│
├── components/                 # Componenti React riusabili
│   ├── Button, Card, Input     # UI base
│   ├── Navbar, Footer          # Layout pubblico
│   ├── DashboardLayout         # Layout protetto
│   ├── PricingSection, FAQ...  # Sezioni landing
│   ├── AnalyticsProvider       # Gestione analytics + consenso
│   ├── CookieBanner            # Banner GDPR
│   ├── PostHogIdentify         # Identificazione utente
│   ├── PremiumGate             # Gate contenuto premium
│   └── dashboard/Sidebar       # Sidebar dashboard
│
├── config/                     # Configurazione centralizzata
│   ├── site.js                 # Nome, logo, tagline
│   ├── seo.js                  # Metadata SEO
│   └── dashboardMenu.js        # Voci menu sidebar
│
├── emails/                     # Template email React Email
├── lib/                        # Utility server-side
│   ├── auth.js                 # Configurazione NextAuth
│   ├── mongodb.js              # Connessione Mongoose
│   ├── stripe.js               # Istanza Stripe
│   ├── resend.js               # Client email + sendEmail()
│   ├── r2.js                   # Client Cloudflare R2
│   ├── ratelimit.js            # Rate limiter Upstash
│   ├── posthog.js              # Client PostHog
│   └── analytics.js            # trackEvent(), identifyUser()
│
├── models/User.js              # Schema Mongoose utente
├── utils/                      # Funzioni pure (cn, fetcher, format*)
└── proxy.js                    # Middleware protezione route
```

---

## Configurazione Rapida

### 1. Personalizza identità

| File | Cosa cambiare |
|------|--------------|
| `src/config/site.js` | Nome app, logo, tagline |
| `src/config/seo.js` | Titoli SEO, descrizione, OG image |
| `src/config/dashboardMenu.js` | Voci del menu dashboard |
| `public/icon.svg` | Logo del sito |
| `public/og-image.png` | Immagine Open Graph (1200×630) |

### 2. Configura servizi

Crea `.env.local` con tutte le variabili necessarie. Lista completa in [docs/deployment.md](deployment.md).

**Obbligatorie per funzionare in locale:**
```env
NEXTAUTH_SECRET=          # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=              # MongoDB Atlas o locale
GOOGLE_ID=                # Google Cloud Console
GOOGLE_SECRET=
RESEND_API_KEY=           # resend.com
EMAIL_FROM=App <noreply@tuodominio.com>
STRIPE_SECRET_KEY=        # stripe.com
STRIPE_WEBHOOK_SECRET=    # Stripe CLI: stripe listen --forward-to localhost:3000/api/stripe/webhook
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_YEARLY=price_xxx
```

**Opzionali (l'app funziona anche senza):**
```env
# Storage avatar
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# Rate limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
NEXT_PUBLIC_GA_ID=

# Cron
CRON_SECRET=
```

### 3. Avvia

```bash
npm install
npm run dev
```

Guide dettagliate: [docs/setup.md](setup.md) — [docs/deployment.md](deployment.md)

---

## Flussi Principali

### Login

```
Utente → /auth/signin
  ├── Click "Google" → OAuth Google → callback → upsert user → dashboard
  └── Inserisce email → Resend invia magic link → click link → callback → upsert user → dashboard
      └── Se è la prima volta → email di benvenuto + redirect a /setup-profile
```

### Pagamento

```
Utente click "Abbonati" → POST /api/stripe/checkout → Stripe Checkout Page
  └── Pagamento OK → webhook checkout.session.completed
        → user.subscriptionStatus = "premium"
        → user.subscriptionEnd = fine periodo
        → email conferma pagamento
```

### Cancellazione

```
Utente → Customer Portal → cancella abbonamento
  → webhook subscription.updated (cancel_at_period_end = true)
  → user resta premium fino a subscriptionEnd
  → cron giornaliero controlla scadenze
  → webhook subscription.deleted → downgrade a free + email
```

### Eliminazione Account

```
Utente → /dashboard/settings → "Elimina account"
  → Rate limit: 3 req/ora
  → Se ha abbonamento attivo → blocca (deve cancellar prima)
  → Se free/scaduto → elimina user + sessions + accounts da MongoDB
  → Cancella customer Stripe (se esiste)
  → Email conferma eliminazione
  → Logout automatico
```

---

## Costi e Scalabilità

### Fase 0 — Sviluppo e beta (0 utenti paganti)

**Costo: €0/mese** (+ ~€10/anno per il dominio)

Tutti i servizi hanno un piano gratuito sufficiente per sviluppo e primi utenti.

### Fase 1 — Lancio (1–100 utenti)

**Costo: €0–20/mese**

| Servizio | Stato | Costo |Email |
|----------|-------|-------|-------|
| Vercel | Hobby è sufficiente per test/beta, **Pro necessario per uso commerciale** | $0 → $20/mese | 
| MongoDB Atlas | M0 (512MB) più che sufficiente | €0 | ludenajluis@gmail.com | 
| Stripe | Solo commissioni sulle transazioni | 1.4% + €0.25/tx | hkf24kdns@gmail.com |
| Resend | 100 email/giorno bastano | €0 | hkf24kdns@gmail.com |
| R2 | 10GB più che abbastanza | €0 | ludenajluis@gmail.com |
| Upstash | 10K cmd/giorno OK | €0 | ludenajluis@gmail.com |
| PostHog | 1M eventi sotto la soglia | €0 | ludenajluis@gmail.com |
| Google Analytics | Free | Free | hkf24kdns@gmail.com |

> **Primo costo obbligatorio:** Vercel Pro ($20/mese) — richiesto dai ToS per uso commerciale. Passaci appena lanci al pubblico.

### Fase 2 — Crescita (100–1.000 utenti)

**Costo: ~€30–50/mese** + commissioni Stripe

| Servizio | Quando scatta | Costo stimato |
|----------|--------------|---------------|
| Vercel Pro | Già attivo | $20/mese |
| MongoDB Atlas M2 | Se superi 512MB di dati | ~$9/mese |
| Resend | Se superi 100 email/giorno | $20/mese |
| Tutti gli altri | Probabilmente ancora nel free tier | €0 |

### Fase 3 — Scala (1.000+ utenti)

**Costo: ~€70–150/mese** + commissioni Stripe

| Servizio | Note |
|----------|------|
| MongoDB Atlas M5/M10 | $25–57/mese per 5–10GB |
| Resend Pro | $20/mese (50K email incluse) |
| Upstash Pay-as-you-go | Se superi 10K cmd/giorno |
| PostHog | Se superi 1M eventi/mese |
| R2 | Se superi 10GB storage |

### Riepilogo soglie critiche

| Servizio | Soglia gratuita | Primo piano a pagamento |
|----------|----------------|------------------------|
| Vercel | Hobby (non commerciale) | **$20/mese** (Pro) — serve al lancio |
| MongoDB | 512MB storage | **~$9/mese** (M2) — centinaia/migliaia di utenti |
| Resend | 100 email/giorno | **$20/mese** — quando hai molti login/giorno |
| Stripe | Nessun fisso | **1.4% + €0.25** per transazione (sempre) |
| R2 | 10GB storage | Pay-as-you-go — solo con molti file upload |
| Upstash | 10K cmd/giorno | Pay-as-you-go — solo con alto traffico API |
| PostHog | 1M eventi/mese | Pay-as-you-go — solo con molto traffico |
| GA4 | Illimitato | **Mai** |

> **Nota:** tutti i costi sopra (tranne Vercel Pro e Stripe) scattano solo con crescita significativa. Un SaaS può restare su costi quasi zero per mesi.

---

## Documentazione Dettagliata

| Documento | Contenuto |
|-----------|-----------|
| [setup.md](setup.md) | Come personalizzare e avviare il progetto |
| [architecture.md](architecture.md) | Stack, struttura directory, flussi auth e pagamenti |
| [db.md](db.md) | Schema utente, collection, stati abbonamento |
| [deployment.md](deployment.md) | Deploy su Vercel, variabili d'ambiente, checklist |
| [pricing.md](pricing.md) | Dettaglio costi di ogni servizio |
| [storage.md](storage.md) | Setup e uso di Cloudflare R2 |
| [analytics.md](analytics.md) | PostHog, Google Analytics, cookie consent |
| [specs/routes.md](specs/routes.md) | Documentazione completa API e pagine |
| [specs/components.md](specs/components.md) | Documentazione completa componenti con props |

---

## Servizi Esterni — Account Necessari

| Servizio | URL | A cosa serve |
|----------|-----|-------------|
| MongoDB Atlas | [mongodb.com/atlas](https://www.mongodb.com/atlas) | Database |
| Google Cloud Console | [console.cloud.google.com](https://console.cloud.google.com) | OAuth Google |
| Stripe | [stripe.com](https://stripe.com) | Pagamenti |
| Resend | [resend.com](https://resend.com) | Email transazionali |
| Vercel | [vercel.com](https://vercel.com) | Hosting e deploy |
| Cloudflare | [cloudflare.com](https://cloudflare.com) | Storage R2 (opzionale) |
| Upstash | [upstash.com](https://upstash.com) | Rate limiting (opzionale) |
| PostHog | [posthog.com](https://posthog.com) | Analytics prodotto (opzionale) |
| Google Analytics | [analytics.google.com](https://analytics.google.com) | Analytics traffico (opzionale) |

---

## Comandi Utili

```bash
# Sviluppo
npm run dev                    # Avvia il server di sviluppo
npm run build                  # Build di produzione
npm run start                  # Avvia il server di produzione
npm run lint                   # Controllo ESLint

# Stripe CLI (in terminale separato)
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Database (solo in sviluppo)
curl -X POST http://localhost:3000/api/dev/reset     # Reset DB
curl -X POST http://localhost:3000/api/dev/seed      # Crea utenti di test
```
