alter table public.participants
add column session_token_hash text;

drop function if exists public.get_player_session_state(text, uuid);
drop function if exists public.get_session_participant(uuid, uuid);
drop function if exists public.submit_player_answer(text, uuid, uuid);

drop policy if exists "public can read session lobbies" on public.public_session_lobbies;

create policy "public can read session lobbies"
on public.public_session_lobbies
for select
to anon, authenticated
using (state in ('lobby', 'in_progress', 'finished'));

create or replace function public.build_session_leaderboard_json(p_session_id uuid, p_question_id uuid)
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
      coalesce(sum(answers.awarded_score), 0)::integer as total_score,
      coalesce(sum(answers.awarded_score) filter (where answers.question_id = p_question_id), 0)::integer as round_score
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
      rank() over (order by total_score desc) as current_rank,
      rank() over (order by (total_score - round_score) desc) as previous_rank
    from participant_scores
  ),
  ordered as (
    select *
    from ranked
    where current_rank <= 3
    order by total_score desc, created_at asc
  )
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'participantId', participant_id,
        'nickname', nickname,
        'totalScore', total_score,
        'roundScore', round_score,
        'rank', current_rank,
        'previousRank', previous_rank,
        'movement', previous_rank - current_rank
      )
      order by total_score desc, created_at asc
    ),
    '[]'::jsonb
  )
  from ordered;
$$;

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
    where current_rank <= 3
    order by total_score desc, created_at asc
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

create or replace function public.join_live_session(p_join_code text, p_nickname text)
returns table (session_id uuid, participant_id uuid, nickname text, session_token text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session public.quiz_sessions%rowtype;
  v_nickname text := btrim(coalesce(p_nickname, ''));
  v_session_token text := encode(gen_random_bytes(24), 'base64url');
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

  insert into public.participants (session_id, nickname, session_token_hash)
  values (v_session.id, v_nickname, encode(digest(v_session_token, 'sha256'), 'hex'))
  returning participants.session_id, participants.id, participants.nickname
  into session_id, participant_id, nickname;

  session_token := v_session_token;
  return next;
end;
$$;

create or replace function public.get_session_participant(p_session_id uuid, p_participant_id uuid, p_session_token text)
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
    and participants.session_token_hash = encode(digest(coalesce(p_session_token, ''), 'sha256'), 'hex')
    and quiz_sessions.state in ('lobby', 'in_progress', 'finished');
$$;

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
begin
  if v_public_state is null or v_session_id is null or p_participant_id is null then
    return v_public_state;
  end if;

  if not exists (
    select 1
    from public.participants
    where participants.id = p_participant_id
      and participants.session_id = v_session_id
      and participants.session_token_hash = encode(digest(coalesce(p_session_token, ''), 'sha256'), 'hex')
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
      'isCorrect', case when v_session_state = 'in_progress' and v_round_state = 'round_results' then v_answer_is_correct else null end
    ),
    'finalResult', v_final_result
  );
end;
$$;

create or replace function public.submit_player_answer(p_join_code text, p_participant_id uuid, p_option_id uuid, p_session_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session public.quiz_sessions%rowtype;
  v_participant public.participants%rowtype;
  v_option public.question_options%rowtype;
  v_now timestamptz := timezone('utc', now());
  v_response_ms integer;
begin
  select * into v_session
  from public.quiz_sessions
  where join_code = upper(btrim(coalesce(p_join_code, '')))
  for update;

  if v_session.id is null then
    raise exception 'Session not found';
  end if;

  if v_session.state <> 'in_progress' or v_session.round_state <> 'question_open' or v_session.current_question_id is null then
    raise exception 'Round is not accepting answers';
  end if;

  select * into v_participant
  from public.participants
  where id = p_participant_id
    and session_id = v_session.id
    and session_token_hash = encode(digest(coalesce(p_session_token, ''), 'sha256'), 'hex');

  if v_participant.id is null then
    raise exception 'Participant not found';
  end if;

  select * into v_option
  from public.question_options
  where id = p_option_id
    and question_id = v_session.current_question_id;

  if v_option.id is null then
    raise exception 'Answer option not found';
  end if;

  v_response_ms := greatest(0, floor(extract(epoch from (v_now - coalesce(v_session.round_started_at, v_now))) * 1000)::integer);

  insert into public.answers (
    session_id,
    question_id,
    participant_id,
    question_option_id,
    is_correct,
    response_ms,
    submitted_at
  )
  values (
    v_session.id,
    v_session.current_question_id,
    v_participant.id,
    v_option.id,
    v_option.is_correct,
    v_response_ms,
    v_now
  );

  return jsonb_build_object(
    'participantId', v_participant.id,
    'questionId', v_session.current_question_id,
    'selectedOptionId', v_option.id,
    'submittedAt', v_now
  );
exception
  when unique_violation then
    raise exception 'Answer already submitted';
end;
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

grant execute on function public.get_player_session_state(text, uuid, text) to anon, authenticated;
grant execute on function public.get_session_participant(uuid, uuid, text) to anon, authenticated;
grant execute on function public.join_live_session(text, text) to anon, authenticated;
grant execute on function public.submit_player_answer(text, uuid, uuid, text) to anon, authenticated;
