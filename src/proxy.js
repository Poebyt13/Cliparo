import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Middleware che protegge le route private con session Auth.js.
 * Reindirizza alla pagina di login se l'utente non è autenticato.
 */
export default withAuth(
  function middleware(req) {
    // L'utente è autenticato: lascia passare la richiesta
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

/**
 * Definisce le route protette dal middleware.
 * Le route pubbliche (auth, api/auth, _next, file statici) sono escluse.
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/:path*",
    "/settings/:path*",
    // Aggiungi qui altre route private
  ],
};
