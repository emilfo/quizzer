create type public.round_state as enum ('waiting', 'question_open', 'round_results');

alter table public.quiz_sessions
add column current_question_id uuid references public.questions (id) on delete set null,
add column current_question_position integer,
add column round_state public.round_state not null default 'waiting',
add column round_started_at timestamptz,
add column round_closed_at timestamptz;

create table public.answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.quiz_sessions (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  participant_id uuid not null references public.participants (id) on delete cascade,
  question_option_id uuid not null references public.question_options (id) on delete restrict,
  is_correct boolean,
  awarded_score integer not null default 0 check (awarded_score >= 0),
  awarded_bonus integer not null default 0 check (awarded_bonus >= 0),
  response_ms integer not null default 0 check (response_ms >= 0),
  submitted_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (session_id, question_id, participant_id)
);

alter table public.participants
add constraint participants_session_id_id_key unique (session_id, id);

alter table public.question_options
add constraint question_options_question_id_id_key unique (question_id, id);

alter table public.answers
add constraint answers_participant_belongs_to_session_fk
foreign key (session_id, participant_id)
references public.participants (session_id, id)
on delete cascade,
add constraint answers_option_belongs_to_question_fk
foreign key (question_id, question_option_id)
references public.question_options (question_id, id)
on delete restrict;

create index answers_session_id_idx on public.answers (session_id);
create index answers_participant_id_idx on public.answers (participant_id);
create index answers_question_id_idx on public.answers (question_id);

create trigger answers_set_updated_at
before update on public.answers
for each row
execute function public.set_updated_at();

alter table public.answers enable row level security;

create policy "hosts can read answers in own sessions"
on public.answers
for select
to authenticated
using (
  exists (
    select 1
    from public.quiz_sessions
    where quiz_sessions.id = answers.session_id
      and quiz_sessions.host_id = (select auth.uid())
  )
);

create or replace function public.calculate_round_bonus(p_response_ms integer, p_round_duration_ms integer)
returns integer
language sql
immutable
as $$
  select case
    when p_round_duration_ms <= 0 then 500
    else greatest(0, least(500, round((1 - greatest(0, least(p_response_ms, p_round_duration_ms))::numeric / p_round_duration_ms::numeric) * 500)::integer))
  end;
$$;

create or replace function public.build_question_options_json(p_question_id uuid)
returns jsonb
language sql
stable
set search_path = public
as $$
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', question_options.id,
        'text', question_options.option_text,
        'position', question_options.position
      )
      order by question_options.position asc
    ),
    '[]'::jsonb
  )
  from public.question_options
  where question_options.question_id = p_question_id;
$$;

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
    order by total_score desc, created_at asc
    limit 3
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
    and quiz_sessions.state in ('lobby', 'in_progress');

  if v_session.id is null then
    return null;
  end if;

  if v_session.current_question_id is not null then
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

  return jsonb_build_object(
    'sessionId', v_session.id,
    'joinCode', v_session.join_code,
    'quizTitle', v_session.quiz_title,
    'sessionState', v_session.state,
    'roundState', v_session.round_state,
    'participantCount', v_session.participant_count,
    'question', v_question,
    'reveal', v_reveal
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
  v_round_state public.round_state := coalesce((v_public_state ->> 'roundState')::public.round_state, 'waiting'::public.round_state);
  v_answer record;
begin
  if v_public_state is null or v_session_id is null or p_participant_id is null then
    return v_public_state;
  end if;

  select
    answers.participant_id,
    answers.question_option_id,
    answers.is_correct
  into v_answer
  from public.answers
  where answers.session_id = v_session_id
    and answers.question_id = v_question_id
    and answers.participant_id = p_participant_id;

  return v_public_state || jsonb_build_object(
    'player',
    jsonb_build_object(
      'participantId', p_participant_id,
      'hasAnswered', v_answer.participant_id is not null,
      'selectedOptionId', v_answer.question_option_id,
      'isCorrect', case when v_round_state = 'round_results' then v_answer.is_correct else null end
    )
  );
end;
$$;

create or replace function public.submit_player_answer(p_join_code text, p_participant_id uuid, p_option_id uuid)
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
    and session_id = v_session.id;

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

create or replace function public.start_live_session(p_session_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_first_question record;
  v_now timestamptz := timezone('utc', now());
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select questions.id, questions.position
  into v_first_question
  from public.quiz_sessions
  join public.questions on questions.quiz_id = quiz_sessions.quiz_id
  where quiz_sessions.id = p_session_id
  order by questions.position asc
  limit 1;

  if v_first_question.id is null then
    raise exception 'Session quiz has no playable questions';
  end if;

  update public.quiz_sessions
  set state = 'in_progress',
      started_at = coalesce(started_at, v_now),
      current_question_id = v_first_question.id,
      current_question_position = v_first_question.position,
      round_state = 'question_open',
      round_started_at = v_now,
      round_closed_at = null
  where id = p_session_id
    and host_id = v_user_id
    and state = 'lobby';

  if not found then
    raise exception 'Session not found, not owned by user, or not in lobby';
  end if;
end;
$$;

create or replace function public.close_live_round(p_session_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_session public.quiz_sessions%rowtype;
  v_closed_at timestamptz := timezone('utc', now());
  v_round_duration_ms integer;
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

  if v_session.state <> 'in_progress' or v_session.round_state <> 'question_open' or v_session.current_question_id is null then
    raise exception 'Round is not open';
  end if;

  v_round_duration_ms := greatest(0, floor(extract(epoch from (v_closed_at - coalesce(v_session.round_started_at, v_closed_at))) * 1000)::integer);

  update public.quiz_sessions
  set round_state = 'round_results',
      round_closed_at = v_closed_at
  where id = v_session.id;

  update public.answers
  set is_correct = question_options.is_correct,
      awarded_bonus = case
        when question_options.is_correct then public.calculate_round_bonus(answers.response_ms, v_round_duration_ms)
        else 0
      end,
      awarded_score = case
        when question_options.is_correct then 1000 + public.calculate_round_bonus(answers.response_ms, v_round_duration_ms)
        else 0
      end
  from public.question_options
  where answers.session_id = v_session.id
    and answers.question_id = v_session.current_question_id
    and answers.question_option_id = question_options.id;
end;
$$;

grant select on public.answers to authenticated;

alter publication supabase_realtime add table public.answers;

grant execute on function public.close_live_round(uuid) to authenticated;
grant execute on function public.get_player_session_state(text, uuid) to anon, authenticated;
grant execute on function public.get_public_session_state(text) to anon, authenticated;
grant execute on function public.submit_player_answer(text, uuid, uuid) to anon, authenticated;
