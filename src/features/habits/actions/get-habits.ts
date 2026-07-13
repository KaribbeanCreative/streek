import { computeHabitStreak } from "@/features/gamification";
import { createClient } from "@/shared/lib/supabase/server";
import { addDays, toDateKey } from "@/shared/lib/dates";
import type { Habit, HabitWithChecks } from "../types";

const CHECKS_LOOKBACK_DAYS = 400;

type HabitRow = Omit<Habit, "frequency"> & {
  frequency: { days?: number[] } | null;
};

function toHabit(row: HabitRow): Habit {
  return {
    ...row,
    frequency: { days: row.frequency?.days ?? [0, 1, 2, 3, 4, 5, 6] },
  };
}

export async function getActiveHabitsWithChecks(): Promise<HabitWithChecks[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const since = addDays(toDateKey(new Date()), -CHECKS_LOOKBACK_DAYS);
  const [{ data: habits }, { data: checks }] = await Promise.all([
    supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .is("archived_at", null)
      .order("created_at", { ascending: true }),
    supabase
      .from("habit_checks")
      .select("habit_id, checked_date")
      .eq("user_id", user.id)
      .gte("checked_date", since),
  ]);

  const checksByHabit = new Map<string, string[]>();
  for (const check of (checks ?? []) as {
    habit_id: string;
    checked_date: string;
  }[]) {
    const list = checksByHabit.get(check.habit_id) ?? [];
    list.push(check.checked_date);
    checksByHabit.set(check.habit_id, list);
  }

  const today = toDateKey(new Date());
  return ((habits ?? []) as HabitRow[]).map((row) => {
    const habit = toHabit(row);
    const checkedDates = checksByHabit.get(row.id) ?? [];
    return {
      ...habit,
      checkedDates,
      streak: computeHabitStreak(
        new Set(checkedDates),
        habit.frequency.days,
        today
      ),
    };
  });
}

export async function getHabitWithChecks(
  habitId: string
): Promise<HabitWithChecks | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const since = addDays(toDateKey(new Date()), -CHECKS_LOOKBACK_DAYS);
  const [{ data: habit }, { data: checks }] = await Promise.all([
    supabase
      .from("habits")
      .select("*")
      .eq("id", habitId)
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("habit_checks")
      .select("checked_date")
      .eq("habit_id", habitId)
      .eq("user_id", user.id)
      .gte("checked_date", since),
  ]);

  if (!habit) return null;

  const mapped = toHabit(habit as HabitRow);
  const checkedDates = ((checks ?? []) as { checked_date: string }[]).map(
    (c) => c.checked_date
  );

  return {
    ...mapped,
    checkedDates,
    streak: computeHabitStreak(
      new Set(checkedDates),
      mapped.frequency.days,
      toDateKey(new Date())
    ),
  };
}
