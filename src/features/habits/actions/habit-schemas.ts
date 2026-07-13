import { z } from "zod";
import { HABIT_COLOR_KEYS } from "@/shared/constants";

export const habitInputSchema = z.object({
  name: z.string().trim().min(1, "Give your habit a name.").max(80),
  emoji: z.string().min(1).max(8),
  color: z.enum(HABIT_COLOR_KEYS),
  days: z
    .array(z.number().int().min(0).max(6))
    .min(1, "Pick at least one day.")
    .max(7),
});

export const checkInputSchema = z.object({
  habitId: z.uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
