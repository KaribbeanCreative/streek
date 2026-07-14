import { createClient } from "@/shared/lib/supabase/server";
import { toDateKey } from "@/shared/lib/dates";
import { splitTasks } from "../lib/sort";
import type { Task, TaskSections } from "../types";

const COMPLETED_LIMIT = 30;

export async function getTaskSections(): Promise<TaskSections> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { today: [], upcoming: [], completed: [] };

  const [{ data: pending }, { data: completed }] = await Promise.all([
    supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .is("completed_at", null),
    supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false })
      .limit(COMPLETED_LIMIT),
  ]);

  const tasks = [
    ...((pending ?? []) as Task[]),
    ...((completed ?? []) as Task[]),
  ];
  return splitTasks(tasks, toDateKey(new Date()));
}

export async function getTask(taskId: string): Promise<Task | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .eq("user_id", user.id)
    .maybeSingle();

  return (data as Task | null) ?? null;
}
