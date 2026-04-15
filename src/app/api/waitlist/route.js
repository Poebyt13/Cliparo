import dbConnect from "@/lib/mongodb";
import WaitlistEmail from "@/models/WaitlistEmail";

export async function POST(request) {
  const { email } = await request.json();
  const referrer = request.headers.get("referer") || null;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return Response.json({ error: "Email non valida" }, { status: 400 });
  }

  await dbConnect();

  try {
    await WaitlistEmail.create({ email, referrer });
    return Response.json({ success: true });
  } catch (err) {
    if (err.code === 11000) {
      return Response.json({ error: "Email già registrata" }, { status: 409 });
    }
    return Response.json({ error: "Errore interno" }, { status: 500 });
  }
}
