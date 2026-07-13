"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  HABIT_COLORS,
  HABIT_COLOR_KEYS,
  HABIT_EMOJIS,
  WEEKDAYS,
  type HabitColor,
} from "@/shared/constants";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { createHabit } from "../actions/create-habit";
import { updateHabit } from "../actions/update-habit";
import type { Habit } from "../types";

export function HabitForm({ habit }: { habit?: Habit }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(habit?.name ?? "");
  const [emoji, setEmoji] = useState(habit?.emoji ?? HABIT_EMOJIS[0]);
  const [color, setColor] = useState<HabitColor>(habit?.color ?? "flame");
  const [days, setDays] = useState<number[]>(
    habit?.frequency.days ?? [0, 1, 2, 3, 4, 5, 6]
  );

  function toggleDay(day: number) {
    setDays((current) =>
      current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const input = { name, emoji, color, days };
      const result = habit
        ? await updateHabit(habit.id, input)
        : await createHabit(input);
      if (result.ok) {
        router.push(habit ? `/habits/${habit.id}` : "/habits");
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="habit-name">Name</Label>
        <Input
          id="habit-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Drink water"
          maxLength={80}
          required
          className="h-11"
        />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">Emoji</legend>
        <div className="grid grid-cols-6 gap-2">
          {HABIT_EMOJIS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setEmoji(option)}
              aria-pressed={emoji === option}
              className={cn(
                "flex size-11 items-center justify-center rounded-lg border text-xl transition-colors",
                emoji === option
                  ? "border-primary bg-accent"
                  : "border-border bg-card"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">Color</legend>
        <div className="flex flex-wrap gap-3">
          {HABIT_COLOR_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setColor(key)}
              aria-label={key}
              aria-pressed={color === key}
              className={cn(
                "size-9 rounded-full transition-transform",
                color === key && "scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-background"
              )}
              style={{ backgroundColor: HABIT_COLORS[key].css }}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">Days</legend>
        <div className="flex gap-1.5">
          {WEEKDAYS.map((weekday) => (
            <button
              key={weekday.index}
              type="button"
              onClick={() => toggleDay(weekday.index)}
              aria-pressed={days.includes(weekday.index)}
              aria-label={weekday.short}
              className={cn(
                "flex h-11 flex-1 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                days.includes(weekday.index)
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground"
              )}
            >
              {weekday.letter}
            </button>
          ))}
        </div>
      </fieldset>

      {error && <p className="text-sm text-error">{error}</p>}

      <Button
        type="submit"
        disabled={isPending || name.trim().length === 0 || days.length === 0}
        className="h-12 w-full"
      >
        {isPending
          ? "Saving…"
          : habit
            ? "Save changes"
            : "Create habit"}
      </Button>
    </form>
  );
}
