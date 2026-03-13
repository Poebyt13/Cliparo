"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";

const MAX_NAME_LENGTH = 255;
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png"];

/**
 * Pagina di completamento profilo.
 * Mostrata dopo il primo login se name o image sono mancanti.
 */
export default function SetupProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const fileInputRef = useRef(null);

  // Precompila i campi con i dati della sessione (es. Google login)
  if (status === "authenticated" && !initialized) {
    if (session.user.name) setName(session.user.name);
    if (session.user.image) setPreview(session.user.image);
    setInitialized(true);
  }

  // Schermata di caricamento
  if (status === "loading") {
    return (
      <PageContainer>
        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="text-base-content/60 text-lg">Caricamento...</p>
        </div>
      </PageContainer>
    );
  }

  // Redirect se non autenticato
  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  // Validazione e anteprima del file selezionato
  function handleFileChange(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const ext = selected.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError("Formato non valido. Usa JPG o PNG.");
      return;
    }

    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  // Invio form al server
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validazione client-side
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

      const res = await fetch("/api/user/setup-profile", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Errore durante il salvataggio.");
        setLoading(false);
        return;
      }

      // Forza il refresh della sessione per aggiornare needsSetup
      await update();

      // Redirect alla dashboard dopo il completamento
      router.push("/dashboard");
    } catch (err) {
      setError("Errore di rete. Riprova.");
      setLoading(false);
    }
  }

  return (
    <PageContainer>
      <div className="flex min-h-[70vh] items-center justify-center">
        <Card className="w-full max-w-md">
          {/* Intestazione */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-base-content">
              Completa il tuo profilo
            </h1>
            <p className="text-base-content/60 text-sm mt-1">
              Aggiungi il tuo nome e una foto profilo.
            </p>
          </div>

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
                    alt="Anteprima"
                    className="w-full h-full object-cover"
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

              {/* Input file nascosto */}
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

            {/* Messaggio di errore generico */}
            {error && !error.includes("nome") && (
              <div className="alert alert-error text-sm">
                <span>{error}</span>
              </div>
            )}

            {/* Pulsante conferma */}
            <Button
              label={loading ? "Salvataggio..." : "Continua"}
              variant="primary"
              className="w-full"
            />
          </form>
        </Card>
      </div>
    </PageContainer>
  );
}
