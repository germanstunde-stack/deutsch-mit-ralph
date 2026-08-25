-- MODELO FINAL (rode este; é auto-suficiente e limpa o modelo intermediário).
-- Login: confirmação de e-mail na 1ª vez (Supabase Auth, link no e-mail). Depois a sessão
-- fica salva e não pede de novo. Cadastro obrigatório: apelido + data de nascimento.
-- Ranking mostra SÓ apelido + data de nascimento (nunca o e-mail).

-- limpa o modelo intermediário por e-mail, se existir
drop view if exists public.leaderboard;
drop function if exists public.join_player(text,text);
drop function if exists public.set_name(text,text);
drop function if exists public.add_result(text,int,int);
drop table if exists public.players;

-- ===== profiles (com data de nascimento) =====
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text, display_name text, birthdate date, created_at timestamptz not null default now()
);
alter table public.profiles add column if not exists birthdate date;
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.profiles(id, email) values(new.id, new.email) on conflict(id) do nothing; return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- ===== exercise_stats (ranking) =====
create table if not exists public.exercise_stats (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  correct integer not null default 0, wrong integer not null default 0, updated_at timestamptz not null default now()
);
alter table public.exercise_stats enable row level security;
drop policy if exists "stats_select_own" on public.exercise_stats;
create policy "stats_select_own" on public.exercise_stats for select using (auth.uid() = user_id);
drop policy if exists "stats_insert_own" on public.exercise_stats;
create policy "stats_insert_own" on public.exercise_stats for insert with check (auth.uid() = user_id);
drop policy if exists "stats_update_own" on public.exercise_stats;
create policy "stats_update_own" on public.exercise_stats for update using (auth.uid() = user_id);

create or replace function public.add_exercise_result(p_correct int, p_wrong int)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.exercise_stats(user_id, correct, wrong, updated_at)
  values(auth.uid(), greatest(p_correct,0), greatest(p_wrong,0), now())
  on conflict(user_id) do update
    set correct = public.exercise_stats.correct + greatest(p_correct,0),
        wrong   = public.exercise_stats.wrong   + greatest(p_wrong,0),
        updated_at = now();
end; $$;

-- ===== ranking: só apelido + data de nascimento (sem e-mail) =====
create or replace view public.leaderboard with (security_invoker = false) as
  select p.id, coalesce(p.display_name,'Anônimo') as display_name, p.birthdate,
    s.correct, s.wrong, (s.correct + s.wrong) as total,
    case when (s.correct + s.wrong) > 0 then round(100.0 * s.correct / (s.correct + s.wrong)) else 0 end as accuracy
  from public.exercise_stats s join public.profiles p on p.id = s.user_id
  order by s.correct desc, accuracy desc;
grant select on public.leaderboard to anon, authenticated;
