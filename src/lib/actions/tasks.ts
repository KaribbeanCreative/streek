"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { TaskPriority } from "@/types";

export type TaskActionState = { error: string } | null;

const PRIORITIES: readonly TaskPriority[] = ["low", "medium", "high"];

/**
 * Récupère le client Supabase + l'utilisateur courant.
 * Renvoie vers /login si la session est absente (les pages sont déjà protégées,
 * c'est une défense en profondeur côté action).
 */
async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

/**
 * Création d'une tâche. Signature compatible `useActionState`.
 * Lit `title`, `due_date` (optionnel) et `priority` depuis le FormData.
 */
export async function createTask(
  _prev: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const title = String(formData.get("title") ?? "").trim();
  const dueDateRaw = String(formData.get("due_date") ?? "").trim();
  const priorityRaw = String(formData.get("priority") ?? "medium");

  if (!title) return { error: "Le titre est obligatoire." };
  if (title.length > 500) return { error: "Le titre est trop long (500 max)." };

  const priority: TaskPriority = PRIORITIES.includes(priorityRaw as TaskPriority)
    ? (priorityRaw as TaskPriority)
    : "medium";

  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("tasks").insert({
    user_id: user.id,
    title,
    due_date: dueDateRaw || null,
    priority,
  });

  if (error) return { error: error.message };

  revalidatePath("/tasks");
  return null;
}

/** Coche / décoche une tâche. */
export async function toggleTask(id: string, completed: boolean) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("tasks")
    .update({ completed, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/tasks");
  return null;
}

/** Édite le titre d'une tâche. */
export async function updateTaskTitle(id: string, title: string) {
  const trimmed = title.trim();
  if (!trimmed) return { error: "Le titre est obligatoire." };
  if (trimmed.length > 500) return { error: "Le titre est trop long (500 max)." };

  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("tasks")
    .update({ title: trimmed, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/tasks");
  return null;
}

/** Supprime une tâche. */
export async function deleteTask(id: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/tasks");
  return null;
}
