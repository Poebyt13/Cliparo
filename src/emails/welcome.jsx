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
 * Template email di benvenuto per i nuovi utenti registrati.
 * @param {Object} props
 * @param {string} props.name - Nome dell'utente
 * @param {string} props.dashboardUrl - URL della dashboard
 */
export default function WelcomeEmail({ name = "Utente", dashboardUrl = "/" }) {
  return (
    <Html lang="it">
      <Head />
      <Preview>Benvenuto! Il tuo account è pronto.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Benvenuto, {name}! 👋</Heading>
          <Text style={styles.text}>
            Il tuo account è stato creato con successo. Siamo felici di averti con noi.
          </Text>
          <Text style={styles.text}>
            Puoi accedere alla tua dashboard e iniziare a esplorare tutte le funzionalità disponibili.
          </Text>
          <Button href={dashboardUrl} style={styles.button}>
            Vai alla Dashboard
          </Button>
          <Hr style={styles.hr} />
          <Text style={styles.footer}>
            Hai domande? Rispondi a questa email, siamo qui per aiutarti.
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
  footer: {
    fontSize: "13px",
    color: "#9ca3af",
  },
};
