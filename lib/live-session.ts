import type { Database } from '@/lib/supabase/types'

export type SessionState = Database['public']['Enums']['session_state']

export type ParticipantCookie = {
  sessionId: string
  participantId: string
  nickname: string
}

export const PARTICIPANT_COOKIE_NAME = 'quizzer-participant-session'
export const JOIN_CODE_LENGTH = 6

export function normalizeJoinCode(input: string) {
  return input.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, JOIN_CODE_LENGTH)
}

export function isValidJoinCode(code: string) {
  return /^[A-Z0-9]{6}$/.test(code)
}

export function buildPlayerJoinPath(joinCode: string) {
  return `/play/${normalizeJoinCode(joinCode)}`
}

export function buildProjectorPath(joinCode: string) {
  return `/projector/${normalizeJoinCode(joinCode)}`
}

export function isSessionJoinOpen(state: SessionState) {
  return state === 'lobby'
}

export function serializeParticipantCookie(value: ParticipantCookie) {
  return encodeURIComponent(JSON.stringify(value))
}

export function parseParticipantCookie(rawValue: string | undefined) {
  if (!rawValue) return null

  try {
    const parsed = JSON.parse(decodeURIComponent(rawValue)) as Partial<ParticipantCookie>

    if (
      typeof parsed.sessionId !== 'string' ||
      typeof parsed.participantId !== 'string' ||
      typeof parsed.nickname !== 'string'
    ) {
      return null
    }

    return {
      sessionId: parsed.sessionId,
      participantId: parsed.participantId,
      nickname: parsed.nickname,
    }
  } catch {
    return null
  }
}

export function getRequestOrigin(headers: Headers) {
  const host = headers.get('x-forwarded-host') ?? headers.get('host')
  if (!host) return ''

  const protocol = headers.get('x-forwarded-proto') ?? (host.includes('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https')
  return `${protocol}://${host}`
}

export function buildPlayerJoinUrl(origin: string, joinCode: string) {
  return `${origin}${buildPlayerJoinPath(joinCode)}`
}
