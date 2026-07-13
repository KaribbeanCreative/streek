"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/shared/lib/supabase/server";
import type { ActionResult } from "../types";

export async function archiveHabit(habitId: string): Promise<ActionResult> {
  const parsed = z.uuid().safeParse(habitId);
  if (!parsed.success) return { ok: false, error: "Invalid habit." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const { error } = await supabase
    .from("habits")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", parsed.data)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: "Could not archive the habit." };

  revalidatePath("/habits");
  return { ok: true };
}
