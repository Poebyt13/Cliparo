import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

/**
 * Rate limiter basato su Upstash Redis.
 *
 * Richiede le variabili d'ambiente:
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *
 * Se non configurate, il rate limiting è disabilitato (log warning in dev).
 */

// Controlla se Upstash è configurato
const isConfigured =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

// Crea istanza Redis solo se configurata
const redis = isConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

/**
 * Crea un rate limiter con la finestra specificata.
 * @param {number} requests - Numero massimo di richieste nella finestra
 * @param {string} window - Finestra temporale (es. "1 m", "1 h", "1 d")
 * @returns {Ratelimit|null}
 */
function createLimiter(requests, window) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: true,
    prefix: "ratelimit",
  });
}

// ── Limiters predefiniti per i vari tipi di endpoint ──

/** Endpoint di autenticazione: 10 req/min */
export const authLimiter = createLimiter(10, "1 m");

/** Endpoint Stripe checkout: 5 req/min */
export const checkoutLimiter = createLimiter(5, "1 m");

/** Operazioni distruttive (delete account): 3 req/ora */
export const destructiveLimiter = createLimiter(3, "1 h");

/** Endpoint standard autenticati (CRUD profilo, settings): 20 req/min */
export const standardLimiter = createLimiter(20, "1 m");

/**
 * Applica il rate limit a una richiesta.
 * Restituisce null se la richiesta è consentita, oppure una Response 429 se superato il limite.
 *
 * @param {Request} req - La richiesta HTTP
 * @param {Ratelimit|null} limiter - Il rate limiter da usare
 * @param {string} [prefix] - Prefisso opzionale per distinguere endpoint diversi
 * @returns {Promise<NextResponse|null>}
 */
export async function applyRateLimit(req, limiter, prefix = "") {
  // Se Upstash non è configurato, skip (non bloccare in dev senza Redis)
  if (!limiter) {
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️ Rate limiting disabilitato: UPSTASH_REDIS non configurato.");
    }
    return null;
  }

  // Identifica il client tramite IP (header standard Vercel/proxy)
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "127.0.0.1";
  const identifier = prefix ? `${prefix}:${ip}` : ip;

  try {
    const { success, limit, remaining, reset } = await limiter.limit(identifier);

    if (!success) {
      return NextResponse.json(
        { error: "Troppe richieste. Riprova più tardi." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(reset),
            "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
          },
        }
      );
    }
  } catch (err) {
    // Fail open: se Redis non è raggiungibile o le credenziali sono errate,
    // lascia passare la richiesta invece di bloccare tutto.
    console.error("⚠️ Rate limiter error (fail open):", err.message);
  }

  return null;
}
