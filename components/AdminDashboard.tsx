"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminTable } from "@/components/AdminTable";
import { MENSAJES } from "@/lib/constants";
import type { QuorumStats } from "@/lib/quorum";
import type { Estudiante } from "@/lib/supabase";

function exportToCsv(students: Estudiante[]) {
  const headers = ["Nombre", "Email", "Teléfono", "Compromiso", "Fecha de registro"];
  const rows = students.map((s) => [
    s.nombre,
    s.email,
    s.telefono,
    s.compromiso ? "Sí" : "No",
    new Date(s.created_at).toISOString(),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `inscritos-quorum-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function AdminDashboard() {
  const router = useRouter();
  const [students, setStudents] = useState<Estudiante[]>([]);
  const [stats, setStats] = useState<QuorumStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/students");
      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!response.ok) {
        throw new Error("Error al cargar datos");
      }
      const data = await response.json();
      setStudents(data.students);
      setStats(data.stats);
      setError(null);
    } catch {
      setError("No se pudieron cargar los inscritos");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function handleDelete(id: string) {
    const response = await fetch(`/api/admin/students?id=${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar");
    }
    await fetchData();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-light">
        <p className="text-gray-muted">Cargando panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-light">
      <header className="border-b border-gray-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-lg font-bold text-gray-dark">Panel Administrativo</h1>
            <p className="text-sm text-gray-muted">Quórum Comercio Electrónico</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-gray-muted transition hover:text-infotep"
            >
              Ver landing
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-gray-border px-3 py-1.5 text-sm font-medium text-gray-dark transition hover:bg-gray-light"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {stats && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total inscritos" value={String(stats.total)} />
            <StatCard label="Cupos faltantes" value={String(stats.remaining)} />
            <StatCard label="Porcentaje" value={`${stats.percentage}%`} />
            <StatCard
              label="Estado del quórum"
              value={
                stats.completed
                  ? MENSAJES.quorumCompleto
                  : MENSAJES.quorumIncompleto
              }
              small
            />
          </div>
        )}

        <div className="rounded-2xl border border-gray-border bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-gray-dark">
              Inscritos ({students.length})
            </h2>
            <button
              type="button"
              onClick={() => exportToCsv(students)}
              disabled={students.length === 0}
              className="rounded-lg bg-infotep px-4 py-2 text-sm font-semibold text-white transition hover:bg-infotep-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              Exportar CSV
            </button>
          </div>

          <AdminTable students={students} onDelete={handleDelete} />
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  small = false,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-border bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-muted">
        {label}
      </p>
      <p
        className={`mt-2 font-bold text-gray-dark ${small ? "text-base" : "text-2xl"}`}
      >
        {value}
      </p>
    </div>
  );
}
