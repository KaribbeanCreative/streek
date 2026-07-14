import type { Task, TaskSections } from "../types";

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 } as const;

export function comparePending(a: Task, b: Task): number {
  const byPriority = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  if (byPriority !== 0) return byPriority;
  if (a.due_date !== b.due_date) {
    if (a.due_date === null) return 1;
    if (b.due_date === null) return -1;
    return a.due_date < b.due_date ? -1 : 1;
  }
  return a.created_at < b.created_at ? -1 : 1;
}

export function splitTasks(tasks: Task[], today: string): TaskSections {
  const pending = tasks.filter((task) => !task.completed_at);
  const completed = tasks
    .filter((task) => task.completed_at)
    .sort((a, b) => ((a.completed_at ?? "") < (b.completed_at ?? "") ? 1 : -1));

  return {
    today: pending
      .filter((task) => task.due_date !== null && task.due_date <= today)
      .sort(comparePending),
    upcoming: pending
      .filter((task) => task.due_date === null || task.due_date > today)
      .sort(comparePending),
    completed,
  };
}
