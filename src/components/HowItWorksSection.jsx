"use client";

import Image from "next/image";
import Button from "@/components/Button";

/**
 * Sezione "Come funziona" con step numerati e frecce di separazione.
 *
 * Props:
 *  - eyebrow: string — etichetta piccola sopra il titolo (opzionale)
 *  - title: string — titolo principale della sezione (obbligatorio)
 *  - steps: { title, description, image }[] — lista degli step:
 *      - title: string — titolo dello step
 *      - description: string — testo descrittivo
 *      - image: string — percorso o URL dell'immagine (opzionale)
 *  - cta: { label, href, note }|null — CTA opzionale in fondo alla sezione
 */
export default function HowItWorksSection({
  eyebrow = "COME FUNZIONA",
  title,
  steps = [],
  cta = null,
}) {
  return (
    <section className="py-20 bg-base-200">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Intestazione sezione */}
        <div className="text-center mb-14">
          {eyebrow && (
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-4xl sm:text-5xl font-extrabold text-base-content leading-tight">
              {title}
            </h2>
          )}
        </div>

        {/* Griglia step con frecce di separazione */}
        <div className="flex flex-col md:flex-row items-stretch gap-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-row items-stretch flex-1 gap-4">

              {/* Card dello step — altezza uniforme tra tutte le card */}
              <div className="flex-1 card bg-base-300 border border-base-content/10 rounded-box p-6 flex flex-col gap-4">

                {/* Immagine con altezza fissa per uniformità tra le card */}
                <div className="w-full h-48 overflow-hidden rounded-lg bg-base-content/5 flex items-center justify-center">
                  {step.image ? (
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    // Placeholder quando l'immagine non è fornita
                    <span className="text-base-content/20 text-4xl select-none">{index + 1}</span>
                  )}
                </div>

                {/* Numero + titolo */}
                <h3 className="text-base font-bold text-base-content">
                  {index + 1}. {step.title}
                </h3>

                {/* Descrizione */}
                <p className="text-base-content/60 text-sm leading-relaxed">
                  {step.description}
                </p>

              </div>

              {/* Freccia separatrice — visibile solo su desktop tra gli step */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center text-base-content/30 text-2xl shrink-0 self-center">
                  →
                </div>
              )}

            </div>
          ))}
        </div>

        {/* CTA opzionale in fondo alla sezione */}
        {cta && (
          <div className="mt-12 flex flex-col items-center gap-3">
            <Button label={cta.label} href={cta.href} variant="primary" />
            {cta.note && (
              <p className="text-base-content/40 text-xs">{cta.note}</p>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
