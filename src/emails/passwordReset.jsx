import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Hr,
  Preview,
} from "@react-email/components";

/**
 * Template email per il reset della password.
 * @param {Object} props
 * @param {string} props.name - Nome dell'utente
 * @param {string} props.resetUrl - URL del link di reset
 */
export default function PasswordResetEmail({ name = "Utente", resetUrl = "/" }) {
  return (
    <Html lang="it">
      <Head />
      <Preview>Reimposta la tua password.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Reimposta la password 🔐</Heading>
          <Text style={styles.text}>
            Ciao <strong>{name}</strong>, abbiamo ricevuto una richiesta per reimpostare
            la password del tuo account.
          </Text>
          <Text style={styles.text}>
            Clicca il pulsante qui sotto per scegliere una nuova password:
          </Text>
          <Button href={resetUrl} style={styles.button}>
            Reimposta Password
          </Button>
          <Hr style={styles.hr} />
          <Text style={styles.warning}>
            ⚠️ Questo link scade tra <strong>1 ora</strong>.
          </Text>
          <Text style={styles.footer}>
            Se non hai richiesto il reset della password, ignora questa email.
            Il tuo account è al sicuro.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f4f4f5",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "40px",
  },
  heading: {
    fontSize: "24px",
    color: "#111827",
    marginBottom: "16px",
  },
  text: {
    fontSize: "16px",
    color: "#374151",
    lineHeight: "1.6",
  },
  button: {
    backgroundColor: "#ef4444",
    color: "#ffffff",
    padding: "12px 24px",
    borderRadius: "6px",
    textDecoration: "none",
    display: "inline-block",
    marginTop: "16px",
    fontSize: "16px",
  },
  hr: {
    borderColor: "#e5e7eb",
    margin: "32px 0",
  },
  warning: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.5",
  },
  footer: {
    fontSize: "13px",
    color: "#9ca3af",
    marginTop: "8px",
  },
};
