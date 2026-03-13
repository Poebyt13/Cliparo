import { NextResponse } from "next/server";

/**
 * Proxy che protegge le route private controllando il cookie di sessione.
 * Usa il controllo diretto del cookie perché la strategy è "database"
 * (sessioni nel DB, non JWT), quindi withAuth non funziona correttamente.
 */
export function proxy(req) {
  // Il cookie ha nome diverso in HTTP (dev) e HTTPS (prod)
  const sessionToken =
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    // Reindirizza al login preservando l'URL di destinazione
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

/**
 * Definisce le route protette.
 * Le route pubbliche (auth, api/auth, _next, file statici) sono escluse.
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/:path*",
    "/settings/:path*",
    "/setup-profile",
    // Aggiungi qui altre route private
  ],
};
