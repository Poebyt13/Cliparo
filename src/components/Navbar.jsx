"use client";

import Logo from "@/components/Logo";

/**
 * Navbar responsive con logo, link centrali e area destra con CTA e menu utente.
 *
 * Props:
 *  - links: array di { label: string, href: string } — link di navigazione centrali
 *  - cta: { label: string, href: string } — pulsante call-to-action a destra
 *  - userMenu: { label: string, image?: string, onLogout: () => void } | null — menu utente autenticato
 *  - loading: boolean — mostra uno skeleton mentre la sessione viene verificata
 */
export default function Navbar({ links = [], cta, userMenu, loading = false }) {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      {/* Contenitore interno allineato con max-w delle sezioni pagina */}
      <div className="flex w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ── Sinistra: hamburger mobile + logo ── */}
      <div className="navbar-start">
        {/* Menu hamburger mobile */}
        <div className="dropdown">
          <button
            tabIndex={0}
            role="button"
            aria-label="Apri menu"
            className="btn btn-ghost lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Dropdown mobile con i link */}
          {links.length > 0 && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
            >
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Logo */}
        <Logo size="md" />
      </div>

      {/* ── Centro: link di navigazione (solo desktop) ── */}
      <div className="navbar-center hidden lg:flex">
        {links.length > 0 && (
          <ul className="menu menu-horizontal px-1 gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="font-medium">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Destra: CTA e menu utente ── */}
      <div className="navbar-end gap-2">
        {/* Skeleton durante il caricamento della sessione */}
        {loading && <div className="skeleton h-8 w-20 rounded-lg"></div>}

        {/* Pulsante CTA */}
        {!loading && cta && (
          <a href={cta.href} className="btn btn-primary btn-sm">
            {cta.label}
          </a>
        )}

        {/* Menu utente autenticato */}
        {!loading && userMenu && (
          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar placeholder"
            >
              {userMenu.image ? (
                <div className="w-9 h-9 rounded-full overflow-hidden">
                  <img src={userMenu.image} alt={userMenu.label} />
                </div>
              ) : (
                <div className="bg-neutral text-neutral-content w-9 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold">
                    {userMenu.label?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </button>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-48 p-2 shadow"
            >
              <li className="menu-title">
                <span className="text-xs text-base-content/60 truncate">
                  {userMenu.label}
                </span>
              </li>
              {/* Link extra (es. Dashboard) passati tramite userMenu.links */}
              {userMenu.links?.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="font-medium">{link.label}</a>
                </li>
              ))}
              <li>
                <button
                  onClick={userMenu.onLogout}
                  className="text-error font-medium w-full text-left"
                >
                  Esci
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
