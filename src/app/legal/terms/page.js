import Logo from "@/components/Logo";
import siteConfig from "@/config/site";

export const metadata = {
  title: "Termini di Servizio",
};

/**
 * Pagina Termini di Servizio.
 * Percorso: /legal/terms
 *
 * Template base con sezioni standard. Personalizzare i contenuti
 * con i dati reali del proprio servizio prima di andare in produzione.
 */
export default function TermsPage() {
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
            Termini di Servizio
          </h1>
          <p className="mt-2 text-sm text-base-content/50">
            Ultimo aggiornamento: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Contenuto */}
      <article className="mx-auto max-w-3xl px-4 py-12 prose prose-base">
        <h2>1. Accettazione dei termini</h2>
        <p>
          Utilizzando {siteName}, accetti di essere vincolato dai presenti
          Termini di Servizio. Se non accetti questi termini, non utilizzare il
          servizio.
        </p>

        <h2>2. Descrizione del servizio</h2>
        <p>
          {siteName} fornisce una piattaforma SaaS accessibile tramite browser.
          Ci riserviamo il diritto di modificare, sospendere o interrompere il
          servizio in qualsiasi momento.
        </p>

        <h2>3. Account utente</h2>
        <p>
          Sei responsabile della sicurezza del tuo account e di tutte le
          attività che avvengono tramite esso. Devi fornire informazioni
          accurate e mantenerle aggiornate.
        </p>

        <h2>4. Pagamenti e abbonamenti</h2>
        <p>
          I pagamenti sono gestiti tramite Stripe. Gli abbonamenti si rinnovano
          automaticamente alla scadenza. Puoi cancellare in qualsiasi momento
          dal portale di gestione, ma il servizio rimarrà attivo fino alla fine
          del periodo già pagato.
        </p>
        <p>
          Non sono previsti rimborsi per periodi parziali, salvo dove richiesto
          dalla legge applicabile.
        </p>

        <h2>5. Uso consentito</h2>
        <p>Ti impegni a non:</p>
        <ul>
          <li>Violare leggi o regolamenti applicabili</li>
          <li>Interferire con il funzionamento del servizio</li>
          <li>Tentare di accedere a dati di altri utenti</li>
          <li>Utilizzare il servizio per attività illegali o non autorizzate</li>
        </ul>

        <h2>6. Proprietà intellettuale</h2>
        <p>
          Tutti i contenuti, il design e il codice di {siteName} sono di nostra
          proprietà o concessi in licenza. Non è consentita la riproduzione
          senza autorizzazione.
        </p>

        <h2>7. Limitazione di responsabilità</h2>
        <p>
          Il servizio è fornito &quot;così com&apos;è&quot;. Non garantiamo che
          sia privo di errori o interruzioni. In nessun caso saremo
          responsabili per danni indiretti, incidentali o consequenziali.
        </p>

        <h2>8. Modifiche ai termini</h2>
        <p>
          Ci riserviamo il diritto di modificare questi termini. Le modifiche
          saranno comunicate tramite il sito. L&apos;uso continuato del servizio
          dopo la modifica costituisce accettazione dei nuovi termini.
        </p>

        <h2>9. Contatti</h2>
        <p>
          Per domande su questi termini, scrivi a{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </article>
    </div>
  );
}
