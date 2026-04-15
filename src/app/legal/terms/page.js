import Logo from "@/components/Logo";
import siteConfig from "@/config/site";

export const metadata = {
  title: "Terms of Service",
};

/**
 * Pagina Termini di Servizio.
 * Percorso: /legal/terms
 */
export default function TermsPage() {
  const lastUpdated = "April 2026";
  const siteName = siteConfig.name;
  const contactEmail = "ludenajluis@gmail.com";

  const sections = [
    {
      title: "Acceptance of Terms",
      content: (
        <p>By using this service, you agree to these Terms of Service.</p>
      ),
    },
    {
      title: "Description of Service",
      content: (
        <p>
          We provide an AI-powered platform that transforms long-form videos
          into short-form viral clips optimized for platforms such as TikTok,
          Instagram Reels, and YouTube Shorts.
        </p>
      ),
    },
    {
      title: "User Responsibilities",
      content: (
        <>
          <p>You agree not to:</p>
          <ul>
            <li>Upload illegal content</li>
            <li>Upload content you do not own or have rights to</li>
            <li>Use the service for harmful or abusive purposes</li>
          </ul>
        </>
      ),
    },
    {
      title: "Content Ownership",
      content: (
        <>
          <p>You retain full ownership of your uploaded content.</p>
          <p>
            We only process your content to provide AI-generated outputs.
          </p>
        </>
      ),
    },
    {
      title: "Service Availability",
      content: (
        <>
          <p>We do not guarantee uninterrupted or error-free service.</p>
          <p>
            The service may be modified, suspended, or discontinued at any
            time.
          </p>
        </>
      ),
    },
    {
      title: "Limitation of Liability",
      content: (
        <>
          <p>We are not responsible for:</p>
          <ul>
            <li>Any loss of data</li>
            <li>Any damages resulting from use of the service</li>
            <li>Any business losses or indirect damages</li>
          </ul>
          <p>
            The service is provided &quot;as is&quot; without warranties of any
            kind.
          </p>
        </>
      ),
    },
    {
      title: "Payments (if applicable)",
      content: (
        <>
          <p>Paid features may be introduced in the future.</p>
          <p>All pricing will be clearly communicated.</p>
        </>
      ),
    },
    {
      title: "Termination",
      content: (
        <p>
          We reserve the right to suspend or terminate accounts that violate
          these terms.
        </p>
      ),
    },
    {
      title: "Changes to Terms",
      content: <p>We may update these Terms at any time.</p>,
    },
    {
      title: "Contact",
      content: (
        <p>
          For support or questions:{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="text-primary hover:underline font-medium"
          >
            {contactEmail}
          </a>
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-base-200/40">
      {/* Header */}
      <div className="bg-base-100 border-b border-base-300">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <Logo />
          <h1 className="mt-8 text-4xl font-bold tracking-tight text-base-content">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-base-content/50">
            Last updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="mx-auto max-w-3xl px-4 py-12 space-y-4">
        {sections.map((section, index) => (
          <div
            key={section.title}
            className="bg-base-100 border border-base-300 rounded-2xl px-8 py-7 shadow-sm"
          >
            {/* Numero + titolo sezione */}
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                {index + 1}
              </span>
              <h2 className="text-lg font-semibold text-base-content">
                {section.title}
              </h2>
            </div>

            {/* Corpo della sezione */}
            <div className="text-base-content/75 leading-relaxed text-[0.95rem] space-y-3 [&_ul]:mt-2 [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:marker:text-primary/60">
              {section.content}
            </div>
          </div>
        ))}

        {/* Footer note */}
        <p className="text-center text-xs text-base-content/40 pt-4 pb-2">
          {siteName} · Terms of Service · {lastUpdated}
        </p>
      </div>
    </div>
  );
}
