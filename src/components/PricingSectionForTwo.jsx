import Button from "@/components/Button";

/**
 * Sezione pricing per prodotti con acquisto one-time (non abbonamento).
 * Layout: colonna feature a sinistra + 2 card prezzo a destra.
 * Il piano "popular" ha bordo colorato e badge in evidenza.
 *
 * Props:
 *  - title: string — titolo principale della sezione
 *  - subtitle: string — sottotitolo descrittivo
 *  - featuresTitle: string — intestazione della lista feature
 *  - features: string[] — voci della lista feature
 *  - plans: { name, oldPrice, price, currency, description, cta, popular }[]
 *      - name: string — nome del piano
 *      - oldPrice: string — prezzo barrato (es. "$55")
 *      - price: string — prezzo attuale (es. "$25")
 *      - currency: string — valuta (es. "USD")
 *      - description: string — testo sotto il prezzo
 *      - cta: { label, href } — bottone CTA
 *      - popular: boolean — mostra bordo + badge "POPULAR"
 *  - popularLabel: string — testo del badge popular (default "POPULAR")
 */
export default function PricingSectionForTwo({
  title,
  subtitle,
  featuresTitle = "Features",
  features = [],
  plans = [],
  popularLabel = "POPULAR",
}) {
  // Prende solo i primi 2 piani
  const validPlans = plans.slice(0, 2);

  return (
    <section className="py-20 bg-base-200">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Intestazione sezione */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-4xl sm:text-5xl font-extrabold text-base-content leading-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 text-base-content/60 text-lg max-w-xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Layout principale: feature + 2 piani */}
        {/* mt-6 per dare spazio al badge popular che fuoriesce in alto */}
        <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 items-stretch border border-base-content/10 shadow-lg rounded-2xl">

          {/* ── Colonna sinistra: lista feature ── */}
          {/* Angoli arrotondati: in alto su mobile, a sinistra su desktop */}
          <div className="bg-base-300 p-8 flex flex-col gap-6 rounded-t-2xl md:rounded-t-none md:rounded-l-2xl">
            <h3 className="text-xl font-bold text-base-content">
              {featuresTitle}
            </h3>
            <ul className="flex flex-col gap-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-base-content/80">
                  {/* Checkmark */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-success shrink-0 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Card prezzi (2 piani) ── */}
          {validPlans.map((plan, index) => (
            <div
              key={index}
              className={[
                "relative flex flex-col items-center justify-center gap-6 p-8 text-center",
                // Sfondo leggermente più scuro per la card destra
                index === 1 ? "bg-base-300/60" : "bg-base-300/80",
                // Ultimo piano: angoli arrotondati in basso su mobile, a destra su desktop
                index === validPlans.length - 1
                  ? "rounded-b-2xl md:rounded-b-none md:rounded-r-2xl"
                  : "",
                // Bordo colorato per il piano popular (ring-inset rimane dentro il box)
                plan.popular
                  ? "ring-2 ring-inset ring-warning"
                  : "border-t md:border-t-0 md:border-l border-base-content/10",
              ].join(" ")}
            >
              {/* Badge "POPULAR" — solo per il piano in evidenza */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="badge badge-warning text-warning-content text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full shadow">
                    {popularLabel}
                  </span>
                </div>
              )}

              {/* Nome del piano */}
              <h4 className="font-semibold text-base-content text-lg">
                {plan.name}
              </h4>

              {/* Blocco prezzo */}
              <div className="flex items-end justify-center gap-2">
                {/* Prezzo barrato */}
                {plan.oldPrice && (
                  <span className="text-base-content/40 text-base line-through self-start mt-2">
                    {plan.oldPrice}
                  </span>
                )}
                {/* Prezzo attuale */}
                <span className="text-5xl font-extrabold text-base-content leading-none">
                  {plan.price}
                </span>
                {/* Valuta */}
                {plan.currency && (
                  <span className="text-base-content/50 text-sm self-end mb-1">
                    {plan.currency}
                  </span>
                )}
              </div>

              {/* Descrizione sotto il prezzo */}
              {plan.description && (
                <p className="text-base-content/50 text-sm leading-relaxed">
                  {plan.description}
                </p>
              )}

              {/* CTA */}
              {plan.cta && (
                <a href={plan.cta.href} className="w-full">
                  <Button
                    label={plan.cta.label}
                    variant="primary"
                    className="w-full font-bold tracking-widest uppercase"
                  />
                </a>
              )}
            </div>
          ))}

        </div>
        </div>
      </div>
    </section>
  );
}
