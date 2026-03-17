"use client";

import { useEffect, useCallback, useState } from "react";
import { initPostHog, stopPostHog, PostHogProvider, posthog } from "@/lib/posthog";
import CookieBanner, { getCookieConsent } from "@/components/CookieBanner";

/**
 * Provider unico per analytics + cookie consent.
 * Inserire nel layout root per gestire tutto da un punto.
 *
 * - Se l'utente ha già accettato i cookie, inizializza PostHog e GA al mount.
 * - Se non ha ancora scelto, mostra il CookieBanner.
 * - GA viene iniettato tramite gtag.js solo dopo il consenso.
 *
 * Props:
 *  - children: ReactNode
 *  - privacyUrl: string — passato a CookieBanner
 */
export default function AnalyticsProvider({ children, privacyUrl }) {
  const [consentGiven, setConsentGiven] = useState(false);

  // Al mount: controlla se il consenso è già stato dato in precedenza
  useEffect(() => {
    if (getCookieConsent() === "accepted") {
      startAnalytics();
      setConsentGiven(true);
    }
  }, []);

  /** Avvia tutti gli analytics */
  function startAnalytics() {
    // PostHog
    initPostHog();

    // Google Analytics — inietta lo script solo se il GA_ID è configurato
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (gaId && typeof window !== "undefined" && !window.gtag) {
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
      script.async = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", gaId);
    }
  }

  const handleAccept = useCallback(() => {
    startAnalytics();
    setConsentGiven(true);
  }, []);

  const handleDecline = useCallback(() => {
    stopPostHog();
    setConsentGiven(false);
  }, []);

  // Se PostHog è caricato, wrappa nel PostHogProvider per usare gli hook
  const content = consentGiven ? (
    <PostHogProvider client={posthog}>{children}</PostHogProvider>
  ) : (
    children
  );

  return (
    <>
      {content}
      <CookieBanner
        privacyUrl={privacyUrl}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </>
  );
}
