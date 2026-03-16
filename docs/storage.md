# Storage — Cloudflare R2

## Panoramica

Il boilerplate usa **Cloudflare R2** per lo storage dei file (immagini profilo). R2 è compatibile con l'API S3 di AWS, gratuito fino a 10GB di storage e 10 milioni di richieste/mese.

**File:** `src/lib/r2.js`
**Dipendenza:** `@aws-sdk/client-s3`

---

## Configurazione

### Variabili d'ambiente

```env
R2_ACCOUNT_ID=abc123           # ID account Cloudflare (Dashboard → Overview → Account ID)
R2_ACCESS_KEY_ID=xxx           # Access Key (R2 → Manage R2 API Tokens)
R2_SECRET_ACCESS_KEY=xxx       # Secret Key
R2_BUCKET_NAME=boilerplate     # Nome del bucket creato
R2_PUBLIC_URL=https://pub-xxx.r2.dev   # URL pubblico del bucket
```

### Creare il bucket

1. Vai su [Cloudflare Dashboard](https://dash.cloudflare.com) → **R2 Object Storage**
2. Clicca **Create bucket** → scegli un nome (es. `boilerplate`)
3. Vai in **Settings** del bucket → **Public access** → abilita (R2.dev subdomain o custom domain)
4. Vai su **R2 → Manage R2 API Tokens** → crea un token con permesso **Object Read & Write**
5. Copia Access Key ID e Secret Access Key

### Aggiornare next.config.mjs

Decommenta e aggiorna la riga in `images.remotePatterns` con il tuo dominio R2:

```js
images: {
  remotePatterns: [
    { protocol: "https", hostname: "lh3.googleusercontent.com" },
    // Decommentare con il tuo dominio:
    { protocol: "https", hostname: "pub-xxx.r2.dev" },
  ],
},
```

---

## API — `src/lib/r2.js`

### `uploadToR2(buffer, key, contentType)`

Carica un file su R2.

| Parametro | Tipo | Esempio |
|-----------|------|---------|
| `buffer` | `Buffer` | `Buffer.from(await file.arrayBuffer())` |
| `key` | `string` | `"avatars/1710000000-userId.jpg"` |
| `contentType` | `string` | `"image/jpeg"` |

**Ritorna:** URL pubblico del file (es. `https://pub-xxx.r2.dev/avatars/1710000000-userId.jpg`)

### `deleteFromR2(key)`

Elimina un file da R2. Non fa nulla se R2 non è configurato.

| Parametro | Tipo | Esempio |
|-----------|------|---------|
| `key` | `string` | `"avatars/1710000000-userId.jpg"` |

### `getR2KeyFromUrl(url)`

Estrae la key R2 da un URL pubblico completo.

| Input | Output |
|-------|--------|
| `"https://pub-xxx.r2.dev/avatars/123.jpg"` | `"avatars/123.jpg"` |
| `"https://lh3.googleusercontent.com/..."` | `null` (non è un URL R2) |
| `null` | `null` |

---

## Uso nei Route Handler

### Upload profilo (`PATCH /api/user/profile`)

```js
import { uploadToR2, deleteFromR2, getR2KeyFromUrl } from "@/lib/r2";

// 1. Elimina vecchia immagine R2 se presente
const oldKey = getR2KeyFromUrl(currentUser?.image);
if (oldKey) {
  await deleteFromR2(oldKey).catch(() => {});
}

// 2. Upload nuova immagine
const key = `avatars/${fileName}`;
const imageUrl = await uploadToR2(buffer, key, imageFile.type);

// 3. Salva URL nel database
updateFields.image = imageUrl;
```

### Setup profilo (`POST /api/user/setup-profile`)

Stessa logica ma senza eliminazione della vecchia immagine (è il primo caricamento).

---

## Struttura Bucket

```
boilerplate/
└── avatars/
    ├── 1710000000-userId1.jpg
    ├── 1710000001-userId2.png
    └── ...
```

I file sono organizzati sotto il prefisso `avatars/` con naming `timestamp-userId.estensione`.

---

## Validazione File

Implementata nei route handler (non in r2.js):

| Vincolo | Valore |
|---------|--------|
| Tipi MIME permessi | `image/jpeg`, `image/png` |
| Dimensione massima | 2 MB |
| Formato nome file | `{timestamp}-{userId}.{jpg\|png}` |

---

## Comportamento senza R2

Se le variabili `R2_*` non sono configurate:

- Il client S3 **non viene creato** (nessun errore all'avvio)
- `uploadToR2()` lancia un errore esplicito: *"Cloudflare R2 non configurato"*
- `deleteFromR2()` non fa nulla (noop silenzioso)
- L'upload immagine nelle API restituisce errore 500

Per lo sviluppo locale senza R2, le immagini profilo semplicemente non sono caricabili. L'utente può comunque completare il setup con solo il nome.
