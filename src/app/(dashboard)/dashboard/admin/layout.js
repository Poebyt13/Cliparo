import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Metadata per le pagine admin.
 */
export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Layout per la sezione admin.
 * Guard server-side: accessibile solo all'admin (NEXT_PUBLIC_ADMIN_EMAIL).
 * Se l'utente non è admin, viene reindirizzato alla dashboard.
 */
export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!session || !adminEmail || session.user?.email !== adminEmail) {
    redirect("/dashboard");
  }

  return children;
}
