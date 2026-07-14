import Link from "next/link";
import { computeGlobalStreak, getUserStats } from "@/features/gamification";
import { getActiveHabitsWithChecks } from "@/features/habits";
import {
  CircleCheckIcon,
  FlagIcon,
  FlameIcon,
  GearIcon,
  PlusIcon,
  SquareCheckIcon,
  TrophyIcon,
} from "@/shared/icons";
import { toDateKey, weekdayIndex } from "@/shared/lib/dates";
import { createClient } from "@/shared/lib/supabase/server";
import { Card, CardContent } from "@/shared/ui/card";
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
  const globalStreak = computeGlobalStreak({
    checkedDates: new Set(habits.flatMap((habit) => habit.checkedDates)),
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
  const allDone = scheduledToday.length > 0 && doneToday === scheduledToday.length;

  const name = user?.email?.split("@")[0] ?? "there";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Greeting name={name} />
        <Link
          href="/settings"
          aria-label="Settings"
          className="flex size-11 items-center justify-center rounded-full bg-card text-muted-foreground shadow-xs"
        >
          <GearIcon className="size-5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="flex flex-col gap-3 p-4">
            <span className="flex size-10 items-center justify-center rounded-full bg-accent">
              <FlameIcon className="size-5 text-primary" />
            </span>
            <div>
              <p className="font-heading text-3xl font-bold">
                {globalStreak.current}
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  days
                </span>
              </p>
              <p className="text-sm text-muted-foreground">Current Streak</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-3 p-4">
            <span className="flex size-10 items-center justify-center rounded-full bg-accent">
              <TrophyIcon className="size-5 text-warning" />
            </span>
            <div>
              <p className="font-heading text-3xl font-bold">
                {longestStreak}
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  days
                </span>
              </p>
              <p className="text-sm text-muted-foreground">Longest Streak</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Link href="/habits">
        <Card>
          <CardContent className="flex items-center gap-3 px-4 py-3.5">
            <CircleCheckIcon
              className={
                allDone ? "size-5 text-success" : "size-5 text-muted-foreground"
              }
            />
            <p className="text-sm">
              <strong>
                {doneToday} of {scheduledToday.length}
              </strong>{" "}
              <span className="text-muted-foreground">habits done today</span>
            </p>
          </CardContent>
        </Card>
      </Link>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-3">
          <Link
            href="/habits/new"
            className="flex flex-col items-center gap-3 rounded-xl border bg-card p-4 shadow-xs"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-accent">
              <PlusIcon className="size-5 text-primary" />
            </span>
            <span className="text-sm font-medium">Add Habit</span>
          </Link>
          <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-4 opacity-50 shadow-xs">
            <span className="flex size-10 items-center justify-center rounded-full bg-accent">
              <FlagIcon className="size-5 text-primary" />
            </span>
            <span className="text-sm font-medium">Add Goal</span>
          </div>
          <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-4 opacity-50 shadow-xs">
            <span className="flex size-10 items-center justify-center rounded-full bg-accent">
              <SquareCheckIcon className="size-5 text-primary" />
            </span>
            <span className="text-sm font-medium">Add Task</span>
          </div>
        </div>
      </section>
    </div>
  );
}
