"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";

/**
 * Nomi leggibili per i servizi nel popover.
 */
const SERVICE_LABELS = {
  mongodb: "MongoDB",
  stripe: "Stripe",
  resend: "Resend (Email)",
  r2: "Cloudflare R2",
  upstash: "Upstash Redis",
  posthog: "PostHog",
  googleAnalytics: "Google Analytics",
  sentry: "Sentry",
};

/**
 * Colore del pallino in base allo stato del servizio.
 */
function statusColor(status) {
  if (status === "ok") return "bg-success";
  if (status === "not_configured") return "bg-warning";
  return "bg-error";
}

/**
 * Label stato tradotta.
 */
function statusLabel(status) {
  if (status === "ok") return "OK";
  if (status === "not_configured") return "Non configurato";
  return "Errore";
}

/**
 * Widget admin che mostra un pallino fisso in basso a destra
 * con lo stato dei servizi integrati. Visibile solo all'admin.
 *
 * Colori pallino:
 *  - Verde: tutti i servizi OK
 *  - Giallo: qualche servizio non configurato
 *  - Rosso: errore in un servizio
 */
export default function AdminHealthIndicator() {
  const { data: session, status: sessionStatus } = useSession();
  const [health, setHealth] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const isAdmin = sessionStatus === "authenticated" &&
    adminEmail &&
    session?.user?.email === adminEmail;

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health");
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      }
    } catch {
      // Silenzioso — il widget non deve mai rompere l'app
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch iniziale quando l'admin è autenticato
  useEffect(() => {
    if (isAdmin) fetchHealth();
  }, [isAdmin, fetchHealth]);

  // Chiudi il popover cliccando fuori
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Non renderizzare nulla se non è admin o non c'è ADMIN_EMAIL
  if (!isAdmin) return null;

  // Colore del pallino principale
  const dotColor = !health
    ? "bg-base-content/30"
    : health.overall === "ok"
      ? "bg-success"
      : health.overall === "error"
        ? "bg-error"
        : "bg-warning";

  return (
    <div ref={containerRef} className="fixed bottom-4 right-4 z-50">
      {/* Popover con lista servizi — posizionato sopra il pallino */}
      {open && health && (
        <div className="absolute mb-2.5 bottom-6 right-0 bg-base-100 border border-base-300 rounded-xl shadow-xl p-4 w-72">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-base-content">
              Stato servizi
            </h3>
            <button
              onClick={fetchHealth}
              disabled={loading}
              className="btn btn-ghost btn-xs"
              aria-label="Aggiorna stato"
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
            </button>
          </div>
          <ul className="space-y-2">
            {Object.entries(health.services).map(([key, service]) => (
              <li key={key} className="flex items-center gap-2 text-sm">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusColor(service.status)}`} />
                <span className="text-base-content font-medium">
                  {SERVICE_LABELS[key] || key}
                </span>
                <span className="text-base-content/50 text-xs ml-auto">
                  {statusLabel(service.status)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pallino cliccabile */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-4 h-4 rounded-full ${dotColor} shadow-md ring-2 ring-base-100 transition-transform hover:scale-125 cursor-pointer`}
        aria-label="Stato servizi"
        title="Health check admin"
      />
    </div>
  );
}
