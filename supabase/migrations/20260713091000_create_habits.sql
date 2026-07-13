create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  emoji text not null default '🔥',
  color text not null default 'flame',
  frequency jsonb not null default '{"days":[0,1,2,3,4,5,6]}'::jsonb,
  created_at timestamptz not null default now(),
  archived_at timestamptz
);

create index habits_user_id_idx on public.habits (user_id);

alter table public.habits enable row level security;

create policy "habits_select_own"
  on public.habits for select
  using (auth.uid() = user_id);

create policy "habits_insert_own"
  on public.habits for insert
  with check (auth.uid() = user_id);

create policy "habits_update_own"
  on public.habits for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "habits_delete_own"
  on public.habits for delete
  using (auth.uid() = user_id);

create table public.habit_checks (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  checked_date date not null,
  created_at timestamptz not null default now(),
  unique (habit_id, checked_date)
);

create index habit_checks_user_date_idx on public.habit_checks (user_id, checked_date);
create index habit_checks_habit_id_idx on public.habit_checks (habit_id);

alter table public.habit_checks enable row level security;

create policy "habit_checks_select_own"
  on public.habit_checks for select
  using (auth.uid() = user_id);

create policy "habit_checks_insert_own"
  on public.habit_checks for insert
  with check (auth.uid() = user_id);

create policy "habit_checks_delete_own"
  on public.habit_checks for delete
  using (auth.uid() = user_id);
