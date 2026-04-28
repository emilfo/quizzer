import { createHmac, timingSafeEqual } from 'node:crypto'
import type { Database } from '@/lib/supabase/types'

export type SessionState = Database['public']['Enums']['session_state']

export type ParticipantCookie = {
  sessionId: string
  participantId: string
  nickname: string
  sessionToken: string
}

export const PARTICIPANT_COOKIE_NAME = 'quizzer-participant-session'
export const JOIN_CODE_LENGTH = 6

type SignedParticipantCookie = ParticipantCookie & {
  v: 1
}

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

function getParticipantCookieSecret() {
  const configuredSecret = process.env.QUIZZER_PARTICIPANT_COOKIE_SECRET?.trim()

  if (configuredSecret) {
    return configuredSecret
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'quizzer-dev-participant-cookie-secret-2026'
  }

  throw new Error('QUIZZER_PARTICIPANT_COOKIE_SECRET must be set in production.')
}

function signParticipantCookie(payload: string) {
  return createHmac('sha256', getParticipantCookieSecret()).update(payload).digest('base64url')
}

export function serializeParticipantCookie(value: ParticipantCookie) {
  const payload = Buffer.from(
    JSON.stringify({
      ...value,
      v: 1,
    } satisfies SignedParticipantCookie),
  ).toString('base64url')

  return `${payload}.${signParticipantCookie(payload)}`
}

export function parseParticipantCookie(rawValue: string | undefined) {
  if (!rawValue) return null

  try {
    const [payload, signature] = rawValue.split('.')

    if (!payload || !signature) {
      return null
    }

    const expectedSignature = signParticipantCookie(payload)
    const providedSignature = Buffer.from(signature)
    const computedSignature = Buffer.from(expectedSignature)

    if (
      providedSignature.length !== computedSignature.length ||
      !timingSafeEqual(providedSignature, computedSignature)
    ) {
      return null
    }

    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Partial<SignedParticipantCookie>

    if (
      parsed.v !== 1 ||
      typeof parsed.sessionId !== 'string' ||
      typeof parsed.participantId !== 'string' ||
      typeof parsed.nickname !== 'string' ||
      typeof parsed.sessionToken !== 'string'
    ) {
      return null
    }

    return {
      sessionId: parsed.sessionId,
      participantId: parsed.participantId,
      nickname: parsed.nickname,
      sessionToken: parsed.sessionToken,
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
