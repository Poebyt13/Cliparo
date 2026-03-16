# Deployment — Vercel

## Prerequisiti

- Account [Vercel](https://vercel.com)
- Account [MongoDB Atlas](https://www.mongodb.com/atlas) (o MongoDB locale)
- Account [Stripe](https://stripe.com) con prodotti/prezzi creati
- Account [Resend](https://resend.com) con dominio verificato
- Account [Cloudflare](https://cloudflare.com) con bucket R2 creato
- Account [Upstash](https://upstash.com) con database Redis creato

---

## Variabili d'Ambiente

### Obbligatorie

| Variabile | Dove trovarla | Esempio |
|-----------|--------------|---------|
| `NEXTAUTH_URL` | URL del tuo sito su Vercel | `https://mioapp.vercel.app` |
| `NEXTAUTH_SECRET` | Genera con `openssl rand -base64 32` | `1SU9DKQf...` |
| `GOOGLE_ID` | [Google Cloud Console](https://console.cloud.google.com) → Credentials → OAuth 2.0 | `163901...apps.googleusercontent.com` |
| `GOOGLE_SECRET` | Stessa pagina di Google Cloud Console | `GOCSPX-...` |
| `RESEND_API_KEY` | [Resend Dashboard](https://resend.com/api-keys) | `re_9B1P...` |
| `EMAIL_FROM` | Formato: `Nome <email@dominio>` — il dominio deve essere verificato su Resend | `App <noreply@miodominio.com>` |
| `MONGODB_URI` | MongoDB Atlas → Database → Connect → Connection String | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `STRIPE_SECRET_KEY` | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) → Secret key | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks → Signing secret | `whsec_...` |
| `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY` | Stripe → Products → Price ID del piano mensile | `price_...` |
| `NEXT_PUBLIC_STRIPE_PRICE_YEARLY` | Stripe → Products → Price ID del piano annuale | `price_...` |

### Storage (R2)

| Variabile | Dove trovarla |
|-----------|--------------|
| `R2_ACCOUNT_ID` | Cloudflare Dashboard → Overview → Account ID |
| `R2_ACCESS_KEY_ID` | R2 → Manage R2 API Tokens → Access Key ID |
| `R2_SECRET_ACCESS_KEY` | Stessa pagina → Secret Access Key |
| `R2_BUCKET_NAME` | Nome del bucket creato su R2 |
| `R2_PUBLIC_URL` | R2 → bucket → Settings → Public URL (R2.dev o custom domain) |

### Rate Limiting (Upstash)

| Variabile | Dove trovarla |
|-----------|--------------|
| `UPSTASH_REDIS_REST_URL` | [Upstash Console](https://console.upstash.com) → Database → REST API → URL |
| `UPSTASH_REDIS_REST_TOKEN` | Stessa pagina → Token |

> Se Upstash non è configurato, il rate limiting è **disabilitato** (fail-open). L'app funziona comunque.

### Cron Job

| Variabile | Dove trovarla |
|-----------|--------------|
| `CRON_SECRET` | Genera con `openssl rand -base64 32`. Vercel lo invia automaticamente come header `Authorization: Bearer <CRON_SECRET>` |

---

## Deploy su Vercel

### 1. Connetti il repository

1. Vai su [vercel.com/new](https://vercel.com/new)
2. Importa il repository Git
3. Framework preset: **Next.js** (auto-rilevato)

### 2. Configura le variabili d'ambiente

1. Vai in **Settings → Environment Variables**
2. Aggiungi tutte le variabili dalla tabella sopra
3. Assicurati che `NEXTAUTH_URL` punti al tuo dominio Vercel

### 3. Configura Google OAuth

1. Vai su [Google Cloud Console](https://console.cloud.google.com) → API e servizi → Credenziali
2. Nel tuo OAuth Client → **Authorized redirect URIs**, aggiungi:
   ```
   https://mioapp.vercel.app/api/auth/callback/google
   ```

### 4. Configura Stripe Webhook

1. Vai su [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Aggiungi endpoint: `https://mioapp.vercel.app/api/stripe/webhook`
3. Seleziona gli eventi:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copia il **Signing Secret** → mettilo in `STRIPE_WEBHOOK_SECRET`

### 5. Verifica cron job

Il file `vercel.json` configura automaticamente il cron:

```json
{
  "crons": [
    {
      "path": "/api/cron/subscriptions",
      "schedule": "0 8 * * *"
    }
  ]
}
```

Esegue il check abbonamenti ogni giorno alle **08:00 UTC**. Verifica che `CRON_SECRET` sia configurato.

### 6. Deploy

```bash
# Il deploy avviene automaticamente ad ogni push
git push origin main
```

Oppure manualmente dalla dashboard Vercel → **Deployments → Redeploy**.

---

## Vercel.json — Headers Produzione

Il file `vercel.json` aggiunge:

**Security headers** su tutte le risposte:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=63072000`

**Cache headers** su asset statici (`.js`, `.css`, immagini, font):
- `Cache-Control: public, max-age=31536000, immutable`

> Questi headers sono ridondanti con quelli in `next.config.mjs` — sono una difesa in profondità. Su Vercel, `vercel.json` ha precedenza.

---

## Protezione API Dev in Produzione

Le route `/api/dev/*` (reset, seed, test-expire) sono protette con:

```js
if (process.env.NODE_ENV === "production") {
  return NextResponse.json({ error: "Non disponibile." }, { status: 403 });
}
```

`NODE_ENV` è settato automaticamente da Next.js/Vercel a `"production"` in produzione e non può essere sovrascritto dal client.

---

## Checklist Pre-Deploy

- [ ] Tutte le variabili d'ambiente sono configurate su Vercel
- [ ] `NEXTAUTH_URL` punta al dominio corretto
- [ ] Google OAuth redirect URI aggiunto per il dominio di produzione
- [ ] Stripe webhook endpoint configurato per il dominio di produzione
- [ ] `STRIPE_WEBHOOK_SECRET` usa il secret del webhook di produzione (non test)
- [ ] `CRON_SECRET` generato e configurato
- [ ] Bucket R2 creato con accesso pubblico
- [ ] `next.config.mjs` → `images.remotePatterns` include il dominio R2
- [ ] Database MongoDB Atlas accessibile (IP whitelist corretta)
- [ ] Build passa senza errori (`npm run build`)
