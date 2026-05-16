create or replace function public.end_live_session(p_session_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_session public.quiz_sessions%rowtype;
  v_now timestamptz := timezone('utc', now());
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select * into v_session
  from public.quiz_sessions
  where id = p_session_id
    and host_id = v_user_id
  for update;

  if v_session.id is null then
    raise exception 'Session not found or not owned by user';
  end if;

  if v_session.state = 'finished' then
    return;
  end if;

  update public.quiz_sessions
  set state = 'finished',
      ended_at = coalesce(ended_at, v_now),
      round_state = 'waiting',
      round_started_at = null,
      round_closed_at = v_now
  where id = v_session.id;
end;
$$;

grant execute on function public.end_live_session(uuid) to authenticated;
