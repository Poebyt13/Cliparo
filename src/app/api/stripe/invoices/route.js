import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import stripe from "@/lib/stripe";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { applyRateLimit, standardLimiter } from "@/lib/ratelimit";

/**
 * GET /api/stripe/invoices
 * Restituisce le ultime fatture Stripe dell'utente autenticato.
 * Ritorna un array di oggetti con: id, date, amount, currency, status, pdfUrl.
 */
export async function GET(req) {
  const rateLimitResponse = await applyRateLimit(req, standardLimiter, "invoices");
  if (rateLimitResponse) return rateLimitResponse;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user?.stripeCustomerId) {
      // Utente senza customer Stripe: nessuna fattura
      return NextResponse.json({ invoices: [] });
    }

    // Recupera le ultime 10 fatture da Stripe
    const stripeInvoices = await stripe.invoices.list({
      customer: user.stripeCustomerId,
      limit: 10,
    });

    // Mappa solo i campi necessari per il frontend
    const invoices = stripeInvoices.data.map((inv) => ({
      id: inv.id,
      date: inv.created,
      amount: inv.amount_paid,
      currency: inv.currency,
      status: inv.status,
      pdfUrl: inv.invoice_pdf,
    }));

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error("Errore recupero fatture:", error);
    return NextResponse.json({ error: "Errore interno del server." }, { status: 500 });
  }
}
