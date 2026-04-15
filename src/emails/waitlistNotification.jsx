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
 * Email di notifica interna quando qualcuno si iscrive alla waitlist.
 * @param {Object} props
 * @param {string} props.email - Email dell'iscritto
 * @param {string} props.date - Data e ora formattata
 * @param {string|null} props.referrer - URL di provenienza
 * @param {string} props.siteUrl - URL base del sito
 */
export default function WaitlistNotificationEmail({
  email = "test@example.com",
  date = "15 aprile 2026, 12:00",
  referrer = null,
}) {
  const logoUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/icon.png`;
  return (
    <Html lang="en">
      <Head />
      <Preview>New waitlist signup: {email}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.logoSection}>
            <Img
              src={logoUrl}
              alt="Cliparo"
              width="40"
              height="40"
              style={styles.logo}
            />
            <Text style={styles.logoText}>Cliparo</Text>
          </Section>

          <Heading style={styles.heading}>New waitlist signup 🎉</Heading>

          <Text style={styles.text}>
            Someone just joined the <strong style={{ color: "#fff" }}>Cliparo</strong> waitlist.
          </Text>

          <Hr style={styles.hr} />

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{email}</Text>

          <Text style={styles.label}>Date & time</Text>
          <Text style={styles.value}>{date}</Text>

          <Text style={styles.label}>Referrer</Text>
          <Text style={styles.value}>{referrer || "Direct (no referrer)"}</Text>

          <Hr style={styles.hr} />

          <Text style={styles.footer}>Cliparo — internal notification</Text>
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
    marginBottom: "20px",
  },
  logo: {
    borderRadius: "10px",
    margin: "0 auto",
  },
  logoText: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    margin: "6px 0 0",
  },
  heading: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    margin: "0 0 20px",
  },
  text: {
    fontSize: "15px",
    color: "#a1a1b5",
    lineHeight: "1.6",
    margin: "0 0 8px",
  },
  label: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#7c7c96",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    margin: "16px 0 2px",
  },
  value: {
    fontSize: "15px",
    color: "#ffffff",
    margin: "0",
  },
  hr: {
    borderColor: "rgba(255,255,255,0.08)",
    margin: "24px 0",
  },
  footer: {
    fontSize: "12px",
    color: "#4a4a5e",
    margin: "0",
    textAlign: "center",
  },
};
