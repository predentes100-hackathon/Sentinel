create extension if not exists pgcrypto;

create table if not exists public.member_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  level integer not null default 1,
  xp integer not null default 0,
  xp_goal integer not null default 100,
  total_balance numeric not null default 0,
  monthly_spend numeric not null default 0,
  monthly_earned numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  priority text not null,
  xp_value integer not null,
  due_label text not null default 'Today',
  completed boolean not null default false,
  recurrence_type text not null default 'once',
  scheduled_time text,
  last_completed_on date,
  created_at timestamptz not null default now()
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  icon_key text not null,
  xp_value integer not null default 10,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  transaction_date date not null default current_date,
  task_name text not null,
  category text not null,
  transaction_type text not null check (transaction_type in ('Spend', 'Earn')),
  amount numeric not null,
  split_status text not null default 'Solo',
  participants text[] not null default '{}',
  owed_to_me numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  amount numeric not null,
  frequency text not null,
  next_due_at timestamptz not null,
  reminder_minutes integer not null default 60,
  created_at timestamptz not null default now()
);

alter table public.member_profiles alter column level set default 1;
alter table public.member_profiles alter column xp set default 0;
alter table public.member_profiles alter column xp_goal set default 100;
alter table public.member_profiles alter column total_balance set default 0;
alter table public.member_profiles alter column monthly_spend set default 0;
alter table public.member_profiles alter column monthly_earned set default 0;
alter table public.tasks add column if not exists recurrence_type text not null default 'once';
alter table public.tasks add column if not exists scheduled_time text;
alter table public.tasks add column if not exists last_completed_on date;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'tasks_recurrence_type_check'
  ) then
    alter table public.tasks
    add constraint tasks_recurrence_type_check
    check (recurrence_type in ('once', 'daily'));
  end if;
end $$;

alter table public.member_profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.habits enable row level security;
alter table public.transactions enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "Users manage own profile" on public.member_profiles;
create policy "Users manage own profile"
on public.member_profiles
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users manage own tasks" on public.tasks;
create policy "Users manage own tasks"
on public.tasks
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users manage own habits" on public.habits;
create policy "Users manage own habits"
on public.habits
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users manage own transactions" on public.transactions;
create policy "Users manage own transactions"
on public.transactions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users manage own subscriptions" on public.subscriptions;
create policy "Users manage own subscriptions"
on public.subscriptions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
