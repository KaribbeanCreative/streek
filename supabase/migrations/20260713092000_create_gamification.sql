create table public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('habit_checked', 'task_completed', 'goal_reached')),
  entity_id uuid,
  xp_earned integer not null default 0,
  created_at timestamptz not null default now()
);

create index events_user_id_idx on public.events (user_id, created_at desc);

alter table public.events enable row level security;

create policy "events_select_own"
  on public.events for select
  using (auth.uid() = user_id);

create policy "events_insert_own"
  on public.events for insert
  with check (auth.uid() = user_id);

create policy "events_delete_own"
  on public.events for delete
  using (auth.uid() = user_id);

create table public.user_stats (
  user_id uuid primary key references auth.users (id) on delete cascade,
  total_xp integer not null default 0,
  level integer not null default 1,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  freezes_available integer not null default 2,
  updated_at timestamptz not null default now()
);

alter table public.user_stats enable row level security;

create policy "user_stats_select_own"
  on public.user_stats for select
  using (auth.uid() = user_id);

create policy "user_stats_insert_own"
  on public.user_stats for insert
  with check (auth.uid() = user_id);

create policy "user_stats_update_own"
  on public.user_stats for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
