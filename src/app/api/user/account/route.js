import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import stripe from "@/lib/stripe";
import { sendEmail } from "@/lib/resend";
import AccountDeletedEmail from "@/emails/accountDeleted";
import mongoose from "mongoose";

/**
 * DELETE /api/user/account
 * Elimina l'account dell'utente autenticato.
 *
 * Regole:
 * - Se ha un abbonamento attivo (trial/premium non scaduto) → blocca
 * - Se free o abbonamento scaduto → elimina tutto (GDPR)
 *
 * Operazioni: rimuove user, sessions, accounts da MongoDB,
 * elimina il customer da Stripe se presente, e invia email di conferma.
 */
export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "Utente non trovato." }, { status: 404 });
    }

    // Blocca se il piano non è ancora scaduto (l'utente ha pagato fino a subscriptionEnd)
    // Anche se ha già cancellato la subscription su Stripe, il periodo pagato va rispettato.
    if (user.subscriptionEnd && new Date(user.subscriptionEnd) > new Date()) {
      const endDate = new Date(user.subscriptionEnd).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      return NextResponse.json(
        {
          error: `Il tuo piano è attivo fino al ${endDate}. Potrai eliminare l'account dopo la scadenza.`,
          code: "ACTIVE_SUBSCRIPTION",
          subscriptionEnd: user.subscriptionEnd,
        },
        { status: 400 }
      );
    }

    const userName = user.name;
    const userEmail = user.email;
    const stripeCustomerId = user.stripeCustomerId;

    // Elimina il customer da Stripe se presente
    if (stripeCustomerId) {
      try {
        await stripe.customers.del(stripeCustomerId);
      } catch (err) {
        // Se il customer non esiste su Stripe, continua comunque
        console.warn("Errore eliminazione customer Stripe:", err.message);
      }
    }

    // Elimina i dati collegati da MongoDB (sessions e accounts dell'adapter NextAuth)
    const db = mongoose.connection.db;
    await Promise.all([
      User.deleteOne({ _id: user._id }),
      db.collection("sessions").deleteMany({ userId: user._id }),
      db.collection("accounts").deleteMany({ userId: user._id }),
    ]);

    // Invia email di conferma cancellazione
    try {
      await sendEmail({
        to: userEmail,
        subject: "Il tuo account è stato eliminato",
        react: AccountDeletedEmail({ name: userName, email: userEmail }),
      });
    } catch (err) {
      console.error("Errore invio email cancellazione account:", err);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Errore eliminazione account:", error);
    return NextResponse.json({ error: "Errore interno del server." }, { status: 500 });
  }
}
