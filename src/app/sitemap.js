import seoConfig from "@/config/seo";

/**
 * Genera la sitemap.xml dinamica.
 * Next.js serve questo file automaticamente su /sitemap.xml.
 *
 * Aggiungere qui le pagine pubbliche del sito.
 * Le pagine protette (/dashboard, /settings, ecc.) sono escluse di proposito.
 */
export default function sitemap() {
  const baseUrl = seoConfig.url;

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/auth/signin`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/legal/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/legal/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
