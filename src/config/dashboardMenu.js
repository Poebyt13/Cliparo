/**
 * Configurazione del menu della sidebar dashboard.
 *
 * Due tipi di voci:
 *  - type: "item"  → link singolo
 *  - type: "group" → gruppo di link con label e icona
 *
 * Icone: nome stringa da mappare nel componente Sidebar.
 * Icone disponibili: home, user, user-circle, credit-card, settings, bell, chart, logout
 */
const dashboardMenu = [
  {
    type: "item",
    label: "Dashboard",
    href: "/dashboard",
    icon: "home",
  },
  {
    type: "group",
    label: "Account",
    icon: "user",
    items: [
      {
        type: "item",
        label: "Profilo",
        href: "/dashboard/profile",
        icon: "user-circle",
      },
      {
        type: "item",
        label: "Abbonamento",
        href: "/dashboard/billing",
        icon: "credit-card",
      },
    ],
  },
  {
    type: "item",
    label: "Impostazioni",
    href: "/dashboard/settings",
    icon: "settings",
  },
  { 
    type: "item",
    label: "Changelog",
    href: "/dashboard/changelog",
    icon: "bell",
    disabled: true, 
    badge: "soon"
  },
  {
    type: "item",
    label: "Documentazione",
    href: "https://example.com/docs",
    icon: "book",
    external: true,
  },
  // Voce admin — visibile solo se l'email utente === NEXT_PUBLIC_ADMIN_EMAIL
  {
    type: "item",
    label: "Admin",
    href: "/dashboard/admin",
    icon: "shield",
    adminOnly: true,
  },
];

export default dashboardMenu;
