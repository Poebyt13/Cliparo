"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

/**
 * Mappa delle icone SVG disponibili per il menu della sidebar.
 * Per aggiungere una nuova icona: inserisci una nuova chiave con il JSX dell'SVG.
 */
const iconMap = {
  home: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
    </svg>
  ),
  user: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  "user-circle": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0zm6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  "credit-card": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  settings: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  bell: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0" />
    </svg>
  ),
  chart: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  logout: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  book: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
};

/**
 * Renderizza l'icona SVG corrispondente al nome.
 * Ritorna null se il nome non esiste nella mappa.
 */
function SidebarIcon({ name }) {
  if (!name || !iconMap[name]) return null;
  return iconMap[name];
}

/**
 * Badge opzionale accanto al label dell'item.
 */
function ItemBadge({ value }) {
  if (!value) return null;
  return (
    <span className="badge badge-sm badge-neutral ml-auto">{value}</span>
  );
}

/**
 * Singolo item del menu sidebar.
 * Evidenzia come "active" se il pathname corrente corrisponde all'href.
 * Se external === true usa un tag <a> con target="_blank", altrimenti usa Link di Next.js.
 * Se disabled === true renderizza uno <span> non cliccabile.
 */
function SidebarItem({ item, pathname }) {
  const isActive = pathname === item.href;

  const content = (
    <>
      <SidebarIcon name={item.icon} />
      {item.label}
      <ItemBadge value={item.badge} />
    </>
  );

  // Item disabilitato: non cliccabile
  if (item.disabled) {
    return (
      <li>
        <span className="opacity-50 cursor-not-allowed">
          {content}
        </span>
      </li>
    );
  }

  return (
    <li>
      {item.external ? (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={isActive ? "active" : ""}
        >
          {content}
        </a>
      ) : (
        <Link
          href={item.href}
          className={isActive ? "active" : ""}
        >
          {content}
        </Link>
      )}
    </li>
  );
}

/**
 * Gruppo di item con label e icona, renderizzato come sottomenu DaisyUI.
 */
function SidebarGroup({ group, pathname }) {
  return (
    <li>
      <details open>
        <summary>
          <SidebarIcon name={group.icon} />
          {group.label}
        </summary>
        <ul>
          {group.items.map((item) => (
            <SidebarItem key={item.href} item={item} pathname={pathname} />
          ))}
        </ul>
      </details>
    </li>
  );
}

/**
 * Sidebar della dashboard.
 * Riceve la configurazione del menu tramite props.
 * Supporta item singoli e gruppi di item.
 *
 * Props:
 *  - menu: array di oggetti { type: "item" | "group", ... }
 */
export default function Sidebar({ menu = [] }) {
  const pathname = usePathname();

  return (
    <aside className="bg-base-100 w-64 min-h-full flex flex-col border-r border-base-300">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-base-300">
        <Logo size="md" />
      </div>

      {/* Voci di navigazione */}
      <nav className="flex-1 px-3 py-4">
        <ul className="menu menu-md gap-1 w-full">
          {menu.map((entry, index) => {
            if (entry.type === "group") {
              return (
                <SidebarGroup
                  key={entry.label || index}
                  group={entry}
                  pathname={pathname}
                />
              );
            }
            // Default: item singolo
            return (
              <SidebarItem
                key={entry.href || index}
                item={entry}
                pathname={pathname}
              />
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
