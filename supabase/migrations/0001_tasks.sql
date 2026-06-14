-- Migration 0001 — Module Tâches
-- À exécuter dans le SQL Editor du dashboard Supabase.
-- Crée la table public.tasks, son index, active RLS et définit les policies
-- pour que chaque utilisateur ne voie et ne manipule que ses propres tâches.

create table if not exists public.tasks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  title      text not null check (char_length(title) between 1 and 500),
  due_date   date,
  priority   text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  completed  boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_user_id_idx on public.tasks (user_id);

-- Row Level Security : seule protection des données côté base.
alter table public.tasks enable row level security;

create policy "Les utilisateurs lisent leurs tâches"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Les utilisateurs créent leurs tâches"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Les utilisateurs modifient leurs tâches"
  on public.tasks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Les utilisateurs suppriment leurs tâches"
  on public.tasks for delete
  using (auth.uid() = user_id);
