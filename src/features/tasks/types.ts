export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  user_id: string;
  title: string;
  notes: string | null;
  due_date: string | null;
  priority: TaskPriority;
  completed_at: string | null;
  created_at: string;
};

export type TaskInput = {
  title: string;
  notes: string | null;
  due_date: string | null;
  priority: TaskPriority;
};

export type TaskSections = {
  today: Task[];
  upcoming: Task[];
  completed: Task[];
};

export type ActionResult = { ok: true } | { ok: false; error: string };
