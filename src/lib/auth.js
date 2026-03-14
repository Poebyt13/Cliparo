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
 * I callback usano Mongoose (User model) per garantire che i default dello schema
 * vengano sempre applicati, indipendentemente dal provider.
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
     * Usa Mongoose con upsert atomico e setDefaultsOnInsert per garantire
     * che tutti i campi dello schema siano sempre presenti nel documento.
     * - name / image da Google → solo se il name è ancora null
     * - stripeCustomerId / subscriptionStatus → applicati dai default dello schema
     */
    async signIn({ user, account }) {
      try {
        await connectToDatabase();

        // Legge il documento esistente una volta sola (serve per più condizioni)
        const existingUser = await User.findOne({ email: user.email }).lean();

        const setFields = {};

        // Inizializza profileSetupPending solo se non è ancora presente nel documento
        // (non va mai resettato a true su login successivi)
        if (existingUser?.profileSetupPending === undefined) {
          setFields.profileSetupPending = true;
        }

        // Inizializza campi SaaS solo se mancanti (mai sovrascrivere valori esistenti)
        if (existingUser?.stripeCustomerId === undefined) {
          setFields.stripeCustomerId = null;
        }
        if (existingUser?.subscriptionStatus === undefined) {
          setFields.subscriptionStatus = "free";
        }

        // Google: precompila name/image solo se il name è ancora null
        if (account?.provider === "google" && !existingUser?.name) {
          if (user.name)  setFields.name  = user.name;
          if (user.image) setFields.image = user.image;
        }

        // Applica l'update solo se ci sono campi da normalizzare
        if (Object.keys(setFields).length > 0) {
          await User.findOneAndUpdate(
            { email: user.email },
            { $set: setFields },
            { upsert: true, setDefaultsOnInsert: true }
          );
        }
      } catch (error) {
        console.error("Errore nel callback signIn:", error);
      }

      return true;
    },

    /**
     * Arricchisce la sessione con id, subscriptionStatus e flag setupPending.
     * Legge dai campi garantiti dal model User.
     */
    async session({ session, user }) {
      session.user.id = user.id;

      try {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: session.user.email }).lean();

        if (dbUser) {
          session.user.subscriptionStatus = dbUser.subscriptionStatus ?? "free";
          session.user.stripeCustomerId   = dbUser.stripeCustomerId   ?? null;
          session.user.needsSetup         = !!dbUser.profileSetupPending;
        }
      } catch (error) {
        console.error("Errore nel callback session:", error);
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// Esporta il gestore NextAuth pronto per App Router
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
