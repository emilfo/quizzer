'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  buildPlayerJoinPath,
  isValidJoinCode,
  normalizeJoinCode,
  PARTICIPANT_COOKIE_NAME,
  parseParticipantCookie,
  serializeParticipantCookie,
} from '@/lib/live-session'
import { createClient } from '@/lib/supabase/server'

export async function openJoinCode(formData: FormData) {
  const joinCode = normalizeJoinCode(String(formData.get('joinCode') ?? ''))

  if (!isValidJoinCode(joinCode)) {
    redirect('/?joinError=invalid-code')
  }

  redirect(buildPlayerJoinPath(joinCode))
}

export async function joinLiveSession(joinCode: string, formData: FormData) {
  const normalizedJoinCode = normalizeJoinCode(joinCode)
  const nickname = String(formData.get('nickname') ?? '').trim()

  if (!isValidJoinCode(normalizedJoinCode)) {
    redirect('/?joinError=invalid-code')
  }

  if (!nickname) {
    redirect(`${buildPlayerJoinPath(normalizedJoinCode)}?error=missing-nickname`)
  }

  if (nickname.length > 32) {
    redirect(`${buildPlayerJoinPath(normalizedJoinCode)}?error=nickname-too-long`)
  }

  const supabase = await createClient()
  const { data: participants, error } = await supabase.rpc('join_live_session', {
    p_join_code: normalizedJoinCode,
    p_nickname: nickname,
  })

  if (error) {
    const errorCode =
      error.code === '23505'
        ? 'duplicate-nickname'
        : error.message === 'Session not found'
          ? 'session-not-found'
          : error.message === 'Session is not accepting joins'
            ? 'join-closed'
            : error.message === 'Nickname must be 32 characters or fewer'
              ? 'nickname-too-long'
              : 'join-failed'

    redirect(`${buildPlayerJoinPath(normalizedJoinCode)}?error=${errorCode}`)
  }

  const participant = participants[0]
  if (!participant) {
    redirect(`${buildPlayerJoinPath(normalizedJoinCode)}?error=join-failed`)
  }

  const cookieStore = await cookies()
  cookieStore.set(
    PARTICIPANT_COOKIE_NAME,
    serializeParticipantCookie({
      sessionId: participant.session_id,
      participantId: participant.participant_id,
      nickname: participant.nickname,
      sessionToken: participant.session_token,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    },
  )

  redirect(`${buildPlayerJoinPath(normalizedJoinCode)}?joined=1`)
}

export async function submitPlayerAnswer(joinCode: string, formData: FormData) {
  const normalizedJoinCode = normalizeJoinCode(joinCode)

  if (!isValidJoinCode(normalizedJoinCode)) {
    redirect('/?joinError=invalid-code')
  }

  const optionId = String(formData.get('optionId') ?? '')
  if (!optionId) {
    redirect(`${buildPlayerJoinPath(normalizedJoinCode)}?error=answer-failed`)
  }

  const cookieStore = await cookies()
  const participantCookie = parseParticipantCookie(cookieStore.get(PARTICIPANT_COOKIE_NAME)?.value)

  if (!participantCookie) {
    redirect(`${buildPlayerJoinPath(normalizedJoinCode)}?error=rejoin-required`)
  }

  const supabase = await createClient()
  const { error } = await supabase.rpc('submit_player_answer', {
    p_join_code: normalizedJoinCode,
    p_participant_id: participantCookie.participantId,
    p_option_id: optionId,
    p_session_token: participantCookie.sessionToken,
  })

  if (error) {
    const errorCode =
      error.message === 'Answer already submitted'
        ? 'duplicate-answer'
        : error.message === 'Round is not accepting answers'
          ? 'round-closed'
          : 'answer-failed'

    redirect(`${buildPlayerJoinPath(normalizedJoinCode)}?error=${errorCode}`)
  }

  redirect(`${buildPlayerJoinPath(normalizedJoinCode)}?answered=1`)
}
