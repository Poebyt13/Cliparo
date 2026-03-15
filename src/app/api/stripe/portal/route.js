import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import stripe from "@/lib/stripe";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

/**
 * POST /api/stripe/portal
 * Crea una sessione Stripe Customer Portal per gestire l'abbonamento.
 * L'utente viene redirectato al portal dove può cambiare piano, carta o cancellare.
 */
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: "Nessun abbonamento attivo. Vai alla pagina prezzi per iniziare." },
        { status: 400 }
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/billing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Errore creazione portal session:", error);
    return NextResponse.json({ error: "Errore interno del server." }, { status: 500 });
  }
}
