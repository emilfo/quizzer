create type public.session_state as enum ('lobby', 'in_progress', 'finished');

create table public.quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  quiz_title text not null,
  host_id uuid not null references public.profiles (id) on delete cascade,
  join_code text not null,
  state public.session_state not null default 'lobby',
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (join_code)
);

create table public.participants (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.quiz_sessions (id) on delete cascade,
  nickname text not null check (nullif(btrim(nickname), '') is not null and char_length(btrim(nickname)) <= 32),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (session_id, nickname)
);

create table public.public_session_lobbies (
  session_id uuid primary key references public.quiz_sessions (id) on delete cascade,
  join_code text not null,
  quiz_title text not null,
  state public.session_state not null,
  participant_count integer not null default 0 check (participant_count >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (join_code)
);

create unique index quiz_sessions_one_active_session_per_host
on public.quiz_sessions (host_id)
where state in ('lobby', 'in_progress');

create index quiz_sessions_join_code_idx on public.quiz_sessions (join_code);
create index participants_session_id_idx on public.participants (session_id);
create index public_session_lobbies_join_code_idx on public.public_session_lobbies (join_code);

create trigger quiz_sessions_set_updated_at
before update on public.quiz_sessions
for each row
execute function public.set_updated_at();

create trigger participants_set_updated_at
before update on public.participants
for each row
execute function public.set_updated_at();

create trigger public_session_lobbies_set_updated_at
before update on public.public_session_lobbies
for each row
execute function public.set_updated_at();

alter table public.quiz_sessions enable row level security;
alter table public.participants enable row level security;
alter table public.public_session_lobbies enable row level security;

create policy "hosts can read own sessions"
on public.quiz_sessions
for select
to authenticated
using ((select auth.uid()) = host_id);

create policy "hosts can create own sessions"
on public.quiz_sessions
for insert
to authenticated
with check ((select auth.uid()) = host_id);

create policy "hosts can update own sessions"
on public.quiz_sessions
for update
to authenticated
using ((select auth.uid()) = host_id)
with check ((select auth.uid()) = host_id);

create policy "hosts can read participants in own sessions"
on public.participants
for select
to authenticated
using (
  exists (
    select 1
    from public.quiz_sessions
    where quiz_sessions.id = participants.session_id
      and quiz_sessions.host_id = (select auth.uid())
  )
);

create policy "public can join lobby sessions"
on public.participants
for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.quiz_sessions
    where quiz_sessions.id = participants.session_id
      and quiz_sessions.state = 'lobby'
  )
);

create policy "public can read session lobbies"
on public.public_session_lobbies
for select
to anon, authenticated
using (state in ('lobby', 'in_progress'));
