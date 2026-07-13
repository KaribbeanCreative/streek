import { FlameIcon } from "@/shared/icons";
import { cn } from "@/shared/lib/utils";

export function StreakBadge({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium tabular-nums",
        count > 0 ? "text-primary" : "text-muted-foreground",
        className
      )}
    >
      <FlameIcon className="size-4" />
      {count}
    </span>
  );
}
