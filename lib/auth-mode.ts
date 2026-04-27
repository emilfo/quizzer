import { env } from './env'

export function isLocalSupabaseUrl(url: string) {
  const hostname = new URL(url).hostname
  return hostname === '127.0.0.1' || hostname === 'localhost'
}

export function isLocalSupabaseAuthEnabled() {
  return env.QUIZZER_ENABLE_LOCAL_AUTH === 'true' && isLocalSupabaseUrl(env.NEXT_PUBLIC_SUPABASE_URL)
}
