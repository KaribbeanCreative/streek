"use client";

import Link from "next/link";
import { startTransition, useOptimistic } from "react";
import { checkHabit, uncheckHabit } from "../actions/check-habit";
import type { HabitWithChecks } from "../types";
import { CheckButton } from "./check-button";
import { StreakBadge } from "./streak-badge";

export function HabitCard({
  habit,
  today,
}: {
  habit: HabitWithChecks;
  today: string;
}) {
  const [optimisticChecked, setOptimisticChecked] = useOptimistic(
    habit.checkedDates.includes(today)
  );

  function handleToggle() {
    const next = !optimisticChecked;
    startTransition(async () => {
      setOptimisticChecked(next);
      const action = next ? checkHabit : uncheckHabit;
      await action({ habitId: habit.id, date: today });
    });
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-xs">
      <Link
        href={`/habits/${habit.id}`}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <span className="text-2xl" aria-hidden>
          {habit.emoji}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-medium">{habit.name}</span>
          <StreakBadge count={habit.streak.current} />
        </span>
      </Link>
      <CheckButton
        checked={optimisticChecked}
        color={habit.color}
        onToggle={handleToggle}
        label={
          optimisticChecked ? `Uncheck ${habit.name}` : `Check ${habit.name}`
        }
      />
    </div>
  );
}
