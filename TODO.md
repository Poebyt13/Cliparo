# TODO — Boilerplate SaaS Next.js

---

## � Molto utili (solo se aggiungono funzionamento reale)

### J. SWR — valutare se necessario
- [ ] `src/utils/fetcher.js` funziona già come wrapper fetch
- [ ] Installare `swr` **solo se** servono cache automatica, deduplication o revalidation in più pagine dashboard
- [ ] Non installare se le fetch attuali coprono già i casi d'uso

---

## ✅ Completato

### A. `.env.example` ✅
- [x] Creato file `.env.example` con tutte le variabili organizzate per sezione (obbligatorie / opzionali)
- [x] Include: Auth, Database, OAuth, Email, Stripe, Sentry, Admin, Analytics, Rate Limiting, Storage, Cron
- [x] Commenti esplicativi per ogni variabile

### B. Dipendenza `nodemailer` ✅
- [x] Verificato con `npm why nodemailer` — è `peerOptional` di `next-auth` e `@auth/core`
- [x] Necessario per il provider Email (Magic Link) — **non va rimosso**

### C. Eliminato `README.md` ✅
- [x] `README.md` eliminato dalla root — la documentazione è completa in `docs/`

### D. `instrumentation.js` aggiornato ✅
- [x] Sezione "obbligatorie" con errore chiaro se mancanti
- [x] Sezione "opzionali" con avviso informativo (PostHog, GA, Sentry, Admin, Upstash, R2, Stripe prezzi, Cron)
- [x] Messaggio: "Funzionalità opzionali non configurate (l'app funziona comunque)"

### E. Email `paymentConfirmation` ✅
- [x] Invio aggiunto nel webhook `checkout.session.completed`
- [x] Inviata **sempre** (il pagamento va sempre confermato via email)
- [x] Include: nome piano, importo formattato, data, link dashboard

### F. Rimosso `DashboardLayout.jsx` ✅
- [x] File eliminato — inutilizzato, il layout dashboard usa `src/app/(dashboard)/layout.js`

### G. Sentry — error monitoring ✅
- [x] Installato `@sentry/nextjs`
- [x] Creati `sentry.client.config.js`, `sentry.server.config.js`, `sentry.edge.config.js`
- [x] `next.config.mjs` wrappato con `withSentryConfig` (solo se `NEXT_PUBLIC_SENTRY_DSN` presente)
- [x] `global-error.js` aggiornato con `Sentry.captureException`
- [x] Filtro errori: ignora "Failed to fetch" (rumore browser)
- [x] Session replay solo su errore e solo in produzione
- [x] `NEXT_PUBLIC_SENTRY_DSN` aggiunto a `instrumentation.js` come opzionale
- [x] Creato `docs/sentry.md` con guida completa

### H. Health check — endpoint + widget admin ✅
- [x] `GET /api/health` — check MongoDB (connessione reale), Stripe (API call), Resend, R2, Upstash, PostHog, GA, Sentry
- [x] Protetto: solo admin (email === `NEXT_PUBLIC_ADMIN_EMAIL`)
- [x] `AdminHealthIndicator.jsx` — pallino fisso in basso a destra, visibile solo all'admin
- [x] Pallino verde/giallo/rosso in base allo stato globale
- [x] Al click: popover con lista servizi e stato dettagliato
- [x] Inserito nel root `layout.js`

