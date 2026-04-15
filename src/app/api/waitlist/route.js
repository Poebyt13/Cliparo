import dbConnect from "@/lib/mongodb";
import WaitlistEmail from "@/models/WaitlistEmail";
import { sendEmail } from "@/lib/resend";
import WaitlistNotificationEmail from "@/emails/waitlistNotification";
import WaitlistConfirmEmail from "@/emails/waitlistConfirm";

export async function POST(request) {
  const { email } = await request.json();
  const referrer = request.headers.get("referer") || null;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return Response.json({ error: "Email non valida" }, { status: 400 });
  }

  await dbConnect();

  try {
    const entry = await WaitlistEmail.create({ email, referrer });

    const date = new Intl.DateTimeFormat("it-IT", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "Europe/Rome",
    }).format(new Date(entry.createdAt));

    // Notifica admin (fire-and-forget)
    sendEmail({
      to: "hkf24kdns@gmail.com",
      subject: `New waitlist signup: ${email}`,
      react: WaitlistNotificationEmail({ email, date, referrer }),
    }).catch((err) => console.error("[waitlist] admin notification failed:", err));

    // Email di conferma all'utente (fire-and-forget)
    sendEmail({
      to: email,
      subject: "You're on the Cliparo waitlist! 🎉",
      react: WaitlistConfirmEmail(),
    }).catch((err) => console.error("[waitlist] confirm email failed:", err));

    return Response.json({ success: true });
  } catch (err) {
    if (err.code === 11000) {
      return Response.json({ error: "Email già registrata" }, { status: 409 });
    }
    return Response.json({ error: "Errore interno" }, { status: 500 });
  }
}
