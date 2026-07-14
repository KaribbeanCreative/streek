import Link from "next/link";
import { notFound } from "next/navigation";
import { TaskForm, getTask } from "@/features/tasks";
import { ChevronLeftIcon } from "@/shared/icons";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const task = await getTask(id);
  if (!task) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Link
          href="/tasks"
          aria-label="Back to tasks"
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground"
        >
          <ChevronLeftIcon className="size-5" />
        </Link>
        <h1 className="text-2xl font-bold">Edit task</h1>
      </div>
      <TaskForm task={task} />
    </div>
  );
}
