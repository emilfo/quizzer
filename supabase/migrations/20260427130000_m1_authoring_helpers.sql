create or replace function public.quiz_is_publishable(p_quiz_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  with question_stats as (
    select
      q.id,
      nullif(trim(q.prompt), '') is not null as has_prompt,
      count(o.id) = 4 as has_four_options,
      count(*) filter (where nullif(trim(o.option_text), '') is not null) = 4 as has_filled_options,
      count(*) filter (where o.is_correct) = 1 as has_one_correct
    from public.questions q
    left join public.question_options o on o.question_id = q.id
    where q.quiz_id = p_quiz_id
    group by q.id
  )
  select
    exists (select 1 from public.quizzes where id = p_quiz_id and nullif(trim(title), '') is not null)
    and exists (select 1 from question_stats)
    and not exists (
      select 1
      from question_stats
      where not (has_prompt and has_four_options and has_filled_options and has_one_correct)
    );
$$;

create or replace function public.sync_quiz_status(p_quiz_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1
    from public.quizzes
    where id = p_quiz_id
      and status = 'published'
      and not public.quiz_is_publishable(p_quiz_id)
  ) then
    update public.quizzes
    set status = 'draft',
        published_at = null
    where id = p_quiz_id;
  end if;
end;
$$;

create or replace function public.add_question_with_options(p_quiz_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_question_id uuid := gen_random_uuid();
  v_host_id uuid;
  v_position integer;
begin
  select host_id into v_host_id
  from public.quizzes
  where id = p_quiz_id;

  if v_host_id is null or v_host_id <> auth.uid() then
    raise exception 'Quiz not found or not owned by user';
  end if;

  select coalesce(max(position), 0) + 1 into v_position
  from public.questions
  where quiz_id = p_quiz_id;

  insert into public.questions (id, quiz_id, prompt, position)
  values (v_question_id, p_quiz_id, '', v_position);

  insert into public.question_options (question_id, option_text, is_correct, position)
  values
    (v_question_id, '', false, 1),
    (v_question_id, '', false, 2),
    (v_question_id, '', false, 3),
    (v_question_id, '', false, 4);

  perform public.sync_quiz_status(p_quiz_id);

  return v_question_id;
end;
$$;

create or replace function public.save_question_with_options(
  p_quiz_id uuid,
  p_question_id uuid,
  p_prompt text,
  p_options jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_host_id uuid;
  v_question_quiz_id uuid;
begin
  select host_id into v_host_id
  from public.quizzes
  where id = p_quiz_id;

  if v_host_id is null or v_host_id <> auth.uid() then
    raise exception 'Quiz not found or not owned by user';
  end if;

  select quiz_id into v_question_quiz_id
  from public.questions
  where id = p_question_id;

  if v_question_quiz_id is distinct from p_quiz_id then
    raise exception 'Question does not belong to quiz';
  end if;

  if jsonb_array_length(p_options) <> 4 then
    raise exception 'Question must include exactly 4 options';
  end if;

  update public.questions
  set prompt = coalesce(p_prompt, '')
  where id = p_question_id;

  update public.question_options as qo
  set option_text = coalesce(option_data.option_text, ''),
      is_correct = coalesce(option_data.is_correct, false)
  from (
    select
      (value ->> 'id')::uuid as id,
      value ->> 'option_text' as option_text,
      (value ->> 'is_correct')::boolean as is_correct,
      (value ->> 'position')::integer as position
    from jsonb_array_elements(p_options)
  ) as option_data
  where qo.id = option_data.id
    and qo.question_id = p_question_id
    and qo.position = option_data.position;

  if (
    select count(*)
    from public.question_options
    where question_id = p_question_id
  ) <> 4 then
    raise exception 'Question options were not updated correctly';
  end if;

  perform public.sync_quiz_status(p_quiz_id);
end;
$$;

create or replace function public.delete_question_and_reorder(p_quiz_id uuid, p_question_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_host_id uuid;
  v_question_quiz_id uuid;
begin
  select host_id into v_host_id
  from public.quizzes
  where id = p_quiz_id;

  if v_host_id is null or v_host_id <> auth.uid() then
    raise exception 'Quiz not found or not owned by user';
  end if;

  select quiz_id into v_question_quiz_id
  from public.questions
  where id = p_question_id;

  if v_question_quiz_id is distinct from p_quiz_id then
    raise exception 'Question does not belong to quiz';
  end if;

  delete from public.questions
  where id = p_question_id;

  with ordered as (
    select id, row_number() over (order by position asc) as new_position
    from public.questions
    where quiz_id = p_quiz_id
  )
  update public.questions q
  set position = ordered.new_position
  from ordered
  where q.id = ordered.id;

  perform public.sync_quiz_status(p_quiz_id);
end;
$$;

create or replace function public.move_question_position(p_quiz_id uuid, p_question_id uuid, p_direction text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_host_id uuid;
  v_question_quiz_id uuid;
  v_current_position integer;
  v_target_position integer;
begin
  select host_id into v_host_id
  from public.quizzes
  where id = p_quiz_id;

  if v_host_id is null or v_host_id <> auth.uid() then
    raise exception 'Quiz not found or not owned by user';
  end if;

  select quiz_id, position into v_question_quiz_id, v_current_position
  from public.questions
  where id = p_question_id;

  if v_question_quiz_id is distinct from p_quiz_id then
    raise exception 'Question does not belong to quiz';
  end if;

  v_target_position := case when p_direction = 'up' then v_current_position - 1 else v_current_position + 1 end;

  if not exists (
    select 1
    from public.questions
    where quiz_id = p_quiz_id
      and position = v_target_position
  ) then
    return;
  end if;

  with remapped as (
    select
      id,
      case
        when id = p_question_id then v_target_position
        when position = v_target_position then v_current_position
        else position
      end as new_position
    from public.questions
    where quiz_id = p_quiz_id
  )
  update public.questions q
  set position = remapped.new_position
  from remapped
  where q.id = remapped.id;

  perform public.sync_quiz_status(p_quiz_id);
end;
$$;

create or replace function public.publish_quiz_if_valid(p_quiz_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_host_id uuid;
begin
  select host_id into v_host_id
  from public.quizzes
  where id = p_quiz_id;

  if v_host_id is null or v_host_id <> auth.uid() then
    raise exception 'Quiz not found or not owned by user';
  end if;

  if not public.quiz_is_publishable(p_quiz_id) then
    raise exception 'Quiz is not publishable';
  end if;

  update public.quizzes
  set status = 'published',
      published_at = timezone('utc', now())
  where id = p_quiz_id;
end;
$$;
