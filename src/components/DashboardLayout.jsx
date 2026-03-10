"use client";

/**
 * Layout per le pagine di dashboard.
 * Sidebar fissa a sinistra su desktop, collassata su mobile tramite drawer DaisyUI.
 *
 * Props:
 *  - links: array di { label: string, href: string, active?: boolean } — voci della sidebar
 *  - children: contenuto della pagina
 */
export default function DashboardLayout({ links = [], children }) {
  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      {/* Checkbox nascosta per controllo drawer su mobile */}
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* ── Area principale ── */}
      <div className="drawer-content flex flex-col">
        {/* Header mobile con pulsante hamburger */}
        <div className="navbar bg-base-100 shadow-sm lg:hidden px-4">
          <label
            htmlFor="dashboard-drawer"
            className="btn btn-ghost btn-square"
            aria-label="Apri sidebar"
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
          </label>
          <span className="font-semibold text-base-content ml-2">Dashboard</span>
        </div>

        {/* Contenuto pagina con padding uniforme */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* ── Sidebar ── */}
      <div className="drawer-side z-40">
        {/* Overlay scuro su mobile */}
        <label
          htmlFor="dashboard-drawer"
          aria-label="Chiudi sidebar"
          className="drawer-overlay"
        />

        <aside className="bg-base-100 w-64 min-h-full flex flex-col border-r border-base-300">
          {/* Logo / titolo sidebar */}
          <div className="px-6 py-5 border-b border-base-300">
            <a href="/" className="text-xl font-bold text-primary">
              SaaS
            </a>
          </div>

          {/* Voci di navigazione */}
          <nav className="flex-1 px-3 py-4">
            <ul className="menu menu-md gap-1 w-full">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={link.active ? "active" : ""}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
}
