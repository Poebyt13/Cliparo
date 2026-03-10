/**
 * Sezione testimonials con 1, 2 o 3 recensioni affiancate.
 * Layout adattivo: 1 → centrata, 2 → centrate con spazio, 3 → griglia completa.
 *
 * Props:
 *  - testimonials: array (max 3) di:
 *      {
 *        text: string,           — testo della recensione
 *        author: string,         — nome autore
 *        role: string,           — ruolo o sottotitolo autore (es. "74.6K followers on X")
 *        avatar: string,         — URL immagine avatar (opzionale)
 *        stars: number,          — numero di stelle (default: 5, max: 5)
 *        highlight: string,      — testo da evidenziare in giallo nella recensione (opzionale)
 *      }
 */

import Image from "next/image";

function StarRating({ count = 5 }) {
  // Limita le stelle tra 1 e 5
  const stars = Math.min(5, Math.max(1, count));

  // Rendi le stelle non selezionabili dal mouse
  return (
    <div className="flex gap-0.5 text-yellow-400 text-xl mb-4">
      {Array.from({ length: stars }).map((_, i) => (
        <span key={i} className="select-none">★</span>
      ))}
    </div>
  );
}

function TestimonialCard({ text, author, role, avatar, stars = 5, highlight }) {
  // Divide il testo in parti: testo normale e parte evidenziata
  const renderText = () => {
    if (!highlight || !text.includes(highlight)) {
      return <p className="text-base-content/80 text-sm leading-relaxed text-center">{text}</p>;
    }
    const parts = text.split(highlight);
    return (
      <p className="text-base-content/80 text-sm leading-relaxed text-center">
        {parts[0]}
        <mark className="bg-yellow-200 text-base-content px-0.5 rounded not-italic">
          {highlight}
        </mark>
        {parts[1]}
      </p>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-2">
      <StarRating count={stars} />
      {renderText()}
      {/* Autore */}
      <div className="flex items-center gap-3 mt-2">
        {avatar ? (
          <Image
            src={avatar}
            alt={author}
            className="w-10 h-10 rounded-full object-cover border-2 border-base-300"
          />
        ) : (
          /* Avatar placeholder con iniziale */
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-10">
              <span className="text-sm font-semibold">
                {author?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}
        <div>
          <p className="font-semibold text-sm text-base-content">{author}</p>
          {role && <p className="text-xs text-base-content/50">{role}</p>}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection({ testimonials = [] }) {
  // Limita a massimo 3 recensioni
  const items = testimonials.slice(0, 3);
  const count = items.length;

  // Classe griglia dinamica in base al numero di recensioni
  const gridClass = {
    1: "flex justify-center",
    2: "grid grid-cols-1 sm:grid-cols-2 justify-items-center gap-8 max-w-3xl mx-auto",
    3: "grid grid-cols-1 sm:grid-cols-3 gap-8",
  }[count] ?? "flex justify-center";

  // Larghezza max per singola recensione
  const itemClass = count === 1 ? "w-full max-w-md" : "";

  if (count === 0) return null;

  return (
    <section className="py-16 bg-base-100">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className={gridClass}>
          {items.map((t, i) => (
            <div key={i} className={itemClass}>
              <TestimonialCard {...t} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
