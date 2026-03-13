"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Wrapper client-side per SessionProvider di NextAuth.
 * Necessario per separare i Server Component dal Client Component.
 */
export default function SessionProviderWrapper({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
