"use client";

import { useState, useTransition } from "react";
import { PlusIcon } from "@/shared/icons";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { createTask } from "../actions/create-task";

export function QuickAddTask() {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim().length === 0) return;
    setError(null);
    startTransition(async () => {
      const result = await createTask({ title });
      if (result.ok) setTitle("");
      else setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task and press Enter…"
          maxLength={200}
          enterKeyHint="done"
          aria-label="New task title"
          className="h-12"
        />
        <Button
          type="submit"
          size="icon"
          aria-label="Add task"
          disabled={isPending || title.trim().length === 0}
          className="size-12 shrink-0 rounded-full"
        >
          <PlusIcon className="size-5" />
        </Button>
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
    </form>
  );
}
