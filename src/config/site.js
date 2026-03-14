/**
 * Configurazione centralizzata del sito.
 * Modifica qui nome, logo, tagline e URL base — vengono usati in tutta l'app.
 *
 * Per usare un'immagine come logo, imposta logoImage con il path relativo a /public.
 * Es: logoImage: "/logo.png"  →  metti il file in public/logo.png
 * Se logoImage è null, viene mostrato logoText come testo.
 */
const siteConfig = {
  // Nome del sito — mostrato nella navbar, signin, titolo browser, email, ecc.
  name: "SaaS",

  // Tagline breve — usata in header, landing page, meta description
  tagline: "Il tuo prodotto SaaS",

  // URL base del sito (senza slash finale)
  url: process.env.NEXTAUTH_URL || "http://localhost:3000",

  // Logo come immagine: imposta il path (es. "/logo.png") oppure null per usare il testo
  logoImage: null,

  // Testo alternativo all'immagine logo (e alt text dell'img)
  logoText: "SaaS",
};

export default siteConfig;
