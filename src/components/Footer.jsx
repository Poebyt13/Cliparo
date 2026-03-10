/**
 * Footer con 4 colonne: brand, link, legal, altro.
 * Struttura ispirata al layout classico SaaS con copyright e creator note.
 */

import Image from "next/image";
import Me from '@/assets/me.jpg';

// Colonne di link del footer — modificare per personalizzare
const FOOTER_LINKS = {
  links: [
    { label: "Supporto", href: "mailto:hello@example.com" },
    { label: "Prezzi", href: "/#pricing" },
    { label: "Affiliati", href: "/affiliates" },
  ],
  legal: [
    { label: "Termini di servizio", href: "/legal/terms" },
    { label: "Privacy policy", href: "/legal/privacy" },
  ],
  more: [
    { label: "Newsletter", href: "/newsletter" },
    { label: "Changelog", href: "/changelog" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Blog", href: "/blog" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-base-200 border-t border-base-300">
      {/* Contenitore principale allineato con il resto della pagina */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14">
        {/* ── Griglia 4 colonne ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Colonna 1: Brand */}
          <div className="flex flex-col gap-4">
            <a href="/" className="text-xl font-bold text-primary">
              SaaS
            </a>
            <p className="text-sm text-base-content/60 leading-relaxed max-w-xs">
              Boilerplate completo per lanciare il tuo SaaS. Auth, pagamenti ed email già configurati.
              Nessun lavoro manuale. Nessun mal di testa.
            </p>
            <p className="text-xs text-base-content/40">
              Copyright © {new Date().getFullYear()} — Tutti i diritti riservati
            </p>
          </div>

          {/* Colonna 2: Link */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-base-content/50 mb-4">
              Link
            </h3>
            <ul className="flex flex-col gap-2">
              {FOOTER_LINKS.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-base-content/70 hover:text-base-content transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonna 3: Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-base-content/50 mb-4">
              Legal
            </h3>
            <ul className="flex flex-col gap-2">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-base-content/70 hover:text-base-content transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonna 4: Altro */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-base-content/50 mb-4">
              Altro
            </h3>
            <ul className="flex flex-col gap-2">
              {FOOTER_LINKS.more.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-base-content/70 hover:text-base-content transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Striscia inferiore: nota creator ── */}
        <div className="mt-12 pt-6 border-t border-base-300 flex items-center gap-3">
          <div className="avatar placeholder">
            <Image src={Me} alt="Creator" className="w-10 h-10 rounded-full" />
          </div>
          <p className="text-sm text-base-content/60">
            Hey 👋 Sono il creatore di questo boilerplate. Seguimi su{" "}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline text-base-content/80 hover:text-base-content transition-colors"
            >
              Twitter.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
