# SaaS Boilerplate

Boilerplate completo per creare applicazioni SaaS con Next.js, Stripe, MongoDB e Resend. Auth, pagamenti, email e dashboard pronti all'uso.

## Stack

| Layer | Tecnologia |
|---|---|
| Framework | Next.js 15 App Router |
| UI | Tailwind CSS + DaisyUI v5 |
| Database | MongoDB + Mongoose |
| Auth | NextAuth v4 (Google + Magic Link) |
| Pagamenti | Stripe (abbonamenti + webhook) |
| Email | Resend + React Email |
| Deploy | Vercel |

## Quick Start

```bash
# 1. Clona il progetto
git clone <url-repo> my-saas
cd my-saas

# 2. Installa le dipendenze
npm install

# 3. Copia e configura le variabili d'ambiente
cp .env.example .env.local
# Compila .env.local con le tue chiavi (vedi sezione sotto)

# 4. Avvia il server di sviluppo
npm run dev
```

## Variabili d'ambiente (.env.local)

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=... # openssl rand -base64 32

# Google OAuth
GOOGLE_ID=...
GOOGLE_SECRET=...

# Resend (email)
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@tuodominio.com

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Vercel Cron (solo produzione)
CRON_SECRET=... # openssl rand -base64 32
```

## Personalizzazione rapida

Per trasformare il boilerplate nel tuo progetto:

1. **`src/config/site.js`** → Nome, logo, tagline del sito
2. **`src/config/seo.js`** → Title, description, og:image per la SEO
3. **`src/app/page.js`** → Contenuti landing page (hero, features, pricing, FAQ)
4. **`src/app/pricing/page.js`** → Piani e prezzi standalone
5. **`src/app/globals.css`** → Colori tema (oklch, DaisyUI)
6. **`public/`** → Favicon, og-image.png, logo
7. **`.env.local`** → Chiavi API per i tuoi servizi

## Struttura progetto

```
src/
├── app/
│   ├── (dashboard)/        # Route group protetta
│   │   ├── dashboard/      # Dashboard principale
│   │   │   ├── billing/    # Gestione abbonamento + fatture
│   │   │   ├── profile/    # Modifica profilo
│   │   │   └── settings/   # Impostazioni + elimina account
│   │   └── layout.js       # Layout con sidebar
│   ├── api/
│   │   ├── auth/           # NextAuth route handler
│   │   ├── cron/           # Vercel Cron jobs
│   │   ├── dev/            # Endpoint di sviluppo (seed, reset, test-expire)
│   │   ├── stripe/         # Checkout, webhook, portal, invoices
│   │   └── user/           # Profilo, account, setup-profile
│   ├── auth/               # Pagine login ed errore
│   ├── pricing/            # Pagina pricing pubblica
│   └── setup-profile/      # Completamento profilo post-login
├── components/             # Componenti UI riusabili
├── config/                 # Configurazione (site, seo, menu dashboard)
├── emails/                 # Template email React Email
├── lib/                    # Utility server (auth, db, stripe, resend, cron)
├── models/                 # Mongoose schemas
└── proxy.js                # Protezione route (sostituto middleware)
```

## Funzionalità incluse

- **Auth** — Google OAuth + Magic Link, sessioni su database, setup profilo
- **Subscription** — Free / Trial / Premium, checkout Stripe, webhook lifecycle completo
- **Dashboard** — Sidebar navigazione, profilo, billing, settings
- **Stripe Portal** — Gestione self-service piano, carta, cancellazione
- **Fatture** — Lista fatture con link PDF da Stripe
- **Eliminazione account** — GDPR, blocco se subscription attiva, conferma con modal
- **Cron job** — Warning email 3 giorni prima della scadenza
- **Email** — Login, welcome, payment, expiring, expired, account deleted
- **SEO** — Open Graph, Twitter card, metadata centralizzati
- **Toast** — Notifiche globali con Sonner
- **PremiumGate** — Gating contenuti per piano
- **Dev tools** — Seed utenti test, reset DB, test expiration

## Stripe: test in locale

```bash
# Terminale 1: ascolta i webhook
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Terminale 2: testa un evento
stripe trigger checkout.session.completed

# Testa il downgrade senza Stripe:
curl -s -X POST http://localhost:3000/api/dev/test-expire \
  -H "Content-Type: application/json" \
  -d '{"email": "premium@test.dev"}'
```

## Deploy su Vercel

1. Importa il progetto su [Vercel](https://vercel.com)
2. Configura **tutte** le variabili d'ambiente (`.env.local`)
3. Il file `vercel.json` configura automaticamente il cron job giornaliero
4. Configura il webhook Stripe per puntare a `https://tuodominio.com/api/stripe/webhook`
5. Attiva il Stripe Customer Portal nella dashboard Stripe

## Licenza

Uso personale e commerciale illimitato.
