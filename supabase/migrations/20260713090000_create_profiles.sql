-- Profiles: one row per auth user, created by trigger on signup.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  marketing_opt_in boolean not null default false,
  plan text not null default 'free',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, marketing_opt_in)
  values (
    new.id,
    lower(new.email),
    coalesce((new.raw_user_meta_data ->> 'marketing_opt_in')::boolean, false)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
