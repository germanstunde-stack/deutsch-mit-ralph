-- Ranking em 3 categorias: "exercise_stats"/"leaderboard" (Exercícios) já existem prontos (0003).
-- "exam_results" (Provas, com mode com_consulta/sem_consulta) estava só na 0001, que nunca
-- rodou nesse banco (só a 0003 "auto-suficiente" rodou) — por isso criamos aqui também,
-- com IF NOT EXISTS pra não dar erro se já existir.

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

-- Só falta a view agregada de provas: melhor nota, soma e média de todas as tentativas,
-- pra permitir comparar desempenho de todas as formas (pedido do usuário).
create or replace view public.leaderboard_provas
with (security_invoker = false) as
  select
    p.id,
    coalesce(p.display_name, 'Anônimo') as display_name,
    p.birthdate,
    e.mode,
    max(e.score) as melhor,
    sum(e.score) as soma,
    round(avg(e.score), 1) as media,
    count(*) as tentativas,
    max(e.total) as total
  from public.exam_results e
  join public.profiles p on p.id = e.user_id
  group by p.id, p.display_name, p.birthdate, e.mode
  order by melhor desc;

grant select on public.leaderboard_provas to anon, authenticated;
