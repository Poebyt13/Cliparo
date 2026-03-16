# Components

Documentazione completa di tutti i componenti riutilizzabili del boilerplate.

---

## Indice

- [UI Base](#ui-base): Button, Card, Input, Logo, PageContainer
- [Layout](#layout): Navbar, Footer, DashboardLayout, Sidebar, SessionProviderWrapper
- [Gating](#gating): PremiumGate
- [Landing Page](#landing-page): CallToActionSection, PricingSection, PricingSectionForTwo, FaqSection, FaqSectionAlt, HowItWorksSection, SocialProof, TestimonialsSection, VideoSection, ExplainInDays

---

## UI Base

### Button

`src/components/Button.jsx`

Bottone riutilizzabile con varianti DaisyUI. Se viene passato `href`, renderizza un `<a>` al posto di `<button>`.

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `label` | `string` | — | Testo del bottone (obbligatorio) |
| `onClick` | `function` | — | Handler del click |
| `href` | `string` | — | Se presente, il bottone diventa un link `<a>` |
| `variant` | `"primary"` \| `"secondary"` \| `"accent"` \| `"outline"` \| `"error"` \| `"ghost"` | `"primary"` | Stile visivo |
| `className` | `string` | — | Classi CSS aggiuntive |
| `type` | `"button"` \| `"submit"` \| `"reset"` | `"button"` | Tipo HTML del bottone |
| `disabled` | `boolean` | `false` | Disabilita il bottone |

```jsx
<Button label="Inizia gratis" variant="primary" href="/auth/signin" />
<Button label="Salva" variant="accent" type="submit" onClick={handleSave} />
<Button label="Annulla" variant="ghost" onClick={handleCancel} />
```

---

### Card

`src/components/Card.jsx`

Contenitore card con titolo, descrizione e contenuto personalizzato.

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `title` | `string` | — | Titolo della card |
| `description` | `string` | — | Sottotitolo/descrizione |
| `children` | `ReactNode` | — | Contenuto custom |
| `className` | `string` | — | Classi CSS aggiuntive |

```jsx
<Card title="Piano Premium" description="Accesso completo a tutte le funzionalità">
  <p>Contenuto custom qui</p>
</Card>
```

---

### Input

`src/components/Input.jsx`

Campo input con label e messaggio di errore. Supporta tutti gli attributi nativi HTML tramite `...rest`.

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `label` | `string` | — | Label del campo (obbligatorio) |
| `value` | `string` | — | Valore controllato (obbligatorio) |
| `onChange` | `function` | — | Handler di cambio valore (obbligatorio) |
| `placeholder` | `string` | `""` | Placeholder |
| `type` | `string` | `"text"` | Tipo input HTML |
| `error` | `string` | — | Messaggio di errore sotto il campo |
| `disabled` | `boolean` | `false` | Disabilita il campo (applica anche `readOnly`) |

```jsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  placeholder="tu@esempio.com"
/>
```

---

### Logo

`src/components/Logo.jsx`

Logo configurabile che legge i dati da `siteConfig`. Supporta tre varianti: solo icona, solo testo, o entrambi.

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Dimensione del logo |
| `variant` | `"icon"` \| `"text"` \| `"both"` | `"both"` | Cosa mostrare |
| `href` | `string` | `"/"` | Link di navigazione |
| `className` | `string` | — | Classi CSS aggiuntive |

**Dimensioni:**
- `sm`: icona 24px, testo `text-lg`
- `md`: icona 32px, testo `text-xl`
- `lg`: icona 40px, testo `text-2xl`

**Configurazione:** Modifica `src/config/site.js` per cambiare `logoImage` e `logoText`.

```jsx
<Logo size="lg" variant="both" />
<Logo variant="icon" size="sm" />
<Logo variant="text" href="/dashboard" />
```

---

### PageContainer

`src/components/PageContainer.jsx`

Wrapper di layout centrato per le pagine. Applica `max-w-7xl`, padding e centratura automatica.

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Contenuto della pagina |

```jsx
<PageContainer>
  <h1>La mia pagina</h1>
  <p>Contenuto centrato con max-width</p>
</PageContainer>
```

---

## Layout

### Navbar

`src/components/Navbar.jsx`

Navbar responsive con hamburger menu su mobile, link centrali e menu utente con dropdown.

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `links` | `{ label, href }[]` | — | Link di navigazione centrali |
| `cta` | `{ label, href }` | — | Bottone CTA a destra |
| `userMenu` | `object \| null` | — | Menu utente autenticato |
| `loading` | `boolean` | `false` | Mostra skeleton durante il caricamento sessione |

**Struttura `userMenu`:**
```js
{
  label: "Mario Rossi",
  image: "https://...",        // avatar (opzionale)
  links: [                     // link nel dropdown (opzionale)
    { label: "Dashboard", href: "/dashboard" },
    { label: "Profilo", href: "/dashboard/profile" }
  ],
  onLogout: () => signOut()    // callback logout
}
```

```jsx
<Navbar
  links={[
    { label: "Prezzi", href: "#pricing" },
    { label: "FAQ", href: "#faq" }
  ]}
  cta={{ label: "Inizia gratis", href: "/auth/signin" }}
  userMenu={session ? {
    label: session.user.name,
    image: session.user.image,
    onLogout: () => signOut()
  } : null}
/>
```

---

### Footer

`src/components/Footer.jsx`

Footer a 4 colonne con informazioni brand, link, link legali e sezione creatore. I link sono configurati internamente in `FOOTER_LINKS`.

**Nessuna prop.** Modifica direttamente il componente per cambiare i link.

**Link predefiniti:** `/legal/terms`, `/legal/privacy`

---

### DashboardLayout

`src/components/DashboardLayout.jsx`

Layout dashboard con sidebar fissa su desktop e drawer su mobile.

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `links` | `{ label, href, active? }[]` | — | Voci di navigazione sidebar |
| `children` | `ReactNode` | — | Contenuto della pagina |

---

### Sidebar

`src/components/dashboard/Sidebar.jsx`

Sidebar del dashboard con supporto per icone, gruppi, badge, stati attivi e link esterni/disabilitati.

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `menu` | `MenuEntry[]` | — | Array di voci del menu |

**Struttura menu:**
```js
// Voce singola
{
  type: "item",
  href: "/dashboard",
  label: "Dashboard",
  icon: "home",           // nome icona dalla mappa interna
  badge: "3",             // badge opzionale
  disabled: false,        // disabilitato (mostra "soon")
  external: false         // apre in nuova tab
}

// Gruppo di voci
{
  type: "group",
  label: "Account",
  icon: "user",
  items: [
    { type: "item", href: "/dashboard/profile", label: "Profilo" },
    { type: "item", href: "/dashboard/billing", label: "Abbonamento" }
  ]
}
```

**Icone disponibili:** `home`, `user`, `settings`, `credit-card`, `bell`, `book`, `file`, `chart`, `external`

**Configurazione:** Il menu viene definito in `src/config/dashboardMenu.js`.

---

### SessionProviderWrapper

`src/components/SessionProviderWrapper.js`

Wrapper client-side per il `SessionProvider` di NextAuth. Necessario perché il layout root è un Server Component.

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Componenti figli |

```jsx
// Usato in src/app/layout.js
<SessionProviderWrapper>
  {children}
</SessionProviderWrapper>
```

---

## Gating

### PremiumGate

`src/components/PremiumGate.jsx`

Componente di gating che blocca il contenuto per utenti senza abbonamento sufficiente. Mostra un overlay blur con CTA di upgrade.

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Contenuto da proteggere |
| `requiredPlan` | `"trial"` \| `"premium"` | `"premium"` | Piano minimo richiesto |
| `fallback` | `ReactNode` | — | UI personalizzata se l'utente non ha il piano |

**Comportamento:**
- Se l'utente ha il piano richiesto → mostra `children` normalmente
- Se l'utente NON ha il piano → mostra `children` con blur overlay + messaggio di upgrade
- Se viene passato `fallback` → mostra il fallback al posto del blur

```jsx
<PremiumGate requiredPlan="premium">
  <AdvancedFeature />
</PremiumGate>

<PremiumGate requiredPlan="trial" fallback={<p>Inizia la prova gratuita</p>}>
  <TrialFeature />
</PremiumGate>
```

---

## Landing Page

### CallToActionSection

`src/components/CallToActionSection.jsx`

Sezione hero CTA centrata. Supporta due modalità: bottone semplice o campo email con submit.

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `title` | `string` | `"Lancia il tuo SaaS in giorni, non mesi."` | Titolo principale |
| `subtitle` | `string` | — | Sottotitolo |
| `ctaLabel` | `string` | `"Inizia gratis"` | Testo del bottone/submit |
| `ctaType` | `"button"` \| `"input"` | `"button"` | Modalità CTA |
| `ctaHref` | `string` | — | URL per modalità button |
| `onCtaClick` | `function` | — | Callback click (riceve email in modalità input) |
| `variant` | `string` | `"primary"` | Variante bottone |

```jsx
// Modalità bottone
<CallToActionSection
  title="Il tuo SaaS, pronto in 3 giorni"
  ctaLabel="Inizia ora"
  ctaHref="/auth/signin"
/>

// Modalità input email
<CallToActionSection
  ctaType="input"
  ctaLabel="Iscriviti"
  onCtaClick={(email) => handleSubscribe(email)}
/>
```

---

### PricingSection

`src/components/PricingSection.jsx`

Griglia di piani tariffari con colonne dinamiche e lista feature.

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `title` | `string` | `"Scegli il piano giusto"` | Titolo sezione |
| `subtitle` | `string` | `"Nessuna sorpresa. Cancella quando vuoi."` | Sottotitolo |
| `plans` | `Plan[]` | — | Array di piani |

**Struttura `Plan`:**
```js
{
  title: "Pro",
  price: "€19",
  period: "/mese",
  description: "Per professionisti",
  features: ["Feature 1", "Feature 2", "Feature 3"],
  cta: { label: "Inizia", href: "/checkout", variant: "primary" },
  highlighted: true  // bordo evidenziato
}
```

---

### PricingSectionForTwo

`src/components/PricingSectionForTwo.jsx`

Layout pricing a due piani con colonna features a sinistra e card a destra.

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `title` | `string` | — | Titolo sezione |
| `subtitle` | `string` | — | Sottotitolo |
| `featuresTitle` | `string` | `"Features"` | Titolo colonna features |
| `features` | `string[]` | — | Lista features condivise |
| `plans` | `Plan[]` | — | Array di 2 piani (max) |
| `popularLabel` | `string` | `"POPULAR"` | Testo badge "popular" |

**Struttura `Plan`:**
```js
{
  name: "Mensile",
  oldPrice: "€29",      // prezzo barrato (opzionale)
  price: "€19",
  currency: "€",        // opzionale
  description: "Ideale per iniziare",
  cta: { label: "Scegli", href: "/checkout", onClick: fn, disabled: false },
  popular: true          // mostra badge "POPULAR"
}
```

---

### FaqSection

`src/components/FaqSection.jsx`

Accordion FAQ semplice con auto-chiusura (una sola domanda aperta alla volta).

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `faqs` | `{ question, answer }[]` | — | Array di domande e risposte |

```jsx
<FaqSection faqs={[
  { question: "Posso cancellare quando voglio?", answer: "Sì, senza penali." },
  { question: "C'è una prova gratuita?", answer: "Sì, 7 giorni." }
]} />
```

---

### FaqSectionAlt

`src/components/FaqSectionAlt.jsx`

FAQ alternativa con layout a due colonne (titolo a sinistra, accordion a destra) e animazioni.

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `faqs` | `{ question, answer }[]` | — | Array di domande e risposte |
| `sticky` | `boolean` | — | Rende la colonna sinistra sticky durante lo scroll |
| `changeColorWhenOpen` | `boolean` | — | Evidenzia la domanda aperta con colore primary |

```jsx
<FaqSectionAlt
  faqs={faqs}
  sticky
  changeColorWhenOpen
/>
```

---

### HowItWorksSection

`src/components/HowItWorksSection.jsx`

Timeline numerata con frecce tra gli step e CTA opzionale in fondo.

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `eyebrow` | `string` | `"COME FUNZIONA"` | Testo sopra il titolo |
| `title` | `string` | — | Titolo sezione (obbligatorio) |
| `steps` | `Step[]` | — | Array di step |
| `cta` | `{ label, href, note? }` | — | Bottone CTA in fondo (opzionale) |

**Struttura `Step`:**
```js
{
  title: "Registrati",
  description: "Crea il tuo account in 30 secondi",
  image: "/steps/step1.png"  // opzionale
}
```

---

### SocialProof

`src/components/SocialProof.jsx`

Widget con avatar sovrapposti, contatore e label. Ideale sotto la CTA principale.

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `count` | `string \| number` | `"1,000"` | Numero di utenti |
| `label` | `string` | `"utenti ci hanno già scelto"` | Testo descrittivo |
| `avatars` | `string[]` | — | Array di URL immagini avatar |

```jsx
<SocialProof
  count="2,500"
  label="aziende ci usano"
  avatars={["/avatars/1.jpg", "/avatars/2.jpg", "/avatars/3.jpg"]}
/>
```

---

### TestimonialsSection

`src/components/TestimonialsSection.jsx`

Griglia di testimonianze (1-3 colonne adattive) con rating a stelle.

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `testimonials` | `Testimonial[]` | — | Array di testimonianze (max 3) |

**Struttura `Testimonial`:**
```js
{
  text: "Prodotto fantastico, lo uso tutti i giorni!",
  author: "Mario Rossi",
  role: "CEO di Acme",          // opzionale
  avatar: "/avatars/mario.jpg", // opzionale (fallback: iniziali)
  stars: 5,                     // opzionale (1-5)
  highlight: "fantastico"       // opzionale (evidenzia parola nel testo)
}
```

---

### VideoSection

`src/components/VideoSection.jsx`

Sezione video embed centrata con messaggio opzionale a sinistra (solo desktop).

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `videoUrl` | `string` | — | URL embed YouTube |
| `message` | `string` | — | Messaggio descrittivo (solo desktop, lato sinistro) |
| `title` | `string` | — | Titolo sezione |

```jsx
<VideoSection
  title="Guarda come funziona"
  videoUrl="https://www.youtube.com/embed/abc123"
  message="In 2 minuti ti spieghiamo tutto"
/>
```

---

### ExplainInDays

`src/components/ExplainInDays.jsx`

Timeline orizzontale con 2-4 milestone. Layout responsive: orizzontale su desktop, griglia 2×2 su tablet, colonna singola su mobile.

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `steps` | `Step[]` | — | Array di 2-4 step |

**Struttura `Step`:**
```js
{
  title: "Giorno 1",
  description: "Setup iniziale e configurazione",
  image: "/steps/day1.png"  // opzionale
}
```

**Layout per breakpoint:**
- **Desktop (lg+):** timeline orizzontale con linea di connessione e punti
- **Tablet (md):** griglia 2×2 senza linea
- **Mobile:** colonna singola centrata

---

## Struttura Email Templates

I template email si trovano in `src/emails/` e vengono usati con Resend:

| Template | File | Quando viene inviato |
|----------|------|---------------------|
| Login Magic Link | `login.jsx` | Richiesta di login via email |
| Welcome | `welcome.jsx` | Prima registrazione |
| Password Reset | `passwordReset.jsx` | Richiesta reset password |
| Payment Confirmation | `paymentConfirmation.jsx` | Pagamento completato (webhook Stripe) |

Per personalizzare i template, modifica direttamente i file JSX in `src/emails/`.
