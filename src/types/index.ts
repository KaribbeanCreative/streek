/**
 * Types partagés de l'application Streek.
 *
 * Les types `Database` générés depuis le schéma Supabase viendront s'ajouter
 * ici plus tard ; pour l'instant les types métier sont écrits à la main.
 */

/** Priorité d'une tâche. Doit rester aligné avec la contrainte CHECK en base. */
export type TaskPriority = "low" | "medium" | "high";

/** Une tâche telle que stockée dans la table `public.tasks`. */
export type Task = {
  id: string;
  user_id: string;
  title: string;
  /** Date d'échéance au format ISO "YYYY-MM-DD", ou `null` si aucune. */
  due_date: string | null;
  priority: TaskPriority;
  completed: boolean;
  created_at: string;
  updated_at: string;
};
