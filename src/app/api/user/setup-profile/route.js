import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { uploadToR2 } from "@/lib/r2";
import { applyRateLimit, standardLimiter } from "@/lib/ratelimit";
import { sendEmail } from "@/lib/resend";
import WelcomeEmail from "@/emails/welcome";

// Tipi MIME accettati per le immagini
const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const MAX_NAME_LENGTH = 255;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * POST /api/user/setup-profile
 * Aggiorna name e image dell'utente autenticato.
 * Accetta multipart/form-data con campi "name" e "image" (file).
 */
export async function POST(req) {
  const rateLimitResponse = await applyRateLimit(req, standardLimiter, "setup-profile");
  if (rateLimitResponse) return rateLimitResponse;

  // Verifica autenticazione
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const imageFile = formData.get("image");

    // ── Validazione name ──
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Il nome è obbligatorio." }, { status: 400 });
    }
    if (name.trim().length > MAX_NAME_LENGTH) {
      return NextResponse.json({ error: `Il nome non può superare ${MAX_NAME_LENGTH} caratteri.` }, { status: 400 });
    }

    await connectToDatabase();

    // Campi da aggiornare
    const updateFields = { name: name.trim() };

    // ── Gestione upload immagine (opzionale se l'utente ha già un'immagine) ──
    if (imageFile && typeof imageFile !== "string" && imageFile.size > 0) {
      // Validazione tipo file
      if (!ALLOWED_TYPES.includes(imageFile.type)) {
        return NextResponse.json({ error: "Formato immagine non valido. Usa JPG o PNG." }, { status: 400 });
      }

      // Controllo dimensione prima di leggere i byte in memoria
      if (imageFile.size > MAX_IMAGE_SIZE) {
        return NextResponse.json({ error: "Immagine troppo grande. Massimo 2MB." }, { status: 400 });
      }

      // Genera nome univoco: timestamp-userId.estensione
      const ext = imageFile.type === "image/png" ? "png" : "jpg";
      const userId = session.user.id;
      const fileName = `${Date.now()}-${userId}.${ext}`;

      // Upload su Cloudflare R2
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const key = `avatars/${fileName}`;
      updateFields.image = await uploadToR2(buffer, key, imageFile.type);
    }

    // session.user.needsSetup è letto fresh dal DB in ogni chiamata getServerSession
    // (NextAuth database sessions rileggono l'utente a ogni request).
    // È true solo se profileSetupPending è ancora true → primo completamento profilo.
    const isFirstSetup = session.user.needsSetup === true;

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { ...updateFields, profileSetupPending: false } },
      { returnDocument: "after" }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "Utente non trovato." }, { status: 404 });
    }

    // Invia welcome email solo al primo completamento del profilo
    if (isFirstSetup) {
      const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      sendEmail({
        to: session.user.email,
        subject: "Benvenuto!",
        react: WelcomeEmail({
          name: name.trim(),
          dashboardUrl: `${siteUrl}/dashboard`,
        }),
      }).catch((err) => console.error("Errore invio welcome email:", err));
    }

    return NextResponse.json({
      ok: true,
      user: {
        name: updatedUser.name,
        image: updatedUser.image ?? null,
      },
    });
  } catch (error) {
    console.error("Errore nel setup profilo:", error);
    return NextResponse.json({ error: "Errore interno del server." }, { status: 500 });
  }
}
