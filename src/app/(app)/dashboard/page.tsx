import Link from "next/link";
import {
  StreakHero,
  computeGlobalStreak,
  getUserStats,
} from "@/features/gamification";
import { DailyProgress, getActiveHabitsWithChecks } from "@/features/habits";
import {
  FlagIcon,
  GearIcon,
  PlusIcon,
  SquareCheckIcon,
} from "@/shared/icons";
import { toDateKey, weekdayIndex } from "@/shared/lib/dates";
import { createClient } from "@/shared/lib/supabase/server";
import { Greeting } from "@/shared/ui/greeting";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [habits, stats] = await Promise.all([
    getActiveHabitsWithChecks(),
    getUserStats(),
  ]);

  const today = toDateKey(new Date());
  const allCheckedDates = habits.flatMap((habit) => habit.checkedDates);
  const globalStreak = computeGlobalStreak({
    checkedDates: new Set(allCheckedDates),
    scheduledWeekdays: new Set(habits.flatMap((habit) => habit.frequency.days)),
    earliestDate:
      habits.length > 0
        ? habits.map((habit) => habit.created_at.slice(0, 10)).sort()[0]
        : null,
    today,
  });
  const longestStreak = Math.max(
    stats?.longest_streak ?? 0,
    globalStreak.current
  );

  const scheduledToday = habits.filter((habit) =>
    habit.frequency.days.includes(weekdayIndex(today))
  );
  const doneToday = scheduledToday.filter((habit) =>
    habit.checkedDates.includes(today)
  ).length;

  const name = user?.email?.split("@")[0] ?? "there";

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <Greeting name={name} />
        <Link
          href="/settings"
          aria-label="Settings"
          className="flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors active:bg-accent"
        >
          <GearIcon className="size-5" />
        </Link>
      </div>

      <StreakHero
        current={globalStreak.current}
        longest={longestStreak}
        freezesRemaining={globalStreak.freezesRemaining}
        checkedDates={allCheckedDates}
        today={today}
      />

      <DailyProgress done={doneToday} total={scheduledToday.length} />

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">Quick actions</h2>
        <div className="grid grid-cols-3 gap-3">
          <Link
            href="/habits/new"
            className="flex flex-col items-center gap-2 rounded-2xl bg-primary py-5 font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-[background-color,transform] hover:bg-primary-hover active:scale-[0.97]"
          >
            <PlusIcon className="size-6" />
            <span className="text-sm">Habit</span>
          </Link>
          <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed py-5 text-muted-foreground/70">
            <FlagIcon className="size-6" />
            <span className="text-sm font-medium">
              Goal <span className="opacity-70">· soon</span>
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed py-5 text-muted-foreground/70">
            <SquareCheckIcon className="size-6" />
            <span className="text-sm font-medium">
              Task <span className="opacity-70">· soon</span>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
