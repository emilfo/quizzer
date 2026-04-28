import { describe, expect, it } from 'vitest'
import {
  buildPlayerJoinPath,
  buildPlayerJoinUrl,
  buildProjectorPath,
  getRequestOrigin,
  isSessionJoinOpen,
  isValidJoinCode,
  normalizeJoinCode,
  parseParticipantCookie,
  serializeParticipantCookie,
} from '../lib/live-session'

describe('live session helpers', () => {
  it('normalizes join codes', () => {
    expect(normalizeJoinCode(' ab-cd12 ')).toBe('ABCD12')
    expect(normalizeJoinCode('abc12345')).toBe('ABC123')
  })

  it('validates join codes', () => {
    expect(isValidJoinCode('ABC123')).toBe(true)
    expect(isValidJoinCode('ABC12')).toBe(false)
    expect(isValidJoinCode('abc123')).toBe(false)
  })

  it('builds player and projector paths', () => {
    expect(buildPlayerJoinPath(' ab-cd12 ')).toBe('/play/ABCD12')
    expect(buildProjectorPath(' xy-9z88 ')).toBe('/projector/XY9Z88')
  })

  it('checks whether joins are open', () => {
    expect(isSessionJoinOpen('lobby')).toBe(true)
    expect(isSessionJoinOpen('in_progress')).toBe(false)
    expect(isSessionJoinOpen('finished')).toBe(false)
  })

  it('serializes and parses participant cookies', () => {
    const cookie = {
      sessionId: 'session-1',
      participantId: 'participant-1',
      nickname: 'Ada',
      sessionToken: 'token-1',
    }

    const serialized = serializeParticipantCookie(cookie)

    expect(parseParticipantCookie(serialized)).toEqual(cookie)
    expect(parseParticipantCookie('')).toBeNull()
    expect(parseParticipantCookie('tampered.signature')).toBeNull()
  })

  it('derives the request origin from headers', () => {
    expect(getRequestOrigin(new Headers())).toBe('')
    expect(getRequestOrigin(new Headers({ host: 'localhost:3000' }))).toBe('http://localhost:3000')
    expect(
      getRequestOrigin(
        new Headers({
          host: 'quizzer.example.com',
          'x-forwarded-host': 'quizzer.example.com',
          'x-forwarded-proto': 'https',
        }),
      ),
    ).toBe('https://quizzer.example.com')
  })

  it('builds a player join url', () => {
    expect(buildPlayerJoinUrl('https://quizzer.example.com', 'ab-cd12')).toBe(
      'https://quizzer.example.com/play/ABCD12',
    )
  })
})
