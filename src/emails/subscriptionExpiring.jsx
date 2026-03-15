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
 * Template email per avvisare che il piano scade o si rinnova tra pochi giorni.
 * @param {Object} props
 * @param {string} props.name - Nome dell'utente
 * @param {string} props.plan - Piano attuale ("trial" o "premium")
 * @param {number} props.daysLeft - Giorni rimanenti
 * @param {string} props.renewUrl - URL pricing (per trial senza carta)
 * @param {string} props.manageUrl - URL dashboard/billing (Stripe portal)
 * @param {boolean} props.cancelAtPeriodEnd - true = già cancellato, sta per scadere
 */
export default function SubscriptionExpiringEmail({
  name = "",
  plan = "premium",
  daysLeft = 3,
  renewUrl = "/",
  manageUrl = "/dashboard/billing",
  cancelAtPeriodEnd = false,
}) {
  const displayName = name || "utente";
  const planLabel = plan === "trial" ? "prova gratuita" : "piano Premium";
  const daysText = `${daysLeft} ${daysLeft === 1 ? "giorno" : "giorni"}`;

  // Scenario A: abbonamento già cancellato, sta per scadere definitivamente
  if (cancelAtPeriodEnd) {
    return (
      <Html lang="it">
        <Head />
        <Preview>Il tuo {planLabel} scade tra {daysText}</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.heading}>
              Il tuo {planLabel} scade tra {daysText}
            </Heading>
            <Text style={styles.text}>
              Ciao <strong>{displayName}</strong>,
            </Text>
            <Text style={styles.text}>
              Hai cancellato il tuo {planLabel} e il servizio terminerà tra{" "}
              <strong>{daysText}</strong>. Dopo questa data perderai l&apos;accesso
              alle funzionalità avanzate.
            </Text>
            <Text style={styles.text}>
              Se hai cambiato idea, puoi <strong>riattivare l&apos;abbonamento</strong>{" "}
              prima della scadenza senza perdere il periodo già pagato:
            </Text>
            <Button href={manageUrl} style={styles.button}>
              Riattiva l&apos;abbonamento →
            </Button>
            <Hr style={styles.hr} />
            <Text style={styles.footer}>
              Se vuoi comunque cancellare, non devi fare nulla: il piano scadrà automaticamente.
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  // Scenario B: abbonamento attivo, si rinnova automaticamente
  return (
    <Html lang="it">
      <Head />
      <Preview>Il tuo {planLabel} si rinnova tra {daysText}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>
            Il tuo {planLabel} si rinnova presto
          </Heading>
          <Text style={styles.text}>
            Ciao <strong>{displayName}</strong>,
          </Text>
          <Text style={styles.text}>
            Ti ricordiamo che il tuo {planLabel} si rinnoverà automaticamente
            tra <strong>{daysText}</strong>. Non devi fare nulla — l&apos;accesso
            continuerà senza interruzioni.
          </Text>
          <Text style={styles.text}>
            Se desideri modificare o cancellare l&apos;abbonamento, puoi farlo dal pannello:
          </Text>
          <Button href={manageUrl} style={styles.button}>
            Gestisci abbonamento →
          </Button>
          <Hr style={styles.hr} />
          <Text style={styles.footer}>
            Se non hai richiesto modifiche, puoi ignorare questa email.
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
