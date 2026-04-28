import { headers } from 'next/headers'
import Link from 'next/link'
import { LiveSessionRefresh } from '@/components/live-session-refresh'
import { getOptionLabel, getOptionToneClass, type PublicSessionView } from '@/lib/gameplay'
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
  const { data: publicStateData } = await supabase.rpc('get_public_session_state', {
    p_join_code: normalizedJoinCode,
  })

  const session = publicStateData as PublicSessionView | null

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

  const headerStore = await headers()

  const origin = getRequestOrigin(headerStore)
  const joinUrl = buildPlayerJoinUrl(origin, session.joinCode)
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(joinUrl)}`

  return (
    <main className="page-shell">
      <div className="container stack">
        <LiveSessionRefresh mode="public" sessionId={session.sessionId} />

        {session.sessionState === 'lobby' ? (
          <>
            <section className="card stack center-card">
              <span className="pill">Public projector</span>
              <h1>{session.quizTitle}</h1>
              <div className="join-code">{session.joinCode}</div>
              <p className="muted">Scan the QR code or enter the join code at home to join the lobby.</p>
              {/* eslint-disable-next-line @next/next/no-img-element -- QR image is served by an external generator URL. */}
              <img alt={`QR code for ${joinUrl}`} className="qr-image" height="240" src={qrSrc} width="240" />
              <Link className="button secondary" href={joinUrl}>
                Open join link
              </Link>
            </section>

            <section className="card stack center-card">
              <span className="pill">Lobby open</span>
              <div className="metric">{session.participantCount}</div>
              <div className="metric-label">participants</div>
            </section>
          </>
        ) : null}

        {session.sessionState === 'in_progress' && session.question && session.roundState === 'question_open' ? (
          <section className="card stack center-card">
            <span className="pill">Question {session.question.position}</span>
            <h1>{session.quizTitle}</h1>
            <h2 className="question-prompt">{session.question.prompt}</h2>
            <div className="option-grid">
              {session.question.options.map((option) => (
                <div key={option.id} className={`option-card ${getOptionToneClass(option.position)}`}>
                  <div className="option-label">{getOptionLabel(option.position)}</div>
                  <strong>{option.text}</strong>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {session.sessionState === 'in_progress' && session.question && session.roundState === 'round_results' ? (
          <>
            <section className="card stack center-card">
              <span className="pill">Round results</span>
              <h1>{session.quizTitle}</h1>
              <h2 className="question-prompt">{session.question.prompt}</h2>
              <div className="option-grid">
                {session.question.options.map((option) => (
                  <div
                    key={option.id}
                    className={`option-card ${getOptionToneClass(option.position)} ${session.reveal?.correctOptionId === option.id ? 'is-correct' : ''}`}
                  >
                    <div className="option-label">{getOptionLabel(option.position)}</div>
                    <strong>{option.text}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="card stack">
              <div className="row-between">
                <h2>Top 3 leaderboard</h2>
                <span className="pill">Live standings</span>
              </div>
              <div className="leaderboard-list">
                {session.reveal?.leaderboard.map((entry) => (
                  <div key={entry.participantId} className="leaderboard-row">
                    <div className="row" style={{ alignItems: 'center' }}>
                      <div className="rank-badge">#{entry.rank}</div>
                      <div>
                        <strong>{entry.nickname}</strong>
                        <div className="muted">Round +{entry.roundScore}</div>
                      </div>
                    </div>
                    <div className="leaderboard-score">
                      <strong>{entry.totalScore}</strong>
                      <span className={`movement ${entry.movement > 0 ? 'up' : entry.movement < 0 ? 'down' : 'flat'}`}>
                        {entry.movement > 0 ? `↑${entry.movement}` : entry.movement < 0 ? `↓${Math.abs(entry.movement)}` : '—'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : null}

        {session.sessionState === 'finished' ? (
          <section className="card stack">
            <div className="row-between">
              <div className="stack" style={{ gap: '0.25rem' }}>
                <span className="pill">Final results</span>
                <h1>{session.quizTitle}</h1>
              </div>
              <span className="pill">Top 3</span>
            </div>
            <div className="leaderboard-list">
              {session.finalResults?.leaderboard.map((entry) => (
                <div key={entry.participantId} className="leaderboard-row">
                  <div className="row" style={{ alignItems: 'center' }}>
                    <div className="rank-badge">#{entry.rank}</div>
                    <strong>{entry.nickname}</strong>
                  </div>
                  <div className="leaderboard-score">
                    <strong>{entry.totalScore}</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}
