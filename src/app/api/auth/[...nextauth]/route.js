// Delega tutta la logica a src/lib/auth.js per mantenere la route minimale
export { GET, POST } from "@/lib/auth";

/**
 NextAuth gestisce automaticamente queste route:

/api/auth/signin
/api/auth/session
/api/auth/callback/google
/api/auth/signout
 */