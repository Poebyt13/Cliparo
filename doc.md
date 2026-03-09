# Documentazione — SaaS Boilerplate

## Cos'è questo progetto

È un **SaaS boilerplate** — un punto di partenza pre-configurato per costruire qualsiasi applicazione web a pagamento. Invece di ricominciare da zero ogni volta, hai già pronte tutte le fondamenta: autenticazione, database, pagamenti ed email. Basta aggiungere la tua logica di business sopra.

---

## Stack tecnologico

| Tecnologia | Versione | Ruolo |
|---|---|---|
| **Next.js** | 16.1.6 | Framework React — gestisce frontend e backend insieme (App Router) |
| **React** | 19.2.3 | Libreria UI |
| **MongoDB + Mongoose** | ^9.2.4 | Database — salva utenti e dati con schema validato |
| **NextAuth v4** | ^4.24.13 | Autenticazione — login Google OAuth e Magic Link email |
| **@auth/mongodb-adapter** | ^3.11.1 | Adapter NextAuth per salvare sessioni su MongoDB |
| **Stripe** | ^20.4.1 | Pagamenti — abbonamenti e gestione piano premium |
| **Resend** | ^6.9.3 | Email transazionali — invia email via API |
| **@react-email/components** | ^1.0.8 | Template email scritti come componenti React |
| **Tailwind CSS** | ^4.2.1 | CSS utility-first |
| **DaisyUI** | ^5.5.19 | Componenti UI pronti sopra Tailwind |

---

## Struttura del progetto

```
boilerplate/
├── src/
│   ├── app/                        # Pagine e API (Next.js App Router)
│   │   ├── layout.js               # Layout globale con font Geist
│   │   ├── page.js                 # Homepage (da personalizzare)
│   │   ├── globals.css             # CSS globale
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.js    # Endpoint /api/auth/* (NextAuth)
│   │       └── stripe/
│   │           ├── checkout/
│   │           │   └── route.js    # POST /api/stripe/checkout
│   │           └── webhook/
│   │               └── route.js    # POST /api/stripe/webhook
│   ├── lib/                        # Utility e connessioni riusabili
│   │   ├── auth.js                 # Configurazione NextAuth
│   │   ├── mongodb.js              # Connessione Mongoose (con cache)
│   │   ├── mongoClient.js          # Connessione MongoClient nativo (per NextAuth)
│   │   ├── stripe.js               # Istanza Stripe
│   │   └── resend.js               # Istanza Resend + sendEmail()
│   ├── models/
│   │   └── User.js                 # Schema Mongoose utente
│   ├── emails/                     # Template email React
│   │   ├── login.jsx               # Magic Link login
│   │   ├── welcome.jsx             # Benvenuto nuovo utente
│   │   ├── paymentConfirmation.jsx # Conferma pagamento
│   │   └── passwordReset.jsx       # Reset password
│   ├── components/                 # Componenti UI (da popolare)
│   ├── utils/                      # Funzioni utility (da popolare)
│   ├── middleware.js               # Protezione route private
│   └── AGENT_GUIDE.md              # Regole per Copilot/Cursor AI
├── package.json
├── next.config.mjs
├── postcss.config.mjs
├── eslint.config.mjs
├── jsconfig.json
└── doc.md                          # Questo file
```

---

## Descrizione dettagliata dei file

### `src/app/` — Pagine e API

In Next.js con **App Router**, ogni cartella dentro `src/app/` diventa automaticamente un URL. Non occorre configurare nessun router manualmente.

#### `layout.js`
Layout globale che avvolge tutte le pagine. Carica i font **Geist Sans** e **Geist Mono** da Google Fonts tramite `next/font`.

#### `page.js`
Homepage dell'applicazione (`/`). Per ora mostra la pagina default di Next.js con link a documentazione e template Vercel. **Da sostituire** con la landing page del prodotto.

#### `api/auth/[...nextauth]/route.js`
Endpoint catch-all che gestisce tutte le route di NextAuth (`/api/auth/signin`, `/api/auth/callback`, `/api/auth/session`, ecc.). Il file è minimale — delega tutta la logica a `src/lib/auth.js`.

#### `api/stripe/checkout/route.js`
`POST /api/stripe/checkout`

1. Verifica che l'utente sia autenticato (getServerSession)
2. Recupera l'utente dal DB
3. Crea un Customer Stripe se non esiste ancora e salva l'ID
4. Riceve il `priceId` dal body della richiesta
5. Crea una **Stripe Checkout Session** in modalità `subscription`
6. Ritorna l'URL di checkout a cui redirigere il browser

#### `api/stripe/webhook/route.js`
`POST /api/stripe/webhook`

Riceve gli eventi da Stripe e aggiorna lo stato abbonamento dell'utente nel database. Verifica la firma del webhook per sicurezza. Gestisce i seguenti eventi:

| Evento Stripe | Azione |
|---|---|
| `customer.subscription.created` | Aggiorna stato abbonamento |
| `customer.subscription.updated` | Aggiorna stato abbonamento |
| `customer.subscription.deleted` | Imposta stato a `"free"` |
| `invoice.payment_succeeded` | Imposta stato a `"premium"` |
| `invoice.payment_failed` | Imposta stato a `"free"` |

---

### `src/lib/` — Utility e connessioni

#### `mongodb.js` — Connessione Mongoose
Gestisce la connessione a MongoDB tramite Mongoose. Implementa una **cache globale** (`globalThis.mongoose`) per evitare di aprire centinaia di connessioni durante lo sviluppo con hot reload. Da usare nei modelli e nelle API che lavorano con i dati.

```js
import connectToDatabase from "@/lib/mongodb";
await connectToDatabase();
```

