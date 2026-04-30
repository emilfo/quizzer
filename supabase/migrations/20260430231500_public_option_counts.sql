create or replace function public.build_public_option_counts_json(p_session_id uuid, p_question_id uuid)
returns jsonb
language sql
stable
set search_path = public
as $$
  with option_counts as (
    select
      question_options.id as option_id,
      question_options.position,
      count(answers.id)::integer as response_count
    from public.question_options
    left join public.answers
      on answers.question_option_id = question_options.id
     and answers.session_id = p_session_id
     and answers.question_id = p_question_id
    where question_options.question_id = p_question_id
    group by question_options.id, question_options.position
  )
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'optionId', option_id,
        'position', position,
        'count', response_count
      )
      order by position asc
    ),
    '[]'::jsonb
  )
  from option_counts;
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

  if v_session.state = 'in_progress' and v_session.round_state = 'round_results' and v_session.current_question_id is not null then
    select id
    into v_correct_option_id
    from public.question_options
    where question_options.question_id = v_session.current_question_id
      and question_options.is_correct
    order by question_options.position asc
    limit 1;

    v_reveal := jsonb_build_object(
      'correctOptionId', v_correct_option_id,
      'optionCounts', public.build_public_option_counts_json(v_session.id, v_session.current_question_id),
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
