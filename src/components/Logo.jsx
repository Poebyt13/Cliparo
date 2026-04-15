import Link from "next/link";
import Image from "next/image";
import siteConfig from "@/config/site";
import cn from "@/utils/cn";

/**
 * Componente Logo riusabile.
 * Mostra icona, testo, o entrambi in base alla prop `variant` e a siteConfig.
 * Se logoImage non esiste, fallback automatico a testo (usa name se logoText è null).
 *
 * Props:
 *  - size: "sm" | "md" | "lg"                    — dimensione (default "md")
 *  - variant: "icon" | "text" | "both"          — cosa mostrare (default "both")
 *  - href: string                                 — link al click (default "/")
 *  - className: string                            — classi CSS extra
 *
 * Comportamenti variant:
 *  - "icon":  solo icona (fallback a testo se logoImage non esiste)
 *  - "text":  solo testo (usa logoText, fallback a name)
 *  - "both":  icona + testo affianco (se logoImage esiste), altrimenti solo testo
 */
export default function Logo({ size = "md", variant = "both", href = "/", className = "" }) {
  // Classi dimensione testo in base alla prop size
  const textSizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-3xl",
  };

  // Dimensioni icona in base alla prop size
  const imgSizes = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 48, height: 48 },
  };

  // Determina che cosa mostrare in base alla prop variant
  const showIcon = (variant === "icon" || variant === "both") && siteConfig.logoImage;
  const showText = (variant === "text" || variant === "both");
  
  // Testo da mostrare: logoText se esiste, fallback a name (che esiste sempre)
  const displayText = siteConfig.logoText || siteConfig.name;

  return (
    <Link href={href} className={cn("inline-flex items-center gap-2", className)}>
      {/* Icona — mostrata in base a variant se logoImage esiste */}
      {showIcon && (
        <Image
          src={siteConfig.logoImage}
          alt={displayText}
          width={imgSizes[size].width}
          height={imgSizes[size].height}
          className="object-contain"
          priority
        />
      )}

      {/* Testo — mostrato in base a variant; se no icon, mostra in ogni caso (fallback) */}
      {(showText || (!showIcon && variant !== "icon")) && (
        <span className={cn("font-bold text-white", textSizes[size])}>
          {displayText}
        </span>
      )}
    </Link>
  );
}
