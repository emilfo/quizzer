'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  buildPlayerJoinPath,
  isSessionJoinOpen,
  isValidJoinCode,
  normalizeJoinCode,
  PARTICIPANT_COOKIE_NAME,
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

  const supabase = await createClient()
  const { data: session } = await supabase
    .from('quiz_sessions')
    .select('id, join_code, state')
    .eq('join_code', normalizedJoinCode)
    .maybeSingle()

  if (!session) {
    redirect(`${buildPlayerJoinPath(normalizedJoinCode)}?error=session-not-found`)
  }

  if (!isSessionJoinOpen(session.state)) {
    redirect(`${buildPlayerJoinPath(normalizedJoinCode)}?error=join-closed`)
  }

  const { data: participant, error } = await supabase
    .from('participants')
    .insert({ nickname, session_id: session.id })
    .select('id, nickname, session_id')
    .single()

  if (error) {
    const duplicateNickname = error.code === '23505'
    redirect(`${buildPlayerJoinPath(normalizedJoinCode)}?error=${duplicateNickname ? 'duplicate-nickname' : 'join-failed'}`)
  }

  const cookieStore = await cookies()
  cookieStore.set(
    PARTICIPANT_COOKIE_NAME,
    serializeParticipantCookie({
      sessionId: participant.session_id,
      participantId: participant.id,
      nickname: participant.nickname,
    }),
    {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    },
  )

  redirect(`${buildPlayerJoinPath(normalizedJoinCode)}?joined=1`)
}
