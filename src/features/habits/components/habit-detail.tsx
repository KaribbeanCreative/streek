"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { WEEKDAYS } from "@/shared/constants";
import { ArchiveIcon, FlameIcon, PencilIcon } from "@/shared/icons";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { archiveHabit } from "../actions/archive-habit";
import type { HabitWithChecks } from "../types";
import { HabitHeatmap } from "./habit-heatmap";

export function HabitDetail({ habit }: { habit: HabitWithChecks }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleArchive() {
    if (!window.confirm(`Archive “${habit.name}”? Its history is kept.`)) {
      return;
    }
    startTransition(async () => {
      const result = await archiveHabit(habit.id);
      if (result.ok) router.push("/habits");
    });
  }

  const scheduleLabel =
    habit.frequency.days.length === 7
      ? "Every day"
      : WEEKDAYS.filter((w) => habit.frequency.days.includes(w.index))
          .map((w) => w.short)
          .join(" · ");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="text-4xl" aria-hidden>
          {habit.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-bold">{habit.name}</h1>
          <p className="text-sm text-muted-foreground">{scheduleLabel}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="flex flex-col items-center gap-1 px-2 py-4">
            <span className="flex items-center gap-1 font-heading text-2xl font-bold text-primary">
              <FlameIcon className="size-5" />
              {habit.streak.current}
            </span>
            <span className="text-xs text-muted-foreground">Streak</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-1 px-2 py-4">
            <span className="font-heading text-2xl font-bold">
              {habit.streak.longest}
            </span>
            <span className="text-xs text-muted-foreground">Best</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-1 px-2 py-4">
            <span className="font-heading text-2xl font-bold">
              {habit.checkedDates.length}
            </span>
            <span className="text-xs text-muted-foreground">Checks</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="px-4 py-4">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">
            Last 365 days
          </h2>
          <HabitHeatmap
            checkedDates={habit.checkedDates}
            scheduledDays={habit.frequency.days}
            color={habit.color}
          />
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button asChild variant="outline" className="h-11 flex-1">
          <Link href={`/habits/${habit.id}/edit`}>
            <PencilIcon className="size-4" />
            Edit
          </Link>
        </Button>
        <Button
          variant="outline"
          disabled={isPending}
          onClick={handleArchive}
          className="h-11 flex-1 text-muted-foreground"
        >
          <ArchiveIcon className="size-4" />
          Archive
        </Button>
      </div>
    </div>
  );
}
