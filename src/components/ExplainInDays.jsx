import Image from "next/image";

/**
 * Sezione timeline orizzontale "spiegazione a giorni".
 * Mostra da 2 a 4 milestone con tre layout responsive:
 *  - lg+  : riga singola orizzontale con linea full-width
 *  - md   : griglia 2x2, nessuna linea
 *  - <md  : colonna singola, nessuna linea
 *
 * Props:
 *  - steps: { title, description, image }[] — da 2 a 4 item:
 *      - title: string — es. "Day 1"
 *      - description: string — breve descrizione del giorno
 *      - image: string — URL o percorso dell'immagine (opzionale)
 */
export default function ExplainInDays({ steps = [] }) {
  // Limita a max 4 step
  const validSteps = steps.slice(0, 4);

  return (
    // section è position:relative per ospitare la linea full-width in assoluto
    <section className="relative py-16 bg-base-100">

      {/*
        Linea orizzontale full-width — visibile solo su lg+.
        top = py-16 (64px) + h-40 immagini (160px) + metà dot h-3.5 (7px) = 231px
      */}
      <div
        className="hidden lg:block absolute left-0 right-0 h-px bg-base-content/20 pointer-events-none z-0"
        style={{ top: "231px" }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* --- Desktop (lg+): riga orizzontale con dot sulla linea --- */}
        <div className="hidden lg:flex">
          {validSteps.map((step, index) => (
            <div key={index} className="flex flex-col items-center flex-1">

              {/* Immagine — h-40 fisso per allineare tutti i dot alla stessa quota */}
              <div className="h-40 flex items-end justify-center pb-5">
                {step.image ? (
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={120}
                    height={120}
                    className="w-28 h-28 object-contain drop-shadow-md"
                  />
                ) : (
                  // Placeholder numerico se l'immagine manca
                  <span className="w-20 h-20 rounded-full bg-base-300 flex items-center justify-center text-2xl font-bold text-base-content/40 select-none">
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Dot — z-10 per sovrapporsi alla linea assoluta */}
              <div className="relative z-10 w-3.5 h-3.5 rounded-full bg-base-content shrink-0" />

              {/* Testo sotto il dot */}
              <div className="mt-5 text-center px-3">
                <h3 className="font-bold text-base-content text-base mb-1">
                  {step.title}
                </h3>
                <p className="text-base-content/55 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* --- Tablet (md → lg): griglia 2×2, nessuna linea --- */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-10">
          {validSteps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-24 h-24 flex items-center justify-center mb-4">
                {step.image ? (
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={96}
                    height={96}
                    className="w-24 h-24 object-contain drop-shadow-md"
                  />
                ) : (
                  <span className="w-20 h-20 rounded-full bg-base-300 flex items-center justify-center text-2xl font-bold text-base-content/40 select-none">
                    {index + 1}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-base-content text-base mb-1">
                {step.title}
              </h3>
              <p className="text-base-content/55 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* --- Mobile (<md): colonna singola centrata — immagine, titolo, descrizione --- */}
        <div className="flex md:hidden flex-col gap-10">
          {validSteps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-28 h-28 flex items-center justify-center mb-4">
                {step.image ? (
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={112}
                    height={112}
                    className="w-28 h-28 object-contain drop-shadow-md"
                  />
                ) : (
                  // Placeholder numerico se l'immagine manca
                  <span className="w-20 h-20 rounded-full bg-base-300 flex items-center justify-center text-2xl font-bold text-base-content/40 select-none">
                    {index + 1}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-base-content text-base mb-1">
                {step.title}
              </h3>
              <p className="text-base-content/60 text-sm leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
