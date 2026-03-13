import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongoClient";
import { sendEmail } from "@/lib/resend";
import LoginEmail from "@/emails/login";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

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
    /**
     * Eseguito dopo ogni login riuscito.
     * Sincronizza name e image da Google e garantisce i campi SaaS.
     */
    async signIn({ user, account }) {
      try {
        await connectToDatabase();

        // Campi che vanno aggiornati solo se arrivano dal provider (es. Google)
        const fieldsToUpdate = {};
        if (account?.provider === "google") {
          if (user.name)  fieldsToUpdate.name  = user.name;
          if (user.image) fieldsToUpdate.image = user.image;
        }

        // Garantisce che i campi SaaS esistano sempre nel documento
        await User.findOneAndUpdate(
          { email: user.email },
          {
            // Aggiorna name/image se arrivano da Google
            ...(Object.keys(fieldsToUpdate).length > 0 && { $set: fieldsToUpdate }),
            // Imposta i campi SaaS solo se il documento è nuovo o i campi mancano
            $setOnInsert: {
              stripeCustomerId: null,
              subscriptionStatus: "free",
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (error) {
        console.error("Errore nel callback signIn:", error);
      }

      return true;
    },

    /**
     * Arricchisce la sessione con id, subscriptionStatus e flag di profilo incompleto.
     */
    async session({ session, user }) {
      // Espone l'id MongoDB e lo stato abbonamento nella session
      session.user.id = user.id;

      try {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: session.user.email }).lean();
        if (dbUser) {
          session.user.subscriptionStatus = dbUser.subscriptionStatus ?? "free";
          session.user.stripeCustomerId   = dbUser.stripeCustomerId   ?? null;
          // Flag per il frontend: profilo incompleto se manca name
          session.user.needsSetup = !dbUser.name;
        }
      } catch (error) {
        console.error("Errore nel callback session:", error);
      }

      return session;
    },

    /**
     * Intercetta il redirect dopo il login.
     * Se il profilo è incompleto, forza il redirect a /setup-profile.
     */
    async redirect({ url, baseUrl }) {
      try {
        await connectToDatabase();

        // Estrae l'email dalla URL di callback (quando torna dal provider)
        // Controlla il DB per vedere se il profilo è completo
        const callbackUrl = url.startsWith("/") ? url : new URL(url).pathname;

        // Non intercettare se sta già andando a /setup-profile o /auth
        if (callbackUrl.startsWith("/setup-profile") || callbackUrl.startsWith("/auth")) {
          return url.startsWith("/") ? `${baseUrl}${url}` : url;
        }
      } catch (error) {
        console.error("Errore nel callback redirect:", error);
      }

      // Redirect standard: URL interni restano interni
      return url.startsWith("/") ? `${baseUrl}${url}` : url;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// Esporta il gestore NextAuth pronto per App Router
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
