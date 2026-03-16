# Setup — Come Usare il Boilerplate

Guida per personalizzare il boilerplate e avviare un nuovo progetto SaaS.

---

## Quick Start

```bash
# 1. Clona il boilerplate
git clone <repo-url> mio-progetto
cd mio-progetto

# 2. Installa le dipendenze
npm install

# 3. Copia il file env
cp .env.example .env.local
# (oppure crea .env.local manualmente — vedi docs/deployment.md per tutte le variabili)

# 4. Avvia in sviluppo
npm run dev
```

Apri `http://localhost:3000`.

---

## Cosa Personalizzare

### 1. Identità del sito — `src/config/site.js`

Questo file controlla nome, logo e tagline usati in tutta l'app:

```js
const siteConfig = {
  name: "MioSaaS",                    // Nome mostrato ovunque
  tagline: "La soluzione perfetta",    // Tagline per landing page
  url: process.env.NEXTAUTH_URL,       // URL base
  logoImage: "/icon.svg",             // Logo in /public (null per solo testo)
  logoText: "MioSaaS",               // Testo affianco al logo (null per solo icona)
};
```

Metti il tuo logo in `public/icon.svg` (o qualsiasi formato supportato da Next.js Image).

### 2. SEO — `src/config/seo.js`

Titoli, descrizioni e immagini Open Graph:

```js
const seoConfig = {
  defaultTitle: "MioSaaS",
  titleTemplate: "%s | MioSaaS",
  description: "Descrizione del tuo prodotto per Google e social media.",
  ogImage: "/og-image.png",          // Immagine 1200x630 in /public
  locale: "it_IT",
};
```

### 3. Menu Dashboard — `src/config/dashboardMenu.js`

Aggiungi o modifica le voci della sidebar:

```js
const dashboardMenu = [
  { type: "item", label: "Dashboard", href: "/dashboard", icon: "home" },
  { type: "item", label: "Analytics", href: "/dashboard/analytics", icon: "chart" },
  {
    type: "group",
    label: "Account",
    icon: "user",
    items: [
      { type: "item", label: "Profilo", href: "/dashboard/profile", icon: "user-circle" },
      { type: "item", label: "Abbonamento", href: "/dashboard/billing", icon: "credit-card" },
    ],
  },
];
```

**Icone disponibili:** `home`, `user`, `user-circle`, `credit-card`, `settings`, `bell`, `chart`, `book`, `logout`

**Opzioni speciali:**
- `disabled: true` + `badge: "soon"` — voce disabilitata con badge "coming soon"
- `external: true` — apre in nuova tab (link esterno)

### 4. Piani e Prezzi Stripe

