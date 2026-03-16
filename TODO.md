# TODO — Boilerplate SaaS Next.js

---

## 🔴 Da implementare

Nessun task rimanente — tutto implementato! 🎉

---

## ✅ Completato

### 7. `cn.js` — utility classi CSS condizionali
- [x] Installato `clsx` e `tailwind-merge`
- [x] Creato `src/utils/cn.js` con `cn(...classes)` Tailwind-safe
- [x] Aggiornati componenti: `Button.jsx`, `Card.jsx`, `Input.jsx`, `Logo.jsx`

### 8. `fetcher.js` — utility fetch per SWR/client
- [x] Creato `src/utils/fetcher.js` con `fetcher(url)` e `postFetcher(url, data)`
- [x] Gestione errori con status code e body JSON

### 9. `global-error.js` — error boundary del root layout
- [x] Creato `src/app/global-error.js` — `"use client"` con tag `<html>` e `<body>`
- [x] Stesso design di `error.js` per coerenza visiva

### 10. `generateMetadata` per ogni pagina
- [x] Landing page — usa defaults dal root `layout.js` (title, description, OG image)
- [x] Sign in — `layout.js` con title "Accedi"
- [x] Legal Terms/Privacy — already had `export const metadata`
- [x] Dashboard — `layout.js` con title "Dashboard" e `robots: { index: false }`
- [x] Dashboard Billing — `layout.js` con title "Abbonamento" (noindex ereditato)
- [x] Dashboard Profile — `layout.js` con title "Profilo" (noindex ereditato)
- [x] Dashboard Settings — `layout.js` con title "Impostazioni" (noindex ereditato)
- [x] Setup Profile — `layout.js` con title "Completa il profilo" e `noindex`

### 11. File upload — Cloudflare R2
- [x] Installato `@aws-sdk/client-s3`
- [x] Creato `src/lib/r2.js` — client S3 per R2 con `uploadToR2()`, `deleteFromR2()`, `getR2KeyFromUrl()`
- [x] Aggiornato `api/user/profile/route.js` — upload R2 + eliminazione vecchia immagine
- [x] Aggiornato `api/user/setup-profile/route.js` — upload R2
- [x] Aggiunto commento in `next.config.mjs` per `images.remotePatterns` R2
- [x] **Env richieste:** `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`

### 12. `vercel.json` — headers e configurazione produzione
- [x] Security headers backup (ridondanti con `next.config.mjs`, difesa in profondità)
- [x] Cache-Control `immutable` per assets statici (js, css, immagini, font)
- [x] Route dev già protette con `NODE_ENV === "production"` nei route handler
- [x] Cron verificato: `0 8 * * *` UTC

---

## ✅ Completato

### 1. Rate Limiting
- [x] Installato `@upstash/ratelimit` + `@upstash/redis`
- [x] Creata utility `src/lib/ratelimit.js` con rate limiter riusabile (graceful degradation se Upstash non configurato)
- [x] Rate limit applicato a tutti gli endpoint API:
  - `POST /api/stripe/checkout` — 5 req/min (`checkoutLimiter`)
  - `DELETE /api/user/account` — 3 req/ora (`destructiveLimiter`)
  - `PATCH /api/user/profile` — 20 req/min (`standardLimiter`)
  - `PATCH /api/user/settings` — 20 req/min (`standardLimiter`)
  - `POST /api/user/setup-profile` — 20 req/min (`standardLimiter`)
  - `POST /api/stripe/portal` — 20 req/min (`standardLimiter`)
  - `GET /api/stripe/invoices` — 20 req/min (`standardLimiter`)
- [x] **Env richieste:** `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (opzionali, se assenti il rate limit è disabilitato)

### 2. `next.config.mjs` — immagini e security headers
- [x] `images.remotePatterns` per Google avatar (`lh3.googleusercontent.com`)
- [x] Security headers: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, Strict-Transport-Security

### 3. Pagine di errore HTTP
- [x] `src/app/not-found.js` — pagina 404 personalizzata
- [x] `src/app/error.js` — pagina errore runtime (crash componenti)
- [x] `/auth/error` — errori di autenticazione (già esistente)

### 4. Pagine legali
- [x] `src/app/legal/terms/page.js` — Termini di Servizio
- [x] `src/app/legal/privacy/page.js` — Privacy Policy (GDPR)
- [x] Footer già collegato a `/legal/terms` e `/legal/privacy`

### 5. SEO — Sitemap e robots.txt
- [x] `src/app/sitemap.js` — sitemap.xml con pagine pubbliche
- [x] `src/app/robots.js` — blocca `/dashboard/`, `/api/`, `/setup-profile`

### 6. `src/utils/` — utility condivise
- [x] `src/utils/formatDate.js` — `formatDate()` e `formatDateShort()` in italiano
- [x] `src/utils/formatPrice.js` — `formatPrice()` in EUR (supporta centesimi Stripe)

---

## ✅ Già implementato (dalla sessione precedente)

- [x] Auth: NextAuth v4, Magic Link + Google OAuth, session database
- [x] Stripe: Checkout, webhook lifecycle completo, `cancel_at_period_end`
- [x] Email: Login, Welcome, PaymentConfirmation, SubscriptionExpired, SubscriptionExpiring, AccountDeleted
- [x] Cron: check abbonamenti giornaliero con `CRON_SECRET`
- [x] `vercel.json`: cron configurato correttamente
- [x] Proxy (`src/proxy.js`): redirect autenticato/non autenticato, guard route auth
- [x] Dashboard: pagine Billing, Profile, Settings
- [x] User model: tutti i campi SaaS (`subscriptionStatus`, `subscriptionEnd`, `cancelAtPeriodEnd`, preferenze email)
- [x] API: settings GET+PATCH, account DELETE, stripe checkout+webhook+portal
- [x] Pagina `/auth/error` con messaggi localizzati
- [x] Dev tools: `/api/dev/reset`, `/api/dev/seed`
- [x] Toast: Sonner integrato nel layout + usato in billing, profile, settings
- [x] `stripeCustomerId`: gestito correttamente — billing mostra "Scegli piano" anche se il customer ID esiste
- [x] Template email `passwordReset.jsx`: mantenuto come base per progetti futuri
