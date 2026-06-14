import { cn } from "@/lib/utils";
import type { TaskPriority } from "@/types";

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Mid",
  high: "Hig",
};

const PRIORITY_CLASS: Record<TaskPriority, string> = {
  low: "border-green-200 bg-green-100 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300",
  medium:
    "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  high: "border-red-200 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
};

const PRIORITY_DOT: Record<TaskPriority, string> = {
  low: "bg-green-500",
  medium: "bg-amber-500",
  high: "bg-red-500",
};

/** Badge de priorité (composant présentationnel partagé liste + formulaire). */
export function PriorityBadge({
  priority,
  className,
}: {
  priority: TaskPriority;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-md border px-1.5 py-0.5 text-xs font-semibold",
        PRIORITY_CLASS[priority],
        className,
      )}
    >
      <span
        className={cn("size-1.5 rounded-full", PRIORITY_DOT[priority])}
        aria-hidden
      />
      {PRIORITY_LABEL[priority]}
    </span>
  );
}
