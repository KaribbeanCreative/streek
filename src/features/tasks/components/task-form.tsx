"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { deleteTask } from "../actions/delete-task";
import { updateTask } from "../actions/update-task";
import type { Task, TaskPriority } from "../types";

const PRIORITIES: { value: TaskPriority; label: string; active: string }[] = [
  { value: "low", label: "Low", active: "border-transparent bg-info text-white" },
  { value: "medium", label: "Medium", active: "border-transparent bg-primary text-primary-foreground" },
  { value: "high", label: "High", active: "border-transparent bg-error text-white" },
];

export function TaskForm({ task }: { task: Task }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes ?? "");
  const [dueDate, setDueDate] = useState(task.due_date ?? "");
  const [priority, setPriority] = useState<TaskPriority>(task.priority);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await updateTask(task.id, {
        title,
        notes: notes.trim().length > 0 ? notes : null,
        due_date: dueDate.length > 0 ? dueDate : null,
        priority,
      });
      if (result.ok) router.push("/tasks");
      else setError(result.error);
    });
  }

  function handleDelete() {
    if (!window.confirm(`Delete “${task.title}”?`)) return;
    startTransition(async () => {
      const result = await deleteTask(task.id);
      if (result.ok) router.push("/tasks");
      else setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="task-title">Title</Label>
        <Input
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
          className="h-11"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="task-notes">Notes</Label>
        <Textarea
          id="task-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything useful…"
          maxLength={2000}
          rows={4}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="task-due">Due date</Label>
        <Input
          id="task-due"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="h-11"
        />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">Priority</legend>
        <div className="flex gap-2">
          {PRIORITIES.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPriority(option.value)}
              aria-pressed={priority === option.value}
              className={cn(
                "h-11 flex-1 rounded-lg border text-sm font-medium transition-colors",
                priority === option.value
                  ? option.active
                  : "border-border bg-card text-muted-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          disabled={isPending || title.trim().length === 0}
          className="h-12 w-full"
        >
          {isPending ? "Saving…" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={handleDelete}
          className="h-11 w-full text-error"
        >
          Delete task
        </Button>
      </div>
    </form>
  );
}