### I. Admin panel base ✅
- [x] `src/app/(dashboard)/dashboard/admin/layout.js` — guard server-side (redirect se non admin)
- [x] `src/app/(dashboard)/dashboard/admin/page.js` — statistiche + lista utenti paginata
- [x] `GET /api/admin/stats` — conteggio utenti per piano
- [x] `GET /api/admin/users` — lista utenti con paginazione (?page=1&limit=20)
- [x] Voce "Admin" nel menu sidebar con icona shield (visibile solo all'admin via `adminOnly`)
- [x] Sidebar aggiornata: filtra automaticamente voci `adminOnly`

### K. Gestione provider collegati ✅
- [x] `GET /api/user/accounts` — lista provider collegati (Google, email)
- [x] `DELETE /api/user/accounts` — scollega provider OAuth (con guard: non scollegare l'unico)
- [x] Sezione "Account collegati" aggiunta in `/dashboard/settings`
- [x] Icone per Google e Email, pulsante "Scollega" con conferma

---

## ✅ Completato (sessioni precedenti)

### Analytics e Cookie Consent ✅
- [x] PostHog — `src/lib/posthog.js` con `initPostHog()`, `stopPostHog()`
- [x] Google Analytics — iniettato dinamicamente via gtag.js dopo consenso cookie
- [x] `src/lib/analytics.js` — `trackEvent()` e `identifyUser()`
- [x] `src/components/AnalyticsProvider.jsx` — orchestratore unico (PostHog + GA + CookieBanner)
- [x] `src/components/CookieBanner.jsx` — banner GDPR con Accetta/Rifiuta
- [x] `src/components/PostHogIdentify.jsx` — identifica utente loggato in PostHog (nel layout dashboard)
- [x] Session replay disabilitato in development

### cn.js, fetcher.js, global-error.js ✅
- [x] `src/utils/cn.js` — classi CSS condizionali (clsx + tailwind-merge)
- [x] `src/utils/fetcher.js` — fetch wrapper con gestione errori
- [x] `src/app/global-error.js` — error boundary root layout

### Metadata SEO per ogni pagina ✅
- [x] Landing page — usa defaults dal root `layout.js` (title, description, OG image)
- [x] Sign in — `layout.js` con title "Accedi"
- [x] Legal Terms/Privacy — already had `export const metadata`
- [x] Dashboard — `layout.js` con title "Dashboard" e `robots: { index: false }`
- [x] Dashboard Billing — `layout.js` con title "Abbonamento" (noindex ereditato)
- [x] Dashboard Profile — `layout.js` con title "Profilo" (noindex ereditato)
- [x] Dashboard Settings — `layout.js` con title "Impostazioni" (noindex ereditato)
- [x] Setup Profile — `layout.js` con title "Completa il profilo" e `noindex`

### File upload — Cloudflare R2 ✅
- [x] Installato `@aws-sdk/client-s3`
- [x] Creato `src/lib/r2.js` — client S3 per R2 con `uploadToR2()`, `deleteFromR2()`, `getR2KeyFromUrl()`
- [x] Aggiornato `api/user/profile/route.js` — upload R2 + eliminazione vecchia immagine
- [x] Aggiornato `api/user/setup-profile/route.js` — upload R2
- [x] Aggiunto commento in `next.config.mjs` per `images.remotePatterns` R2
- [x] **Env richieste:** `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`

### vercel.json — headers e configurazione produzione ✅
- [x] Security headers backup (ridondanti con `next.config.mjs`, difesa in profondità)
- [x] Cache-Control `immutable` per assets statici (js, css, immagini, font)
- [x] Route dev già protette con `NODE_ENV === "production"` nei route handler
- [x] Cron verificato: `0 8 * * *` UTC

### Rate Limiting ✅
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

### next.config.mjs — immagini e security headers ✅
- [x] `images.remotePatterns` per Google avatar (`lh3.googleusercontent.com`)
- [x] Security headers: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, Strict-Transport-Security

### Pagine di errore HTTP ✅
- [x] `src/app/not-found.js` — pagina 404 personalizzata
- [x] `src/app/error.js` — pagina errore runtime (crash componenti)
- [x] `/auth/error` — errori di autenticazione (già esistente)

### Pagine legali ✅
- [x] `src/app/legal/terms/page.js` — Termini di Servizio
- [x] `src/app/legal/privacy/page.js` — Privacy Policy (GDPR)
- [x] Footer già collegato a `/legal/terms` e `/legal/privacy`

### SEO — Sitemap e robots.txt ✅
- [x] `src/app/sitemap.js` — sitemap.xml con pagine pubbliche
- [x] `src/app/robots.js` — blocca `/dashboard/`, `/api/`, `/setup-profile`

### Utility condivise ✅
- [x] `src/utils/formatDate.js` — `formatDate()` e `formatDateShort()` in italiano
- [x] `src/utils/formatPrice.js` — `formatPrice()` in EUR (supporta centesimi Stripe)

---

### Già implementato dalla prima sessione ✅

- [x] Auth: NextAuth v4, Magic Link + Google OAuth, session database
- [x] Template email `passwordReset.jsx`: mantenuto — non ancora collegato (usiamo Magic Link), ma conservato come base per implementare il password reset in futuro
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
