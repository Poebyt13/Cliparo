import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import PostHogIdentify from "@/components/PostHogIdentify";

/**
 * Metadata per tutte le pagine dashboard.
 * Applica noindex a tutte le sotto-pagine e titolo di default "Dashboard".
 * Le sotto-pagine possono sovrascrivere il titolo con il proprio layout.js.
 */
export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

/**
 * Redirect server-side prima di qualsiasi render:
 * se il profilo non è ancora completato, manda a /setup-profile.
 * Questo elimina il flash client-side che si vedeva con il redirect via useEffect.
 */
export default async function DashboardRootLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (session?.user?.needsSetup) {
    redirect("/setup-profile");
  }

  return (
    <>
      <PostHogIdentify />
      {children}
    </>
  );
}
