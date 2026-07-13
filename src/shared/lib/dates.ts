const DAY_MS = 86_400_000;

function toUtcNoon(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(dateKey: string, amount: number): string {
  const date = new Date(toUtcNoon(dateKey).getTime() + amount * DAY_MS);
  return date.toISOString().slice(0, 10);
}

/** 0 = Monday … 6 = Sunday */
export function weekdayIndex(dateKey: string): number {
  return (toUtcNoon(dateKey).getUTCDay() + 6) % 7;
}

export function monthKey(dateKey: string): string {
  return dateKey.slice(0, 7);
}

export function monthShortLabel(dateKey: string): string {
  return toUtcNoon(dateKey).toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
}
