"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/shared/lib/supabase/server";
import type { ActionResult } from "../types";
import { quickTaskSchema } from "./task-schemas";

export async function createTask(input: { title: string }): Promise<ActionResult> {
  const parsed = quickTaskSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid task." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const { error } = await supabase.from("tasks").insert({
    user_id: user.id,
    title: parsed.data.title,
  });

  if (error) return { ok: false, error: "Could not create the task." };

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { ok: true };
}
