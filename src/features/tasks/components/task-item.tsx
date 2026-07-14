"use client";

import Link from "next/link";
import { startTransition, useOptimistic } from "react";
import { CheckIcon } from "@/shared/icons";
import { toDateKey } from "@/shared/lib/dates";
import { cn } from "@/shared/lib/utils";
import { completeTask, uncompleteTask } from "../actions/complete-task";
import { formatDueDate } from "../lib/format";
import type { Task } from "../types";
import { PriorityBadge } from "./priority-badge";

export function TaskItem({ task }: { task: Task }) {
  const [optimisticDone, setOptimisticDone] = useOptimistic(
    task.completed_at !== null
  );

  function handleToggle() {
    const next = !optimisticDone;
    startTransition(async () => {
      setOptimisticDone(next);
      const action = next ? completeTask : uncompleteTask;
      await action({ taskId: task.id, date: toDateKey(new Date()) });
    });
  }

  const today = toDateKey(new Date());
  const overdue =
    !optimisticDone && task.due_date !== null && task.due_date < today;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border bg-card p-3 shadow-xs transition-opacity duration-300",
        optimisticDone && "opacity-55"
      )}
    >
      <button
        type="button"
        onClick={handleToggle}
        aria-label={optimisticDone ? `Reopen ${task.title}` : `Complete ${task.title}`}
        aria-pressed={optimisticDone}
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-all active:scale-90",
          optimisticDone
            ? "border-transparent bg-success"
            : "border-border bg-transparent"
        )}
      >
        {optimisticDone && (
          <span className="animate-pop">
            <CheckIcon className="size-4 text-white" />
          </span>
        )}
      </button>
      <Link href={`/tasks/${task.id}`} className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate font-medium transition-colors duration-300",
            optimisticDone && "text-muted-foreground line-through"
          )}
        >
          {task.title}
        </p>
        {!optimisticDone && (
          <span className="mt-0.5 flex items-center gap-2">
            <PriorityBadge priority={task.priority} />
            {task.due_date && (
              <span
                className={cn(
                  "text-xs",
                  overdue ? "font-medium text-error" : "text-muted-foreground"
                )}
              >
                {formatDueDate(task.due_date, today)}
              </span>
            )}
          </span>
        )}
      </Link>
    </div>
  );
}
