# AGENT GUIDE - Copilot / Cursor AI

## Regole generali
- Scrivi tutti i nomi di variabili, funzioni, classi e file in inglese.
- I commenti devono essere in italiano, chiari e concisi.
- Segui le best practices per Next.js, Tailwind, DaisyUI, Mongoose, Stripe, Resend.
- Usa il pattern modulare: ogni funzione o utility deve poter essere riusata in altri progetti.
- Non generare tutto il codice in un’unica volta, procedi **step by step**.
- Tutti i file di supporto vanno dentro `src/` (lib, models, emails, components, utils).
- Tutti i file di route/pagine Next.js vanno dentro `src/app/`.

## Best practices specifiche
- Database: riusa la connessione Mongoose per evitare connessioni multiple.
- Auth.js: usa sessioni, Magic link e Google login.
- Stripe: gestione abbonamenti, webhook e stato premium utente.
- Email: usa Resend e template modulari.
- UI: Tailwind + DaisyUI, componenti riusabili, layout coerente.

## Output richiesto
- Scrivi codice pronto all’uso
- Usa commenti in italiano
- Mantieni file puliti e leggibili
- Fornisci path completi (es: `src/lib/mongodb.js`)