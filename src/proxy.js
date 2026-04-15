import { NextResponse } from "next/server";

/**
 * Proxy che protegge le route private controllando il cookie di sessione.
 * Usa il controllo diretto del cookie perché la strategy è "database"
 * (sessioni nel DB, non JWT), quindi withAuth non funziona correttamente.
 */
// Route auth: se autenticato, reindirizza alla dashboard
const AUTH_ROUTES = ["/auth/signin"];

export function proxy(req) {
  const { pathname } = req.nextUrl;

  // Landing-only mode: tutto blocca → redirect a home
  return NextResponse.redirect(new URL("/", req.url));
}

/**
 * Definisce le route protette + le route auth (per redirect inverso).
 * Le route pubbliche (api/auth, _next, file statici) sono escluse.
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/:path*",
    "/settings/:path*",
    "/setup-profile",
    "/auth/:path*",
    "/api/admin/:path*",
    "/api/user/:path*",
    "/api/stripe/:path*",
    "/api/cron/:path*",
    "/api/dev/:path*",
  ],
};
