"use server";

import { revalidatePath } from "next/cache";
import { trackEvent, untrackEvent } from "@/features/gamification";
import { createClient } from "@/shared/lib/supabase/server";
import type { ActionResult } from "../types";
import { checkInputSchema } from "./habit-schemas";

type CheckInput = { habitId: string; date: string };

export async function checkHabit(input: CheckInput): Promise<ActionResult> {
  const parsed = checkInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid check." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const { habitId, date } = parsed.data;
  const { data, error } = await supabase
    .from("habit_checks")
    .upsert(
      { habit_id: habitId, user_id: user.id, checked_date: date },
      { onConflict: "habit_id,checked_date", ignoreDuplicates: true }
    )
    .select("id");

  if (error) return { ok: false, error: "Could not check the habit." };

  const insertedNewCheck = (data ?? []).length > 0;
  if (insertedNewCheck) {
    await trackEvent("habit_checked", habitId, { date });
  }

  revalidatePath("/habits");
  revalidatePath(`/habits/${habitId}`);
  return { ok: true };
}

export async function uncheckHabit(input: CheckInput): Promise<ActionResult> {
  const parsed = checkInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid check." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const { habitId, date } = parsed.data;
  const { data, error } = await supabase
    .from("habit_checks")
    .delete()
    .eq("habit_id", habitId)
    .eq("user_id", user.id)
    .eq("checked_date", date)
    .select("id");

  if (error) return { ok: false, error: "Could not uncheck the habit." };

  const removedCheck = (data ?? []).length > 0;
  if (removedCheck) {
    await untrackEvent("habit_checked", habitId, { date });
  }

  revalidatePath("/habits");
  revalidatePath(`/habits/${habitId}`);
  return { ok: true };
}
