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
  Row,
  Column,
  Section,
} from "@react-email/components";

/**
 * Template email di conferma pagamento abbonamento.
 * @param {Object} props
 * @param {string} props.name - Nome dell'utente
 * @param {string} props.plan - Nome del piano acquistato
 * @param {string} props.amount - Importo pagato (es. "€9.99")
 * @param {string} props.date - Data del pagamento formattata
 * @param {string} props.dashboardUrl - URL della dashboard
 */
export default function PaymentConfirmationEmail({
  name = "Utente",
  plan = "Premium",
  amount = "€9.99",
  date = new Date().toLocaleDateString("it-IT"),
  dashboardUrl = "/dashboard",
}) {
  return (
    <Html lang="it">
      <Head />
      <Preview>Pagamento confermato — Grazie per il tuo abbonamento!</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Pagamento confermato ✅</Heading>
          <Text style={styles.text}>
            Ciao <strong>{name}</strong>, il tuo pagamento è stato elaborato con successo.
          </Text>

          {/* Riepilogo abbonamento */}
          <Section style={styles.receipt}>
            <Row>
              <Column style={styles.receiptLabel}>Piano</Column>
              <Column style={styles.receiptValue}>{plan}</Column>
            </Row>
            <Row>
              <Column style={styles.receiptLabel}>Importo</Column>
              <Column style={styles.receiptValue}>{amount}</Column>
            </Row>
            <Row>
              <Column style={styles.receiptLabel}>Data</Column>
              <Column style={styles.receiptValue}>{date}</Column>
            </Row>
          </Section>

          <Text style={styles.text}>
            Puoi accedere a tutte le funzionalità premium dalla tua dashboard.
          </Text>
          <Button href={dashboardUrl} style={styles.button}>
            Vai alla Dashboard
          </Button>
          <Hr style={styles.hr} />
          <Text style={styles.footer}>
            Per problemi con il pagamento contatta il supporto rispondendo a questa email.
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
  receipt: {
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
    padding: "16px",
    margin: "24px 0",
  },
  receiptLabel: {
    fontSize: "14px",
    color: "#6b7280",
    padding: "6px 0",
    width: "50%",
  },
  receiptValue: {
    fontSize: "14px",
    color: "#111827",
    fontWeight: "bold",
    padding: "6px 0",
    width: "50%",
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
