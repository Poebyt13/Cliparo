import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongoClient";
import { sendEmail } from "@/lib/resend";
import LoginEmail from "@/emails/login";

/**
 * Configurazione NextAuth con Google OAuth, Magic Link email e MongoDB adapter.
 * Usa clientPromise (MongoClient nativo) richiesto da @auth/mongodb-adapter.
 */
export const authOptions = {
  // Adapter usa il client nativo MongoDB, non Mongoose
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    // Provider Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),

    // Provider Email per Magic Link via Resend
    EmailProvider({
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url }) => {
        try {
          // Usa il template React centralizzato e la utility sendEmail
          await sendEmail({
            to: identifier,
            subject: "Accedi al tuo account",
            react: LoginEmail({ loginUrl: url, email: identifier }),
          });
        } catch (error) {
          console.error("Errore nell'invio della email di verifica:", error);
          throw new Error("Impossibile inviare la email di verifica.");
        }
      },
    }),
  ],

  // Sessione su database MongoDB
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,   // scade dopo 30 giorni
    updateAge: 24 * 60 * 60,      // aggiorna il token ogni 24 ore
  },

  // Pagine personalizzate
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  callbacks: {
    async session({ session, user }) {
      // Espone l'id MongoDB dell'utente nella session
      session.user.id = user.id;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// Esporta il gestore NextAuth pronto per App Router
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
