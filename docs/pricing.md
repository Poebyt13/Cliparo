# Pricing dei Servizi

Panoramica dei costi di ogni tecnologia/servizio usato nel progetto, con dettagli sul piano gratuito e su quando inizia a costare.

---

## Riepilogo rapido

| Servizio | Piano gratuito | Quando costa |
|----------|---------------|--------------|
| **Vercel** | Hobby plan illimitato | Da $20/mese (Pro) se usi per business o team |
| **MongoDB Atlas** | 512MB storage, forever free | Da $9/mese (M10) se superi 512MB o vuoi replica set |
| **Cloudflare R2** | 10GB storage, 1M operazioni/mese | Pay-as-you-go oltre i limiti |
| **Upstash Redis** | 10.000 comandi/giorno, 256MB | Pay-as-you-go oltre i limiti |
| **Resend** | 100 email/giorno, 3.000/mese | Da $20/mese (50.000 email/mese) |
| **Stripe** | Nessun costo fisso | 1.5% + €0.25 per transazione (carte EU) |
| **Next.js / React** | Open source, gratuito per sempre | — |
| **NextAuth** | Open source, gratuito per sempre | — |
| **TailwindCSS / DaisyUI** | Open source, gratuito per sempre | — |
| **Tutti gli altri pacchetti npm** | Open source, gratuiti per sempre | — |

---

## Vercel

**Costo:** Gratuito (Hobby) → $20/mese (Pro)

Il piano **Hobby** è gratuito per sempre e copre tutti i progetti personali:
- Deployment illimitati
- 100GB di bandwidth/mese
- Edge Functions
- Cron Jobs (fino a 2)
- Preview Deployments

Diventa necessario passare a **Pro** ($20/mese) quando:
- Usi il progetto per scopi commerciali (la Vercel Fair Use Policy lo richiede)
- Hai un team (più collaboratori sullo stesso progetto)
- Hai bisogno di più di 1.000 GB di bandwidth, o staging environments

> Per un progetto personale o early-stage SaaS: **Hobby va benissimo**.

---

## MongoDB Atlas

**Costo:** Gratuito (M0 Shared) → $9+/mese (Dedicated)

Il cluster **M0** è gratuito per sempre:
- 512MB di storage
- Connessioni condivise (max 500)
- Una sola regione
- Nessuna replica set (ma i dati sono comunque al sicuro)

Superate le esigenze base:
- **M2**: $9/mese — 2GB storage, connessioni dedicate
- **M5**: $25/mese — 5GB storage
- **M10**: $57/mese — 10GB, replica set, backups automatici

> Con 512MB puoi gestire facilmente migliaia di utenti. Il limite lo raggiungi solo con grandi volumi di dati per utente.

---

## Cloudflare R2

**Costo:** Gratuito fino ai limiti → Pay-as-you-go

Il piano gratuito include ogni mese:
- **10GB** di storage
- **1 milione** di operazioni Class A (scrittura, lista: PUT, POST, LIST)
- **10 milioni** di operazioni Class B (lettura: GET, HEAD)
- **Nessun costo di egress** (a differenza di AWS S3)

Oltre i limiti gratuiti:
- Storage: $0.015/GB/mese
- Class A: $4.50 per milione di operazioni
- Class B: $0.36 per milione di operazioni

> Il punto di forza di R2 rispetto ad AWS S3 è l'assenza di costi di egress. Per un'app con upload di avatar o documenti, il free tier dura molto a lungo.

---

## Upstash Redis

**Costo:** Gratuito fino ai limiti → Pay-as-you-go

Il piano **Free** include:
- **10.000 comandi/giorno** (si resetta ogni giorno)
- **256MB** di storage
- 1 database

Oltre i limiti:
- Piano **Pay as you go**: $0.20 per 100.000 comandi
- Piano **Pro $10/mese**: 100.000 comandi/giorno inclusi

**Uso nel progetto:** Il Redis viene usato solo per il rate limiting (Upstash Ratelimit). Ogni richiesta alle API consumate fa 1-2 comandi Redis. Con 10.000 comandi/giorno puoi gestire serenamente migliaia di richieste API al giorno nelle prime fasi.

> Il free tier di Upstash è molto generoso per un'app early-stage. Il limite si raggiunge solo con traffico consistente.

---

## Resend

**Costo:** Gratuito fino ai limiti → $20/mese

Il piano **Free** include:
- **100 email/giorno**
- **3.000 email/mese**
- 1 dominio personalizzato

Piani a pagamento:
- **Pro $20/mese**: 50.000 email/mese incluse, poi $1 per 1.000
- **Scale $90/mese**: 100.000 email/mese

**Uso nel progetto:** Resend invia magic link di login, email di benvenuto e conferma pagamento. A meno che tu non abbia centinaia di nuovi utenti al giorno, il free tier è più che sufficiente.

---

## Stripe

**Costo:** Nessun costo fisso → Commissione per transazione

Stripe non ha canoni mensili. Si paga solo sulle transazioni:
- **1.5% + €0.25** per carte europee standard
- **2.9% + €0.30** per carte non europee
- +1.5% per carte emesse fuori dall'EEA

**Vantaggi:** Nessun rischio, paghi solo quando guadagni. Ideale per SaaS early-stage.

> Ricorda di configurare il webhook su Stripe Dashboard per ogni ambiente (staging e produzione). Vedi `docs/deployment.md`.

---

## Tecnologie open source (sempre gratuite)

Tutte le seguenti librerie sono open source con licenza MIT o simile — non hanno costi, limiti di utilizzo o piani a pagamento:

| Pacchetto | Uso nel progetto |
|-----------|-----------------|
| `next` | Framework principale |
| `react` / `react-dom` | UI library |
| `next-auth` | Autenticazione |
| `@auth/mongodb-adapter` | Adapter MongoDB per NextAuth |
| `mongoose` | ODM per MongoDB |
| `@aws-sdk/client-s3` | SDK per Cloudflare R2 |
| `@react-email/components` | Template email in JSX |
| `@react-email/render` | Rendering HTML email |
| `stripe` (SDK) | SDK per le API Stripe |
| `tailwindcss` | CSS utility framework |
| `daisyui` | Componenti UI su TailwindCSS |
| `sonner` | Toast notifications |
| `clsx` + `tailwind-merge` | Utility per classi CSS |
| `eslint` + `eslint-config-next` | Linting |
| `postcss` + `autoprefixer` | Build CSS |
