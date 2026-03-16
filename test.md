# TEST — Verifica implementazioni Boilerplate

Guida per testare tutte le implementazioni del TODO completato.

---

## 1. `cn.js` — utility classi CSS

**Cosa verificare:** i componenti che usano `cn()` rendono correttamente le classi.

1. Avvia il dev server (`npm run dev`)
2. Apri la landing page `/` — verifica che i `Button`, `Card`, `Logo` abbiano lo stile corretto
3. Vai su `/auth/signin` — verifica che `Input` mostri correttamente:
   - Stato normale (nessuna classe extra)
   - Stato errore (invia il form vuoto — deve apparire bordo rosso `input-error`)
4. Vai su `/dashboard/profile` — verifica che `Button` e `Card` siano stilizzati come prima
5. **Nessuna regressione visiva** = test passato

---

## 2. `fetcher.js` — utility fetch

**Cosa verificare:** le funzioni sono importabili e funzionano.

1. Apri la console del browser su qualsiasi pagina
2. Nella console esegui:
   ```js
   import("/src/utils/fetcher.js").then(m => m.fetcher("/api/auth/session")).then(console.log)
   ```
   - Deve restituire l'oggetto sessione (o `{}` se non loggato)
3. **Verifica errore:** in console:
   ```js
   import("/src/utils/fetcher.js").then(m => m.fetcher("/api/nonexistent")).catch(e => console.log(e.status, e.message))
   ```
   - Deve loggare `404 "Errore nel caricamento dei dati"`

> Nota: `fetcher.js` è una utility per uso futuro con SWR o nei componenti client. Non è ancora usata nel codice attuale — basta verificare che sia importabile senza errori.

---

## 3. `global-error.js` — error boundary root layout

**Cosa verificare:** la pagina di errore critico si mostra in caso di crash nel layout.

> `global-error.js` cattura solo errori nel root `layout.js`, che sono molto rari. In sviluppo Next.js mostra il suo overlay di errore, quindi il modo più semplice per verificare è:

1. Controlla che il file esista: `src/app/global-error.js`
2. Verifica che contenga:
   - `"use client"` in cima
   - Tag `<html>` e `<body>` (obbligatorio per Next.js)
   - Pulsanti "Riprova" e "Torna alla home"
3. **Verifica build:** il file è già incluso nella build (la build passa senza errori = OK)

---

## 4. `generateMetadata` — titoli pagina

**Cosa verificare:** ogni pagina mostra il titolo corretto nel tab del browser.

| Pagina | URL | Titolo atteso nel tab |
|--------|-----|-----------------------|
| Landing | `/` | `SaaS Boilerplate` |
| Sign in | `/auth/signin` | `Accedi \| SaaS Boilerplate` |
| Terms | `/legal/terms` | `Termini di Servizio \| SaaS Boilerplate` |
| Privacy | `/legal/privacy` | `Privacy Policy \| SaaS Boilerplate` |
| Dashboard | `/dashboard` | `Dashboard \| SaaS Boilerplate` |
| Billing | `/dashboard/billing` | `Abbonamento \| SaaS Boilerplate` |
| Profile | `/dashboard/profile` | `Profilo \| SaaS Boilerplate` |
| Settings | `/dashboard/settings` | `Impostazioni \| SaaS Boilerplate` |
| Setup Profile | `/setup-profile` | `Completa il profilo \| SaaS Boilerplate` |

**Verifica noindex sulle pagine protette:**

1. Apri DevTools → tab Elements
2. Cerca nel `<head>` il tag `<meta name="robots">`
3. Le pagine dashboard e setup-profile devono avere `noindex, nofollow`
4. Le pagine pubbliche (landing, signin, legal) **non** devono avere il tag robots noindex

---

## 5. Cloudflare R2 — file upload

**Prerequisiti:** devi avere un bucket R2 configurato su Cloudflare.

### 5a. Setup Cloudflare R2

