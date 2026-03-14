import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import path from "path";
import { writeFile } from "fs/promises";

// Tipi MIME accettati per le immagini
const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const MAX_NAME_LENGTH = 255;

/**
 * POST /api/user/setup-profile
 * Aggiorna name e image dell'utente autenticato.
 * Accetta multipart/form-data con campi "name" e "image" (file).
 */
export async function POST(req) {
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

      // Genera nome univoco: timestamp-userId.estensione
      const ext = imageFile.type === "image/png" ? "png" : "jpg";
      const userId = session.user.id;
      const fileName = `${Date.now()}-${userId}.${ext}`;

      // Salva il file in public/uploads
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadPath = path.join(process.cwd(), "public", "uploads", fileName);
      await writeFile(uploadPath, buffer);

      // Salva l'URL relativo nel database
      updateFields.image = `/uploads/${fileName}`;
    }

    // Aggiorna name, image e imposta profileSetupPending a false
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { ...updateFields, profileSetupPending: false } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "Utente non trovato." }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      user: {
        name: updatedUser.name,
        image: updatedUser.image,
      },
    });
  } catch (error) {
    console.error("Errore nel setup profilo:", error);
    return NextResponse.json({ error: "Errore interno del server." }, { status: 500 });
  }
}
