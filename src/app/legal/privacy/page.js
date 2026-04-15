import Logo from "@/components/Logo";
import siteConfig from "@/config/site";

export const metadata = {
  title: "Privacy Policy",
};

/**
 * Pagina Privacy Policy.
 * Percorso: /legal/privacy
 */
export default function PrivacyPage() {
  const lastUpdated = "April 2026";
  const siteName = siteConfig.name;
  const contactEmail = "ludenajluis@gmail.com";

  const sections = [
    {
      title: "Introduction",
      content: (
        <>
          <p>
            This Privacy Policy explains how we collect, use, and protect your
            information when you use our service.
          </p>
          <p>By using this website, you agree to this Privacy Policy.</p>
        </>
      ),
    },
    {
      title: "Information We Collect",
      content: (
        <>
          <p>We may collect the following types of information:</p>
          <ul>
            <li>
              Email address (when you join the waitlist or create an account)
            </li>
            <li>Usage data (such as interactions with the platform)</li>
            <li>
              Uploaded content (videos or media you provide for processing)
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "How We Use Your Information",
      content: (
        <>
          <p>We use collected information to:</p>
          <ul>
            <li>Provide and improve our AI video clipping service</li>
            <li>Send important updates about the product</li>
            <li>Improve user experience and performance</li>
            <li>Respond to support requests</li>
          </ul>
        </>
      ),
    },
    {
      title: "Uploaded Content",
      content: (
        <>
          <p>You retain full ownership of your uploaded videos.</p>
          <p>We do not claim ownership of your content.</p>
          <p>
            We only process your content to generate AI clips and improve
            functionality.
          </p>
          <p>We do not sell or share your content with third parties.</p>
        </>
      ),
    },
    {
      title: "Data Storage",
      content: (
        <>
          <p>
            We store your data securely using industry-standard practices.
          </p>
          <p>
            We retain data only as long as necessary to provide the service.
          </p>
        </>
      ),
    },
    {
      title: "Third-Party Services",
      content: (
        <>
          <p>We may use third-party providers for:</p>
          <ul>
            <li>Hosting</li>
            <li>Analytics</li>
            <li>AI processing</li>
          </ul>
          <p>These providers only process data on our behalf.</p>
        </>
      ),
    },
    {
      title: "Data Security",
      content: (
        <p>
          We take reasonable measures to protect your data but cannot guarantee
          absolute security.
        </p>
      ),
    },
    {
      title: "Your Rights",
      content: (
        <>
          <p>You may request:</p>
          <ul>
            <li>Access to your data</li>
            <li>Deletion of your data</li>
            <li>Correction of your information</li>
          </ul>
        </>
      ),
    },
    {
      title: "Changes",
      content: (
        <p>We may update this Privacy Policy at any time.</p>
      ),
    },
    {
      title: "Contact",
      content: (
        <p>
          If you have questions, contact us at:{" "}
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
            Privacy Policy
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
          {siteName} · Privacy Policy · {lastUpdated}
        </p>
      </div>
    </div>
  );
}
