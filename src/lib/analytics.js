import { posthog } from "@/lib/posthog";

/**
 * Traccia un evento custom via PostHog.
 * Sicuro da chiamare anche se PostHog non è inizializzato — fallisce silenziosamente.
 *
 * @param {string} eventName - Nome dell'evento (es. "checkout_started")
 * @param {Object} [properties] - Proprietà aggiuntive dell'evento
 */
export function trackEvent(eventName, properties = {}) {
  if (typeof window === "undefined") return;

  try {
    if (posthog.__loaded && !posthog.has_opted_out_capturing()) {
      posthog.capture(eventName, properties);
    }
  } catch {
    // PostHog non disponibile — ignora silenziosamente
  }
}

/**
 * Identifica l'utente in PostHog (da usare dopo il login).
 *
 * @param {string} userId - ID univoco dell'utente
 * @param {Object} [traits] - Proprietà utente (es. { email, plan })
 */
export function identifyUser(userId, traits = {}) {
  if (typeof window === "undefined") return;

  try {
    if (posthog.__loaded && !posthog.has_opted_out_capturing()) {
      posthog.identify(userId, traits);
    }
  } catch {
    // PostHog non disponibile — ignora silenziosamente
  }
}
