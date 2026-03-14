import Link from "next/link";
import Image from "next/image";
import siteConfig from "@/config/site";

/**
 * Componente Logo riusabile.
 * Mostra l'immagine da siteConfig.logoImage se disponibile,
 * altrimenti mostra siteConfig.logoText come testo.
 *
 * Props:
 *  - size: "sm" | "md" | "lg" — dimensione del logo (default "md")
 *  - href: string — link al click (default "/")
 *  - className: string — classi CSS extra
 */
export default function Logo({ size = "md", href = "/", className = "" }) {
  // Classi dimensione testo in base alla prop size
  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  // Dimensioni immagine in base alla prop size
  const imgSizes = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 48, height: 48 },
  };

  const content = siteConfig.logoImage ? (
    // Mostra immagine logo
    <Image
      src={siteConfig.logoImage}
      alt={siteConfig.logoText}
      width={imgSizes[size].width}
      height={imgSizes[size].height}
      className="object-contain"
      priority
    />
  ) : (
    // Mostra testo logo
    <span className={`font-bold text-primary ${textSizes[size]}`}>
      {siteConfig.logoText}
    </span>
  );

  return (
    <Link href={href} className={`inline-flex items-center gap-2 ${className}`}>
      {content}
    </Link>
  );
}
