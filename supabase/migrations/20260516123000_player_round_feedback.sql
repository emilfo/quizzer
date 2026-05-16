create or replace function public.get_player_session_state(p_join_code text, p_participant_id uuid, p_session_token text)
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
  v_round_score integer := null;
  v_points_behind_next integer := null;
begin
  if v_public_state is null or v_session_id is null or p_participant_id is null then
    return v_public_state;
  end if;

  if not exists (
    select 1
    from public.participants
    where participants.id = p_participant_id
      and participants.session_id = v_session_id
      and participants.session_token_hash = encode(extensions.digest(coalesce(p_session_token, ''), 'sha256'), 'hex')
  ) then
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

  if v_session_state = 'in_progress' and v_round_state = 'round_results' and v_question_id is not null then
    with participant_scores as (
      select
        participants.id as participant_id,
        coalesce(sum(answers.awarded_score), 0)::integer as total_score,
        coalesce(sum(answers.awarded_score) filter (where answers.question_id = v_question_id), 0)::integer as round_score
      from public.participants
      left join public.answers
        on answers.session_id = participants.session_id
       and answers.participant_id = participants.id
      where participants.session_id = v_session_id
      group by participants.id
    ),
    current_player as (
      select total_score, round_score
      from participant_scores
      where participant_id = p_participant_id
      limit 1
    )
    select
      current_player.round_score,
      (
        select min(other.total_score) - current_player.total_score
        from participant_scores other
        where other.total_score > current_player.total_score
      )
    into v_round_score, v_points_behind_next
    from current_player;
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
      'isCorrect', case when v_session_state = 'in_progress' and v_round_state = 'round_results' then v_answer_is_correct else null end,
      'roundScore', case when v_session_state = 'in_progress' and v_round_state = 'round_results' then v_round_score else null end,
      'pointsBehindNext', case when v_session_state = 'in_progress' and v_round_state = 'round_results' then v_points_behind_next else null end
    ),
    'finalResult', v_final_result
  );
end;
$$;
