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
  nickname text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (session_id, nickname)
);

create unique index quiz_sessions_one_active_session_per_host
on public.quiz_sessions (host_id)
where state in ('lobby', 'in_progress');

create index quiz_sessions_join_code_idx on public.quiz_sessions (join_code);
create index participants_session_id_idx on public.participants (session_id);

create trigger quiz_sessions_set_updated_at
before update on public.quiz_sessions
for each row
execute function public.set_updated_at();

create trigger participants_set_updated_at
before update on public.participants
for each row
execute function public.set_updated_at();

alter table public.quiz_sessions enable row level security;
alter table public.participants enable row level security;

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

create policy "public can read active sessions"
on public.quiz_sessions
for select
to anon, authenticated
using (state in ('lobby', 'in_progress'));

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

create policy "public can read active session participants"
on public.participants
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.quiz_sessions
    where quiz_sessions.id = participants.session_id
      and quiz_sessions.state in ('lobby', 'in_progress')
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
