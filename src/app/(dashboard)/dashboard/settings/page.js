"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Card from "@/components/Card";
import Button from "@/components/Button";

/**
 * Pagina impostazioni.
 * Percorso: /dashboard/settings
 * Include preferenze email salvate su DB e zona pericolosa (eliminazione account).
 */
export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Preferenze email
  const [notificationEmails, setNotificationEmails] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [loadingPrefs, setLoadingPrefs] = useState(true);

  const plan = session?.user?.subscriptionStatus || "free";
  const planEnd = session?.user?.subscriptionEnd
    ? new Date(session.user.subscriptionEnd)
    : null;

  // Verifica se l'abbonamento è attivo (non scaduto)
  const hasActiveSubscription =
    (plan === "premium" || plan === "trial") &&
    planEnd &&
    planEnd > new Date();

  // Carica preferenze email dal DB
  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/user/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.notificationEmails !== undefined) setNotificationEmails(data.notificationEmails);
        if (data.marketingEmails !== undefined) setMarketingEmails(data.marketingEmails);
      })
      .catch(() => {})
      .finally(() => setLoadingPrefs(false));
  }, [status]);

  // Salva una preferenza email
  async function updatePreference(field, value) {
    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error();
      toast.success("Preferenza aggiornata.");
    } catch {
      toast.error("Errore nel salvataggio. Riprova.");
      // Ripristina il toggle allo stato precedente
      if (field === "notificationEmails") setNotificationEmails(!value);
      if (field === "marketingEmails") setMarketingEmails(!value);
    }
  }

  // Elimina account
  async function handleDeleteAccount() {
    if (confirmText !== "ELIMINA") return;

    setDeleting(true);
    try {
      const res = await fetch("/api/user/account", { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Errore nell'eliminazione dell'account.");
        setDeleting(false);
        return;
      }

      toast.success("Account eliminato. Verrai disconnesso.");
      // Disconnetti e torna alla home dopo un breve delay
      setTimeout(() => signOut({ callbackUrl: "/" }), 1500);
    } catch {
      toast.error("Errore di rete. Riprova.");
      setDeleting(false);
    }
  }

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
        <h1 className="text-3xl font-bold text-base-content">Impostazioni</h1>
        <p className="text-base-content/60 mt-1">
          Preferenze e gestione dell&apos;account.
        </p>
      </div>

      {/* Sezione preferenze email */}
      <Card className="max-w-2xl">
        <h2 className="font-semibold text-base-content mb-4">Preferenze email</h2>
        {loadingPrefs ? (
          <div className="flex justify-center py-4">
            <span className="loading loading-spinner loading-sm text-primary" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content">
                  Email di notifica
                </p>
                <p className="text-xs text-base-content/60">
                  Ricevi avvisi su scadenza piano e aggiornamenti account.
                </p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={notificationEmails}
                onChange={(e) => {
                  setNotificationEmails(e.target.checked);
                  updatePreference("notificationEmails", e.target.checked);
                }}
              />
            </div>
            <div className="divider my-0" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content">
                  Email promozionali
                </p>
                <p className="text-xs text-base-content/60">
                  Ricevi offerte speciali e promozioni.
                </p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={marketingEmails}
                onChange={(e) => {
                  setMarketingEmails(e.target.checked);
                  updatePreference("marketingEmails", e.target.checked);
                }}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Zona pericolosa */}
      <Card className="max-w-2xl border-error/30">
        <h2 className="font-semibold text-error mb-2">Zona pericolosa</h2>
        <p className="text-sm text-base-content/60 mb-4">
          L&apos;eliminazione dell&apos;account è irreversibile. Tutti i tuoi dati verranno
          rimossi permanentemente.
        </p>

        {hasActiveSubscription ? (
          // Utente con piano attivo: blocca eliminazione, mostra data scadenza
          <div className="space-y-3">
            <div className="alert alert-warning text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>
                Il tuo piano è attivo fino al{" "}
                <strong>
                  {planEnd.toLocaleDateString("it-IT", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
                . Potrai eliminare l&apos;account dopo la scadenza.
              </span>
            </div>
          </div>
        ) : (
          // Utente free o scaduto: può eliminare
          <Button
            label="Elimina account"
            onClick={() => setShowDeleteModal(true)}
            variant="error"
          />
        )}
      </Card>

      {/* Modal conferma eliminazione */}
      {showDeleteModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">
              Conferma eliminazione account
            </h3>
            <p className="py-4 text-sm text-base-content/70">
              Questa azione è <strong>irreversibile</strong>. Tutti i tuoi dati,
              sessioni e informazioni di pagamento verranno eliminati
              permanentemente.
            </p>
            <p className="text-sm text-base-content mb-3">
              Scrivi <strong>ELIMINA</strong> per confermare:
            </p>
            <input
              type="text"
              className="input input-bordered w-full"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="ELIMINA"
              autoFocus
            />
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText("");
                }}
                disabled={deleting}
              >
                Annulla
              </button>
              <button
                className="btn btn-error"
                onClick={handleDeleteAccount}
                disabled={confirmText !== "ELIMINA" || deleting}
              >
                {deleting ? "Eliminazione..." : "Elimina definitivamente"}
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setConfirmText("");
              }}
            >
              close
            </button>
          </form>
        </dialog>
      )}
    </div>
  );
}
