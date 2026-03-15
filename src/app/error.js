"use client";

import Logo from "@/components/Logo";

/**
 * Pagina di errore runtime globale.
 * Next.js la mostra quando un componente o una route fallisce con un errore non gestito.
 * Diversa da /auth/error che gestisce SOLO errori di autenticazione NextAuth.
 */
export default function GlobalError({ error, reset }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-100 px-4 text-center">
      <Logo />
      <h1 className="mt-6 text-4xl font-bold text-base-content">
        Qualcosa è andato storto
      </h1>
      <p className="mt-3 text-lg text-base-content/60">
        Si è verificato un errore inaspettato. Riprova o torna alla home.
      </p>
      <div className="mt-8 flex gap-3">
        <button onClick={() => reset()} className="btn btn-primary">
          Riprova
        </button>
        <a href="/" className="btn btn-ghost">
          Torna alla home
        </a>
      </div>
    </div>
  );
}
