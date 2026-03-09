import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import stripe from "@/lib/stripe";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

/**
 * POST /api/stripe/checkout
 * Crea una Stripe Checkout Session per avviare un abbonamento.
 * Richiede sessione autenticata.
 */
export async function POST(req) {
  // Verifica che l'utente sia autenticato
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  try {
    await connectToDatabase();

    // Recupera l'utente dal database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "Utente non trovato." }, { status: 404 });
    }

    // Crea il customer Stripe se non esiste ancora
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });
      customerId = customer.id;

      // Salva il customer ID nel database
      await User.findByIdAndUpdate(user._id, { stripeCustomerId: customerId });
    }

    const { priceId } = await req.json();
    if (!priceId) {
      return NextResponse.json({ error: "priceId mancante." }, { status: 400 });
    }

    // Crea la Checkout Session per l'abbonamento
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?checkout=cancelled`,
      metadata: {
        userId: user._id.toString(),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Errore nella creazione della checkout session:", error);
    return NextResponse.json({ error: "Errore interno del server." }, { status: 500 });
  }
}
