import Link from "next/link";
import { CURSO } from "@/lib/constants";

export function Header() {
  return (
    <header className="border-b border-gray-border bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-infotep text-sm font-bold text-white">
            QC
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-muted">
              {CURSO.institucion}
            </p>
            <p className="text-sm font-semibold text-gray-dark">
              Quórum Comercio Electrónico
            </p>
          </div>
        </div>
        <Link
          href="/admin/login"
          className="text-xs font-medium text-gray-muted transition hover:text-infotep"
        >
          Admin
        </Link>
      </div>
    </header>
  );
}
