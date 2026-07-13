import { addDays, monthKey, weekdayIndex } from "@/shared/lib/dates";

/**
 * Single source of truth for XP values, level formula and streak/freeze
 * rules. No XP value or streak rule may live anywhere else.
 */

export const XP_VALUES = {
  habit_checked: 10,
  task_completed: 15,
  goal_reached: 50,
} as const;

export type EventType = keyof typeof XP_VALUES;

export const FREEZES_PER_MONTH = 2;

const XP_LEVEL_BASE = 100;

/** Level n requires 100 * (n - 1)² total XP: 0, 100, 400, 900… */
export function levelForXp(totalXp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, totalXp) / XP_LEVEL_BASE)) + 1;
}

export function xpForLevel(level: number): number {
  return XP_LEVEL_BASE * (level - 1) ** 2;
}

export type GlobalStreakInput = {
  /** Every date (YYYY-MM-DD) with at least one habit checked. */
  checkedDates: ReadonlySet<string>;
  /** Union of scheduled weekdays across active habits. 0 = Monday. */
  scheduledWeekdays: ReadonlySet<number>;
  /** Date of the oldest active habit — the streak cannot start before it. */
  earliestDate: string | null;
  today: string;
};

export type GlobalStreakResult = {
  current: number;
  freezesRemaining: number;
};

/**
 * Global streak: consecutive activity walking back from today. A day counts
 * when at least one habit was checked. Non-scheduled days pass through.
 * A missed scheduled day consumes a freeze — each calendar month forgives up
 * to FREEZES_PER_MONTH missed days; beyond that the streak breaks. Today
 * never breaks the streak while the day is still in progress.
 */
export function computeGlobalStreak({
  checkedDates,
  scheduledWeekdays,
  earliestDate,
  today,
}: GlobalStreakInput): GlobalStreakResult {
  if (!earliestDate || scheduledWeekdays.size === 0) {
    return { current: 0, freezesRemaining: FREEZES_PER_MONTH };
  }

  const freezesUsed = new Map<string, number>();
  let current = 0;
  let day = today;

  while (day >= earliestDate) {
    if (checkedDates.has(day)) {
      current += 1;
    } else if (scheduledWeekdays.has(weekdayIndex(day)) && day !== today) {
      const month = monthKey(day);
      const used = (freezesUsed.get(month) ?? 0) + 1;
      if (used > FREEZES_PER_MONTH) break;
      freezesUsed.set(month, used);
    }
    day = addDays(day, -1);
  }

  return {
    current,
    freezesRemaining: Math.max(
      0,
      FREEZES_PER_MONTH - (freezesUsed.get(monthKey(today)) ?? 0)
    ),
  };
}

export type HabitStreakResult = {
  current: number;
  longest: number;
};

/**
 * Per-habit streak, strict (freezes only protect the global streak):
 * consecutive checks over the habit's scheduled days. Non-scheduled days
 * pass through, an unchecked today does not break the run yet.
 */
export function computeHabitStreak(
  checkedDates: ReadonlySet<string>,
  scheduledDays: readonly number[],
  today: string
): HabitStreakResult {
  if (checkedDates.size === 0) return { current: 0, longest: 0 };

  const scheduled = new Set(scheduledDays);
  const earliest = [...checkedDates].sort()[0];

  let current = 0;
  let day = today;
  while (day >= earliest) {
    if (checkedDates.has(day)) {
      current += 1;
    } else if (scheduled.has(weekdayIndex(day)) && day !== today) {
      break;
    }
    day = addDays(day, -1);
  }

  let longest = 0;
  let run = 0;
  for (let d = earliest; d <= today; d = addDays(d, 1)) {
    if (checkedDates.has(d)) {
      run += 1;
      if (run > longest) longest = run;
    } else if (scheduled.has(weekdayIndex(d)) && d !== today) {
      run = 0;
    }
  }

  return { current, longest };
}
