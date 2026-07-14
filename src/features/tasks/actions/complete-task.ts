"use server";

import { revalidatePath } from "next/cache";
import { trackEvent, untrackEvent } from "@/features/gamification";
import { createClient } from "@/shared/lib/supabase/server";
import type { ActionResult } from "../types";
import { completeInputSchema } from "./task-schemas";

type CompleteInput = { taskId: string; date: string };

export async function completeTask(input: CompleteInput): Promise<ActionResult> {
  const parsed = completeInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid task." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const { taskId, date } = parsed.data;
  const { data, error } = await supabase
    .from("tasks")
    .update({ completed_at: new Date().toISOString() })
    .eq("id", taskId)
    .eq("user_id", user.id)
    .is("completed_at", null)
    .select("id");

  if (error) return { ok: false, error: "Could not complete the task." };

  const completedNow = (data ?? []).length > 0;
  if (completedNow) {
    await trackEvent("task_completed", taskId, { date });
  }

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function uncompleteTask(
  input: CompleteInput
): Promise<ActionResult> {
  const parsed = completeInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid task." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const { taskId, date } = parsed.data;
  const { data, error } = await supabase
    .from("tasks")
    .update({ completed_at: null })
    .eq("id", taskId)
    .eq("user_id", user.id)
    .not("completed_at", "is", null)
    .select("id");

  if (error) return { ok: false, error: "Could not reopen the task." };

  const reopenedNow = (data ?? []).length > 0;
  if (reopenedNow) {
    await untrackEvent("task_completed", taskId, { date });
  }

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { ok: true };
}
