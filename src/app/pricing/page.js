"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import PricingSectionForTwo from "@/components/PricingSectionForTwo";
import FaqSectionAlt from "@/components/FaqSectionAlt";
import Footer from "@/components/Footer";

// Voci di navigazione (coerenti con la landing page)
const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Prezzi", href: "/pricing" },
  { label: "FAQ", href: "#faq" },
];

// FAQ relative ai prezzi
const PRICING_FAQS = [
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
    question: "Cosa succede quando il mio piano scade?",
    answer:
      "Il tuo account torna al piano Free. Non perdi i tuoi dati, ma le funzionalità premium vengono disattivate.",
  },
];

/*
 * ── Configurazione piani ──
 * Sostituisci i priceId con quelli reali dal tuo Stripe Dashboard:
 * Dashboard → Products → seleziona prodotto → copia il Price ID (price_xxx)
 *
 * In Stripe Test Mode puoi usare la carta: 4242 4242 4242 4242
 */
const PLANS = [
  {
    name: "Pro Mensile",
    oldPrice: null,
    price: "€9",
    currency: "/mese",
    description: "Fatturazione mensile, cancella quando vuoi.",
    // ⚠️ Sostituisci con il tuo Price ID da Stripe Dashboard
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || "",
    popular: false,
  },
  {
    name: "Pro Annuale",
    oldPrice: "€108",
    price: "€79",
    currency: "/anno",
    description: "Risparmia il 27%. Fatturazione annuale.",
    // ⚠️ Sostituisci con il tuo Price ID da Stripe Dashboard
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || "",
    popular: true,
  },
];

/**
 * Pagina Pricing standalone.
 * Percorso: /pricing
 * Usata come destinazione dal PremiumGate e dalle email di scadenza.
 */
export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState(null);

  // Navbar: CTA login se non autenticato, menu utente se autenticato
  const navCta =
    status === "unauthenticated"
      ? { label: "Inizia gratis", href: "/auth/signin" }
      : null;
  const navUserMenu =
    status === "authenticated"
      ? {
          label: session.user.email,
          image: session.user.image || null,
          links: [{ label: "Dashboard", href: "/dashboard" }],
          onLogout: () => signOut(),
        }
      : null;

  // Avvia il checkout Stripe
  async function handleCheckout(priceId) {
    // Se non loggato, manda al login
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (!priceId) {
      toast.error("Price ID non configurato. Controlla le variabili ambiente.");
      return;
    }

    setLoadingPlan(priceId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Errore nella creazione del checkout.");
        return;
      }

      // Redirect alla pagina checkout di Stripe
      window.location.href = data.url;
    } catch {
      toast.error("Errore di rete. Riprova.");
    } finally {
      setLoadingPlan(null);
    }
  }

  // Costruisci i piani con onClick per il checkout
  const plansWithCta = PLANS.map((plan) => ({
    ...plan,
    cta: {
      label: loadingPlan === plan.priceId ? "Caricamento..." : "Abbonati ora",
      onClick: () => handleCheckout(plan.priceId),
      disabled: loadingPlan !== null,
    },
  }));

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Navbar
        links={NAV_LINKS}
        cta={navCta}
        userMenu={navUserMenu}
        loading={status === "loading"}
      />

      {/* Pricing */}
      <section className="py-12">
        <PricingSectionForTwo
          title="Scegli il tuo piano"
          subtitle="Inizia gratis, passa a Pro quando sei pronto."
          featuresTitle="Cosa include Pro"
          features={[
            "Auth con Google e Magic link",
            "Pagamenti Stripe preconfigurati",
            "Email transazionali con Resend",
            "Database MongoDB con Mongoose",
            "Dashboard utente inclusa",
            "Componenti UI riusabili",
            "Deploy-ready su Vercel",
          ]}
          plans={plansWithCta}
        />
      </section>

      {/* FAQ */}
      <section id="faq">
        <FaqSectionAlt faqs={PRICING_FAQS} changeColorWhenOpen={true} />
      </section>

      <Footer />
    </div>
  );
}
