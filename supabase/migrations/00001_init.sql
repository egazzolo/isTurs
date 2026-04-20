-- profiles: one row per auth user, tracks plan + stripe info
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  plan text not null default 'free' check (plan in ('free','pro')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  subscription_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- activities: teacher-created games
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  type text not null check (type in ('quiz','match_up','whack_a_mole','spin_wheel')),
  title text not null,
  slug text not null unique,
  content jsonb not null default '{}'::jsonb,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.activities(user_id);
create index on public.activities(slug);

-- results: one row per anonymous student playthrough
create table public.results (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities on delete cascade,
  score integer,
  max_score integer,
  completion_time_seconds integer,
  payload jsonb not null default '{}'::jsonb,
  played_at timestamptz not null default now()
);
create index on public.results(activity_id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.activities enable row level security;
alter table public.results enable row level security;

-- profiles: user can read/update own row
create policy "own profile read" on public.profiles for select using (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- activities: owner full access; anyone can SELECT if is_public
create policy "owner all" on public.activities for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "public read" on public.activities for select using (is_public = true);

-- results: owner can read results for their activities; anyone can insert
create policy "owner read results" on public.results for select
  using (exists (select 1 from public.activities a where a.id = activity_id and a.user_id = auth.uid()));
create policy "public insert results" on public.results for insert
  with check (exists (select 1 from public.activities a where a.id = activity_id and a.is_public = true));
