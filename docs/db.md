# Database — MongoDB + Mongoose

## Connessione

Il progetto usa **due connessioni** parallele a MongoDB:

| Client | File | Usato da | Tipo |
|--------|------|----------|------|
| **Mongoose** | `src/lib/mongodb.js` | Tutto il codice applicativo (API, cron, callbacks) | ODM con schema |
| **MongoClient nativo** | `src/lib/mongoClient.js` | NextAuth MongoDB Adapter | Driver nativo |

### Perché due client?

NextAuth `@auth/mongodb-adapter` richiede il client nativo MongoDB (`MongoClient`), non Mongoose. Il codice applicativo usa Mongoose per i vantaggi dello schema (validazione, default, virtual, indici).

### Cache in sviluppo

Entrambi i client usano una cache globale (`globalThis`) per evitare connessioni multiple durante l'hot reload di Next.js:

```js
// mongodb.js (Mongoose)
let cached = globalThis.mongoose;

// mongoClient.js (nativo)
globalThis._mongoClientPromise = client.connect();
```

### Come connettersi nelle API

```js
import connectToDatabase from "@/lib/mongodb";

export async function GET() {
  await connectToDatabase();
  // usa i model Mongoose...
}
```

Non importare mai `mongoClient.js` direttamente nelle API — è riservato all'adapter NextAuth.

---

## Modello User

File: `src/models/User.js`

### Schema completo

| Campo | Tipo | Default | Descrizione |
|-------|------|---------|-------------|
| `name` | String | `null` | Nome dell'utente (trim) |
| `email` | String | `null` | Email univoca (lowercase, trim, unique index) |
| `image` | String | `null` | URL immagine profilo (Google o R2) |
| `emailVerified` | Date | `null` | Data verifica email (NextAuth magic link) |
| `stripeCustomerId` | String | `null` | ID cliente Stripe (index) |
| `subscriptionStatus` | String | `"free"` | Stato abbonamento: `"free"` \| `"trial"` \| `"premium"` |
| `subscriptionEnd` | Date | `null` | Data scadenza piano (null per free) |
| `cancelAtPeriodEnd` | Boolean | `false` | True se l'utente ha cancellato ma il periodo è ancora attivo |
| `profileSetupPending` | Boolean | `true` | True fino a quando l'utente completa /setup-profile |
| `notificationEmails` | Boolean | `true` | Ricevi email di notifica (scadenza, aggiornamenti) |
| `marketingEmails` | Boolean | `false` | Ricevi email promozionali |
| `createdAt` | Date | auto | Timestamp creazione (Mongoose timestamps) |
| `updatedAt` | Date | auto | Timestamp ultimo aggiornamento |

### Indici

```js
// Indice univoco su email (creato da `unique: true` nello schema)
{ email: 1 }  // unique

// Indice su stripeCustomerId per lookup rapido nei webhook
{ stripeCustomerId: 1 }

// Indice composto per la query del cron (abbonamenti in scadenza)
{ subscriptionStatus: 1, subscriptionEnd: 1 }
```

### Compatibilità NextAuth

Il modello usa `collection: "users"` che è la stessa collection usata dal MongoDB Adapter di NextAuth. I campi `name`, `email`, `image`, `emailVerified` sono quelli standard del modello utente NextAuth; i campi SaaS sono aggiunti sopra.

NextAuth crea anche le collection `sessions` e `accounts` automaticamente tramite l'adapter.

---

## Collection nel Database

| Collection | Gestita da | Descrizione |
|------------|-----------|-------------|
| `users` | Mongoose + NextAuth Adapter | Utenti con dati auth + SaaS |
| `sessions` | NextAuth Adapter | Sessioni attive (database strategy) |
| `accounts` | NextAuth Adapter | Account OAuth collegati (Google) |
| `verification_tokens` | NextAuth Adapter | Token magic link (temporanei, auto-eliminati) |

---

## Stati Abbonamento

```
               checkout.session.completed
  free ────────────────────────────────────── premium
   │                                             │
   │         subscription.updated                │
   │         (cancel_at_period_end = true)        │
   │                                             │
   │                                     cancelAtPeriodEnd = true
   │                                     (resta premium fino a subscriptionEnd)
   │                                             │
   │         subscription.deleted                │
   ◄─────────────────────────────────────────────┘
                 downgrade a free
                 + email notifica
```

### Valori possibili

| `subscriptionStatus` | `subscriptionEnd` | `cancelAtPeriodEnd` | Significato |
|----------------------|-------------------|---------------------|-------------|
| `"free"` | `null` | `false` | Piano gratuito, nessun abbonamento |
| `"trial"` | data futura | `false` | Periodo di prova attivo |
| `"premium"` | data futura | `false` | Abbonamento premium attivo e in rinnovo |
| `"premium"` | data futura | `true` | Abbonamento cancellato, attivo fino a scadenza |
| `"free"` | `null` | `false` | Abbonamento scaduto (post subscription.deleted) |

### Downgrade automatico

Due meccanismi di sicurezza per il downgrade:

1. **Callback `session()`** — ogni volta che la sessione viene letta, controlla se `subscriptionEnd < now` e fa il downgrade in background
2. **Cron job** — `/api/cron/subscriptions` viene eseguito ogni mattina alle 08:00 UTC e gestisce abbonamenti scaduti + invio email di avviso

---

## Utility Dev

### Reset database (`POST /api/dev/reset`)
Svuota tutte le collection (users, sessions, accounts). Solo in development.

### Seed utenti test (`POST /api/dev/seed`)
Crea utenti di test con diversi stati di abbonamento. Solo in development.

### Test scadenza (`POST /api/dev/test-expire`)
Simula la scadenza di un abbonamento per un email specifico. Solo in development.

```bash
# Esempi
curl -X POST http://localhost:3000/api/dev/reset
curl -X POST http://localhost:3000/api/dev/seed
curl -X POST http://localhost:3000/api/dev/test-expire \
  -H "Content-Type: application/json" \
  -d '{"email": "utente@test.dev"}'
```
