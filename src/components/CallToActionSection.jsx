"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";

/**
 * Sezione Call To Action centrata — stile hero minimalista.
 *
 * Props:
 *  - title: string — titolo grande principale
 *  - subtitle: string — sottotitolo descrittivo
 *  - ctaLabel: string — testo del pulsante o dell'input
 *  - ctaType: "button" | "input" — scegli tra un pulsante o un campo email con invio (default: "button")
 *  - ctaHref: string — URL per il button (opzionale, solo con ctaType="button")
 *  - onCtaClick: (value?: string) => void — callback al click/submit
 *  - variant: variante colore del bottone (default: "primary")
 */
export default function CallToActionSection({
  title = "Lancia il tuo SaaS in giorni, non mesi.",
  subtitle = "Auth, pagamenti ed email già configurati. Concentrati sul prodotto.",
  ctaLabel = "Inizia gratis",
  ctaType = "button",
  ctaHref,
  onCtaClick,
  variant = "primary",
}) {
  // Valore del campo email, usato solo quando ctaType === "input"
  const [inputValue, setInputValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (onCtaClick) onCtaClick(inputValue);
  }

  return (
    <section className="py-24 bg-base-100">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-6">

        {/* Titolo principale */}
        <h2 className="text-4xl sm:text-5xl font-extrabold text-base-content leading-tight">
          {title}
        </h2>

        {/* Sottotitolo */}
        {subtitle && (
          <p className="text-base-content/60 text-lg max-w-xl">
            {subtitle}
          </p>
        )}

        {/* CTA: bottone o input email */}
        {ctaType === "input" ? (
          /* Modalità input: campo email + pulsante di invio affiancati */
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
          >
            <div className="flex-1">
              <Input
                type="email"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="tu@email.com"
              />
            </div>
            <Button label={ctaLabel} variant={variant} className="sm:self-start" />
          </form>
        ) : (
          /* Modalità button semplice */
          <Button
            label={ctaLabel}
            href={ctaHref}
            onClick={onCtaClick}
            variant={variant}
            className="px-10"
          />
        )}

      </div>
    </section>
  );
}
