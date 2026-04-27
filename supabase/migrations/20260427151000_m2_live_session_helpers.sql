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

grant select, insert, update on public.quiz_sessions to authenticated;
grant select on public.quiz_sessions to anon;
grant select, insert on public.participants to anon, authenticated;

grant execute on function public.create_live_session(uuid) to authenticated;
grant execute on function public.start_live_session(uuid) to authenticated;
