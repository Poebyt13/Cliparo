/**
 * Pulsante riusabile con varianti DaisyUI.
 *
 * Props:
 *  - label: string — testo del pulsante
 *  - onClick: () => void — handler click (opzionale)
 *  - href: string — se fornito, renderizza come <a> per la navigazione
 *  - variant: "primary" | "secondary" | "accent" | "outline" — stile cromatico (default: "primary")
 *  - className: string — classi aggiuntive
 */
export default function Button({
  label,
  onClick,
  href,
  variant = "primary",
  className = "",
}) {
  // Mappa variante → classe DaisyUI
  const variantClass = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    accent: "btn-accent",
    outline: "btn-outline",
  }[variant] ?? "btn-primary";

  const baseClass = `btn ${variantClass} ${className}`;

  // Se href è fornito, usa <a> per la navigazione
  if (href) {
    return (
      <a href={href} className={baseClass}>
        {label}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseClass}>
      {label}
    </button>
  );
}
