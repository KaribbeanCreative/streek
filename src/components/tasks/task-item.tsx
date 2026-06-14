"use client";

import { useState, useTransition } from "react";
import { CheckIcon, Loader2Icon, PencilIcon, Trash2Icon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { deleteTask, toggleTask, updateTaskTitle } from "@/lib/actions/tasks";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

/** Formate "YYYY-MM-DD" → "14 Sept. 26" (fr, mois capitalisé, sans décalage de fuseau). */
function formatDueDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const formatted = new Date(y, m - 1, d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
  // fr-FR donne "14 sept. 26" → on capitalise la 1re lettre du mois.
  return formatted.replace(/ ([a-zà-ÿ])/, (_, c: string) => " " + c.toUpperCase());
}

export function TaskItem({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);

  function handleToggle(checked: boolean) {
    startTransition(async () => {
      const result = await toggleTask(task.id, checked);
      if (result?.error) toast.error(result.error);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteTask(task.id);
      if (result?.error) toast.error(result.error);
    });
  }

  function handleSaveTitle() {
    const next = draftTitle.trim();
    if (!next || next === task.title) {
      setIsEditing(false);
      setDraftTitle(task.title);
      return;
    }
    startTransition(async () => {
      const result = await updateTaskTitle(task.id, next);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      setIsEditing(false);
    });
  }

  return (
    // Mobile : 2 rangées (titre+actions, puis méta). À partir de sm: tout
    // revient sur une seule ligne (flex-wrap + ordre/largeur de la méta).
    <li className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border border-border bg-card px-3 py-2.5">
      <Checkbox
        checked={task.completed}
        onCheckedChange={handleToggle}
        disabled={isPending || isEditing}
        aria-label={task.completed ? "Marquer à faire" : "Marquer terminée"}
      />

      {isEditing ? (
        <Input
          autoFocus
          value={draftTitle}
          maxLength={500}
          onChange={(e) => setDraftTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSaveTitle();
            if (e.key === "Escape") {
              setIsEditing(false);
              setDraftTitle(task.title);
            }
          }}
          className="h-8 min-w-0 flex-1"
        />
      ) : (
        <span
          onDoubleClick={() => setIsEditing(true)}
          className={cn(
            "min-w-0 flex-1 truncate text-sm",
            task.completed && "text-muted-foreground line-through",
          )}
        >
          {task.title}
        </span>
      )}

      {/* Méta : sous le titre sur mobile (order-last + largeur pleine),
          réintégrée dans la ligne à partir de sm:. */}
      <div className="order-last flex w-full items-center gap-3 pl-8 sm:order-none sm:w-auto sm:pl-0">
        <PriorityBadge priority={task.priority} />

        {task.due_date && (
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatDueDate(task.due_date)}
          </span>
        )}
      </div>

      {isEditing ? (
        <>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSaveTitle}
            disabled={isPending}
            aria-label="Enregistrer"
          >
            {isPending ? <Loader2Icon className="animate-spin" /> : <CheckIcon />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setIsEditing(false);
              setDraftTitle(task.title);
            }}
            disabled={isPending}
            aria-label="Annuler"
          >
            <XIcon />
          </Button>
        </>
      ) : (
        <>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            disabled={isPending}
            aria-label="Éditer"
          >
            <PencilIcon />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDelete}
            disabled={isPending}
            aria-label="Supprimer"
            className="text-destructive hover:text-destructive"
          >
            <Trash2Icon />
          </Button>
        </>
      )}
    </li>
  );
}
