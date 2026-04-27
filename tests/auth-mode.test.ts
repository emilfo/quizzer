import { beforeEach, describe, expect, it, vi } from 'vitest'

const envState = vi.hoisted(() => ({
  supabaseUrl: 'http://127.0.0.1:54321',
  anonKey: 'test-anon-key',
  enableLocalAuth: 'false',
}))

vi.mock('../lib/env', () => ({
  env: {
    get NEXT_PUBLIC_SUPABASE_URL() {
      return envState.supabaseUrl
    },
    get NEXT_PUBLIC_SUPABASE_ANON_KEY() {
      return envState.anonKey
    },
    get QUIZZER_ENABLE_LOCAL_AUTH() {
      return envState.enableLocalAuth
    },
  },
}))

import { isLocalSupabaseAuthEnabled, isLocalSupabaseUrl } from '../lib/auth-mode'

describe('isLocalSupabaseUrl', () => {
  beforeEach(() => {
    envState.supabaseUrl = 'http://127.0.0.1:54321'
    envState.enableLocalAuth = 'false'
  })

  it('detects localhost URLs', () => {
    expect(isLocalSupabaseUrl('http://127.0.0.1:54321')).toBe(true)
    expect(isLocalSupabaseUrl('http://localhost:54321')).toBe(true)
  })

  it('rejects hosted Supabase URLs', () => {
    expect(isLocalSupabaseUrl('https://project-ref.supabase.co')).toBe(false)
  })

  it('requires the explicit local auth flag', () => {
    expect(isLocalSupabaseAuthEnabled()).toBe(false)

    envState.enableLocalAuth = 'true'
    expect(isLocalSupabaseAuthEnabled()).toBe(true)
  })

  it('still rejects hosted Supabase when the flag is on', () => {
    envState.enableLocalAuth = 'true'
    envState.supabaseUrl = 'https://project-ref.supabase.co'

    expect(isLocalSupabaseAuthEnabled()).toBe(false)
  })
})
