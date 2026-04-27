create or replace function public.generate_join_code()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text;
  v_chars constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_length integer := length(v_chars);
  v_index integer;
begin
  loop
    v_code := '';

    for v_index in 1..6 loop
      v_code := v_code || substr(v_chars, 1 + floor(random() * v_length)::integer, 1);
    end loop;

    exit when not exists (
      select 1
      from public.quiz_sessions
      where join_code = v_code
    );
  end loop;

  return v_code;
end;
$$;

create or replace function public.sync_public_session_lobby()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    delete from public.public_session_lobbies
    where session_id = old.id;

    return old;
  end if;

  insert into public.public_session_lobbies (session_id, join_code, quiz_title, state, participant_count)
  values (
    new.id,
    new.join_code,
    new.quiz_title,
    new.state,
    (
      select count(*)::integer
      from public.participants
      where participants.session_id = new.id
    )
  )
  on conflict (session_id) do update
  set join_code = excluded.join_code,
      quiz_title = excluded.quiz_title,
      state = excluded.state,
      participant_count = excluded.participant_count;

  return new;
end;
$$;

create or replace function public.sync_public_session_participant_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session_id uuid := coalesce(new.session_id, old.session_id);
begin
  update public.public_session_lobbies
  set participant_count = (
    select count(*)::integer
    from public.participants
    where participants.session_id = v_session_id
  )
  where session_id = v_session_id;

  return coalesce(new, old);
end;
$$;

create trigger quiz_sessions_sync_public_lobby
after insert or update or delete on public.quiz_sessions
for each row
execute function public.sync_public_session_lobby();

create trigger participants_sync_public_lobby_count
after insert or update or delete on public.participants
for each row
execute function public.sync_public_session_participant_count();

create or replace function public.create_live_session(p_quiz_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_session_id uuid;
  v_quiz record;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select id, host_id, title, status
  into v_quiz
  from public.quizzes
  where id = p_quiz_id;

  if v_quiz is null or v_quiz.host_id <> v_user_id then
    raise exception 'Quiz not found or not owned by user';
  end if;

  if v_quiz.status <> 'published' then
    raise exception 'Only published quizzes can start sessions';
  end if;

  insert into public.quiz_sessions (quiz_id, quiz_title, host_id, join_code)
  values (v_quiz.id, v_quiz.title, v_user_id, public.generate_join_code())
  returning id into v_session_id;

  return v_session_id;
exception
  when unique_violation then
    raise exception 'Host already has an active session';
end;
$$;

create or replace function public.start_live_session(p_session_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  update public.quiz_sessions
  set state = 'in_progress',
      started_at = coalesce(started_at, timezone('utc', now()))
  where id = p_session_id
    and host_id = v_user_id
    and state = 'lobby';

  if not found then
    raise exception 'Session not found, not owned by user, or not in lobby';
  end if;
end;
$$;

create or replace function public.join_live_session(p_join_code text, p_nickname text)
returns table (session_id uuid, participant_id uuid, nickname text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session public.quiz_sessions%rowtype;
  v_nickname text := btrim(coalesce(p_nickname, ''));
begin
  if v_nickname = '' then
    raise exception 'Nickname is required';
  end if;

  if char_length(v_nickname) > 32 then
    raise exception 'Nickname must be 32 characters or fewer';
  end if;

  select * into v_session
  from public.quiz_sessions
  where join_code = upper(btrim(coalesce(p_join_code, '')));

  if v_session.id is null then
    raise exception 'Session not found';
  end if;

  if v_session.state <> 'lobby' then
    raise exception 'Session is not accepting joins';
  end if;

  insert into public.participants (session_id, nickname)
  values (v_session.id, v_nickname)
  returning participants.session_id, participants.id, participants.nickname
  into session_id, participant_id, nickname;

  return next;
end;
$$;

create or replace function public.get_session_participant(p_session_id uuid, p_participant_id uuid)
returns table (id uuid, nickname text)
language sql
security definer
set search_path = public
as $$
  select participants.id, participants.nickname
  from public.participants
  join public.quiz_sessions on quiz_sessions.id = participants.session_id
  where participants.session_id = p_session_id
    and participants.id = p_participant_id
    and quiz_sessions.state in ('lobby', 'in_progress');
$$;

grant select, insert, update on public.quiz_sessions to authenticated;
grant select on public.public_session_lobbies to anon, authenticated;
grant insert on public.participants to anon, authenticated;

alter publication supabase_realtime add table public.quiz_sessions;
alter publication supabase_realtime add table public.participants;
alter publication supabase_realtime add table public.public_session_lobbies;

grant execute on function public.create_live_session(uuid) to authenticated;
grant execute on function public.get_session_participant(uuid, uuid) to anon, authenticated;
grant execute on function public.join_live_session(text, text) to anon, authenticated;
grant execute on function public.start_live_session(uuid) to authenticated;
