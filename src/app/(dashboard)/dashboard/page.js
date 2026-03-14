"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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

  return (
    <div className="space-y-6">
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
            <h2 className="card-title text-sm text-base-content/60">Abbonamento</h2>
            <div className="flex items-center gap-2">
              <span className={`badge ${
                session?.user?.subscriptionStatus === "premium"
                  ? "badge-primary"
                  : session?.user?.subscriptionStatus === "trial"
                    ? "badge-warning"
                    : "badge-ghost"
              }`}>
                {session?.user?.subscriptionStatus || "free"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
