import { addDays } from "@/shared/lib/dates";

export function formatDueDate(dueDate: string, today: string): string {
  if (dueDate === today) return "Today";
  if (dueDate === addDays(today, 1)) return "Tomorrow";
  if (dueDate === addDays(today, -1)) return "Yesterday";

  const [year, month, day] = dueDate.split("-").map(Number);
  const label = new Date(Date.UTC(year, month - 1, day, 12)).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", timeZone: "UTC" }
  );
  return dueDate < today ? `Overdue · ${label}` : label;
}
