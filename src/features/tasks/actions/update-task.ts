"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/shared/lib/supabase/server";
import type { ActionResult, TaskInput } from "../types";
import { taskInputSchema } from "./task-schemas";

export async function updateTask(
  taskId: string,
  input: TaskInput
): Promise<ActionResult> {
  const parsedId = z.uuid().safeParse(taskId);
  const parsed = taskInputSchema.safeParse(input);
  if (!parsedId.success || !parsed.success) {
    return { ok: false, error: "Invalid task data." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const { error } = await supabase
    .from("tasks")
    .update(parsed.data)
    .eq("id", parsedId.data)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: "Could not update the task." };

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { ok: true };
}
