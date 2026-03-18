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

export default function DashboardRootLayout({ children }) {
  return (
    <>
      <PostHogIdentify />
      {children}
    </>
  );
}
