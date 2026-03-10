/**
 * Componente social proof con avatar sovrapposti e contatore utenti.
 *
 * Props:
 *  - count: string | number — numero da mostrare in grassetto (es. "4,230" o 4230)
 *  - label: string — testo descrittivo dopo il numero (es. "utenti ci hanno scelto")
 *  - avatars: array di string — URL delle immagini avatar (max consigliato: 8-10)
 */

import Image from "next/image";

export default function SocialProof({
  count = "1,000",
  label = "utenti ci hanno già scelto",
  avatars = [],
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Gruppo avatar sovrapposti */}
      {avatars.length > 0 && (
        <div className="flex items-center">
          {avatars.map((src, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-full border-2 border-base-100 overflow-hidden -ml-3 first:ml-0"
              style={{ zIndex: avatars.length - i }}
            >
              <Image
                src={src}
                alt={`Utente ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Testo: numero + label */}
      <p className="text-base text-base-content italic">
        <strong className="not-italic font-extrabold">{count}</strong>{" "}
        {label}
      </p>
    </div>
  );
}
