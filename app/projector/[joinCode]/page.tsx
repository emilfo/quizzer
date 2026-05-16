import { headers } from 'next/headers'
import { LiveSessionStage } from '@/components/live-session-stage'
import { LiveSessionRefresh } from '@/components/live-session-refresh'
import type { PublicSessionView } from '@/lib/gameplay'
import { buildPlayerJoinUrl, getRequestOrigin, isValidJoinCode, normalizeJoinCode } from '@/lib/live-session'
import { createClient } from '@/lib/supabase/server'
import { advanceQuizSession, closeQuizRound, endQuizSession, startQuizSession } from '@/app/host/actions'

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
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: ownedSession } = user
    ? await supabase
        .from('quiz_sessions')
        .select('id, host_id, state, round_state')
        .eq('id', session.sessionId)
        .eq('host_id', user.id)
        .maybeSingle()
    : { data: null }

  const advanceAction =
    ownedSession?.state === 'lobby'
      ? { label: 'Start quiz', action: startQuizSession.bind(null, ownedSession.id) }
      : ownedSession?.round_state === 'question_open'
        ? { label: 'Reveal / close round', action: closeQuizRound.bind(null, ownedSession.id) }
        : ownedSession?.round_state === 'round_results'
          ? { label: 'Next / continue', action: advanceQuizSession.bind(null, ownedSession.id) }
          : null

  const origin = getRequestOrigin(headerStore)
  const joinUrl = buildPlayerJoinUrl(origin, session.joinCode)
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(joinUrl)}`
  return (
    <main className="page-shell page-shell--projector">
      <div className="container container--projector stack">
        <LiveSessionRefresh mode="public" sessionId={session.sessionId} />
        <LiveSessionStage
          hostControls={
            ownedSession ? (
              <>
                {ownedSession.state !== 'finished' ? (
                  <aside className="host-control-strip host-control-strip--left" aria-label="End quiz control">
                    <div className="host-control-actions">
                      <form action={endQuizSession.bind(null, ownedSession.id)}>
                        <button className="button danger button-compact" type="submit">
                          End quiz
                        </button>
                      </form>
                    </div>
                  </aside>
                ) : null}
                {advanceAction ? (
                  <aside className="host-control-strip" aria-label="Projector host controls">
                    <div className="host-control-copy">
                      <span className="pill">
                        {ownedSession.state === 'lobby'
                          ? 'Lobby'
                          : ownedSession.round_state === 'question_open'
                            ? 'Question live'
                            : ownedSession.round_state === 'round_results'
                              ? 'Results'
                              : 'Finished'}
                      </span>
                      <p className="surface-note">
                        {ownedSession.state === 'lobby'
                          ? 'Start when the room is ready.'
                          : ownedSession.round_state === 'question_open'
                            ? 'Reveal to close the round.'
                            : ownedSession.round_state === 'round_results'
                              ? 'Advance when the standings settle.'
                              : 'Quiz complete.'}
                      </p>
                    </div>
                    <div className="host-control-actions">
                      <form action={advanceAction.action}>
                        <button className="button button-compact" type="submit">
                          {advanceAction.label}
                        </button>
                      </form>
                    </div>
                  </aside>
                ) : null}
              </>
            ) : null
          }
          joinQrSrc={qrSrc}
          joinUrl={joinUrl}
          session={session}
        />
      </div>
    </main>
  )
}
