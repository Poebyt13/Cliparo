import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classi CSS in modo sicuro per Tailwind.
 * Usa clsx per classi condizionali e twMerge per risolvere conflitti Tailwind.
 *
 * Esempio: cn("btn btn-primary", isLarge && "btn-lg", className)
 */
export default function cn(...inputs) {
  return twMerge(clsx(inputs));
}
