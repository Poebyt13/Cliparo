"use client";

import { useEffect, useRef } from "react";

/**
 * Wrapper scroll-reveal con Intersection Observer.
 * Aggiunge ".visible" quando l'elemento entra nel viewport (una sola volta).
 *
 * Props:
 *  - delay: number (secondi) — ritardo transizione
 *  - hero: boolean — se true usa variante senza translateY
 *  - className: string
 *  - children: ReactNode
 */
export default function ScrollReveal({ delay = 0, hero = false, className = "", children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Se l'utente preferisce ridurre il movimento, o browser senza IO, mostra subito
    if (
      typeof window !== "undefined" &&
      (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
        !("IntersectionObserver" in window))
    ) {
      el.classList.add("visible");
      return;
    }

    // Desktop: scatta quando l'elemento è 80px già visibile → si vede l'animazione.
    // Mobile: pre-trigger di 80px + transizione 0.25s → appare subito senza nero.
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    const rootMargin = isMobile ? "0px 0px 80px 0px" : "0px 0px -180px 0px";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          el.style.willChange = "auto";
          observer.unobserve(el);
        }
      },
      { threshold: 0, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${hero ? "scroll-reveal-hero" : "scroll-reveal"} ${className}`}
      style={delay > 0 ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
