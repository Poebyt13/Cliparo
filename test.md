# TEST — Verifica nuove implementazioni

Guida per testare le funzionalità appena implementate.

---

## 1. Sentry — Error monitoring

**Prerequisiti:** crea un progetto su [sentry.io](https://sentry.io), copia il DSN e aggiungilo al `.env.local`:
```
NEXT_PUBLIC_SENTRY_DSN=https://xxx@yyy.ingest.sentry.io/zzz
```

### 1a. Verifica inizializzazione

1. Riavvia il dev server (`npm run dev`)
2. Apri la console del browser → **non** devono esserci errori legati a Sentry
3. Apri DevTools → Network → filtra per `sentry`
4. Naviga tra le pagine — devono apparire richieste verso Sentry (envelope/transaction)
5. **Verifica dashboard Sentry:** vai su Issues → deve comparire almeno una transaction di performance

### 1b. Verifica errore catturato

1. Provoca un errore client-side (es. modifica temporaneamente un componente per lanciare un `throw new Error("Test Sentry")`)
2. **Verifica dashboard Sentry:** l'errore deve comparire in Issues con lo stack trace
3. Rimuovi l'errore di test

### 1c. Senza DSN configurato — nessun impatto

1. Rimuovi `NEXT_PUBLIC_SENTRY_DSN` dal `.env.local`
2. Riavvia il server
3. **Verifica:** il sito funziona normalmente, nessun errore in console, nessuna richiesta verso Sentry
4. Rimetti il DSN dopo il test

### 1d. File config presenti

Verifica che esistano tutti e tre i file nella root del progetto:
- `sentry.server.config.js` (Node.js runtime)
- `sentry.client.config.js` (browser, include replay)
- `sentry.edge.config.js` (Edge runtime)

---

## 2. `instrumentation.js` — Validazione variabili d'ambiente all'avvio

**Cosa verificare:** all'avvio del server vengono stampati avvisi chiari per env mancanti.

### 2a. Con tutte le env configurate

1. Assicurati che `.env.local` abbia tutte le variabili obbligatorie
2. Riavvia il server (`npm run dev`)
3. **Verifica nel terminale:** non devono apparire avvisi `⚠` per le variabili obbligatorie
4. Per le variabili opzionali non configurate (es. PostHog, GA, R2) apparirà un messaggio `ℹ` informativo — è normale

### 2b. Con variabili obbligatorie mancanti

1. Commenta temporaneamente `STRIPE_SECRET_KEY` nel `.env.local`
2. Riavvia il server
3. **Verifica nel terminale:** deve apparire:
   ```
   ⚠  STRIPE_SECRET_KEY          — pagamenti Stripe
   ```
4. Decommenta la variabile dopo il test

### 2c. Variabili verificate

**Obbligatorie** (⚠ warning se mancanti):
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `MONGODB_URI`
- `RESEND_API_KEY`, `EMAIL_FROM`
- `GOOGLE_ID`, `GOOGLE_SECRET`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

**Opzionali** (ℹ info se mancanti):
- `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_SENTRY_DSN`
- `NEXT_PUBLIC_ADMIN_EMAIL`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`
- `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY`, `NEXT_PUBLIC_STRIPE_PRICE_YEARLY`
- `CRON_SECRET`

---

## 3. Health check endpoint — `/api/health`

**Prerequisiti:** `NEXT_PUBLIC_ADMIN_EMAIL` nel `.env.local` deve corrispondere all'email con cui fai login.

### 3a. Accesso come admin

1. Fai login con l'email che corrisponde a `NEXT_PUBLIC_ADMIN_EMAIL`
2. Apri nel browser: `http://localhost:3000/api/health`
3. **Verifica:** deve restituire un JSON con:
   - `overall`: `"ok"`, `"partial"` o `"error"`
   - `services`: oggetto con stato di ciascun servizio (mongodb, stripe, resend, r2, upstash, posthog, googleAnalytics, sentry)
4. Ogni servizio ha `status` (`"ok"`, `"not_configured"`, `"error"`) e `message`

### 3b. Accesso NON admin — bloccato

1. Fai login con un'email diversa da `NEXT_PUBLIC_ADMIN_EMAIL`
2. Apri nel browser: `http://localhost:3000/api/health`
3. **Verifica:** deve restituire `401` con `{ "error": "Non autorizzato" }`

### 3c. Accesso non autenticato — bloccato

1. Apri una finestra incognita (non loggato)
2. Vai su `http://localhost:3000/api/health`
3. **Verifica:** deve restituire `401`

---

## 4. Admin Health Indicator — widget pallino

**Prerequisiti:** `NEXT_PUBLIC_ADMIN_EMAIL` configurato nel `.env.local`.

### 4a. Visibile solo all'admin

1. Fai login con l'email admin (`NEXT_PUBLIC_ADMIN_EMAIL`)
2. **Verifica:** in basso a destra deve apparire un pallino colorato:
   - 🟢 Verde = tutti i servizi OK
   - 🟡 Giallo = qualche servizio non configurato
   - 🔴 Rosso = errore in un servizio
3. Clicca sul pallino → si apre un popover con la lista di tutti i servizi e il loro stato

### 4b. NON visibile a utenti normali

1. Fai login con un'email diversa da `NEXT_PUBLIC_ADMIN_EMAIL`
2. **Verifica:** il pallino in basso a destra **non** deve apparire
3. Verifica anche come utente non loggato sulla landing page — nessun pallino

### 4c. Refresh stato

1. Come admin, clicca il pallino per aprire il popover
2. Clicca il pulsante di refresh (icona freccia circolare) dentro il popover
3. **Verifica:** lo spinner appare brevemente e i dati si aggiornano

---

## 5. Admin Panel — `/dashboard/admin`

**Prerequisiti:** `NEXT_PUBLIC_ADMIN_EMAIL` configurato, almeno qualche utente nel DB.

### 5a. Accesso admin

1. Fai login con l'email admin
2. Nella sidebar del dashboard deve apparire la voce "Admin" (o simile)
3. Vai su `/dashboard/admin`
4. **Verifica:** la pagina mostra:
   - 4 card statistiche: Totale utenti, Free, Premium, Trial
   - Tabella utenti con paginazione (nome, email, piano, scadenza, data registrazione)

### 5b. Dati corretti

1. Confronta il "Totale utenti" con il numero di utenti nel DB
2. **Verifica:** la somma di Free + Premium + Trial deve corrispondere al totale
3. Se hai più di 20 utenti, verifica che la paginazione funzioni (pulsanti avanti/indietro)

### 5c. Accesso NON admin — redirect

1. Fai login con un'email diversa da `NEXT_PUBLIC_ADMIN_EMAIL`
2. Prova a navigare direttamente a `/dashboard/admin`
3. **Verifica:** vieni reindirizzato a `/dashboard` (il layout server-side blocca l'accesso)

### 5d. API admin protette

1. Come utente NON admin, apri dal browser:
   - `http://localhost:3000/api/admin/stats` → deve restituire `401`
   - `http://localhost:3000/api/admin/users` → deve restituire `401`

---

## 6. Preferenze email — `/dashboard/settings`

**Cosa verificare:** i toggle per le preferenze email funzionano e salvano su DB.

### 6a. Visualizzazione toggle

1. Fai login e vai su `/dashboard/settings`
2. **Verifica:** nella sezione "Preferenze email" ci sono 2 toggle:
   - **Email di notifica** — attivo di default
   - **Email promozionali** — disattivato di default

### 6b. Salvataggio preferenza

1. Cambia uno dei toggle (es. disattiva "Email di notifica")
2. **Verifica:** appare un toast "Preferenza aggiornata."
3. Ricarica la pagina — il toggle deve mantenere lo stato che hai impostato
4. Riattiva il toggle — toast di conferma, e lo stato si salva

### 6c. Errore di rete

1. Disattiva la rete (DevTools → Network → Offline)
2. Cambia un toggle
3. **Verifica:** appare un toast di errore e il toggle torna allo stato precedente

---

## 7. Account collegati (OAuth) — `/dashboard/settings`

**Cosa verificare:** la sezione mostra i provider collegati e permette di scollegarli.

### 7a. Visualizzazione provider

1. Fai login (con Magic Link o Google) e vai su `/dashboard/settings`
2. **Verifica:** nella sezione "Account collegati" appaiono i provider che hai usato:
   - Se hai usato Magic Link: appare "Magic Link (Email)" con icona email
   - Se hai usato Google: appare "Google" con logo Google
   - Se hai usato entrambi: appaiono entrambi

### 7b. Scollegamento provider (se ne hai più di uno)

1. Collega sia Google che Magic Link allo stesso account
2. Nella sezione "Account collegati", clicca **"Scollega"** su Google
3. **Verifica:** appare toast "Provider scollegato.", Google scompare dalla lista
4. Il provider email resta (non è scollegabile)

### 7c. Blocco scollegamento ultimo provider

1. Se hai solo 1 provider collegato (es. solo email)
2. **Verifica:** il pulsante "Scollega" non compare per il provider email (non è mai scollegabile)
3. Se hai solo Google senza email: il pulsante "Scollega" deve essere disabilitato (non puoi rimuovere l'unico metodo di accesso)

### 7d. API protezione

1. Prova a chiamare `DELETE /api/user/accounts` con body `{ "provider": "email" }`
2. **Verifica:** risponde `400` — "Non puoi scollegare il provider email."

---

## 8. Ultimi test dopo fix

**Test rapidi per verificare i fix applicati durante la sessione di test.**

### 8a. Widget health — pallino non si sposta

1. Fai login come admin
2. Clicca il pallino in basso a destra
3. **Verifica:** il popover si apre **sopra** il pallino, il pallino rimane fisso nella sua posizione (non si sposta a sinistra)

### 8b. Widget health — click fuori chiude

1. Apri il popover cliccando il pallino
2. Clicca in un punto qualsiasi della pagina (fuori dal popover)
3. **Verifica:** il popover si chiude automaticamente

### 8c. Sentry — nessun warning in console server

1. Riavvia il dev server
2. **Verifica nel terminale:** non devono apparire warning `disableLogger is deprecated` né `ACTION REQUIRED: onRouterTransitionStart`

### 8d. Sentry — debug silenzioso

1. Apri la console del browser
2. **Verifica:** non ci sono più i log `[Sentry]` blu che riempivano la console

---

## Nota su Magic Link e provider collegati

Il Magic Link (email) appare come provider collegato **solo se** `emailVerified` è valorizzato nel DB. Questo succede dopo il primo login con Magic Link.

- Se crei l'account con **Google** e poi fai login con **Magic Link** usando la stessa email → avrai entrambi i provider
- Il provider email **non è mai scollegabile** (non mostra il pulsante "Scollega")
- Il pulsante "Scollega" appare solo su provider OAuth (Google) e solo se hai almeno 2 metodi di accesso

---

## Checklist rapida

- [x] Sentry — errori catturati su dashboard Sentry
- [x] Sentry — nessun impatto se DSN non configurato
- [x] Sentry — nessun warning `disableLogger` o `onRouterTransitionStart`
- [x] Sentry — console browser silenziosa (no log `[Sentry]`)
- [x] `instrumentation.js` — avvisi env mancanti all'avvio server
- [x] Health check — `/api/health` restituisce stato servizi (solo admin)
- [x] Health check — `401` se non admin
- [x] Admin widget — pallino visibile solo all'admin
- [x] Admin widget — popover apre sopra, pallino non si sposta
- [x] Admin widget — click fuori chiude il popover
- [x] Admin panel — statistiche e lista utenti
- [x] Admin panel — redirect se non admin
- [x] Admin API — `401` se non admin
- [x] Preferenze email — toggle salvano su DB
- [x] Account collegati — provider visibili
- [x] Account collegati — scollegamento funziona (se più di uno)
- [x] Account collegati — blocco scollegamento ultimo provider
