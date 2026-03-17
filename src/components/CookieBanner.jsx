"use client";

import { useState, useEffect, useCallback } from "react";
import cn from "@/utils/cn";

const STORAGE_KEY = "cookie_consent";

/**
 * Banner consenso cookie GDPR.
 * Blocca analytics (PostHog + GA) finché l'utente non accetta.
 *
 * Props:
 *  - privacyUrl: string — URL della pagina privacy (default: "/legal/privacy")
 *  - onAccept: () => void — callback eseguito quando l'utente accetta
 *  - onDecline: () => void — callback eseguito quando l'utente rifiuta
 *  - className: string — classi aggiuntive sul container
 */
export default function CookieBanner({
  privacyUrl = "/legal/privacy",
  onAccept,
  onDecline,
  className = "",
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Mostra il banner solo se l'utente non ha ancora fatto una scelta
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
    onAccept?.();
  }, [onAccept]);

  const handleDecline = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
    onDecline?.();
  }, [onDecline]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6",
        className
      )}
    >
      <div className="mx-auto max-w-xl bg-base-100 border border-base-300 rounded-box shadow-lg p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <p className="text-sm text-base-content/80 flex-1">
          Utilizziamo cookie analitici per migliorare la tua esperienza.{" "}
          <a href={privacyUrl} className="link link-primary">
            Privacy Policy
          </a>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleDecline}
            className="btn btn-sm btn-ghost"
          >
            Rifiuta
          </button>
          <button
            onClick={handleAccept}
            className="btn btn-sm btn-primary"
          >
            Accetta
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Legge lo stato del consenso cookie dal localStorage.
 * @returns {"accepted" | "declined" | null}
 */
export function getCookieConsent() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}
