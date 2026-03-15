"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PageContainer from "@/components/PageContainer";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Logo from "@/components/Logo";

// Messaggi di errore NextAuth leggibili dall'utente
const ERROR_MESSAGES = {
  OAuthSignin: "Errore durante l'avvio dell'accesso con il provider esterno.",
  OAuthCallback: "Errore nella risposta dal provider esterno.",
  OAuthCreateAccount: "Impossibile creare l'account con il provider esterno.",
  EmailCreateAccount: "Impossibile creare l'account con questa email.",
  Callback: "Errore durante il processo di autenticazione.",
  OAuthAccountNotLinked: "Questa email è già associata a un altro metodo di accesso. Prova ad accedere con il metodo usato in precedenza.",
  EmailSignin: "Errore nell'invio dell'email di accesso. Riprova più tardi.",
  SessionRequired: "Devi effettuare l'accesso per visualizzare questa pagina.",
  Default: "Si è verificato un errore. Riprova più tardi.",
};

/**
 * Contenuto della pagina errore.
 * Separato per poter wrappare con Suspense (useSearchParams richiede Suspense boundary).
 */
function ErrorContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error") || "Default";
  const message = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.Default;

  return (
    <PageContainer className="flex items-center justify-center min-h-screen">
      <Card className="max-w-md w-full text-center space-y-6">
        <Logo />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-base-content">
            Errore di autenticazione
          </h1>
          <p className="text-base-content/60">{message}</p>
        </div>
        <div className="flex flex-col gap-3">
          <Button label="Torna al login" href="/auth/signin" variant="primary" />
          <Button label="Torna alla home" href="/" variant="ghost" />
        </div>
      </Card>
    </PageContainer>
  );
}

/**
 * Pagina di errore autenticazione.
 * Percorso: /auth/error
 * NextAuth redirecta qui con ?error=<codice> quando qualcosa fallisce.
 */
export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
