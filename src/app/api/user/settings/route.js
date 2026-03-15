import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

/**
 * GET /api/user/settings
 * Restituisce le preferenze email dell'utente.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email })
    .select("notificationEmails marketingEmails")
    .lean();

  if (!user) {
    return NextResponse.json({ error: "Utente non trovato." }, { status: 404 });
  }

  return NextResponse.json({
    notificationEmails: user.notificationEmails ?? true,
    marketingEmails: user.marketingEmails ?? false,
  });
}

/**
 * PATCH /api/user/settings
 * Aggiorna le preferenze email dell'utente.
 * Body: { notificationEmails?: boolean, marketingEmails?: boolean }
 */
export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  const body = await req.json();
  const updates = {};

  if (typeof body.notificationEmails === "boolean") {
    updates.notificationEmails = body.notificationEmails;
  }
  if (typeof body.marketingEmails === "boolean") {
    updates.marketingEmails = body.marketingEmails;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nessun campo valido da aggiornare." }, { status: 400 });
  }

  await connectToDatabase();
  await User.findOneAndUpdate({ email: session.user.email }, { $set: updates });

  return NextResponse.json({ ok: true, ...updates });
}
