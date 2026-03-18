# Analytics — PostHog + Google Analytics + Cookie Consent

## Panoramica

Il boilerplate integra **due sistemi di analytics**, entrambi bloccati finché l'utente non accetta i cookie (GDPR):

| Strumento | Cosa traccia | Dove agisce |
|-----------|-------------|-------------|
| **PostHog** | Comportamento utente in-app (click, pageview, session replay, funnel) | Tutta l'app |
| **Google Analytics (GA4)** | Traffico e sorgenti sulla landing page | Sito pubblico |

Tutto è gestito da un unico componente: `AnalyticsProvider`, che coordina consenso cookie, inizializzazione PostHog e iniezione dello script GA.

---

## Architettura

```
layout.js
  └── SessionProviderWrapper
        └── AnalyticsProvider          ← gestisce tutto
              ├── PostHogProvider      ← wrap condizionale (solo se consenso dato)
              │     └── PostHogIdentify  ← identifica utente loggato (in dashboard layout)
              ├── GA4 script injection ← iniettato dinamicamente dopo consenso
              └── CookieBanner         ← mostrato solo al primo accesso
```

### Flusso di inizializzazione

1. L'utente visita il sito → `AnalyticsProvider` controlla `localStorage.cookie_consent`
2. Se **non c'è valore** → mostra `CookieBanner`
3. Se l'utente clicca **"Accetta"**:
   - Salva `"accepted"` in `localStorage.cookie_consent`
   - Chiama `initPostHog()` → inizializza PostHog SDK
   - Inietta lo script `gtag.js` → attiva Google Analytics
   - Wrappa i children nel `PostHogProvider`
4. Se l'utente clicca **"Rifiuta"**:
   - Salva `"declined"` in `localStorage.cookie_consent`
   - Nessun analytics attivato
5. Visite successive → il banner non appare più, gli analytics partono automaticamente se già accettati

---

## File coinvolti

| File | Tipo | Scopo |
|------|------|-------|
| `src/components/AnalyticsProvider.jsx` | Client Component | Provider unico: gestisce consenso, inizializza PostHog + GA |
| `src/lib/posthog.js` | Client lib | `initPostHog()`, `stopPostHog()`, export del client PostHog |
| `src/lib/analytics.js` | Client lib | `trackEvent()` e `identifyUser()` — helper riutilizzabili |
| `src/components/CookieBanner.jsx` | Client Component | Banner GDPR con Accetta/Rifiuta |
| `src/components/PostHogIdentify.jsx` | Client Component | Identifica l'utente loggato in PostHog (senza UI) |

---

## PostHog

### Configurazione

**Variabili d'ambiente:**

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx      # Project API Key (da PostHog → Project Settings)
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com   # Host (EU o US)
```

**Opzioni di inizializzazione** (`src/lib/posthog.js`):

```js
posthog.init(key, {
  api_host: host,
  person_profiles: "identified_only",  // crea profili solo per utenti identificati
  capture_pageview: true,              // pageview automatici
  capture_pageleave: true,             // traccia quando l'utente lascia la pagina
  disable_session_recording: process.env.NODE_ENV === "development",  // no replay in dev
});
```

### Cosa traccia automaticamente (dopo consenso)

| Funzionalità | Attiva | Note |
|--------------|--------|------|
| Pageview | ✅ Auto | Ogni cambio pagina |
| Page leave | ✅ Auto | Quando l'utente esce dalla pagina |
| Click/interazioni | ✅ Auto (autocapture) | Click, input, ecc. |
| Session replay | ✅ Auto (solo produzione) | Disabilitato in development per non sprecare quota |
| Identificazione utente | ✅ Manuale | Via `PostHogIdentify` nel layout dashboard |

### Identificazione utente

Il componente `PostHogIdentify` (senza UI) va incluso nel layout della dashboard. Quando la sessione NextAuth è disponibile, chiama `posthog.identify()` con:

```js
identifyUser(session.user.id, {
  email: session.user.email,
  name: session.user.name,
  plan: session.user.subscriptionStatus,  // "free", "trial", "premium"
});
```

Questo associa tutti gli eventi PostHog all'utente reale, invece di lasciarli anonimi.

### Eventi custom

Per tracciare eventi specifici del tuo SaaS, usa `trackEvent()`:

```js
import { trackEvent } from "@/lib/analytics";

// Esempio: l'utente ha completato una certa azione
trackEvent("feature_used", { feature: "export_pdf", plan: "premium" });

