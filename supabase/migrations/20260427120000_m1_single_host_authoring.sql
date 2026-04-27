create extension if not exists "pgcrypto";

create type public.quiz_status as enum ('draft', 'published');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles (id) on delete cascade,
  title text not null default '',
  status public.quiz_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  prompt text not null default '',
  position integer not null check (position > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (quiz_id, position)
);

create table public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  option_text text not null default '',
  is_correct boolean not null default false,
  position integer not null check (position between 1 and 4),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (question_id, position)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger quizzes_set_updated_at
before update on public.quizzes
for each row
execute function public.set_updated_at();

create trigger questions_set_updated_at
before update on public.questions
for each row
execute function public.set_updated_at();

create trigger question_options_set_updated_at
before update on public.question_options
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.quizzes enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;

create policy "profiles are readable by owner"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "profiles are writable by owner"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "hosts can read own quizzes"
on public.quizzes
for select
to authenticated
using ((select auth.uid()) = host_id);

create policy "hosts can create own quizzes"
on public.quizzes
for insert
to authenticated
with check ((select auth.uid()) = host_id);

create policy "hosts can update own quizzes"
on public.quizzes
for update
to authenticated
using ((select auth.uid()) = host_id)
with check ((select auth.uid()) = host_id);

create policy "hosts can delete own quizzes"
on public.quizzes
for delete
to authenticated
using ((select auth.uid()) = host_id);

create policy "hosts can read own questions"
on public.questions
for select
to authenticated
using (
  exists (
    select 1
    from public.quizzes
    where quizzes.id = questions.quiz_id
      and quizzes.host_id = (select auth.uid())
  )
);

create policy "hosts can create own questions"
on public.questions
for insert
to authenticated
with check (
  exists (
    select 1
    from public.quizzes
    where quizzes.id = questions.quiz_id
      and quizzes.host_id = (select auth.uid())
  )
);

create policy "hosts can update own questions"
on public.questions
for update
to authenticated
using (
  exists (
    select 1
    from public.quizzes
    where quizzes.id = questions.quiz_id
      and quizzes.host_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.quizzes
    where quizzes.id = questions.quiz_id
      and quizzes.host_id = (select auth.uid())
  )
);

create policy "hosts can delete own questions"
on public.questions
for delete
to authenticated
using (
  exists (
    select 1
    from public.quizzes
    where quizzes.id = questions.quiz_id
      and quizzes.host_id = (select auth.uid())
  )
);

create policy "hosts can read own question options"
on public.question_options
for select
to authenticated
using (
  exists (
    select 1
    from public.questions
    join public.quizzes on quizzes.id = questions.quiz_id
    where questions.id = question_options.question_id
      and quizzes.host_id = (select auth.uid())
  )
);

create policy "hosts can create own question options"
on public.question_options
for insert
to authenticated
with check (
  exists (
    select 1
    from public.questions
    join public.quizzes on quizzes.id = questions.quiz_id
    where questions.id = question_options.question_id
      and quizzes.host_id = (select auth.uid())
  )
);

create policy "hosts can update own question options"
on public.question_options
for update
to authenticated
using (
  exists (
    select 1
    from public.questions
    join public.quizzes on quizzes.id = questions.quiz_id
    where questions.id = question_options.question_id
      and quizzes.host_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.questions
    join public.quizzes on quizzes.id = questions.quiz_id
    where questions.id = question_options.question_id
      and quizzes.host_id = (select auth.uid())
  )
);

create policy "hosts can delete own question options"
on public.question_options
for delete
to authenticated
using (
  exists (
    select 1
    from public.questions
    join public.quizzes on quizzes.id = questions.quiz_id
    where questions.id = question_options.question_id
      and quizzes.host_id = (select auth.uid())
  )
);
