import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Hr,
  Preview,
} from "@react-email/components";

/**
 * Template email di conferma cancellazione account.
 * Inviata dopo che l'utente ha eliminato il proprio account.
 * @param {Object} props
 * @param {string} props.name - Nome dell'utente
 * @param {string} props.email - Email dell'utente
 */
export default function AccountDeletedEmail({
  name = "",
  email = "",
}) {
  const displayName = name || "utente";

  return (
    <Html lang="it">
      <Head />
      <Preview>Il tuo account è stato eliminato</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>
            Account eliminato
          </Heading>
          <Text style={styles.text}>
            Ciao <strong>{displayName}</strong>,
          </Text>
          <Text style={styles.text}>
            Confermiamo che il tuo account associato a{" "}
            <strong>{email}</strong> è stato eliminato con successo.
          </Text>
          <Text style={styles.text}>
            Tutti i tuoi dati personali sono stati rimossi dai nostri sistemi.
          </Text>
          <Hr style={styles.hr} />
          <Text style={styles.text}>
            Se non hai richiesto tu questa operazione, contattaci immediatamente
            rispondendo a questa email.
          </Text>
          <Text style={styles.footer}>
            Ci dispiace vederti andare. Speriamo di rivederti presto!
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f5f5f5",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  container: {
    maxWidth: "480px",
    margin: "0 auto",
    padding: "40px 20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
  },
  heading: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "16px",
  },
  text: {
    fontSize: "15px",
    lineHeight: "24px",
    color: "#333333",
  },
  hr: {
    borderColor: "#e5e5e5",
    margin: "24px 0",
  },
  footer: {
    fontSize: "13px",
    lineHeight: "20px",
    color: "#888888",
  },
};
