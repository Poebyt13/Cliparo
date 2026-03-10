"use client";

import { useState } from "react";

/**
 * Sezione FAQ con layout a due colonne: titolo a sinistra, accordion a destra.
 * Gestita con useState per animazione fluida in apertura E chiusura.
 * Un solo item aperto alla volta (auto-close).
 *
 * Props:
 *  - faqs: array di { question: string, answer: string }
 *  - sticky: boolean — se true, la colonna sinistra rimane sticky durante lo scroll (opzionale)
 */
export default function FaqSectionAlt({ faqs = [], sticky = false, changeColorWhenOpen = false }) {
  // Indice dell'item aperto, null = tutti chiusi
  const [openIndex, setOpenIndex] = useState(null);

  function toggle(index) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <section className="py-16 bg-base-100">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 items-start">

          {/* ── Colonna sinistra: intestazione ── */}
          <div className={sticky ? "lg:top-8 lg:sticky" : ""}>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              FAQ
            </span>
            <h2 className="mt-2 text-3xl font-bold text-base-content leading-snug">
              Domande frequenti
            </h2>
          </div>

          {/* ── Colonna destra: accordion ── */}
          <div className="flex flex-col divide-y divide-base-300">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index}>
                  {/* Pulsante domanda */}
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex items-center justify-between py-4 text-left gap-4 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    {/* Cambia colore della domanda se aperta */}
                    <span className={`font-semibold ${changeColorWhenOpen && isOpen ? "text-primary" : "text-base-content"}`}>{faq.question}</span>
                    {/* Icona +/- animata */}
                    <span
                      className="shrink-0 text-base-content/50 transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </button>

                  {/* Risposta con transizione grid-template-rows per animazione fluida */}
                  <div
                    className="grid transition-all duration-300 ease-in-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm text-base-content/70 leading-relaxed pb-4">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
