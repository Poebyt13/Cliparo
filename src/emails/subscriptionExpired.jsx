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
 * Template email per notificare che il piano è scaduto.
 * @param {Object} props
 * @param {string} props.name - Nome dell'utente
 * @param {string} props.plan - Piano scaduto ("trial" o "premium")
 * @param {string} props.renewUrl - URL per rinnovare
 */
export default function SubscriptionExpiredEmail({
  name = "",
  plan = "premium",
  renewUrl = "/",
}) {
  const displayName = name || "utente";
  const planLabel = plan === "trial" ? "prova gratuita" : "piano Premium";

  return (
    <Html lang="it">
      <Head />
      <Preview>Il tuo {planLabel} è scaduto</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>
            Il tuo {planLabel} è scaduto
          </Heading>
          <Text style={styles.text}>
            Ciao <strong>{displayName}</strong>,
          </Text>
          <Text style={styles.text}>
            Il tuo {planLabel} è scaduto. Il tuo account è stato convertito al piano gratuito.
          </Text>
          <Text style={styles.text}>
            I tuoi dati sono al sicuro e saranno disponibili non appena riattiverai il piano.
            Nessun dato è stato cancellato.
          </Text>
          <Button href={renewUrl} style={styles.button}>
            Riattiva il piano →
          </Button>
          <Hr style={styles.hr} />
          <Text style={styles.footer}>
            Se hai domande, rispondi a questa email.
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
