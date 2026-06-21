"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { ProgressBar } from "@/components/ProgressBar";
import { QuorumStatus } from "@/components/QuorumStatus";
import { RegistrationForm } from "@/components/RegistrationForm";
import { CURSO } from "@/lib/constants";
import type { QuorumStats } from "@/lib/quorum";

const defaultStats: QuorumStats = {
  total: 0,
  target: 30,
  remaining: 30,
  percentage: 0,
  completed: false,
};

export function LandingPage() {
  const [stats, setStats] = useState<QuorumStats>(defaultStats);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch {
      // Keep default stats on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="border-b border-gray-border bg-gray-light">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-infotep">
              Preinscripción de interés
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-dark sm:text-4xl">
              {CURSO.nombre}
            </h1>
            <div className="mt-6 flex items-center gap-4">
              <img
                src="/profesor.png"
                alt={CURSO.profesor}
                className="h-16 w-16 rounded-full border-2 border-white object-cover shadow-md"
              />
              <div className="space-y-0.5 text-sm text-gray-muted">
                <p>
                  <span className="font-semibold text-gray-dark">Profesor:</span>{" "}
                  {CURSO.profesor}
                </p>
                <p>
                  <span className="font-semibold text-gray-dark">Institución:</span>{" "}
                  {CURSO.institucion}, {CURSO.pais}
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-muted">
              Esta no es una inscripción oficial. Es una lista de interés para
              reunir el quórum de 30 estudiantes. Cuando se complete, nos
              pondremos en contacto contigo para iniciar el curso.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-dark">
                Progreso del quórum
              </h2>
              {loading ? (
                <div className="h-24 animate-pulse rounded-xl bg-gray-light" />
              ) : (
                <>
                  <ProgressBar
                    percentage={stats.percentage}
                    total={stats.total}
                    target={stats.target}
                  />
                  <QuorumStatus
                    completed={stats.completed}
                    remaining={stats.remaining}
                  />
                </>
              )}
            </div>

            <div className="rounded-2xl border border-gray-border bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 text-xl font-semibold text-gray-dark">
                Registra tu interés
              </h2>
              <RegistrationForm
                quorumCompleted={stats.completed}
                onSuccess={fetchStats}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-border bg-gray-light">
        <div className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-gray-muted sm:px-6">
          © {new Date().getFullYear()} Pedro Félix · Propietario y Desarrollador · Quórum Comercio Electrónico
        </div>
      </footer>
    </>
  );
}
