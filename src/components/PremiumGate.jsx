"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

// Mappa i piani a livelli numerici per confronto
const PLAN_LEVELS = { free: 0, trial: 1, premium: 2 };

/**
 * Componente di gating per contenuti riservati a un piano specifico.
 *
 * Props:
 *   - children: contenuto da proteggere
 *   - requiredPlan: piano minimo richiesto ("trial" o "premium", default "premium")
 *   - fallback: nodo alternativo opzionale al posto dell'overlay di default
 *
 * Se l'utente ha il piano sufficiente → mostra i children normalmente.
 * Altrimenti → sfuma i children e mostra un overlay con CTA di upgrade.
 */
export default function PremiumGate({ children, requiredPlan = "premium", fallback }) {
  const { data: session, status } = useSession();

  // Attende la sessione prima di decidere
  if (status === "loading") return null;

  const userLevel     = PLAN_LEVELS[session?.user?.subscriptionStatus] ?? 0;
  const requiredLevel = PLAN_LEVELS[requiredPlan] ?? 2;

  // Utente con piano sufficiente: mostra il contenuto normalmente
  if (userLevel >= requiredLevel) return children;

  // Componente fallback personalizzato
  if (fallback) return fallback;

  // Overlay di default: sfuma il contenuto e mostra il messaggio di upgrade
  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* Contenuto sfumato e non interagibile */}
      <div className="blur-sm pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>

      {/* Overlay di upgrade */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-base-100/75 backdrop-blur-sm">
        <div className="text-center space-y-3 p-6 max-w-xs">
          <div className="text-3xl">🔒</div>
          <p className="font-semibold text-base-content text-lg">
            Funzionalità {requiredPlan}
          </p>
          <p className="text-sm text-base-content/60">
            Aggiorna il tuo piano per sbloccare questo contenuto.
          </p>
          <Link href="/pricing" className="btn btn-primary btn-sm">
            Aggiorna piano →
          </Link>
        </div>
      </div>
    </div>
  );
}
