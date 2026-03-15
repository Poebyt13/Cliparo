import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/resend";
import SubscriptionExpiringEmail from "@/emails/subscriptionExpiring";

// Giorni prima della scadenza per inviare l'avviso
const WARNING_DAYS = 3;

// URL di rinnovo (pagina pricing del sito)
const RENEW_URL = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/pricing`;

// URL gestione abbonamento (dashboard billing → apre il Stripe portal)
const MANAGE_URL = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/billing`;

/**
 * Controlla gli abbonamenti in scadenza e invia l'avviso.
 *
 * Cerca utenti trial/premium la cui scadenza cade esattamente tra WARNING_DAYS giorni
 * e invia loro un'email di promemoria.
 *
 * Il downgrade effettivo (email + DB → free) è gestito dal webhook Stripe
 * (customer.subscription.deleted) per avere notifiche in tempo reale.
 *
 * @returns {Object} Riepilogo delle operazioni eseguite
 */
export async function checkSubscriptions() {
  await connectToDatabase();

  const now = new Date();
  const results = { warned: [], errors: [] };

  // Finestra: da inizio giorno tra WARNING_DAYS a fine giorno tra WARNING_DAYS
  const warningStart = new Date(now);
  warningStart.setDate(warningStart.getDate() + WARNING_DAYS);
  warningStart.setHours(0, 0, 0, 0);

  const warningEnd = new Date(warningStart);
  warningEnd.setHours(23, 59, 59, 999);

  const expiringUsers = await User.find({
    subscriptionStatus: { $in: ["trial", "premium"] },
    subscriptionEnd: { $gte: warningStart, $lte: warningEnd },
  }).lean();

  for (const user of expiringUsers) {
    // Rispetta la preferenza dell'utente: salta se ha disattivato le notifiche
    if (user.notificationEmails === false) continue;

    try {
      await sendEmail({
        to: user.email,
        subject: user.cancelAtPeriodEnd
          ? `Il tuo piano scade tra ${WARNING_DAYS} giorni`
          : `Il tuo piano si rinnova tra ${WARNING_DAYS} giorni`,
        react: SubscriptionExpiringEmail({
          name: user.name,
          plan: user.subscriptionStatus,
          daysLeft: WARNING_DAYS,
          renewUrl: RENEW_URL,
          manageUrl: MANAGE_URL,
          cancelAtPeriodEnd: user.cancelAtPeriodEnd ?? false,
        }),
      });
      results.warned.push(user.email);
    } catch (err) {
      console.error(`Errore invio avviso a ${user.email}:`, err);
      results.errors.push({ email: user.email, error: err.message });
    }
  }

  console.log("Cron subscriptions completato:", results);
  return results;
}
