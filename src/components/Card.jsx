import cn from "@/utils/cn";

/**
 * Componente Card riusabile con titolo, descrizione e contenuto opzionale.
 *
 * Props:
 *  - title: string — titolo della card (opzionale)
 *  - description: string — testo descrittivo sotto il titolo (opzionale)
 *  - children: ReactNode — contenuto personalizzato
 *  - className: string — classi aggiuntive per sovrascrivere lo stile
 */
export default function Card({ title, description, children, className = "" }) {
  return (
    <div
      className={cn("card bg-base-100 border border-base-300 shadow-sm rounded-box", className)}
    >
      <div className="card-body">
        {title && (
          <h2 className="card-title text-base-content">{title}</h2>
        )}
        {description && (
          <p className="text-base-content/70 text-sm">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}
