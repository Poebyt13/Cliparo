import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Completa il profilo",
  robots: { index: false, follow: false },
};

/**
 * Se il profilo è già completo, reindirizza direttamente alla dashboard.
 * Evita che un utente già configurato veda la pagina di setup.
 */
export default async function SetupProfileLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (session && !session.user?.needsSetup) {
    redirect("/dashboard");
  }

  return children;
}
