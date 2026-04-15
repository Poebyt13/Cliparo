import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Img,
  Hr,
  Preview,
  Section,
} from "@react-email/components";

/**
 * Email di conferma waitlist inviata all'utente che si iscrive.
 * @param {Object} props
 * @param {string} props.siteUrl - URL base del sito (per caricare l'icona)
 */
export default function WaitlistConfirmEmail() {
  const logoUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/icon.png`;
  return (
    <Html lang="en">
      <Head />
      <Preview>You're on the Cliparo waitlist!</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.logoSection}>
            <Img
              src={logoUrl}
              alt="Cliparo"
              width="48"
              height="48"
              style={styles.logo}
            />
            <Text style={styles.logoText}>Cliparo</Text>
          </Section>

          <Heading style={styles.heading}>You're on the list! 🎉</Heading>

          <Text style={styles.text}>
            Thanks for joining the <strong>Cliparo</strong> waitlist.
          </Text>
          <Text style={styles.text}>
            We're building something special — an AI tool that turns your long videos into
            viral-ready clips for TikTok, Reels, and Shorts in seconds.
          </Text>
          <Text style={styles.text}>
            We'll reach out as soon as Cliparo is ready for you. You'll be among the first to try it.
          </Text>

          <Hr style={styles.hr} />

          <Text style={styles.footer}>
            Cliparo — Turn any video into viral clips.
          </Text>
          <Text style={styles.footerMuted}>
            You received this email because you signed up for the Cliparo waitlist.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#0f0f17",
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: "520px",
    margin: "40px auto",
    backgroundColor: "#1a1a2e",
    borderRadius: "16px",
    padding: "48px 40px",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  logoSection: {
    textAlign: "center",
    marginBottom: "24px",
  },
  logo: {
    borderRadius: "12px",
    margin: "0 auto",
  },
  logoText: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    margin: "8px 0 0",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    margin: "0 0 24px",
  },
  text: {
    fontSize: "15px",
    color: "#a1a1b5",
    lineHeight: "1.7",
    margin: "0 0 16px",
  },
  hr: {
    borderColor: "rgba(255,255,255,0.08)",
    margin: "32px 0 24px",
  },
  footer: {
    fontSize: "13px",
    color: "#7c7c96",
    margin: "0 0 4px",
    textAlign: "center",
  },
  footerMuted: {
    fontSize: "11px",
    color: "#4a4a5e",
    margin: "0",
    textAlign: "center",
  },
};