#### `mongoClient.js` — Client nativo MongoDB
Connessione con il **MongoClient nativo** (non Mongoose). Necessaria perché `@auth/mongodb-adapter` — usato da NextAuth per salvare sessioni e account — richiede il client nativo, non Mongoose.

#### `auth.js` — Configurazione NextAuth
Configura i provider di autenticazione:
- **Google OAuth** — login con account Google
- **Email Magic Link** — login senza password via email (usa il template `login.jsx` e la funzione `sendEmail`)

Configura sessioni salvate su database MongoDB con durata 30 giorni. Espone l'ID MongoDB dell'utente nella sessione tramite il callback `session`.

#### `stripe.js` — Istanza Stripe
Inizializza Stripe con la chiave segreta e l'API version più recente. Pronto all'importazione in qualsiasi file.

```js
import stripe from "@/lib/stripe";
```

#### `resend.js` — Invio email
Espone due export:
- `resend` — istanza Resend grezza
- `sendEmail({ to, subject, react })` — funzione wrapper per inviare email con template React

```js
import { sendEmail } from "@/lib/resend";
await sendEmail({ to: "user@example.com", subject: "Oggetto", react: <MyTemplate /> });
```

---

### `src/models/User.js` — Schema utente

Schema Mongoose con i seguenti campi:

| Campo | Tipo | Descrizione |
|---|---|---|
| `email` | String, unique | Email dell'utente (obbligatoria, lowercase) |
| `name` | String | Nome dell'utente (obbligatorio) |
| `stripeCustomerId` | String | ID cliente Stripe (null finché non si abbona) |
| `subscriptionStatus` | String (enum) | `"free"` \| `"premium"` \| `"trial"` |
| `createdAt` / `updatedAt` | Date | Gestiti automaticamente da Mongoose (`timestamps: true`) |

---

### `src/emails/` — Template email

Tutti i template sono componenti React scritti con `@react-email/components`. Vengono renderizzati in HTML da Resend prima dell'invio.

| File | Quando si usa |
|---|---|
| `login.jsx` | Magic Link per accedere senza password (inviata automaticamente da NextAuth) |
| `welcome.jsx` | Benvenuto a un nuovo utente registrato |
| `paymentConfirmation.jsx` | Conferma pagamento con riepilogo piano, importo e data |
| `passwordReset.jsx` | Link per reimpostare la password (link valido 1 ora) |

---

### `src/middleware.js` — Protezione route

Eseguito **prima di ogni richiesta**. Usa `withAuth` di NextAuth per proteggere automaticamente le route private. Se l'utente non è autenticato, viene reindirizzato a `/auth/signin`.

Route attualmente protette:
- `/dashboard/*`
- `/account/*`
- `/settings/*`

Per aggiungere nuove route protette, aggiungere il pattern nel `matcher` del file.

---

## Variabili d'ambiente

Creare un file `.env.local` nella root del progetto con le seguenti variabili:

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# NextAuth
NEXTAUTH_SECRET=una_stringa_casuale_e_sicura
NEXTAUTH_URL=http://localhost:5173

# Google OAuth (da Google Cloud Console)
GOOGLE_ID=
GOOGLE_SECRET=

# Email
EMAIL_FROM=noreply@tuodominio.com
RESEND_API_KEY=re_...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Flusso completo dell'applicazione

### Login con Magic Link
```
1. Utente inserisce la sua email
2. NextAuth genera un token univoco e lo salva su MongoDB
3. Resend invia l'email con il link (template login.jsx)
4. Utente clicca il link → NextAuth verifica il token
5. Sessione creata su MongoDB, utente autenticato
```

### Login con Google
```
1. Utente clicca "Accedi con Google"
2. Redirect a Google OAuth
3. Google ritorna a /api/auth/callback/google
4. NextAuth crea/collega l'account su MongoDB
5. Sessione creata, utente autenticato
```

### Abbonamento Stripe
```
1. Frontend chiama POST /api/stripe/checkout con { priceId }
2. Il server crea un Customer Stripe se non esiste
3. Salva stripeCustomerId nel DB
4. Crea una Checkout Session → ritorna l'URL
5. Browser reindirizza al checkout Stripe
6. Utente paga → Stripe manda un webhook a /api/stripe/webhook
7. Server verifica la firma → aggiorna subscriptionStatus a "premium"
```

### Accesso a route protette
```
1. Utente visita /dashboard
2. middleware.js intercetta la richiesta
3. Controlla se esiste una sessione valida
4. Sì → lascia passare | No → redirect a /auth/signin
```

---

## Cosa manca ancora (da costruire)

Il backend è completo. Le pagine UI sono ancora da creare in `src/app/`:

- [ ] `/auth/signin` — pagina di login (form email + pulsante Google)
- [ ] `/auth/error` — pagina di errore autenticazione
- [ ] `/dashboard` — area riservata post-login
- [ ] `/pricing` — pagina con i piani e i prezzi
- [ ] `/account` — impostazioni account utente
- [ ] `/settings` — preferenze applicazione

I componenti riusabili andranno in `src/components/`, le funzioni helper in `src/utils/`.

---

## Comandi utili

```bash
# Avvia in sviluppo (porta 5173)
npm run dev

# Build di produzione
npm run build

# Avvia in produzione
npm start

# Lint
npm run lint
```

---

## Regole del progetto (AGENT_GUIDE)

- Nomi di variabili, funzioni, classi e file in **inglese**
- Commenti in **italiano**
- Pattern modulare — ogni funzione deve essere riusabile
- File di supporto in `src/` (lib, models, emails, components, utils)
- Pagine e route in `src/app/`
- Riutilizzare sempre la connessione Mongoose esistente
