-- Deutsch mit Ralph — schema inicial
-- Rode no SQL Editor do Supabase (ou via `supabase db push`).

-- ========== profiles ==========
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- cria o profile automaticamente quando um usuário se cadastra
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ========== exercise_stats (alimenta o ranking) ==========
create table if not exists public.exercise_stats (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  correct integer not null default 0,
  wrong integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.exercise_stats enable row level security;

drop policy if exists "stats_select_own" on public.exercise_stats;
create policy "stats_select_own" on public.exercise_stats
  for select using (auth.uid() = user_id);

drop policy if exists "stats_upsert_own" on public.exercise_stats;
create policy "stats_insert_own" on public.exercise_stats
  for insert with check (auth.uid() = user_id);
create policy "stats_update_own" on public.exercise_stats
  for update using (auth.uid() = user_id);

-- soma acertos/erros de forma atômica
create or replace function public.add_exercise_result(p_correct int, p_wrong int)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.exercise_stats (user_id, correct, wrong, updated_at)
  values (auth.uid(), greatest(p_correct,0), greatest(p_wrong,0), now())
  on conflict (user_id) do update
    set correct = public.exercise_stats.correct + greatest(p_correct,0),
        wrong   = public.exercise_stats.wrong   + greatest(p_wrong,0),
        updated_at = now();
end;
$$;

-- ========== exam_results ==========
create table if not exists public.exam_results (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  module text not null default 'A0',
  mode text not null check (mode in ('com_consulta','sem_consulta')),
  score integer not null,
  total integer not null,
  duration_sec integer not null default 0,
  taken_at timestamptz not null default now()
);

alter table public.exam_results enable row level security;

drop policy if exists "exam_select_own" on public.exam_results;
create policy "exam_select_own" on public.exam_results
  for select using (auth.uid() = user_id);

drop policy if exists "exam_insert_own" on public.exam_results;
create policy "exam_insert_own" on public.exam_results
  for insert with check (auth.uid() = user_id);

-- ========== progress (por tema) ==========
create table if not exists public.progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  topic text not null,
  completed boolean not null default false,
  hard_words jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, topic)
);

alter table public.progress enable row level security;

drop policy if exists "progress_select_own" on public.progress;
create policy "progress_select_own" on public.progress
  for select using (auth.uid() = user_id);

drop policy if exists "progress_upsert_own" on public.progress;
create policy "progress_insert_own" on public.progress
  for insert with check (auth.uid() = user_id);
create policy "progress_update_own" on public.progress
  for update using (auth.uid() = user_id);

-- ========== ranking (view pública: só nome + totais, sem e-mail) ==========
create or replace view public.leaderboard
with (security_invoker = false) as
  select
    p.id,
    coalesce(p.display_name, 'Anônimo') as display_name,
    s.correct,
    s.wrong,
    (s.correct + s.wrong) as total,
    case when (s.correct + s.wrong) > 0
      then round(100.0 * s.correct / (s.correct + s.wrong))
      else 0 end as accuracy
  from public.exercise_stats s
  join public.profiles p on p.id = s.user_id
  order by s.correct desc, accuracy desc;

grant select on public.leaderboard to anon, authenticated;
