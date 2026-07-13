"use client";

import { toDateKey, weekdayIndex } from "@/shared/lib/dates";
import type { HabitWithChecks } from "../types";
import { HabitCard } from "./habit-card";

export function TodayHabitList({ habits }: { habits: HabitWithChecks[] }) {
  const today = toDateKey(new Date());
  const todayWeekday = weekdayIndex(today);

  const scheduledToday = habits.filter((habit) =>
    habit.frequency.days.includes(todayWeekday)
  );
  const otherDays = habits.filter(
    (habit) => !habit.frequency.days.includes(todayWeekday)
  );

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
        <span className="text-3xl" aria-hidden>
          🔥
        </span>
        <p className="font-medium">No habits yet</p>
        <p className="text-sm text-muted-foreground">
          Create your first habit and start a streak.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        {scheduledToday.length === 0 ? (
          <p className="rounded-xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
            Nothing scheduled today. Rest day 😌
          </p>
        ) : (
          scheduledToday.map((habit) => (
            <HabitCard key={habit.id} habit={habit} today={today} />
          ))
        )}
      </section>
      {otherDays.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Other days
          </h2>
          {otherDays.map((habit) => (
            <HabitCard key={habit.id} habit={habit} today={today} />
          ))}
        </section>
      )}
    </div>
  );
}
