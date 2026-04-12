import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import AdminHealthIndicator from "@/components/AdminHealthIndicator";
import { Toaster } from "sonner";
import seoConfig from "@/config/seo";

const geistSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: seoConfig.defaultTitle,
    template: seoConfig.titleTemplate,
  },
  description: seoConfig.description,
  openGraph: {
    title: seoConfig.defaultTitle,
    description: seoConfig.description,
    url: seoConfig.url,
    siteName: seoConfig.defaultTitle,
    images: [{ url: seoConfig.ogImage, width: 1200, height: 630 }],
    locale: seoConfig.locale,
    type: seoConfig.type,
  },
  twitter: {
    card: seoConfig.twitterCard,
    title: seoConfig.defaultTitle,
    description: seoConfig.description,
    images: [seoConfig.ogImage],
  },
  metadataBase: new URL(seoConfig.url),
};

/**
 * Layout principale dell'applicazione.
 *
 * Il tema viene applicato staticamente tramite data-theme su <html>.
 * DaisyUI attiva automaticamente saas-dark se il sistema operativo
 * usa prefers-color-scheme: dark (configurato in globals.css).
 *
 * Per cambiare tema predefinito basta modificare data-theme qui sotto.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="saas-dark" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProviderWrapper>
          <AnalyticsProvider privacyUrl="/legal/privacy">
            {children}
          </AnalyticsProvider>
          <AdminHealthIndicator />
        </SessionProviderWrapper>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
