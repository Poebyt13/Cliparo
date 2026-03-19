import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

/**
 * GET /api/admin/users
 * Restituisce la lista utenti con dati essenziali.
 * Supporta paginazione: ?page=1&limit=20
 * Accessibile solo all'admin.
 */
export async function GET(request) {
  const session = await getServerSession(authOptions);
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!session || !adminEmail || session.user?.email !== adminEmail) {
    return Response.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const skip = (page - 1) * limit;

  await connectToDatabase();

  const [users, total] = await Promise.all([
    User.find()
      .select("name email image subscriptionStatus subscriptionEnd createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(),
  ]);

  return Response.json({
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
