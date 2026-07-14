import Link from "next/link";
import { CheckIcon, ChevronRightIcon } from "@/shared/icons";

type DailyProgressProps = {
  done: number;
  total: number;
};

export function DailyProgress({ done, total }: DailyProgressProps) {
  const allDone = total > 0 && done === total;
  const remaining = total - done;

  const message =
    total === 0
      ? "Nothing scheduled today. Rest day"
      : allDone
        ? "All done. The flame burns bright"
        : remaining === 1
          ? "1 to go, almost there"
          : `${remaining} to go, keep it up`;

  return (
    <Link
      href="/habits"
      className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-xs transition-colors active:bg-accent"
    >
      <ProgressRing done={done} total={total} />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">
          {done} of {total} habits
        </p>
        <p className="truncate text-sm text-muted-foreground">{message}</p>
      </div>
      <ChevronRightIcon className="size-5 shrink-0 text-muted-foreground" />
    </Link>
  );
}

function ProgressRing({ done, total }: { done: number; total: number }) {
  const size = 52;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = total > 0 ? done / total : 0;
  const allDone = total > 0 && done === total;

  return (
    <span className="relative flex shrink-0 items-center justify-center">
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={allDone ? "var(--success)" : "var(--primary)"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
        />
      </svg>
      <span className="absolute text-xs font-bold tabular-nums">
        {allDone ? (
          <CheckIcon className="size-4 text-success" />
        ) : (
          `${done}/${total}`
        )}
      </span>
    </span>
  );
}
