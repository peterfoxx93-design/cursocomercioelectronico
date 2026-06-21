interface ProgressBarProps {
  percentage: number;
  total: number;
  target: number;
}

export function ProgressBar({ percentage, total, target }: ProgressBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-3xl font-bold text-gray-dark sm:text-4xl">
            {total}{" "}
            <span className="text-xl font-semibold text-gray-muted sm:text-2xl">
              de {target}
            </span>
          </p>
          <p className="mt-1 text-sm text-gray-muted">estudiantes inscritos</p>
        </div>
        <p className="text-2xl font-bold text-infotep">{percentage}%</p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-gray-border">
        <div
          className="progress-bar-fill h-full rounded-full bg-infotep transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={total}
          aria-valuemin={0}
          aria-valuemax={target}
          aria-label={`Progreso del quórum: ${total} de ${target} estudiantes`}
        />
      </div>
    </div>
  );
}
