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

  // Il cookie ha nome diverso in HTTP (dev) e HTTPS (prod)
  const sessionToken =
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  // Utente autenticato che prova ad accedere a pagine auth → dashboard
  if (sessionToken && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Utente non autenticato che prova ad accedere a route protette → signin
  if (!sessionToken) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
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
    "/auth/signin",
    // Aggiungi qui altre route private o auth
  ],
};
