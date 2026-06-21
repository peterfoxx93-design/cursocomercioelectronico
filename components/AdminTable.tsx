"use client";

import { useMemo, useState } from "react";
import type { Estudiante } from "@/lib/supabase";
import { ConfirmDialog } from "./ConfirmDialog";

interface AdminTableProps {
  students: Estudiante[];
  onDelete: (id: string) => Promise<void>;
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("es-DO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
}

export function AdminTable({ students, onDelete }: AdminTableProps) {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return students;

    return students.filter(
      (s) =>
        s.nombre.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query),
    );
  }, [students, search]);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await onDelete(deleteId);
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="mb-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o email..."
          className="w-full rounded-lg border border-gray-border px-4 py-2.5 text-sm outline-none focus:border-infotep focus:ring-2 focus:ring-infotep/20 sm:max-w-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-gray-light text-xs uppercase tracking-wide text-gray-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Nombre</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Teléfono</th>
              <th className="px-4 py-3 font-semibold">Compromiso</th>
              <th className="px-4 py-3 font-semibold">Fecha</th>
              <th className="px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-muted">
                  {search ? "No se encontraron resultados" : "No hay inscritos aún"}
                </td>
              </tr>
            ) : (
              filtered.map((student) => (
                <tr key={student.id} className="bg-white hover:bg-gray-light/50">
                  <td className="px-4 py-3 font-medium text-gray-dark">
                    {student.nombre}
                  </td>
                  <td className="px-4 py-3 text-gray-muted">{student.email}</td>
                  <td className="px-4 py-3 text-gray-muted">{student.telefono}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Sí
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-muted">
                    {formatDate(student.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setDeleteId(student.id)}
                      className="text-xs font-medium text-red-600 transition hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Eliminar registro"
        message="¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </>
  );
}
