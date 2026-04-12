/**
 * Configurazione SEO centralizzata.
 * Usata in layout.js e nelle singole pagine per metadata coerenti.
 *
 * Per personalizzare: modifica title, description e ogImage.
 * ogImage deve essere un URL assoluto (o un path in /public).
 */
const seoConfig = {
  // Titolo di default mostrato nel browser
  defaultTitle: "clipFast — AI-powered viral clips",

  // Template per il titolo delle sotto-pagine: "Pagina | clipFast"
  titleTemplate: "%s | clipFast",

  // Descrizione di default per i motori di ricerca
  description:
    "Turn any long video into viral TikTok clips. AI finds the most engaging moments, creates clips, adds captions, and formats them — in seconds.",

  // URL base del sito (senza slash finale)
  url: process.env.NEXTAUTH_URL || "http://localhost:3000",

  // Immagine Open Graph di default (1200x630 consigliata)
  ogImage: "/og-image.png",

  // Tipo di sito per Open Graph
  type: "website",

  // Locale
  locale: "it_IT",

  // Twitter card type
  twitterCard: "summary_large_image",
};

export default seoConfig;
