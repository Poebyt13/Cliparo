import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Hr,
  Preview,
  Section,
} from "@react-email/components";

export default function WaitlistConfirmEmail() {
  return (
    <Html lang="en">
      <Head />
      <Preview>You're on the Cliparo waitlist — we'll be in touch.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.logoSection}>
            <Text style={styles.logoText}>Cliparo</Text>
          </Section>

          <Heading style={styles.heading}>You're on the waitlist.</Heading>

          <Text style={styles.text}>
            Thanks for your interest in <strong>Cliparo</strong>.
          </Text>
          <Text style={styles.text}>
            We're building an AI tool that turns long-form videos into short clips ready to post on TikTok, Reels, and Shorts — automatically.
          </Text>
          <Text style={styles.text}>
            Early access will be rolled out in waves. We'll reach out as soon as your spot is ready.
          </Text>

          <Hr style={styles.hr} />

          <Text style={styles.footer}>
            Cliparo — From raw video to ready-to-post clips.
          </Text>
          <Text style={styles.footerMuted}>
            You received this because you joined the Cliparo waitlist. No further emails until your access is ready.
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
  logoText: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    margin: "0",
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
