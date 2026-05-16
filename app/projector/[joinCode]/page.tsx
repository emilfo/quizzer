import { headers } from 'next/headers'
import { LiveSessionStage } from '@/components/live-session-stage'
import { LiveSessionRefresh } from '@/components/live-session-refresh'
import type { PublicSessionView } from '@/lib/gameplay'
import { buildPlayerJoinUrl, getRequestOrigin, isValidJoinCode, normalizeJoinCode } from '@/lib/live-session'
import { createClient } from '@/lib/supabase/server'

export default async function ProjectorPage({
  params,
}: {
  params: Promise<{ joinCode: string }>
}) {
  const { joinCode } = await params
  const normalizedJoinCode = normalizeJoinCode(joinCode)

  if (!isValidJoinCode(normalizedJoinCode)) {
    return (
      <main className="page-shell page-shell--projector">
        <div className="container container--projector stack">
          <section className="card hero-card stack center-card">
            <span className="brand-badge">Projector error</span>
            <h1 className="display-title">Invalid join code.</h1>
            <p className="hero-copy">Use the 6-character code shown by the host.</p>
          </section>
        </div>
      </main>
    )
  }

  const supabase = await createClient()
  const { data: publicStateData } = await supabase.rpc('get_public_session_state', {
    p_join_code: normalizedJoinCode,
  })

  const session = publicStateData as PublicSessionView | null

  if (!session) {
    return (
      <main className="page-shell page-shell--projector">
        <div className="container container--projector stack">
          <section className="card hero-card stack center-card">
            <span className="brand-badge">Session not found</span>
            <h1 className="display-title">Session not found.</h1>
            <p className="hero-copy">Check the projector join code and try again.</p>
          </section>
        </div>
      </main>
    )
  }

  const headerStore = await headers()

  const origin = getRequestOrigin(headerStore)
  const joinUrl = buildPlayerJoinUrl(origin, session.joinCode)
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(joinUrl)}`
  return (
    <main className="page-shell page-shell--projector">
      <div className="container container--projector stack">
        <LiveSessionRefresh mode="public" sessionId={session.sessionId} />
        <LiveSessionStage
          joinQrSrc={qrSrc}
          joinUrl={joinUrl}
          session={session}
        />
      </div>
    </main>
  )
}
