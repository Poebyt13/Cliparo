"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import { formatDate } from "@/utils/formatDate";

/**
 * Pagina admin — statistiche utenti e lista utenti.
 * Protetta dal layout admin (server-side guard).
 */
export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Carica statistiche
  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  // Carica lista utenti con paginazione
  useEffect(() => {
    let cancelled = false;
    async function loadUsers() {
      try {
        const res = await fetch(`/api/admin/users?page=${page}&limit=20`);
        const data = await res.json();
        if (!cancelled) {
          setUsers(data.users || []);
          setTotalPages(data.totalPages || 1);
        }
      } catch {
        // Silenzioso
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    setLoading(true);
    loadUsers();
    return () => { cancelled = true; };
  }, [page]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-base-content">Admin Panel</h1>
        <p className="text-base-content/60 mt-1">
          Panoramica utenti e stato del progetto.
        </p>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Totale utenti"
          value={stats?.totalUsers}
          icon="👥"
        />
        <StatCard
          label="Free"
          value={stats?.freeUsers}
          icon="🆓"
        />
        <StatCard
          label="Premium"
          value={stats?.premiumUsers}
          icon="⭐"
        />
        <StatCard
          label="Trial"
          value={stats?.trialUsers}
          icon="⏳"
        />
      </div>

      {/* Lista utenti */}
      <Card>
        <h2 className="font-semibold text-base-content mb-4">Utenti</h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-base-content/60 text-center py-8">Nessun utente trovato.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Utente</th>
                    <th>Email</th>
                    <th>Piano</th>
                    <th>Scadenza</th>
                    <th>Registrazione</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="flex items-center gap-2">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt=""
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center text-xs font-bold text-base-content/50">
                              {(user.name || user.email || "?")[0].toUpperCase()}
                            </div>
                          )}
                          <span className="font-medium text-base-content">
                            {user.name || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="text-base-content/70">{user.email}</td>
                      <td>
                        <PlanBadge status={user.subscriptionStatus} />
                      </td>
                      <td className="text-base-content/60 text-sm">
                        {user.subscriptionEnd
                          ? formatDate(user.subscriptionEnd)
                          : "—"}
                      </td>
                      <td className="text-base-content/60 text-sm">
                        {user.createdAt
                          ? formatDate(user.createdAt)
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginazione */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <button
                  className="btn btn-sm btn-ghost"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Precedente
                </button>
                <span className="btn btn-sm btn-ghost no-animation">
                  {page} / {totalPages}
                </span>
                <button
                  className="btn btn-sm btn-ghost"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Successiva →
                </button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

/**
 * Card statistica con icona, valore e label.
 */
function StatCard({ label, value, icon }) {
  return (
    <Card className="text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-3xl font-bold text-base-content">
        {value !== undefined && value !== null ? value : (
          <span className="loading loading-spinner loading-sm" />
        )}
      </div>
      <div className="text-sm text-base-content/60 mt-1">{label}</div>
    </Card>
  );
}

/**
 * Badge colorato per lo stato del piano.
 */
function PlanBadge({ status }) {
  const config = {
    premium: { className: "badge-primary", label: "Premium" },
    trial: { className: "badge-warning", label: "Trial" },
    free: { className: "badge-ghost", label: "Free" },
  };

  const { className, label } = config[status] || config.free;

  return <span className={`badge badge-sm ${className}`}>{label}</span>;
}
