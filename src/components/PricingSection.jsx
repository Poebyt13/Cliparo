import Card from "@/components/Card";
import Button from "@/components/Button";

/**
 * Sezione pricing con N piani affiancati su desktop, stacked su mobile.
 * Usa i componenti Card e Button riusabili.
 *
 * Props:
 *  - title: string — titolo della sezione
 *  - subtitle: string — sottotitolo descrittivo
 *  - plans: { title, price, period, description, features, cta, highlighted }[]
 *      - title: string — nome del piano (es. "Pro")
 *      - price: string — prezzo (es. "€19")
 *      - period: string — periodicità (es. "al mese")
 *      - description: string — breve descrizione
 *      - features: string[] — lista feature
 *      - cta: { label, href, variant } — bottone CTA
 *      - highlighted: boolean — evidenzia con bordo primary
 */
export default function PricingSection({
  title = "Scegli il piano giusto",
  subtitle = "Nessuna sorpresa. Cancella quando vuoi.",
  plans = [
    {
      title: "Free",
      price: "€0",
      period: "per sempre",
      description: "Per iniziare senza impegno.",
      features: ["1 progetto", "Accesso base alle funzionalità", "Supporto community"],
      cta: { label: "Inizia gratis", href: "/auth/signin", variant: "secondary" },
      highlighted: false,
    },
    {
      title: "Pro",
      price: "€19",
      period: "al mese",
      description: "Per professionisti e team in crescita.",
      features: ["Progetti illimitati", "Accesso completo alle funzionalità", "Supporto prioritario via email", "Analisi avanzate"],
      cta: { label: "Abbonati ora", href: "/api/stripe/checkout", variant: "primary" },
      highlighted: true,
    },
    {
      title: "Enterprise",
      price: "Su misura",
      period: "",
      description: "Per grandi team con esigenze personalizzate.",
      features: ["Tutto il piano Pro", "SLA garantito", "Onboarding dedicato", "Fatturazione personalizzata"],
      cta: { label: "Contattaci", href: "mailto:hello@example.com", variant: "accent" },
      highlighted: false,
    },
  ],
}) {
  return (
    <section className="py-16 bg-base-200">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Intestazione sezione */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-3xl font-bold text-base-content">{title}</h2>}
            {subtitle && <p className="mt-3 text-base-content/60 text-lg">{subtitle}</p>}
          </div>
        )}

        {/* Griglia piani — numero colonne dinamico in base ai piani forniti */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <Card
              key={plan.title}
              title={plan.title}
              description={plan.description}
              className={plan.highlighted ? "border-primary shadow-md" : ""}
            >
              {/* Prezzo */}
              <div className="mt-2 mb-4">
                <span className="text-4xl font-extrabold text-base-content">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-base-content/50 text-sm ml-1">
                    {plan.period}
                  </span>
                )}
              </div>

              {/* Lista feature */}
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-base-content/80">
                    {/* Checkmark */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-success shrink-0"
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

              {/* CTA */}
              <a href={plan.cta.href} className="block">
                <Button
                  label={plan.cta.label}
                  variant={plan.cta.variant}
                  className="w-full"
                />
              </a>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