// Esempio: checkout avviato
trackEvent("checkout_started", { priceId: "price_xxx" });
```

La funzione è safe: non fa nulla se PostHog non è caricato o se l'utente ha rifiutato i cookie.

### Funzionalità PostHog disponibili (non nel boilerplate)

Queste funzionalità sono disponibili su PostHog ma vanno configurate per-progetto:

- **Feature flags** — Abilita/disabilita feature per segmenti di utenti
- **A/B testing** — Test varianti di interfaccia
- **Funnel analysis** — Analisi dei funnel di conversione
- **Heatmaps** — Mappe di calore delle interazioni

---

## Google Analytics (GA4)

### Configurazione

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX    # Measurement ID (da GA4 → Admin → Data Streams)
```

Se la variabile non è impostata, lo script GA non viene iniettato. Nessun errore.

### Come funziona

Lo script `gtag.js` viene iniettato dinamicamente nel `<head>` dopo il consenso cookie. Non usa il componente `<GoogleAnalytics>` di `@next/third-parties` — l'iniezione manuale permette di bloccare il caricamento prima del consenso.

GA4 traccia automaticamente:
- **Pageview** — ogni navigazione
- **Sorgenti di traffico** — da dove arrivano i visitatori
- **Bounce rate** — rimbalzi
- **Dispositivo e browser** — statistiche dispositivi
- **Conversioni** — configurabili sulla dashboard GA

### Consiglio d'uso

| Cosa | Strumento |
|------|-----------|
| Visitatori sul sito marketing, traffico, SEO | **Google Analytics** |
| Comportamento utente dentro l'app (post-login) | **PostHog** |

---

## Cookie Banner (GDPR)

### Componente: `CookieBanner`

Un banner fisso in basso che appare solo al primo accesso (nessuna scelta precedente in `localStorage`).

**Props:**

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `privacyUrl` | `string` | `"/legal/privacy"` | Link alla pagina privacy |
| `onAccept` | `function` | — | Callback quando l'utente accetta |
| `onDecline` | `function` | — | Callback quando l'utente rifiuta |
| `className` | `string` | `""` | Classi CSS aggiuntive |

**Storage:** `localStorage` con chiave `cookie_consent`, valori `"accepted"` o `"declined"`.

**Helper:** `getCookieConsent()` — restituisce lo stato attuale del consenso (`"accepted"`, `"declined"`, o `null`).

### Comportamento

- **Prima visita:** banner visibile, nessun analytics attivo
- **Accetta:** banner sparisce, analytics inizializzati, non ricompare
- **Rifiuta:** banner sparisce, nessun analytics, non ricompare
- **Visite successive:** nessun banner, analytics auto-avviati se consenso precedente

### Personalizzazione

Il testo del banner è in italiano e può essere modificato direttamente nel componente. Lo stile usa DaisyUI (`bg-base-100`, `border-base-300`, `btn-primary`, `btn-ghost`).

---

## Setup per un nuovo progetto

### 1. Crea account PostHog

1. Vai su [posthog.com](https://posthog.com) → Sign up
2. Scegli la regione (**EU** consigliato per GDPR)
3. Crea un progetto → copia il **Project API Key**
4. Imposta in `.env.local`:
   ```env
   NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
   NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
   ```

### 2. Crea proprietà Google Analytics

1. Vai su [analytics.google.com](https://analytics.google.com) → Crea proprietà
2. Aggiungi un **Data Stream** web con il dominio del tuo sito
3. Copia il **Measurement ID** (`G-XXXXXXXXXX`)
4. Imposta in `.env.local`:
   ```env
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

### 3. Verifica

1. Avvia l'app → accetta i cookie nel banner
2. **PostHog:** vai sulla dashboard PostHog → dovresti vedere pageview ed eventi
3. **GA4:** vai su Realtime in Google Analytics → dovresti vedere la visita

> **Nota:** in development, PostHog non registra session replay (per risparmiare quota). Per testare le session recording, fai un deploy o cambia temporaneamente la configurazione in `posthog.js`.

---

## Costi

| Servizio | Gratuito | Quando costa |
|----------|----------|-------------|
| **PostHog** | 1M eventi/mese, 5.000 session recordings/mese | Pay-as-you-go oltre il limite (~$0.00031/evento) |
| **Google Analytics** | Gratuito per sempre | — |

Dettagli completi in [docs/pricing.md](pricing.md).
