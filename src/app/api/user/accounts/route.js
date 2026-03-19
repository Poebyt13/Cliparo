import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongoClient";
import { ObjectId } from "mongodb";

/**
 * GET /api/user/accounts
 * Restituisce la lista dei provider collegati all'utente (Google, email).
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  // L'adapter NextAuth salva userId come ObjectId
  const userId = new ObjectId(session.user.id);

  // Cerca tutti gli account collegati all'userId nella collection "accounts" (NextAuth)
  const accounts = await db
    .collection("accounts")
    .find({ userId })
    .project({ provider: 1, type: 1, _id: 0 })
    .toArray();

  // Aggiungi il provider email se l'utente ha emailVerified
  // (NextAuth non crea un record in "accounts" per email provider)
  const hasEmailProvider = session.user.email && session.user.emailVerified !== null;
  if (hasEmailProvider) {
    const hasEmailInAccounts = accounts.some((a) => a.provider === "email");
    if (!hasEmailInAccounts) {
      accounts.push({ provider: "email", type: "email" });
    }
  }

  return Response.json({ accounts });
}

/**
 * DELETE /api/user/accounts
 * Scollega un provider OAuth dall'account.
 * Non permette di scollegare l'ultimo provider attivo.
 * Body: { provider: "google" }
 */
export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const body = await request.json();
  const { provider } = body;

  if (!provider || provider === "email") {
    return Response.json(
      { error: "Non puoi scollegare il provider email." },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db();

  const userId = new ObjectId(session.user.id);

  // Conta i provider attivi per evitare di scollegare l'unico
  const accountCount = await db
    .collection("accounts")
    .countDocuments({ userId });

  // L'utente ha sempre email come fallback, ma verifica che abbia emailVerified
  const hasEmailFallback = session.user.emailVerified !== null;
  const totalProviders = accountCount + (hasEmailFallback ? 1 : 0);

  if (totalProviders <= 1) {
    return Response.json(
      { error: "Non puoi scollegare l'unico metodo di accesso." },
      { status: 400 }
    );
  }

  // Rimuovi l'account del provider specificato
  const result = await db
    .collection("accounts")
    .deleteOne({ userId, provider });

  if (result.deletedCount === 0) {
    return Response.json(
      { error: "Provider non trovato." },
      { status: 404 }
    );
  }

  return Response.json({ success: true });
}
