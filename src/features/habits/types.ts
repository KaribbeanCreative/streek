import type { HabitColor } from "@/shared/constants";

export type Habit = {
  id: string;
  user_id: string;
  name: string;
  emoji: string;
  color: HabitColor;
  frequency: { days: number[] };
  created_at: string;
  archived_at: string | null;
};

export type HabitWithChecks = Habit & {
  /** Checked dates (YYYY-MM-DD), most recent window only. */
  checkedDates: string[];
  /** Computed server-side from the gamification rules. */
  streak: { current: number; longest: number };
};

export type HabitInput = {
  name: string;
  emoji: string;
  color: HabitColor;
  days: number[];
};

export type ActionResult = { ok: true } | { ok: false; error: string };
