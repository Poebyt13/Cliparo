"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import PageContainer from "@/components/PageContainer";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Logo from "@/components/Logo";

/**
 * Pagina di login con Magic Link email e accesso Google.
 * Percorso: /auth/signin
 */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validazione email base
  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  // Invio magic link via NextAuth email provider
  async function handleMagicLink(e) {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Inserisci un indirizzo email valido.");
      return;
    }

    setLoading(true);
    const result = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: "/dashboard",
    });
    setLoading(false);

    if (result?.error) {
      setError("Errore durante l'invio. Riprova.");
    } else {
      setSent(true);
    }
  }

  // Login con Google
  function handleGoogle() {
    signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-100 px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          {/* Intestazione */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Logo size="lg" href="/" />
            </div>
            <h1 className="text-2xl font-bold text-base-content">Accedi al tuo account</h1>
            <p className="text-base-content/60 text-sm mt-1">
              Nessuna password necessaria.
            </p>
          </div>

          {sent ? (
            /* Conferma invio magic link */
            <div className="alert alert-success text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Link inviato! Controlla la tua email per accedere.</span>
            </div>
          ) : (
            <>
              {/* Form magic link */}
              <form onSubmit={handleMagicLink} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  error={error}
                />
                <Button
                  label={loading ? "Invio in corso…" : "Invia link di accesso"}
                  variant="primary"
                  className="w-full"
                />
              </form>

              {/* Divider */}
              <div className="divider text-base-content/40 text-xs my-4">oppure</div>

              {/* Login Google */}
              <button
                onClick={handleGoogle}
                className="btn btn-outline w-full gap-2"
              >
                {/* Icona Google SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.5-1.45-.79-3-.79-4.59s.29-3.14.79-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.55 10.78l7.98-6.19z"/>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.55 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                </svg>
                Continua con Google
              </button>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
