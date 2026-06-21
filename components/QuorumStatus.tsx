import { MENSAJES } from "@/lib/constants";

interface QuorumStatusProps {
  completed: boolean;
  remaining: number;
}

export function QuorumStatus({ completed, remaining }: QuorumStatusProps) {
  if (completed) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
        <p className="font-semibold text-green-800">{MENSAJES.quorumCompleto}</p>
        <p className="mt-1 text-sm text-green-700">
          {MENSAJES.quorumCompletoDescripcion}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-border bg-gray-light px-4 py-3">
      <p className="font-semibold text-gray-dark">{MENSAJES.quorumIncompleto}</p>
      <p className="mt-1 text-sm text-gray-muted">
        Faltan{" "}
        <span className="font-semibold text-infotep">{remaining}</span> cupos
        para completar el quórum de 30 estudiantes.
      </p>
    </div>
  );
}
