"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PremiumGate from "@/components/PremiumGate";

/**
 * Pagina principale della dashboard.
 * Il proxy in src/proxy.js garantisce che solo utenti autenticati accedano.
 * Il layout (dashboard) aggiunge automaticamente la sidebar.
 */
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect a setup-profile se il profilo è incompleto
  useEffect(() => {
    if (status === "authenticated" && session?.user?.needsSetup) {
      router.replace("/setup-profile");
    }
  }, [status, session, router]);

  // Caricamento mentre la sessione viene idratata
  if (status === "loading" || session?.user?.needsSetup) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  const plan      = session?.user?.subscriptionStatus || "free";
  const planEnd   = session?.user?.subscriptionEnd ? new Date(session.user.subscriptionEnd) : null;
  const badgeClass =
    plan === "premium" ? "badge-primary" :
    plan === "trial"   ? "badge-warning"  :
                         "badge-ghost";

  return (
    <div className="space-y-8">
      {/* Intestazione */}
      <div>
        <h1 className="text-3xl font-bold text-base-content">Dashboard</h1>
        <p className="text-base-content/60 mt-1">
          Bentornato, {session?.user?.name || session?.user?.email}
        </p>
      </div>

      {/* Card info utente */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Email */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-sm text-base-content/60">Email</h2>
            <p className="text-base-content font-medium">{session?.user?.email}</p>
          </div>
        </div>

        {/* Piano abbonamento */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-sm text-base-content/60">Piano</h2>
            <span className={`badge ${badgeClass} w-fit`}>{plan}</span>
          </div>
        </div>

        {/* Scadenza abbonamento */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-sm text-base-content/60">Scadenza</h2>
            {planEnd ? (
              <p className="text-base-content font-medium">
                {planEnd.toLocaleDateString("it-IT", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            ) : (
              <p className="text-base-content/40 text-sm">—</p>
            )}
          </div>
        </div>
      </div>

      {/* Demo content gating */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-base-content">Contenuti per piano</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Contenuto trial */}
          <PremiumGate requiredPlan="trial">
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body space-y-2">
                <div className="flex items-center gap-2">
                  <span className="badge badge-warning badge-sm">Trial</span>
                  <h3 className="font-semibold">Statistiche avanzate</h3>
                </div>
                <p className="text-base-content/60 text-sm">
                  Analisi dettagliate delle tue attività, grafici e report settimanali.
                </p>
              </div>
            </div>
          </PremiumGate>

          {/* Contenuto premium */}
          <PremiumGate requiredPlan="premium">
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body space-y-2">
                <div className="flex items-center gap-2">
                  <span className="badge badge-primary badge-sm">Premium</span>
                  <h3 className="font-semibold">Export dati</h3>
                </div>
                <p className="text-base-content/60 text-sm">
                  Esporta i tuoi dati in CSV, PDF e via API. Integrazioni avanzate incluse.
                </p>
              </div>
            </div>
          </PremiumGate>
        </div>
      </div>
    </div>
  );
}

