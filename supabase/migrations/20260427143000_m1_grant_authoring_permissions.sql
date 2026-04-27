grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.quizzes to authenticated;
grant select, insert, update, delete on public.questions to authenticated;
grant select, insert, update, delete on public.question_options to authenticated;

grant usage on type public.quiz_status to authenticated;

grant usage, select on all sequences in schema public to authenticated;

grant execute on function public.quiz_is_publishable(uuid) to authenticated;
grant execute on function public.sync_quiz_status(uuid) to authenticated;
grant execute on function public.add_question_with_options(uuid) to authenticated;
grant execute on function public.save_question_with_options(uuid, uuid, text, jsonb) to authenticated;
grant execute on function public.delete_question_and_reorder(uuid, uuid) to authenticated;
grant execute on function public.move_question_position(uuid, uuid, text) to authenticated;
grant execute on function public.publish_quiz_if_valid(uuid) to authenticated;

alter default privileges in schema public
grant select, insert, update, delete on tables to authenticated;

alter default privileges in schema public
grant usage, select on sequences to authenticated;

alter default privileges in schema public
grant execute on functions to authenticated;
