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
 * Template email magic link per il login senza password.
 * @param {Object} props
 * @param {string} props.loginUrl - URL del magic link
 * @param {string} props.email - Email del destinatario
 */
export default function LoginEmail({ loginUrl = "/", email = "" }) {
  return (
    <Html lang="it">
      <Head />
      <Preview>Il tuo link di accesso è pronto.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Accedi al tuo account</Heading>
          <Text style={styles.text}>
            Hai richiesto un link di accesso per <strong>{email}</strong>.
            Clicca il pulsante qui sotto per accedere istantaneamente:
          </Text>
          <Button href={loginUrl} style={styles.button}>
            Accedi con Magic Link
          </Button>
          <Hr style={styles.hr} />
          <Text style={styles.warning}>
            ⚠️ Questo link scade tra <strong>24 ore</strong> e può essere usato una sola volta.
          </Text>
          <Text style={styles.footer}>
            Se non hai richiesto questo link, puoi ignorare questa email in modo sicuro.
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
    backgroundColor: "#3b82f6",
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
