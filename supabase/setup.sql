-- NRS 疼痛評估系統：空白 Supabase 專案第一次執行

create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user'
    check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table public.pain_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  participant_name text not null check (char_length(participant_name) between 1 and 50),
  age integer check (age between 0 and 120),
  biological_sex text check (
    biological_sex is null
    or biological_sex in ('male', 'female', 'other', 'prefer_not_to_say')
  ),
  pain_location text not null check (char_length(pain_location) between 1 and 100),
  pain_score integer not null check (pain_score between 0 and 10),
  pain_level text generated always as (
    case
      when pain_score = 0 then 'none'
      when pain_score between 1 and 3 then 'mild'
      when pain_score between 4 and 6 then 'moderate'
      else 'severe'
    end
  ) stored,
  analgesic_used boolean not null default false,
  notes text check (notes is null or char_length(notes) <= 500),
  assessed_at timestamptz not null default now()
);

create index pain_assessments_user_id_idx
  on public.pain_assessments(user_id);

create index pain_assessments_assessed_at_idx
  on public.pain_assessments(assessed_at desc);

-- 新 Auth 使用者建立時，自動建立一般使用者 profile。
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 在資料庫端確認管理員，前端無法假冒。
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.profiles enable row level security;
alter table public.pain_assessments enable row level security;

create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can insert own assessments"
on public.pain_assessments
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users read own and admins read all assessments"
on public.pain_assessments
for select
to authenticated
using (
  (select auth.uid()) = user_id
  or (select public.is_admin())
);

grant select on public.profiles to authenticated;
grant select, insert on public.pain_assessments to authenticated;

revoke all on public.profiles from anon;
revoke all on public.pain_assessments from anon;
