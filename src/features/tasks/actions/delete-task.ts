"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/shared/lib/supabase/server";
import type { ActionResult } from "../types";

export async function deleteTask(taskId: string): Promise<ActionResult> {
  const parsed = z.uuid().safeParse(taskId);
  if (!parsed.success) return { ok: false, error: "Invalid task." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", parsed.data)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: "Could not delete the task." };

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { ok: true };
}
