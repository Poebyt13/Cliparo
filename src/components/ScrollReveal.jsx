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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
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
