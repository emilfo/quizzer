create or replace function public.build_final_leaderboard_json(p_session_id uuid)
returns jsonb
language sql
stable
set search_path = public
as $$
  with participant_scores as (
    select
      participants.id as participant_id,
      participants.nickname,
      participants.created_at,
      coalesce(sum(answers.awarded_score), 0)::integer as total_score
    from public.participants
    left join public.answers
      on answers.session_id = participants.session_id
     and answers.participant_id = participants.id
    where participants.session_id = p_session_id
    group by participants.id, participants.nickname, participants.created_at
  ),
  ranked as (
    select
      participant_scores.*,
      rank() over (order by total_score desc) as current_rank
    from participant_scores
  ),
  ordered as (
    select *
    from ranked
    order by total_score desc, created_at asc
    limit 3
  )
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'participantId', participant_id,
        'nickname', nickname,
        'totalScore', total_score,
        'roundScore', 0,
        'rank', current_rank,
        'previousRank', current_rank,
        'movement', 0
      )
      order by total_score desc, created_at asc
    ),
    '[]'::jsonb
  )
  from ordered;
$$;

create or replace function public.get_public_session_state(p_join_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session record;
  v_correct_option_id uuid;
  v_question jsonb := null;
  v_reveal jsonb := null;
  v_final_results jsonb := null;
begin
  select
    quiz_sessions.id,
    quiz_sessions.join_code,
    quiz_sessions.quiz_title,
    quiz_sessions.state,
    quiz_sessions.round_state,
    quiz_sessions.current_question_id,
    quiz_sessions.current_question_position,
    public_session_lobbies.participant_count,
    questions.prompt
  into v_session
  from public.quiz_sessions
  join public.public_session_lobbies on public_session_lobbies.session_id = quiz_sessions.id
  left join public.questions on questions.id = quiz_sessions.current_question_id
  where quiz_sessions.join_code = upper(btrim(coalesce(p_join_code, '')))
    and quiz_sessions.state in ('lobby', 'in_progress', 'finished');

  if v_session.id is null then
    return null;
  end if;

  if v_session.state = 'in_progress' and v_session.current_question_id is not null then
    v_question := jsonb_build_object(
      'id', v_session.current_question_id,
      'position', v_session.current_question_position,
      'prompt', coalesce(v_session.prompt, ''),
      'options', public.build_question_options_json(v_session.current_question_id)
    );
  end if;

  if v_session.round_state = 'round_results' and v_session.current_question_id is not null then
    select id
    into v_correct_option_id
    from public.question_options
    where question_options.question_id = v_session.current_question_id
      and question_options.is_correct
    order by question_options.position asc
    limit 1;

    v_reveal := jsonb_build_object(
      'correctOptionId', v_correct_option_id,
      'leaderboard', public.build_session_leaderboard_json(v_session.id, v_session.current_question_id)
    );
  end if;

  if v_session.state = 'finished' then
    v_final_results := jsonb_build_object(
      'leaderboard', public.build_final_leaderboard_json(v_session.id)
    );
  end if;

  return jsonb_build_object(
    'sessionId', v_session.id,
    'joinCode', v_session.join_code,
    'quizTitle', v_session.quiz_title,
    'sessionState', v_session.state,
    'roundState', v_session.round_state,
    'participantCount', v_session.participant_count,
    'question', v_question,
    'reveal', v_reveal,
    'finalResults', v_final_results
  );
end;
$$;

create or replace function public.get_player_session_state(p_join_code text, p_participant_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_public_state jsonb := public.get_public_session_state(p_join_code);
  v_session_id uuid := (v_public_state ->> 'sessionId')::uuid;
  v_question_id uuid := (v_public_state -> 'question' ->> 'id')::uuid;
  v_session_state public.session_state := coalesce((v_public_state ->> 'sessionState')::public.session_state, 'lobby'::public.session_state);
  v_round_state public.round_state := coalesce((v_public_state ->> 'roundState')::public.round_state, 'waiting'::public.round_state);
  v_answer_participant_id uuid := null;
  v_answer_option_id uuid := null;
  v_answer_is_correct boolean := null;
  v_final_result jsonb := null;
begin
  if v_public_state is null or v_session_id is null or p_participant_id is null then
    return v_public_state;
  end if;

  if v_question_id is not null then
    select
      answers.participant_id,
      answers.question_option_id,
      answers.is_correct
    into v_answer_participant_id, v_answer_option_id, v_answer_is_correct
    from public.answers
    where answers.session_id = v_session_id
      and answers.question_id = v_question_id
      and answers.participant_id = p_participant_id;
  end if;

  if v_session_state = 'finished' then
    with participant_scores as (
      select
        participants.id as participant_id,
        participants.nickname,
        participants.created_at,
        coalesce(sum(answers.awarded_score), 0)::integer as total_score
      from public.participants
      left join public.answers
        on answers.session_id = participants.session_id
       and answers.participant_id = participants.id
      where participants.session_id = v_session_id
      group by participants.id, participants.nickname, participants.created_at
    ),
    ranked as (
      select
        participant_scores.*,
        rank() over (order by total_score desc) as current_rank
      from participant_scores
    )
    select jsonb_build_object(
      'participantId', participant_id,
      'nickname', nickname,
      'rank', current_rank,
      'totalScore', total_score
    )
    into v_final_result
    from ranked
    where participant_id = p_participant_id
    order by total_score desc, created_at asc
    limit 1;
  end if;

  return v_public_state || jsonb_build_object(
    'player',
    jsonb_build_object(
      'participantId', p_participant_id,
      'hasAnswered', v_answer_participant_id is not null,
      'selectedOptionId', v_answer_option_id,
      'isCorrect', case when v_round_state = 'round_results' then v_answer_is_correct else null end
    ),
    'finalResult', v_final_result
  );
end;
$$;

create or replace function public.advance_live_round(p_session_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_session public.quiz_sessions%rowtype;
  v_next_question record;
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

  if v_session.state <> 'in_progress' or v_session.round_state <> 'round_results' or v_session.current_question_position is null then
    raise exception 'Round results are not active';
  end if;

  select questions.id, questions.position
  into v_next_question
  from public.questions
  where questions.quiz_id = v_session.quiz_id
    and questions.position > v_session.current_question_position
  order by questions.position asc
  limit 1;

  if v_next_question.id is null then
    update public.quiz_sessions
    set state = 'finished',
        ended_at = coalesce(ended_at, v_now),
        round_state = 'waiting',
        round_started_at = null,
        round_closed_at = v_now
    where id = v_session.id;
  else
    update public.quiz_sessions
    set current_question_id = v_next_question.id,
        current_question_position = v_next_question.position,
        round_state = 'question_open',
        round_started_at = v_now,
        round_closed_at = null
    where id = v_session.id;
  end if;
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
    and quiz_sessions.state in ('lobby', 'in_progress', 'finished');
$$;

grant execute on function public.advance_live_round(uuid) to authenticated;
