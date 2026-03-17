"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

/**
 * Inizializza il client PostHog.
 * Viene chiamata solo dopo il consenso cookie — mai automaticamente.
 * Se già inizializzato, non fa nulla.
 */
export function initPostHog() {
  if (typeof window === "undefined") return;
  if (posthog.__loaded) return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!key) return;

  posthog.init(key, {
    api_host: host || "https://eu.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
    loaded: (ph) => {
      // In sviluppo disabilita la cattura per non sporcare i dati
      if (process.env.NODE_ENV === "development") {
        ph.opt_out_capturing();
      }
    },
  });
}

/**
 * Ferma PostHog e resetta lo stato (utile se l'utente revoca il consenso).
 */
export function stopPostHog() {
  if (typeof window === "undefined") return;
  if (posthog.__loaded) {
    posthog.opt_out_capturing();
  }
}

export { posthog, PHProvider as PostHogProvider };
