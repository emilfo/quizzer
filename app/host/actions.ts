'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { buildProjectorPath } from '@/lib/live-session'
import { createClient } from '@/lib/supabase/server'
import { validateQuizForPublish, type QuizDraft } from '@/lib/quiz-validation'

type QuizRow = {
  id: string
  title: string
  status: 'draft' | 'published'
}

type QuestionRow = {
  id: string
  quiz_id: string
  prompt: string
  position: number
}

type OptionRow = {
  id: string
  question_id: string
  option_text: string
  is_correct: boolean
  position: number
}

function buildQuizDraft(
  quiz: QuizRow,
  questions: QuestionRow[],
  optionsByQuestion: Map<string, OptionRow[]>,
): QuizDraft {
  return {
    id: quiz.id,
    title: quiz.title,
    status: quiz.status,
    questions: questions.map((question) => ({
      id: question.id,
      prompt: question.prompt,
      position: question.position,
      options: (optionsByQuestion.get(question.id) ?? []).map((option) => ({
        id: option.id,
        optionText: option.option_text,
        isCorrect: option.is_correct,
        position: option.position,
      })),
    })),
  }
}

async function getOwnedQuiz(supabase: Awaited<ReturnType<typeof createClient>>, quizId: string) {
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('id, title, status')
    .eq('id', quizId)
    .single()

  if (!quiz) return null

  const { data: questions } = await supabase
    .from('questions')
    .select('id, quiz_id, prompt, position')
    .eq('quiz_id', quizId)
    .order('position', { ascending: true })

  const questionIds = (questions ?? []).map((question) => question.id)
  const optionsByQuestion = new Map<string, OptionRow[]>()

  if (questionIds.length > 0) {
    const { data: options } = await supabase
      .from('question_options')
      .select('id, question_id, option_text, is_correct, position')
      .in('question_id', questionIds)
      .order('position', { ascending: true })

    for (const option of options ?? []) {
      const current = optionsByQuestion.get(option.question_id) ?? []
      current.push(option)
      optionsByQuestion.set(option.question_id, current)
    }
  }

  return buildQuizDraft(quiz, questions ?? [], optionsByQuestion)
}

async function getActiveSessionForHost(
  supabase: Awaited<ReturnType<typeof createClient>>,
  hostId: string,
) {
  const { data } = await supabase
    .from('quiz_sessions')
    .select('id, join_code, quiz_id, quiz_title, state')
    .eq('host_id', hostId)
    .in('state', ['lobby', 'in_progress'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return data
}

export async function getHostQuizzes() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user) redirect('/')

  const { data } = await supabase
    .from('quizzes')
    .select('id, title, status, created_at, updated_at')
    .eq('host_id', user.id)
    .order('updated_at', { ascending: false })

  return data ?? []
}

export async function getHostActiveSession() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user) redirect('/')

  return getActiveSessionForHost(supabase, user.id)
}

export async function getQuizForEditor(quizId: string) {
  const { supabase } = await ensureHostOwnership(quizId)
  return getOwnedQuiz(supabase, quizId)
}

async function ensureHostOwnership(quizId: string) {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user) redirect('/')

  const { data: quiz } = await supabase.from('quizzes').select('id, host_id').eq('id', quizId).single()
  if (!quiz || quiz.host_id !== user.id) redirect('/host')

  return { supabase, user }
}

async function ensureHostSessionOwnership(sessionId: string) {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user) redirect('/')

  const { data: session } = await supabase
    .from('quiz_sessions')
    .select('id, host_id, join_code, quiz_id, quiz_title, state')
    .eq('id', sessionId)
    .maybeSingle()

  if (!session || session.host_id !== user.id) redirect('/host')

  return { supabase, session, user }
}

