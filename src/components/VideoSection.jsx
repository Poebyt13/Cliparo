"use client";

/**
 * Sezione video centrato con etichetta e freccia a sinistra (solo desktop).
 *
 * Props:
 *  - videoUrl: string — URL embed del video YouTube (es: https://www.youtube.com/embed/VIDEO_ID)
 *  - message: string — piccolo testo mostrato a sinistra del video (solo su schermi grandi)
 *  - title: string — titolo opzionale della sezione
 */
export default function VideoSection({
  videoUrl = "",
  message = "",
  title = "",
}) {
  return (
    <section className="py-20 bg-base-100">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Titolo opzionale */}
        {title && (
          <h2 className="text-4xl sm:text-5xl font-extrabold text-base-content text-center mb-16 leading-tight">
            {title}
          </h2>
        )}

        {/* Wrapper relativo per posizionare il messaggio in assoluto a sinistra del video */}
        <div className="relative mx-auto max-w-3xl">

          {/* Etichetta + freccia — visibile solo su desktop (lg+) */}
          {message && (
            <div className="hidden lg:flex flex-col items-end gap-2 absolute right-full top-1/2 -translate-y-1/2 pr-5 w-40">
              {/* Testo piccolo corsivo */}
              <p className="text-sm text-base-content/60 italic text-right leading-snug">
                {message}
              </p>
              {/* Freccia curva SVG che punta verso destra (verso il video) */}
              <svg
                width="52"
                height="44"
                viewBox="0 0 52 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-base-content/40 ml-auto mr-0"
              >
                {/* Curva da sinistra-alto verso destra-basso */}
                <path
                  d="M 6 4 C 6 22, 44 20, 46 38"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Punta freccia verso destra */}
                <path
                  d="M 38 34 L 46 38 L 40 44"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
          )}

          {/* Video centrato */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-base-content/10 bg-base-300">
            {videoUrl ? (
              <iframe
                src={videoUrl}
                title="Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-base-200">
                <p className="text-base-content/40">Video non disponibile</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
