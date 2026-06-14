import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { TaskForm } from "@/components/tasks/task-form";
import { TaskItem } from "@/components/tasks/task-item";
import type { Task } from "@/types";

export default async function TasksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protection : pas de session → retour au login.
  if (!user) redirect("/login");

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .order("completed", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .returns<Task[]>();

  const list = tasks ?? [];

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-8 space-y-1">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Dashboard
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Mes tâches</h1>
      </div>

      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <TaskForm />
      </div>

      {list.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          Aucune tâche pour le moment. Ajoute-en une ci-dessus.
        </p>
      ) : (
        <ul className="space-y-2">
          {list.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      )}
    </main>
  );
}
