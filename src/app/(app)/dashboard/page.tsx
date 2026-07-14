import Link from "next/link";
import {
  StreakHero,
  computeGlobalStreak,
  getUserStats,
} from "@/features/gamification";
import { DailyProgress, getActiveHabitsWithChecks } from "@/features/habits";
import { TaskItem, getTaskSections } from "@/features/tasks";
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

  const [habits, stats, taskSections] = await Promise.all([
    getActiveHabitsWithChecks(),
    getUserStats(),
    getTaskSections(),
  ]);
  const topTasks = [...taskSections.today, ...taskSections.upcoming].slice(0, 3);

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

      {topTasks.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 className="font-heading text-lg font-semibold">Top tasks</h2>
            <Link href="/tasks" className="text-sm font-medium text-primary">
              See all
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {topTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}

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
          <Link
            href="/tasks"
            className="flex flex-col items-center gap-2 rounded-2xl border bg-card py-5 font-medium shadow-xs transition-colors active:bg-accent"
          >
            <SquareCheckIcon className="size-6 text-primary" />
            <span className="text-sm">Task</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