1. Vai su [Cloudflare Dashboard](https://dash.cloudflare.com) → R2
2. Crea un bucket (es. `boilerplate-avatars`)
3. Vai in Settings del bucket → abilita accesso pubblico (custom domain o R2.dev subdomain)
4. Vai su R2 → Manage R2 API Tokens → Crea un token con permesso `Object Read & Write`
5. Aggiungi al `.env.local`:
   ```
   R2_ACCOUNT_ID=il-tuo-account-id
   R2_ACCESS_KEY_ID=la-tua-access-key
   R2_SECRET_ACCESS_KEY=il-tuo-secret
   R2_BUCKET_NAME=boilerplate-avatars
   R2_PUBLIC_URL=https://il-tuo-dominio-r2.com
   ```
6. In `next.config.mjs`, decommenta e aggiorna la riga `images.remotePatterns` con il tuo dominio R2

### 5b. Test upload

1. Riavvia il dev server dopo aver aggiunto le env
2. Fai login e vai su `/setup-profile`
3. Carica un'immagine JPG o PNG (< 2MB)
4. Compila il nome e salva
5. **Verifica:** l'immagine deve caricarsi correttamente e apparire nel profilo
6. **Verifica nel bucket:** apri il Cloudflare Dashboard → R2 → il tuo bucket → deve esserci il file sotto `avatars/`

### 5c. Test aggiornamento immagine

1. Vai su `/dashboard/profile`
2. Carica una nuova immagine e salva
3. **Verifica:** la nuova immagine sostituisce la vecchia nel profilo
4. **Verifica nel bucket:** la vecchia immagine deve essere stata eliminata, la nuova presente

### 5d. Test senza R2 configurato

1. Rimuovi temporaneamente le variabili `R2_*` dal `.env.local`
2. Riavvia il server
3. Prova a caricare un'immagine su `/dashboard/profile`
4. **Verifica:** deve restituire errore 500 con messaggio (non crash silenzioso)
5. Rimetti le variabili env dopo il test

---

## 6. `vercel.json` — headers produzione

**Cosa verificare:** il file è valido e gli headers funzionano in produzione.

### 6a. Verifica struttura

1. Apri `vercel.json` e controlla che contenga:
   - `crons` con `/api/cron/subscriptions` alle 08:00 UTC
   - `headers` con security headers su `/(.*)`
   - `headers` con `Cache-Control: immutable` su assets statici

### 6b. Test in locale (limitato)

> I headers di `vercel.json` funzionano solo su Vercel. In locale sono gestiti da `next.config.mjs`.

1. Avvia il dev server
2. Apri DevTools → Network → ricarica qualsiasi pagina
3. Clicca sulla risposta della pagina HTML → tab Headers
4. **Verifica** che ci siano:
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Strict-Transport-Security: max-age=63072000; ...`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

> Questi headers vengono da `next.config.mjs` in locale e da `vercel.json` come backup su Vercel.

### 6c. Verifica dopo deploy su Vercel

1. Dopo il deploy, verifica gli stessi headers nella risposta HTTP
2. Verifica che gli asset statici (`.js`, `.css`) abbiano `Cache-Control: public, max-age=31536000, immutable`
3. Verifica che `/api/dev/reset` restituisca `403` in produzione (protetto da `NODE_ENV` check)

---

## Checklist rapida

- [ ] `cn.js` — nessuna regressione visiva nei componenti
- [ ] `fetcher.js` — importabile senza errori
- [ ] `global-error.js` — file presente, build passa
- [ ] `generateMetadata` — titoli corretti in ogni pagina
- [ ] `generateMetadata` — noindex su dashboard e setup-profile
- [ ] Cloudflare R2 — upload immagine funziona
- [ ] Cloudflare R2 — sostituzione immagine elimina la vecchia
- [ ] Cloudflare R2 — errore gestito se R2 non configurato
- [ ] `vercel.json` — security headers presenti nelle risposte
- [ ] `vercel.json` — cache headers su assets statici (solo su Vercel)
