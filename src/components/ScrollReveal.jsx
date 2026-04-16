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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          // Libera memoria GPU dopo il reveal
          el.style.willChange = "auto";
          observer.unobserve(el);
        }
      },
      {
        // Trigger appena un pixel entra dal basso, con pre-carico di 200px
        // (critico per sezioni alte su mobile dove threshold:0.1 richiedeva
        // troppo scroll prima di rivelare)
        threshold: 0,
        rootMargin: "0px 0px 200px 0px",
      }
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
