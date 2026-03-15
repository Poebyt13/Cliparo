"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";

const MAX_NAME_LENGTH = 255;
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png"];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * Pagina modifica profilo utente.
 * Percorso: /dashboard/profile
 */
export default function ProfilePage() {
  const { data: session, status, update } = useSession();

  const [name, setName] = useState("");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const fileInputRef = useRef(null);

  // Precompila i campi dalla sessione corrente
  if (status === "authenticated" && !initialized) {
    if (session.user.name) setName(session.user.name);
    if (session.user.image) setPreview(session.user.image);
    setInitialized(true);
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  // Validazione e anteprima del file
  function handleFileChange(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const ext = selected.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError("Formato non valido. Usa JPG o PNG.");
      return;
    }

    if (selected.size > MAX_IMAGE_SIZE) {
      setError("Immagine troppo grande. Massimo 2MB.");
      return;
    }

    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  // Salva profilo
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Il nome è obbligatorio.");
      return;
    }
    if (name.trim().length > MAX_NAME_LENGTH) {
      setError(`Il nome non può superare ${MAX_NAME_LENGTH} caratteri.`);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (file) formData.append("image", file);

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Errore durante il salvataggio.");
        setLoading(false);
        return;
      }

      // Aggiorna la sessione per riflettere i nuovi dati
      await update();
      toast.success("Profilo aggiornato con successo.");
    } catch (err) {
      setError("Errore di rete. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-base-content">Profilo</h1>
        <p className="text-base-content/60 mt-1">
          Modifica il tuo nome e la foto profilo.
        </p>
      </div>

      <Card className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Anteprima immagine */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-24 h-24 rounded-full bg-base-200 border border-base-300 overflow-hidden flex items-center justify-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Foto profilo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-base-content/30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              type="button"
              className="btn btn-ghost btn-xs text-primary"
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? "Cambia foto" : "Carica foto"}
            </button>
          </div>

          {/* Campo nome */}
          <Input
            label="Nome"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Il tuo nome"
            error={error && error.includes("nome") ? error : ""}
          />

          {/* Email (sola lettura) */}
          <Input
            label="Email"
            type="email"
            value={session?.user?.email || ""}
            disabled
          />

          {/* Errore generico */}
          {error && !error.includes("nome") && (
            <div className="alert alert-error text-sm">
              <span>{error}</span>
            </div>
          )}

          <Button
            label={loading ? "Salvataggio..." : "Salva modifiche"}
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          />
        </form>
      </Card>
    </div>
  );
}
