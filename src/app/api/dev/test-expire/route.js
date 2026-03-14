import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/resend";
import SubscriptionExpiredEmail from "@/emails/subscriptionExpired";

/**
 * POST /api/dev/test-expire
 * Simula la scadenza di un abbonamento: downgrade a free + email di notifica.
 * Replica esattamente il comportamento del webhook customer.subscription.deleted.
 * Solo in ambiente di sviluppo.
 *
 * Sicurezza: NODE_ENV è settato automaticamente da Next.js/Vercel
 * e non può essere sovrascritto dal client. Il check è affidabile.
 *
 * Body: { "email": "utente@test.dev" }
 */
export async function POST(request) {
  // Blocco di sicurezza: Next.js/Vercel settano NODE_ENV automaticamente
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Non disponibile." }, { status: 403 });
  }

  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: "email mancante nel body." }, { status: 400 });
  }

  await connectToDatabase();

  // Trova l'utente
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: `Utente ${email} non trovato.` }, { status: 404 });
  }

  const previousPlan = user.subscriptionStatus;

  // Downgrade a free nel DB
  await User.findByIdAndUpdate(user._id, {
    $set: { subscriptionStatus: "free", subscriptionEnd: null },
  });

  // Invia email di scadenza
  const renewUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/pricing`;
  let emailSent = false;
  try {
    await sendEmail({
      to: user.email,
      subject: "Il tuo piano è scaduto",
      react: SubscriptionExpiredEmail({
        name: user.name,
        plan: previousPlan,
        renewUrl,
      }),
    });
    emailSent = true;
  } catch (err) {
    console.error("Errore invio email scadenza:", err);
  }

  return NextResponse.json({
    ok: true,
    email: user.email,
    previousPlan,
    newPlan: "free",
    emailSent,
  });
}
