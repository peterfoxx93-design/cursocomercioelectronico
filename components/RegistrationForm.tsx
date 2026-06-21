"use client";

import { FormEvent, useState } from "react";
import { COMPROMISO_TEXT, MENSAJES } from "@/lib/constants";

interface RegistrationFormProps {
  quorumCompleted: boolean;
  onSuccess: () => void;
}

interface FormState {
  nombre: string;
  email: string;
  telefono: string;
  compromiso: boolean;
}

const initialForm: FormState = {
  nombre: "",
  email: "",
  telefono: "",
  compromiso: false,
};

export function RegistrationForm({
  quorumCompleted,
  onSuccess,
}: RegistrationFormProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!form.compromiso) {
      setError("Debes aceptar la nota de compromiso para continuar");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "No se pudo registrar tu interés");
        return;
      }

      setSuccess(true);
      setForm(initialForm);
      onSuccess();
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  if (quorumCompleted) {
    return (
      <div className="rounded-xl border border-gray-border bg-gray-light p-6 text-center">
        <p className="font-medium text-gray-dark">{MENSAJES.formularioDeshabilitado}</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
          ✓
        </div>
        <p className="font-semibold text-green-800">{MENSAJES.confirmacionRegistro}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium text-gray-dark">
          Nombre completo
        </label>
        <input
          id="nombre"
          type="text"
          required
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="w-full rounded-lg border border-gray-border px-4 py-3 text-gray-dark outline-none transition focus:border-infotep focus:ring-2 focus:ring-infotep/20"
          placeholder="Tu nombre completo"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-dark">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border border-gray-border px-4 py-3 text-gray-dark outline-none transition focus:border-infotep focus:ring-2 focus:ring-infotep/20"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label htmlFor="telefono" className="mb-1.5 block text-sm font-medium text-gray-dark">
          Teléfono
        </label>
        <input
          id="telefono"
          type="tel"
          required
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          className="w-full rounded-lg border border-gray-border px-4 py-3 text-gray-dark outline-none transition focus:border-infotep focus:ring-2 focus:ring-infotep/20"
          placeholder="809-555-0000"
        />
      </div>

      <div className="rounded-lg border border-gray-border bg-gray-light p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            required
            checked={form.compromiso}
            onChange={(e) => setForm({ ...form, compromiso: e.target.checked })}
            className="mt-1 h-4 w-4 rounded border-gray-border text-infotep focus:ring-infotep"
          />
          <span className="text-sm leading-relaxed text-gray-dark">{COMPROMISO_TEXT}</span>
        </label>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-infotep px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-infotep-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Registrando..." : "Registrar mi interés"}
      </button>
    </form>
  );
}
