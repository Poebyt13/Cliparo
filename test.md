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
- [ ] Cookie consent banner — appare al primo accesso
- [ ] Cookie consent banner — blocca analytics se rifiutato
- [ ] Cookie consent banner — inizializza analytics se accettato
- [ ] PostHog — eventi tracciati solo dopo consenso
- [ ] Google Analytics — gtag iniettato solo dopo consenso
- [ ] Welcome email — inviata solo al primo login

---

## 7. Cookie consent banner (GDPR) + Analytics

**Cosa verificare:** il banner appare al primo accesso, salva la scelta e blocca/avvia gli analytics correttamente.

### 7a. Prima visita — banner visibile

1. Apri il browser in **modalità incognita** (oppure cancella il localStorage)
2. Vai su `http://localhost:3000`
3. **Verifica:** deve apparire in basso il banner con i pulsanti "Rifiuta" e "Accetta"
4. **Ricarica la pagina** — il banner deve riapparire (finché non scegli)

### 7b. Rifiuto cookie

1. Apri la modalità incognita → vai su `/`
2. Clicca **"Rifiuta"**
3. **Verifica:** il banner scompare
4. **Verifica localStorage:** apri DevTools → Application → Local Storage → `http://localhost:3000`
   - Deve esserci la chiave `cookie_consent` con valore `declined`
5. **Verifica analytics:** apri DevTools → Network → filtra per `posthog` o `google-analytics`
   - Non deve esserci **nessuna** richiesta verso PostHog o Google Analytics
6. Ricarica la pagina — il banner **non** deve riapparire (la scelta è salvata)

### 7c. Accettazione cookie

1. Apri la modalità incognita → vai su `/`
2. Clicca **"Accetta"**
3. **Verifica:** il banner scompare
4. **Verifica localStorage:** chiave `cookie_consent` con valore `accepted`
5. **Verifica PostHog** (se `NEXT_PUBLIC_POSTHOG_KEY` è configurata):
   - DevTools → Network → filtra per `posthog` o `i.posthog.com`
   - Deve apparire almeno una richiesta di pageview
6. **Verifica GA** (se `NEXT_PUBLIC_GA_ID` è configurato):
   - DevTools → Network → filtra per `googletagmanager` o `google-analytics`
   - Deve apparire la richiesta di inizializzazione gtag
7. Ricarica la pagina — analytics devono ripartire automaticamente (non serve riacceptare)

### 7d. Test senza env configurate

1. Senza `NEXT_PUBLIC_POSTHOG_KEY` e `NEXT_PUBLIC_GA_ID` nel `.env.local`:
2. Clicca "Accetta" nel banner
3. **Verifica:** nessun errore in console, nessuna richiesta di rete verso analytics
4. Il sito funziona normalmente — le env mancanti vengono ignorate silenziosamente

### 7e. Link Privacy Policy nel banner

1. Apri il banner in modalità incognita
2. Clicca sul link **"Privacy Policy"** nel testo del banner
3. **Verifica:** navighi correttamente a `/legal/privacy`

---

## 8. PostHog — verifica pageview e connessione

**Prerequisiti:** `NEXT_PUBLIC_POSTHOG_KEY` configurata nel `.env.local`, banner accettato (vedi 7c).

> Nota: i file `src/lib/analytics.js` e `src/lib/posthog.js` sono file sorgente bundlati da Next.js — non sono importabili dalla console del browser tramite `import()`. Il test si fa tramite Network DevTools o la dashboard PostHog.

### 8a. Verifica pageview automatici

1. Accetta i cookie in modalità incognita (vedi 7c)
2. Apri DevTools → Network → filtra per il tuo host PostHog (es. `eu.i.posthog.com`)
3. Naviga tra alcune pagine (es. `/`, `/auth/signin`, `/dashboard`)
4. **Verifica:** per ogni navigazione deve apparire una richiesta POST con `$pageview` nel payload
5. **Verifica PostHog dashboard:** Events → deve comparire l'evento `$pageview`

### 8b. Nessuna richiesta se banner non accettato

1. Apri modalità incognita → **rifiuta** il banner
2. Filtra Network per il tuo host PostHog
3. Naviga tra le pagine
4. **Verifica:** nessuna richiesta verso PostHog

### 8c. Analytics riparte senza ricaricare dopo accettazione

1. Apri modalità incognita — il banner appare
2. Apri Network → filtra per PostHog
3. Clicca **"Accetta"** senza ricaricare la pagina
4. **Verifica:** entro pochi secondi deve apparire la prima richiesta PostHog (pageview della pagina corrente)

---

## 9. Welcome email — primo login

**Prerequisiti:** `RESEND_API_KEY` e `EMAIL_FROM` configurati, dev server avviato.

### 9a. Prima registrazione

1. Vai su `/api/dev/reset` (POST) per azzerare il DB, oppure usa un'email che non hai mai usato
2. Vai su `/auth/signin`
3. Inserisci un'email nuova e clicca "Invia link magico"
4. Apri la casella email dell'indirizzo inserito
5. **Verifica:** deve essere arrivata l'email di benvenuto con oggetto `"Benvenuto!"`
6. **Verifica contenuto:** l'email deve contenere il nome dell'utente (o "Utente" se non ancora impostato) e il link alla dashboard

### 9b. Login successivo — email NON inviata

1. Fai log out
2. Accedi di nuovo con la stessa email
3. **Verifica:** arriva solo l'email del magic link login, **non** il benvenuto
4. Controlla i log del server (`npm run dev`) — non deve apparire nessun log di invio welcome email

### 9c. Registrazione con Google

1. Vai su `/auth/signin` → clicca "Continua con Google"
2. Accedi con un account Google mai usato prima
3. **Verifica:** deve arrivare la welcome email con il nome preso dall'account Google

### 9d. Note sul comportamento senza env configurate

> La rimozione di `RESEND_API_KEY` **rompe intenzionalmente** il Magic Link — il login via email *è* un'email, quindi senza il provider email non può funzionare. Questo è il comportamento corretto.
>
> All'avvio del server, `src/instrumentation.js` stampa in console un avviso chiaro per ogni env mancante, così sai subito cosa non è configurato prima di andare in errore a runtime.
>
> Google OAuth non dipende da Resend e funziona anche senza `RESEND_API_KEY` — la welcome email viene comunque tentata ma l'errore viene catturato silenziosamente senza bloccare il login.
