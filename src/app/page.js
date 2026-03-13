"use client";

import { useSession, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import HowItWorksSection from "@/components/HowItWorksSection";
import PricingSection from "@/components/PricingSection";
import PricingSectionForTwo from "@/components/PricingSectionForTwo";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import FaqSectionAlt from "@/components/FaqSectionAlt";
import FaqSection from "@/components/FaqSection";
import CallToActionSection from "@/components/CallToActionSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import SocialProof from "@/components/SocialProof";
import ExplainInDays from "@/components/ExplainInDays";
import VideoSection from "@/components/VideoSection";

// import images from assets folder
import avatar1 from "@/assets/image1.png";
import avatar2 from "@/assets/image2.png";
import avatar3 from "@/assets/image3.png";
import avatar4 from "@/assets/image4.png";
import avatar5 from "@/assets/image5.png";
import avatar6 from "@/assets/image6.png";
import avatar7 from "@/assets/image7.png";
import avatar8 from "@/assets/image8.png";
import avatar9 from "@/assets/image9.png";
import avatar10 from "@/assets/image10.png";
import avatar11 from "@/assets/image11.png";

// import how it works images
import step1 from "@/assets/step1.png";
import step2 from "@/assets/step2.png";
import step3 from "@/assets/step3.png";

// import explain in days images
import day1 from "@/assets/day1.png";
import day2 from "@/assets/day2.png";
import day3 from "@/assets/day3.png";
import day4 from "@/assets/day4.png";

// Voci di navigazione della Navbar
const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Prezzi", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

// Recensioni clienti mostrate nella sezione testimonials
const TESTIMONIALS = [
  {
    stars: 5,
    text: "Setup incredibilmente veloce. Ho avuto auth, pagamenti ed email funzionanti in meno di un'ora. Un risparmio enorme di tempo.",
    highlight: "in meno di un'ora",
    author: "Marco Rossi",
    role: "Founder di AppVeloce",
    avatar: avatar9,
  },
  {
    stars: 5,
    text: "Finalmente un boilerplate serio. Codice pulito, ben strutturato e pronto per la produzione. Lo consiglio a tutti gli indie hacker.",
    highlight: "pronto per la produzione",
    author: "Sara Bianchi",
    role: "Software Engineer",
    avatar: avatar10,
  },
  {
    stars: 5,
    text: "Ho lanciato il mio SaaS in una settimana invece di tre mesi. Il miglior investimento che potessi fare per il mio progetto.",
    highlight: "il miglior investimento",
    author: "Luca Ferrari",
    role: "Indie Maker",
    avatar: avatar11,
  },
];

// Domande frequenti mostrate nella sezione FAQ
const FAQS = [
  {
    question: "Posso cancellare il mio abbonamento in qualsiasi momento?",
    answer:
      "Sì, puoi cancellare quando vuoi direttamente dalla pagina Account. Non ci sono vincoli o penali. Il piano resterà attivo fino alla fine del periodo già pagato.",
  },
  {
    question: "È necessaria una carta di credito per iniziare?",
    answer:
      "No. Il piano Free non richiede nessun metodo di pagamento. Inserisci i dati di pagamento solo quando sei pronto ad upgraddare a Pro.",
  },
  {
    question: "Quali metodi di pagamento sono accettati?",
    answer:
      "Accettiamo tutte le carte di credito e debito principali (Visa, Mastercard, Amex) tramite Stripe. I pagamenti sono sicuri e cifrati.",
  },
  {
    question: "Posso usare questo boilerplate per più progetti?",
    answer:
      "Sì, una volta acquistato puoi usarlo per un numero illimitato di progetti personali e commerciali.",
  },
  {
    question: "È previsto supporto tecnico?",
    answer:
      "Il piano Free include supporto community (forum e GitHub issues). Il piano Pro include supporto prioritario via email con risposta entro 24 ore.",
  },
  {
    question: "Il boilerplate si aggiorna con le nuove versioni di Next.js?",
    answer:
      "Pubblichiamo aggiornamenti regolari per mantenere le dipendenze aggiornate. Gli acquirenti ricevono accesso gratuito a tutte le versioni future.",
  },
];

// Step della sezione "Come funziona"
const HOW_IT_WORKS_STEPS = [
  {
    title: "Registrati in un click",
    description: "Accedi con Google o Magic link. Nessuna password da ricordare, nessun form complicato.",
    image: step1,
  },
  {
    title: "Configura il tuo prodotto",
    description: "Aggiungi le tue feature, personalizza i piani Stripe e imposta le email di benvenuto.",
    image: step2,
  },
  {
    title: "Lancia e guadagna",
    description: "Pubblica il tuo SaaS, accetta pagamenti e monitora i tuoi utenti dal dashboard.",
    image: step3,
  },
];

// Feature card da mostrare nella sezione features
const FEATURES = [
  {
    icon: "⚡",
    title: "Setup immediato",
    description: "Progetto pronto in pochi minuti con tutto il necessario: auth, pagamenti, email.",
  },
  {
    icon: "🔐",
    title: "Autenticazione sicura",
    description: "Magic link e Google OAuth integrati con NextAuth. Nessuna password da gestire.",
  },
  {
    icon: "💳",
    title: "Pagamenti con Stripe",
    description: "Checkout e webhook preconfigurati. Gestisci abbonamenti senza scrivere codice.",
  },
  {
    icon: "✉️",
    title: "Email transazionali",
    description: "Template React pronti per login, benvenuto e conferma pagamento con Resend.",
  },
];

const EXPLAIN_IN_DAYS_STEPS = [
  { title: "Day 1", description: "Learn the fundamentals of coding", image: day1 },
  { title: "Day 4", description: "Log in users and save in database", image: day2 },
  { title: "Day 9", description: "Set up subscription payments", image: day3 },
  { title: "Day 14", description: "Launch your idea!", image: day4 },
];

export default function Home() {
  const { data: session, status } = useSession();

  // Finché la sessione è in caricamento, non mostrare né CTA né userMenu per evitare il flash
  const navCta = status === "unauthenticated" ? { label: "Inizia gratis", href: "/auth/signin" } : null;
  const navUserMenu = status === "authenticated"
    ? {
        label: session.user.email,
        links: [{ label: "Dashboard", href: "/dashboard" }],
        onLogout: () => signOut(),
      }
    : null;

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* ── Navbar ── */}
      <Navbar links={NAV_LINKS} cta={navCta} userMenu={navUserMenu} />

      {/* ── Hero ── */}
      <section className="bg-base-200 py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="badge badge-primary badge-outline mb-4 text-xs uppercase tracking-widest">
            Boilerplate SaaS
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-base-content leading-tight">
            Lancia il tuo SaaS{" "}
            <span className="text-primary">in giorni, non mesi.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-base-content/60 max-w-2xl mx-auto">
            Auth, pagamenti, email e database già configurati.
            Concentrati sul prodotto, non sull&apos;infrastruttura.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Button label="Inizia gratis" href="/auth/signin" variant="primary" />
            <Button label="Scopri le funzionalità" href="#features" variant="outline" />
          </div>
          {/* Social proof sotto i CTA */}
          <div className="mt-14 flex justify-center">
            <SocialProof
              count="1.240"
              label="sviluppatori hanno già usato questo boilerplate"
              avatars={[avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8]}
            />
          </div>
        </div>
      </section>

      <ExplainInDays steps={EXPLAIN_IN_DAYS_STEPS} />
      {/* ── Features ── */}
      <section id="features" className="py-20 bg-base-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-base-content">
              Tutto quello che ti serve, subito.
            </h2>
            <p className="mt-3 text-base-content/60 text-lg">
              Un boilerplate completo per non ricominciare da zero ogni volta.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <Card key={f.title} className="text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-base-content mb-1">{f.title}</h3>
                <p className="text-base-content/60 text-sm">{f.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <VideoSection
        title="Guarda il tutorial"
        videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
        message="Questo è il messaggio a sinistra che spiega il video..."
      />
      {/* ── How It Works ── */}
      <section id="how-it-works" className="bg-base-200">
        <HowItWorksSection
          eyebrow="COME FUNZIONA"
          title="Lancia il tuo SaaS in 3 passi"
          steps={HOW_IT_WORKS_STEPS}
          cta={{
            label: "Inizia gratis →",
            href: "/auth/signin",
            note: "14 giorni di prova. Nessuna carta richiesta.",
          }}
        />
      </section>

      {/* ── Pricing ── */}
      <section id="pricing">
        {/* <PricingSection /> */}
        <PricingSectionForTwo
          title="Build your SaaS for free"
          subtitle="Get the lifetime deal when you're ready to launch it to the world!"
          featuresTitle="Showcase your startups"
          features={[
            "Auth con Google e Magic link",
            "Pagamenti Stripe preconfigurati",
            "Email transazionali con Resend",
            "Database MongoDB con Mongoose",
            "Dashboard utente inclusa",
            "Componenti UI riusabili",
            "Deploy-ready su Vercel",
          ]}
          plans={[
            {
              name: "1-Year Pass",
              oldPrice: "$55",
              price: "$25",
              currency: "USD",
              description: "One-time payment. No subscription",
              cta: { label: "Start for free", href: "/auth/signin" },
              popular: false,
            },
            {
              name: "Lifetime Deal",
              oldPrice: "$75",
              price: "$45",
              currency: "USD",
              description: "One-time payment. No subscription",
              cta: { label: "Start for free", href: "/api/stripe/checkout" },
              popular: true,
            },
          ]}
        />
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-base-200">
        <TestimonialsSection testimonials={TESTIMONIALS} />
      </section>

      {/* ── FAQ ── */}
      <section id="faq">
        <FaqSectionAlt faqs={FAQS} changeColorWhenOpen={true} />
      </section>

      {/* ── Call To Action finale ── */}
      <section className="bg-base-200">
        <CallToActionSection
          title="Pronto a lanciare il tuo SaaS?"
          subtitle="Setup in pochi minuti. Nessuna carta di credito richiesta."
          ctaLabel="Inizia gratis →"
          ctaHref="/auth/signin"
          variant="primary"
        />
      </section>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
