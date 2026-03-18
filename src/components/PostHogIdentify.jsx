"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { identifyUser } from "@/lib/analytics";

/**
 * Componente senza UI — identifica l'utente loggato in PostHog.
 * Va incluso una volta sola nel layout della dashboard.
 * Quando la sessione diventa disponibile, associa tutti gli eventi
 * PostHog successivi all'utente reale (invece di restare anonimi).
 */
export default function PostHogIdentify() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    identifyUser(session.user.id, {
      email: session.user.email,
      name: session.user.name,
      plan: session.user.subscriptionStatus,
    });
  }, [status, session]);

  return null;
}
