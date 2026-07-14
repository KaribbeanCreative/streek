import { z } from "zod";

const dateKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const quickTaskSchema = z.object({
  title: z.string().trim().min(1, "Give your task a title.").max(200),
});

export const taskInputSchema = z.object({
  title: z.string().trim().min(1, "Give your task a title.").max(200),
  notes: z
    .string()
    .trim()
    .max(2000)
    .transform((value) => (value.length > 0 ? value : null))
    .nullable(),
  due_date: dateKey.nullable(),
  priority: z.enum(["low", "medium", "high"]),
});

export const completeInputSchema = z.object({
  taskId: z.uuid(),
  date: dateKey,
});
