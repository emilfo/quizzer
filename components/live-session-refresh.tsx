'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type LiveSessionRefreshProps = {
  sessionId: string
  mode: 'host' | 'public'
}

export function LiveSessionRefresh({ sessionId, mode }: LiveSessionRefreshProps) {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const refresh = () => router.refresh()

    const channel =
      mode === 'host'
        ? supabase
            .channel(`host-session-refresh:${sessionId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'quiz_sessions', filter: `id=eq.${sessionId}` }, refresh)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'participants', filter: `session_id=eq.${sessionId}` }, refresh)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'answers', filter: `session_id=eq.${sessionId}` }, refresh)
            .subscribe()
        : supabase
            .channel(`public-session-refresh:${sessionId}`)
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'public_session_lobbies', filter: `session_id=eq.${sessionId}` },
              refresh,
            )
            .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [mode, router, sessionId])

  return null
}
