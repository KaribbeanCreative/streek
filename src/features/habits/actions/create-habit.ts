"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/shared/lib/supabase/server";
import type { ActionResult, HabitInput } from "../types";
import { habitInputSchema } from "./habit-schemas";

export async function createHabit(input: HabitInput): Promise<ActionResult> {
  const parsed = habitInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid habit." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const { name, emoji, color, days } = parsed.data;
  const { error } = await supabase.from("habits").insert({
    user_id: user.id,
    name,
    emoji,
    color,
    frequency: { days: [...days].sort() },
  });

  if (error) return { ok: false, error: "Could not create the habit." };

  revalidatePath("/habits");
  return { ok: true };
}
