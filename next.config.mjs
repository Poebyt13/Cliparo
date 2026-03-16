/** @type {import('next').NextConfig} */
const nextConfig = {
  // Domini esterni per le immagini ottimizzate (<Image> di Next.js)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Cloudflare R2 — decommentare e inserire il proprio dominio
      //{ protocol: "https", hostname: "cdn.example.com" },
      // Oppure per R2.dev: 
      { protocol: "https", hostname: "*.r2.dev" },
    ],
  },

  // Security headers applicati a tutte le risposte
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
