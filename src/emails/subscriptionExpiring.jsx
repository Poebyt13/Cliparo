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
 * Template email per avvisare che il piano scade tra pochi giorni.
 * @param {Object} props
 * @param {string} props.name - Nome dell'utente
 * @param {string} props.plan - Piano attuale ("trial" o "premium")
 * @param {number} props.daysLeft - Giorni rimanenti
 * @param {string} props.renewUrl - URL per rinnovare il piano
 */
export default function SubscriptionExpiringEmail({
  name = "",
  plan = "premium",
  daysLeft = 3,
  renewUrl = "/",
}) {
  const displayName = name || "utente";
  const planLabel = plan === "trial" ? "prova gratuita" : "piano Premium";

  return (
    <Html lang="it">
      <Head />
      <Preview>Il tuo {planLabel} scade tra {daysLeft} giorni</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>
            Il tuo {planLabel} sta per scadere
          </Heading>
          <Text style={styles.text}>
            Ciao <strong>{displayName}</strong>,
          </Text>
          <Text style={styles.text}>
            Il tuo {planLabel} scade tra <strong>{daysLeft} {daysLeft === 1 ? "giorno" : "giorni"}</strong>.
            Al termine perderai l'accesso alle funzionalità avanzate.
          </Text>
          <Text style={styles.text}>
            Rinnova ora per continuare a usare tutte le funzionalità senza interruzioni:
          </Text>
          <Button href={renewUrl} style={styles.button}>
            Rinnova il piano →
          </Button>
          <Hr style={styles.hr} />
          <Text style={styles.footer}>
            Se hai già rinnovato, puoi ignorare questa email.
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
