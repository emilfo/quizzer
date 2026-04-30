import { headers } from 'next/headers'
import Link from 'next/link'
import { LiveSessionRefresh } from '@/components/live-session-refresh'
import {
  getOptionLabel,
  getOptionToneClass,
  getRevealOptionCount,
  getRevealOptionPercentage,
  getRevealTotalResponses,
  type PublicSessionView,
} from '@/lib/gameplay'
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
          <section className="card hero-card stack center-card">
            <span className="brand-badge">Projector error</span>
            <h1 className="display-title">That code looks off.</h1>
            <p className="hero-copy">Use the 6-character join code shown on the host screen.</p>
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
          <section className="card hero-card stack center-card">
            <span className="brand-badge">Session not found</span>
            <h1 className="display-title">No live session matches that code.</h1>
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
  const revealOptionCounts = session.reveal?.optionCounts ?? []
  const totalResponses = getRevealTotalResponses(revealOptionCounts)

  return (
    <main className="page-shell">
      <div className="container stack">
        <LiveSessionRefresh mode="public" sessionId={session.sessionId} />

        {session.sessionState === 'lobby' ? (
          <div className="page-grid page-grid--projector">
            <section className="card projector-stage stack center-card">
              <span className="brand-badge">Public projector</span>
              <h1 className="display-title">{session.quizTitle}</h1>
              <div className="projector-code">{session.joinCode}</div>
              <p className="hero-copy">Scan the QR code or enter the join code at home to join the lobby.</p>
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
              <p className="surface-note">Friendly, quick join flow. The room feels ready before the quiz starts.</p>
            </section>
          </div>
        ) : null}

        {session.sessionState === 'in_progress' && session.question && session.roundState === 'question_open' ? (
          <section className="card projector-stage stack">
            <div className="row-between">
              <div className="stack" style={{ gap: '0.2rem' }}>
                <span className="brand-badge">Question {session.question.position}</span>
                <h1 className="display-title">{session.quizTitle}</h1>
              </div>
              <span className="pill">Question open</span>
            </div>
            <h2 className="section-title">{session.question.prompt}</h2>
            <div className="projector-answer-grid answer-grid">
              {session.question.options.map((option) => (
                <div key={option.id} className={`projector-answer-tile ${getOptionToneClass(option.position)}`}>
                  <div className="row-between">
                    <div className="option-key">{getOptionLabel(option.position)}</div>
                    <span className="pill">Tap color</span>
                  </div>
                  <strong className="projector-answer-text">{option.text}</strong>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {session.sessionState === 'in_progress' && session.question && session.roundState === 'round_results' ? (
          <>
            <section className="card projector-stage stack">
              <div className="row-between">
                <div className="stack" style={{ gap: '0.2rem' }}>
                  <span className="brand-badge">Round results</span>
                  <h1 className="display-title">{session.quizTitle}</h1>
                </div>
                <span className="pill">{totalResponses} responses</span>
              </div>
              <h2 className="section-title">{session.question.prompt}</h2>
              <p className="surface-note">The reveal shows how the room answered before shifting to the live standings.</p>
              <div className="projector-answer-grid answer-grid">
                {session.question.options.map((option) => {
                  const optionCount = getRevealOptionCount(revealOptionCounts, option.id)
                  const optionPercentage = getRevealOptionPercentage(revealOptionCounts, option.id)

                  return (
                    <div
                      key={option.id}
                      className={`projector-answer-tile ${getOptionToneClass(option.position)} ${session.reveal?.correctOptionId === option.id ? 'is-correct' : ''}`}
                    >
                      <div className="row-between">
                        <div className="option-key">{getOptionLabel(option.position)}</div>
                        {session.reveal?.correctOptionId === option.id ? <span className="pill">Correct</span> : <span className="pill">Option</span>}
                      </div>
                      <strong className="projector-answer-text">{option.text}</strong>
                      <div className="result-stat-block">
                        <div className="result-stat-row">
                          <strong>{optionCount}</strong>
                          <span>{optionPercentage}%</span>
                        </div>
                        <div className="result-bar-track">
                          <div className="result-bar-fill" style={{ width: `${optionPercentage}%` }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="card stack">
              <div className="row-between">
                <h2 className="section-title">Top 3 leaderboard</h2>
                <span className="pill">Live standings</span>
              </div>
              <div className="subtle-grid">
                {session.reveal?.leaderboard.map((entry) => (
                  <div key={entry.participantId} className="podium-row">
                    <div className="row" style={{ alignItems: 'center' }}>
                      <div className="rank-badge">#{entry.rank}</div>
                      <div>
                        <strong>{entry.nickname}</strong>
                        <div className="surface-note">Round +{entry.roundScore}</div>
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
          <section className="card projector-stage stack">
            <div className="row-between">
              <div className="stack" style={{ gap: '0.25rem' }}>
                <span className="brand-badge">Final results</span>
                <h1 className="display-title">{session.quizTitle}</h1>
              </div>
              <span className="pill">Top 3</span>
            </div>
            <div className="subtle-grid">
              {session.finalResults?.leaderboard.map((entry) => (
                <div key={entry.participantId} className="podium-row">
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
