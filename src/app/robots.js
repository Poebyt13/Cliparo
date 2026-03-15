import seoConfig from "@/config/seo";

/**
 * Genera il robots.txt dinamico.
 * Next.js serve questo file automaticamente su /robots.txt.
 *
 * Blocca i bot da dashboard, API e pagine admin.
 * Consente l'indicizzazione delle pagine pubbliche.
 */
export default function robots() {
  const baseUrl = seoConfig.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/setup-profile", "/auth/error"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
