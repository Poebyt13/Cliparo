import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

/**
 * GET /api/admin/stats
 * Restituisce statistiche utenti e abbonamenti.
 * Accessibile solo all'admin.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!session || !adminEmail || session.user?.email !== adminEmail) {
    return Response.json({ error: "Non autorizzato" }, { status: 401 });
  }

  await connectToDatabase();

  // Conteggio per piano
  const [totalUsers, freeUsers, premiumUsers, trialUsers] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ subscriptionStatus: "free" }),
    User.countDocuments({ subscriptionStatus: "premium" }),
    User.countDocuments({ subscriptionStatus: "trial" }),
  ]);

  return Response.json({
    totalUsers,
    freeUsers,
    premiumUsers,
    trialUsers,
  });
}