async function refreshQuizStatus(supabase: Awaited<ReturnType<typeof createClient>>, quizId: string) {
  const { error } = await supabase.rpc('sync_quiz_status', {
    p_quiz_id: quizId,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function createQuiz(formData: FormData) {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user) redirect('/')

  const title = String(formData.get('title') ?? '').trim()
  const { data: quiz, error } = await supabase
    .from('quizzes')
    .insert({ host_id: user.id, title: title || 'Untitled quiz', status: 'draft' })
    .select('id')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  if (quiz) redirect(`/host/${quiz.id}`)
  redirect('/host')
}

export async function updateQuizTitle(quizId: string, formData: FormData) {
  const { supabase } = await ensureHostOwnership(quizId)
  const title = String(formData.get('title') ?? '').trim()
  const { error } = await supabase.from('quizzes').update({ title }).eq('id', quizId)

  if (error) {
    throw new Error(error.message)
  }

  await refreshQuizStatus(supabase, quizId)
  revalidatePath('/host')
  revalidatePath(`/host/${quizId}`)
}

export async function addQuestion(quizId: string) {
  const { supabase } = await ensureHostOwnership(quizId)
  const { error } = await supabase.rpc('add_question_with_options', {
    p_quiz_id: quizId,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/host')
  revalidatePath(`/host/${quizId}`)
}

export async function saveQuestion(quizId: string, questionId: string, formData: FormData) {
  const { supabase } = await ensureHostOwnership(quizId)
  const prompt = String(formData.get('prompt') ?? '').trim()
  const options = [1, 2, 3, 4].map((position) => ({
    id: String(formData.get(`option-${position}-id`) ?? ''),
    option_text: String(formData.get(`option-${position}`) ?? '').trim(),
    is_correct: formData.get('correct') === String(position),
    position,
  }))

  const { error } = await supabase.rpc('save_question_with_options', {
    p_quiz_id: quizId,
    p_question_id: questionId,
    p_prompt: prompt,
    p_options: options,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/host')
  revalidatePath(`/host/${quizId}`)
}

export async function deleteQuestion(quizId: string, questionId: string) {
  const { supabase } = await ensureHostOwnership(quizId)
  const { error } = await supabase.rpc('delete_question_and_reorder', {
    p_quiz_id: quizId,
    p_question_id: questionId,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/host')
  revalidatePath(`/host/${quizId}`)
}

export async function moveQuestion(quizId: string, questionId: string, direction: 'up' | 'down') {
  const { supabase } = await ensureHostOwnership(quizId)
  const { error } = await supabase.rpc('move_question_position', {
    p_quiz_id: quizId,
    p_question_id: questionId,
    p_direction: direction,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/host')
  revalidatePath(`/host/${quizId}`)
}

export async function publishQuiz(quizId: string) {
  const { supabase } = await ensureHostOwnership(quizId)
  const quiz = await getOwnedQuiz(supabase, quizId)
  if (!quiz) return
  const validation = validateQuizForPublish(quiz)
  if (!validation.isPublishable) return
  const { error } = await supabase.rpc('publish_quiz_if_valid', {
    p_quiz_id: quizId,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/host')
  revalidatePath(`/host/${quizId}`)
}

export async function startLiveSession(quizId: string) {
  const { supabase, user } = await ensureHostOwnership(quizId)
  const activeSession = await getActiveSessionForHost(supabase, user.id)

  if (activeSession) {
    redirect(`/host/session/${activeSession.id}`)
  }

  const { data: sessionId, error } = await supabase.rpc('create_live_session', {
    p_quiz_id: quizId,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/host')
  redirect(`/host/session/${sessionId}`)
}

export async function getHostSessionControlData(sessionId: string) {
  const { supabase, session } = await ensureHostSessionOwnership(sessionId)
  const { data: participants } = await supabase
    .from('participants')
    .select('id, nickname')
    .eq('session_id', session.id)
    .order('created_at', { ascending: true })

  return {
    session,
    participants: participants ?? [],
  }
}

export async function startQuizSession(sessionId: string) {
  const { supabase, session } = await ensureHostSessionOwnership(sessionId)
  const { error } = await supabase.rpc('start_live_session', {
    p_session_id: sessionId,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/host')
  revalidatePath(`/host/session/${sessionId}`)
  revalidatePath(buildProjectorPath(session.join_code))
}
