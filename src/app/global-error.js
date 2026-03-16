"use client";

/**
 * Error boundary per crash nel root layout.
 * Diverso da error.js: global-error.js cattura errori che avvengono
 * dentro layout.js e template.js al livello root.
 *
 * Next.js richiede che includa i tag <html> e <body> perché
 * quando questo componente è attivo, il root layout non è renderizzato.
 */
export default function GlobalError({ error, reset }) {
  return (
    <html lang="it" data-theme="saas-light">
      <body className="antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center bg-base-100 px-4 text-center">
          <h1 className="mt-6 text-4xl font-bold text-base-content">
            Qualcosa è andato storto
          </h1>
          <p className="mt-3 text-lg text-base-content/60">
            Si è verificato un errore critico. Riprova o torna alla home.
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
      </body>
    </html>
  );
}
