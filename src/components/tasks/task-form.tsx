"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { createTask } from "@/lib/actions/tasks";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import type { TaskPriority } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Hauteur unique forcée sur tous les contrôles (le style inline gagne sur les
// classes des composants, donc Input / Select / Button rendent strictement la
// même hauteur et s'alignent au pixel).
const CONTROL_H = { height: "2.5rem" } as const;

export function TaskForm() {
  const [state, formAction, isPending] = useActionState(createTask, null);
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  // Affiche l'erreur, et réinitialise le formulaire après un succès.
  useEffect(() => {
    if (state && "error" in state) {
      toast.error(state.error);
      return;
    }
    // Succès : l'action vient de se terminer sans erreur (state === null après pending).
    if (wasPending.current && !isPending && state === null) {
      formRef.current?.reset();
    }
  }, [state, isPending]);

  useEffect(() => {
    if (isPending) wasPending.current = true;
  }, [isPending]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-4 sm:flex-row sm:items-end"
    >
      <div className="flex-1 space-y-2">
        <Label htmlFor="title">Nouvelle tâche</Label>
        <Input
          id="title"
          name="title"
          placeholder="Que faut-il faire ?"
          maxLength={500}
          required
          style={CONTROL_H}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="due_date">Échéance</Label>
        <Input
          id="due_date"
          name="due_date"
          type="date"
          className="w-full sm:w-40"
          style={CONTROL_H}
        />
      </div>

      <div className="space-y-2">
        <Label>Priorité</Label>
        <Select name="priority">
          <SelectTrigger className="w-full px-2.5 py-1 sm:w-32" style={CONTROL_H}>
            <SelectValue>
              {(value: TaskPriority | null) =>
                value ? (
                  <PriorityBadge priority={value} />
                ) : (
                  <span className="text-muted-foreground">Priorité</span>
                )
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">
              <PriorityBadge priority="high" />
            </SelectItem>
            <SelectItem value="medium">
              <PriorityBadge priority="medium" />
            </SelectItem>
            <SelectItem value="low">
              <PriorityBadge priority="low" />
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isPending} style={CONTROL_H}>
        {isPending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
        Ajouter
      </Button>
    </form>
  );
}
