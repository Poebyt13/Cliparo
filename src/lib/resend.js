import { Resend } from "resend";

/**
 * Istanza Resend con inizializzazione lazy.
 * Creata al primo utilizzo per evitare che un'env mancante rompa il modulo
 * al caricamento — l'errore viene lanciato solo quando si tenta di inviare.
 */
let _resend = null;

function getResendClient() {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("Definisci la variabile d'ambiente RESEND_API_KEY.");
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

/**
 * Invia un'email generica tramite Resend.
 * @param {Object} params
 * @param {string|string[]} params.to - Destinatario/i
 * @param {string} params.subject - Oggetto dell'email
 * @param {React.ReactElement} params.react - Template React da renderizzare
 * @returns {Promise<Object>} Risposta Resend
 */
export async function sendEmail({ to, subject, react }) {
  const resend = getResendClient();
  return resend.emails.send({
    from: process.env.EMAIL_FROM || "noreply@example.com",
    to,
    subject,
    react,
  });
}
