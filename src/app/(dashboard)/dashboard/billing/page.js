"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Card from "@/components/Card";
import Button from "@/components/Button";

/**
 * Pagina gestione abbonamento.
 * Percorso: /dashboard/billing
 * Mostra piano attuale, pulsante Stripe Customer Portal e ultime fatture.
 */
export default function BillingPage() {
  const { data: session, status } = useSession();
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [loadingPortal, setLoadingPortal] = useState(false);

  const plan = session?.user?.subscriptionStatus || "free";
  const planEnd = session?.user?.subscriptionEnd
    ? new Date(session.user.subscriptionEnd)
    : null;
  const hasStripeCustomer = !!session?.user?.stripeCustomerId;

  // Carica le fatture
  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/stripe/invoices")
      .then((res) => res.json())
      .then((data) => setInvoices(data.invoices || []))
      .catch(() => toast.error("Errore nel caricamento delle fatture."))
      .finally(() => setLoadingInvoices(false));
  }, [status]);

  // Redirect al Stripe Customer Portal
  async function handleManagePlan() {
    setLoadingPortal(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Errore nell'apertura del portale.");
        setLoadingPortal(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      toast.error("Errore di rete. Riprova.");
      setLoadingPortal(false);
    }
  }

  // Badge colore per il piano
  const badgeClass =
    plan === "premium" ? "badge-primary" :
    plan === "trial"   ? "badge-warning"  :
                         "badge-ghost";

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-base-content">Abbonamento</h1>
        <p className="text-base-content/60 mt-1">
          Gestisci il tuo piano e le fatture.
        </p>
      </div>

      {/* Card piano attuale */}
      <Card className="max-w-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-semibold text-base-content">Piano attuale</h2>
            <div className="flex items-center gap-2">
              <span className={`badge ${badgeClass}`}>{plan}</span>
              {planEnd && (
                <span className="text-sm text-base-content/60">
                  scade il{" "}
                  {planEnd.toLocaleDateString("it-IT", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>

          {/* CTA: portal se ha customer, altrimenti pricing */}
          {hasStripeCustomer ? (
            <Button
              label={loadingPortal ? "Apertura..." : "Gestisci piano"}
              onClick={handleManagePlan}
              variant="primary"
              disabled={loadingPortal}
            />
          ) : (
            <Button
              label="Scegli un piano"
              href="/pricing"
              variant="primary"
            />
          )}
        </div>
      </Card>

      {/* Fatture */}
      <div className="max-w-2xl space-y-4">
        <h2 className="text-xl font-semibold text-base-content">Fatture</h2>

        {loadingInvoices ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        ) : invoices.length === 0 ? (
          <Card>
            <p className="text-base-content/60 text-sm text-center py-4">
              Nessuna fattura disponibile.
            </p>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Importo</th>
                  <th>Stato</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="text-base-content">
                      {new Date(inv.date * 1000).toLocaleDateString("it-IT", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="text-base-content font-medium">
                      {(inv.amount / 100).toFixed(2)}{" "}
                      {inv.currency.toUpperCase()}
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm ${
                          inv.status === "paid"
                            ? "badge-success"
                            : inv.status === "open"
                            ? "badge-warning"
                            : "badge-ghost"
                        }`}
                      >
                        {inv.status === "paid" ? "Pagata" : inv.status === "open" ? "In attesa" : inv.status}
                      </span>
                    </td>
                    <td>
                      {inv.pdfUrl && (
                        <a
                          href={inv.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link link-primary text-sm"
                        >
                          PDF
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
