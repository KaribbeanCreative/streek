import { cn } from "@/shared/lib/utils";
import type { TaskPriority } from "../types";

const STYLES: Record<TaskPriority, string> = {
  high: "bg-error/10 text-error",
  medium: "bg-primary/10 text-primary",
  low: "bg-info/10 text-info",
};

const LABELS: Record<TaskPriority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        STYLES[priority]
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {LABELS[priority]}
    </span>
  );
}
