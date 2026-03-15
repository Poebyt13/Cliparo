import Logo from "@/components/Logo";
import siteConfig from "@/config/site";

export const metadata = {
  title: "Privacy Policy",
};

/**
 * Pagina Privacy Policy.
 * Percorso: /legal/privacy
 *
 * Template base con sezioni GDPR standard. Personalizzare i contenuti
 * con i dati reali del proprio servizio prima di andare in produzione.
 */
export default function PrivacyPage() {
  const lastUpdated = "15 marzo 2026";
  const siteName = siteConfig.name;
  const contactEmail = "hello@example.com";

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-base-200 border-b border-base-300 py-12">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Logo />
          <h1 className="mt-6 text-3xl font-bold text-base-content">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-base-content/50">
            Ultimo aggiornamento: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Contenuto */}
      <article className="mx-auto max-w-3xl px-4 py-12 prose prose-base">
        <h2>1. Titolare del trattamento</h2>
        <p>
          Il titolare del trattamento dei dati personali è {siteName}. Per
          contattarci: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>

        <h2>2. Dati raccolti</h2>
        <p>Raccogliamo i seguenti dati:</p>
        <ul>
          <li>
            <strong>Dati di registrazione:</strong> nome, indirizzo email,
            immagine profilo (se fornita tramite Google OAuth)
          </li>
          <li>
            <strong>Dati di pagamento:</strong> gestiti interamente da Stripe.
            Non memorizziamo numeri di carta di credito.
          </li>
          <li>
            <strong>Dati tecnici:</strong> indirizzo IP, tipo di browser, pagine
            visitate (solo per sicurezza e rate limiting)
          </li>
        </ul>

        <h2>3. Base giuridica</h2>
        <p>Trattiamo i dati sulla base di:</p>
        <ul>
          <li>Esecuzione del contratto (fornitura del servizio)</li>
          <li>Consenso (email marketing, se attivato)</li>
          <li>Interesse legittimo (sicurezza, prevenzione abusi)</li>
        </ul>

        <h2>4. Finalità del trattamento</h2>
        <ul>
          <li>Fornitura e gestione del servizio</li>
          <li>Gestione degli abbonamenti e dei pagamenti</li>
          <li>Invio di email transazionali (conferma pagamento, scadenza piano)</li>
          <li>Invio di email promozionali (solo con consenso esplicito)</li>
          <li>Sicurezza e prevenzione di accessi non autorizzati</li>
        </ul>

        <h2>5. Condivisione dei dati</h2>
        <p>I dati possono essere condivisi con:</p>
        <ul>
          <li>
            <strong>Stripe:</strong> per la gestione dei pagamenti
          </li>
          <li>
            <strong>Resend:</strong> per l&apos;invio di email transazionali
          </li>
          <li>
            <strong>MongoDB Atlas:</strong> per l&apos;archiviazione dei dati
          </li>
          <li>
            <strong>Vercel:</strong> per l&apos;hosting del servizio
          </li>
        </ul>
        <p>Non vendiamo i tuoi dati a terze parti.</p>

        <h2>6. Cookie</h2>
        <p>
          Utilizziamo solo cookie tecnici necessari per il funzionamento
          dell&apos;autenticazione (session cookie httpOnly). Non utilizziamo
          cookie di profilazione o di terze parti.
        </p>

        <h2>7. Conservazione dei dati</h2>
        <p>
          I dati vengono conservati per la durata del tuo account. Puoi
          richiedere la cancellazione completa del tuo account e di tutti i dati
          associati dalla pagina Impostazioni.
        </p>

        <h2>8. Diritti dell&apos;utente (GDPR)</h2>
        <p>Hai diritto a:</p>
        <ul>
          <li>Accedere ai tuoi dati personali</li>
          <li>Rettificare dati inesatti</li>
          <li>Cancellare il tuo account e tutti i dati (diritto all&apos;oblio)</li>
          <li>Limitare o opporti al trattamento</li>
          <li>Portabilità dei dati</li>
          <li>Revocare il consenso in qualsiasi momento</li>
        </ul>
        <p>
          Per esercitare questi diritti, scrivi a{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>

        <h2>9. Sicurezza</h2>
        <p>
          Adottiamo misure tecniche e organizzative per proteggere i tuoi dati:
          connessioni HTTPS, cookie httpOnly e Secure, rate limiting, hashing
          dei dati sensibili.
        </p>

        <h2>10. Modifiche</h2>
        <p>
          Ci riserviamo il diritto di aggiornare questa policy. Le modifiche
          saranno pubblicate su questa pagina con la data di aggiornamento.
        </p>
      </article>
    </div>
  );
}