1. Crea i prodotti su [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
2. Copia i Price ID (`price_xxx`)
3. Aggiorna le variabili:
   ```env
   NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_tuoprezzo_mensile
   NEXT_PUBLIC_STRIPE_PRICE_YEARLY=price_tuoprezzo_annuale
   ```
4. Personalizza `PricingSectionForTwo.jsx` con i tuoi prezzi e feature

### 5. Email

I template sono in `src/emails/`. Per personalizzarli:

| Template | Quando viene inviata |
|---------|---------------------|
| `login.jsx` | Magic link di accesso |
| `welcome.jsx` | Primo login riuscito |
| `paymentConfirmation.jsx` | Pagamento completato |
| `subscriptionExpiring.jsx` | Abbonamento in scadenza (7 giorni prima) |
| `subscriptionExpired.jsx` | Abbonamento scaduto |
| `accountDeleted.jsx` | Account eliminato |
| `passwordReset.jsx` | Template base per futuri progetti con password |

Per aggiungere una nuova email:
1. Crea il file in `src/emails/nuovaEmail.jsx`
2. Usa i componenti di `@react-email/components`
3. Inviala con `sendEmail()` da `@/lib/resend.js`

---

## Personalizzare gli Stili

### Sistema di Temi — `src/app/globals.css`

Il boilerplate usa **DaisyUI 5** con due temi custom:

- `saas-light` — tema chiaro (default)
- `saas-dark` — tema scuro (attivato automaticamente da `prefers-color-scheme: dark`)

### Cambiare i colori

I colori sono definiti in `globals.css` usando il formato **OKLCh**:

```css
@plugin "daisyui/theme" {
  name: "saas-light";

  /* Colori brand — modifica questi per il tuo brand */
  --color-primary:           oklch(58% 0.22 264);  /* viola-blu */
  --color-secondary:         oklch(62% 0.18 300);  /* viola */
  --color-accent:            oklch(70% 0.20 180);  /* teal */

  /* Sfondi */
  --color-base-100:     oklch(100% 0 0);           /* bianco */
  --color-base-200:     oklch(96% 0.005 264);      /* grigio chiaro */
  --color-base-300:     oklch(90% 0.010 264);      /* bordi */
  --color-base-content: oklch(20% 0.02 264);       /* testo */
}
```

**Come funziona OKLCh:**
- `luminosità%` — 0% = nero, 100% = bianco
- `croma` — 0 = grigio, 0.37 = massima saturazione
- `angolo hue` — 0-360° (264 = viola-blu, 140 = verde, 20 = rosso, 180 = teal)

**Suggerimento:** per cambiare la palette, modifica solo l'angolo hue dei colori `primary`, `secondary` e `accent` mantenendo gli stessi valori di luminosità e croma.

### Cambiare l'arrotondamento

```css
--radius-selector: 0.5rem;   /* select, dropdown */
--radius-field:    0.375rem; /* input, textarea */
--radius-box:      0.75rem;  /* card, modal */
```

Aumenta i valori per un look più arrotondato, riduci per un look più squadrato.

### Cambiare il font

Il font è configurato in `src/app/layout.js`:

```js
import { Inter, Geist_Mono } from "next/font/google";

const geistSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});
```

Per cambiare font, sostituisci `Inter` con qualsiasi font di [Google Fonts](https://fonts.google.com). Il font mono (`Geist_Mono`) è usato per `<code>`, `<pre>`, ecc.

### Cambiare il tema di default

In `src/app/layout.js`, modifica `data-theme`:

```html
<html lang="it" data-theme="saas-light">
```

Opzioni: `saas-light`, `saas-dark`, o qualsiasi tema built-in DaisyUI (`light`, `dark`, `corporate`, `business`).

### Dark mode automatica

Il tema scuro si attiva automaticamente quando il sistema operativo usa dark mode, grazie a `--prefersdark` nella config DaisyUI in `globals.css`.

---

## Aggiungere una Nuova Pagina

### Pagina pubblica

```
src/app/nuova-pagina/page.js
```

### Pagina dashboard (protetta)

```
src/app/(dashboard)/dashboard/nuova-pagina/page.js
src/app/(dashboard)/dashboard/nuova-pagina/layout.js  ← per metadata/title
```

Il `layout.js` definisce il titolo (le pagine "use client" non possono esportare `metadata`):

```js
export const metadata = { title: "Nuova Pagina" };

export default function NuovaPaginaLayout({ children }) {
  return children;
}
```

Ricorda di:
1. Aggiungere la voce nel menu se necessario (`src/config/dashboardMenu.js`)
2. Aggiungere la route al matcher del proxy se è protetta (`src/proxy.js`)
3. Aggiungere alla sitemap se è pubblica (`src/app/sitemap.js`)

---

## Aggiungere una Nuova API

```
src/app/api/nuova-feature/route.js
```

Pattern standard:

```js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { applyRateLimit, standardLimiter } from "@/lib/ratelimit";

export async function POST(req) {
  // 1. Rate limiting
  const rateLimitResponse = await applyRateLimit(req, standardLimiter, "nuova-feature");
  if (rateLimitResponse) return rateLimitResponse;

  // 2. Autenticazione
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  // 3. Connessione DB
  await connectToDatabase();

  // 4. Logica
  try {
    // ...
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Errore:", error);
    return NextResponse.json({ error: "Errore interno." }, { status: 500 });
  }
}
```

---

## Aggiungere un Nuovo Modello

```js
// src/models/NuovoModel.js
import mongoose from "mongoose";

const nuovoModelSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    // ... altri campi
  },
  { timestamps: true }
);

const NuovoModel = mongoose.models.NuovoModel || mongoose.model("NuovoModel", nuovoModelSchema);

export default NuovoModel;
```

Usa sempre `mongoose.models.X || mongoose.model("X", schema)` per evitare errori di hot reload.

---

## Script Disponibili

| Comando | Descrizione |
|---------|-------------|
| `npm run dev` | Avvia il dev server con hot reload |
| `npm run build` | Build di produzione |
| `npm run start` | Avvia il server di produzione |
| `npm run lint` | Esegue ESLint |
