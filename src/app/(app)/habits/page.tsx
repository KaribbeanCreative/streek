import Link from "next/link";
import { computeGlobalStreak } from "@/features/gamification";
import { TodayHabitList, getActiveHabitsWithChecks } from "@/features/habits";
import { FlameIcon, PlusIcon, SnowflakeIcon } from "@/shared/icons";
import { toDateKey } from "@/shared/lib/dates";

export default async function HabitsPage() {
  const habits = await getActiveHabitsWithChecks();

  const globalStreak = computeGlobalStreak({
    checkedDates: new Set(habits.flatMap((habit) => habit.checkedDates)),
    scheduledWeekdays: new Set(
      habits.flatMap((habit) => habit.frequency.days)
    ),
    earliestDate:
      habits.length > 0
        ? habits
            .map((habit) => habit.created_at.slice(0, 10))
            .sort()[0]
        : null,
    today: toDateKey(new Date()),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Today</h1>
        <div className="flex items-center gap-3 text-sm font-medium">
          <span className="flex items-center gap-1 text-primary">
            <FlameIcon className="size-4" />
            {globalStreak.current}
          </span>
          <span className="flex items-center gap-1 text-info">
            <SnowflakeIcon className="size-4" />
            {globalStreak.freezesRemaining}
          </span>
        </div>
      </div>

      <TodayHabitList habits={habits} />

      <Link
        href="/habits/new"
        aria-label="New habit"
        className="fixed bottom-24 right-6 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary-hover active:scale-95"
      >
        <PlusIcon className="size-6" />
      </Link>
    </div>
  );
}
