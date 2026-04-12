"use client";

import Logo from "@/components/Logo";

/**
 * Navbar floating pill — design da landing page.
 *
 * Props:
 *  - links: array di { label: string, href: string }
 *  - cta: { label: string, href: string } | null
 *  - userMenu: { label: string, image?: string, onLogout: () => void, links?: [] } | null
 *  - loading: boolean
 */
export default function Navbar({ links = [], cta, userMenu, loading = false }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pb-2 pointer-events-none">
      <nav className="pointer-events-auto max-w-3xl mx-auto flex items-center justify-between gap-4 rounded-full border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl px-5 py-2.5 shadow-lg shadow-black/10 ring-1 ring-inset ring-white/[0.05]">

        {/* ── Sinistra: Logo ── */}
        <Logo size="md" />

        {/* ── Centro: link desktop ── */}
        {links.length > 0 && (
          <ul className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="px-3 py-1.5 text-sm font-medium text-base-content/70 hover:text-base-content transition-colors rounded-full hover:bg-base-200/60"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* ── Destra: login + CTA + avatar ── */}
        <div className="flex items-center gap-2">
          {loading && <div className="skeleton h-8 w-20 rounded-full" />}

          {/* Log in link per utenti non autenticati */}
          {!loading && !userMenu && (
            <a
              href="/auth/signin"
              className="hidden sm:block px-3 py-1.5 text-sm font-medium text-base-content/70 hover:text-base-content transition-colors"
            >
              Log in
            </a>
          )}

          {/* CTA button */}
          {!loading && cta && (
            <a
              href={cta.href}
              className="btn btn-primary btn-sm rounded-full px-4 text-sm"
            >
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
                    <img src={userMenu.image} alt={userMenu.label} referrerPolicy="no-referrer" />
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
                  <span className="text-xs text-base-content/60 truncate">{userMenu.label}</span>
                </li>
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

          {/* Mobile hamburger */}
          {links.length > 0 && (
            <div className="dropdown dropdown-end lg:hidden">
              <button
                tabIndex={0}
                role="button"
                aria-label="Apri menu"
                className="btn btn-ghost btn-sm btn-circle"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow border border-base-300/40"
              >
                {links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
  
