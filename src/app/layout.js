import { Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

const geistSans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SaaS Boilerplate",
  description: "SaaS boilerplate con Next.js, DaisyUI e Tailwind CSS",
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
    <html lang="it" data-theme="saas-light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
