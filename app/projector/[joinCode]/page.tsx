import { headers } from 'next/headers'
import Link from 'next/link'
import { LiveSessionPanel } from '@/components/live-session-panel'
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
      <main className="page-shell">
        <div className="container stack">
          <section className="card stack center-card">
            <h1>Invalid join code</h1>
          </section>
        </div>
      </main>
    )
  }

  const supabase = await createClient()
  const { data: session } = await supabase
    .from('quiz_sessions')
    .select('id, join_code, quiz_title, state')
    .eq('join_code', normalizedJoinCode)
    .maybeSingle()

  if (!session) {
    return (
      <main className="page-shell">
        <div className="container stack">
          <section className="card stack center-card">
            <h1>Session not found</h1>
          </section>
        </div>
      </main>
    )
  }

  const [{ data: participants }, headerStore] = await Promise.all([
    supabase.from('participants').select('id, nickname').eq('session_id', session.id).order('created_at', { ascending: true }),
    headers(),
  ])

  const origin = getRequestOrigin(headerStore)
  const joinUrl = buildPlayerJoinUrl(origin, session.join_code)
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(joinUrl)}`

  return (
    <main className="page-shell">
      <div className="container stack">
        <section className="card stack center-card">
          <span className="pill">Public projector</span>
          <h1>{session.quiz_title}</h1>
          <div className="join-code">{session.join_code}</div>
          <p className="muted">Scan the QR code or enter the join code at home to join the lobby.</p>
          <img alt={`QR code for ${joinUrl}`} className="qr-image" height="240" src={qrSrc} width="240" />
          <Link className="button secondary" href={joinUrl}>
            Open join link
          </Link>
        </section>

        <LiveSessionPanel
          initialParticipants={participants ?? []}
          initialState={session.state}
          mode="projector"
          sessionId={session.id}
        />
      </div>
    </main>
  )
}
