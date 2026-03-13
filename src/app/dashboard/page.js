"use client";

import { useSession } from "next-auth/react";

/**
 * Pagina dashboard: il middleware in src/middleware.js garantisce
 * che solo gli utenti autenticati raggiungano questa route.
 */
export default function DashboardPage() {
  const { data: session, status } = useSession();

  // Schermata di caricamento mentre la sessione viene idratata lato client
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-600">{session?.user?.email}</p>
    </div>
  );
}
