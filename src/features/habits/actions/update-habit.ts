"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/shared/lib/supabase/server";
import type { ActionResult, HabitInput } from "../types";
import { habitInputSchema } from "./habit-schemas";

export async function updateHabit(
  habitId: string,
  input: HabitInput
): Promise<ActionResult> {
  const parsedId = z.uuid().safeParse(habitId);
  const parsed = habitInputSchema.safeParse(input);
  if (!parsedId.success || !parsed.success) {
    return { ok: false, error: "Invalid habit data." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const { name, emoji, color, days } = parsed.data;
  const { error } = await supabase
    .from("habits")
    .update({ name, emoji, color, frequency: { days: [...days].sort() } })
    .eq("id", parsedId.data)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: "Could not update the habit." };

  revalidatePath("/habits");
  revalidatePath(`/habits/${parsedId.data}`);
  return { ok: true };
}
