import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("Definisci la variabile d'ambiente RESEND_API_KEY.");
}

/**
 * Istanza Resend inizializzata con la chiave API.
 * Riutilizzabile in tutte le utility del progetto.
 */
export const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Invia un'email generica tramite Resend.
 * @param {Object} params
 * @param {string|string[]} params.to - Destinatario/i
 * @param {string} params.subject - Oggetto dell'email
 * @param {React.ReactElement} params.react - Template React da renderizzare
 * @returns {Promise<Object>} Risposta Resend
 */
export async function sendEmail({ to, subject, react }) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM || "noreply@example.com",
    to,
    subject,
    react,
  });
}
