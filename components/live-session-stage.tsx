import type { ReactNode } from 'react'
import Link from 'next/link'
import { getOptionLabel, getOptionToneClass, getRevealOptionCount, getRevealOptionPercentage, getRevealTotalResponses, type LeaderboardEntry, type PublicSessionView, type SessionQuestion } from '@/lib/gameplay'

type SessionLike = {
  sessionId: string
  joinCode: string
  quizTitle: string
  sessionState: PublicSessionView['sessionState']
  roundState: PublicSessionView['roundState']
  participantCount: number
  question: SessionQuestion | null
  reveal: PublicSessionView['reveal']
  finalResults: PublicSessionView['finalResults']
}

type Participant = {
  id: string
  nickname: string
  hasAnswered?: boolean
}

type Props = {
  session: SessionLike
  participants?: Participant[]
  joinUrl?: string
  joinQrSrc?: string
  hostControls?: ReactNode
  showHostPanels?: boolean
}

function Leaderboard({ entries, showRoundScore }: { entries: LeaderboardEntry[]; showRoundScore: boolean }) {
  return (
    <div className="subtle-grid">
      {entries.map((entry) => (
        <div key={entry.participantId} className="podium-row">
          <div className="row" style={{ alignItems: 'center' }}>
            <div className="rank-badge">#{entry.rank}</div>
            <div>
              <strong>{entry.nickname}</strong>
              {showRoundScore ? <div className="surface-note">Round +{entry.roundScore}</div> : null}
            </div>
          </div>
          <div className="leaderboard-score">
            <strong>{entry.totalScore}</strong>
            {showRoundScore ? <span className={`movement ${entry.movement > 0 ? 'up' : entry.movement < 0 ? 'down' : 'flat'}`}>{entry.movement > 0 ? `↑${entry.movement}` : entry.movement < 0 ? `↓${Math.abs(entry.movement)}` : '—'}</span> : null}
          </div>
        </div>
      ))}
    </div>
  )
}

function QuestionCard({ question, roundState }: { question: SessionQuestion; roundState: 'question_open' | 'round_results' }) {
  const reveal = roundState === 'round_results'
  return (
    <section className="card projector-stage stack">
      <div className="row-between">
        <span className="brand-badge">Question {question.position}</span>
        <span className="pill">{reveal ? 'Round results' : 'Question open'}</span>
      </div>
      <h2 className="section-title">{question.prompt}</h2>
      <div className="projector-answer-grid answer-grid">
        {question.options.map((option) => (
          <div key={option.id} className={`projector-answer-tile ${getOptionToneClass(option.position)}`}>
            <div className="row-between">
              <div className="option-key">{getOptionLabel(option.position)}</div>
              <span className="pill">{reveal ? 'Reveal' : 'Answer pad'}</span>
            </div>
            <strong className="projector-answer-text">{option.text}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}

export function LiveSessionStage({ session, participants = [], joinUrl, joinQrSrc, hostControls, showHostPanels = false }: Props) {
  const revealOptionCounts = session.reveal?.optionCounts ?? []
  const totalResponses = getRevealTotalResponses(revealOptionCounts)

  return (
    <div className="live-session-stage stack">
      {session.sessionState === 'lobby' ? (
        <div className="page-grid page-grid--projector">
          <section className="card projector-stage stack center-card">
            <span className="brand-badge">Public projector</span>
            <h1 className="display-title">{session.quizTitle}</h1>
            <div className="projector-code">{session.joinCode}</div>
            <p className="hero-copy">Scan the QR code or enter the join code to join the lobby.</p>
            {joinQrSrc ? (
              // eslint-disable-next-line @next/next/no-img-element -- QR image is served by an external generator URL.
              <img alt={`QR code for ${joinUrl ?? session.joinCode}`} className="qr-image" height="240" src={joinQrSrc} width="240" />
            ) : null}
            {joinUrl ? (
              <Link className="button secondary" href={joinUrl}>
                Open join link
              </Link>
            ) : null}
          </section>
          <section className="card stack center-card">
            <span className="pill">Lobby open</span>
            <div className="metric">{session.participantCount}</div>
            <div className="metric-label">participants</div>
            <p className="surface-note">The room is open and ready.</p>
          </section>
        </div>
      ) : null}

      {session.sessionState === 'in_progress' && session.question && session.roundState === 'question_open' ? (
        <QuestionCard question={session.question} roundState={session.roundState} />
      ) : null}

      {session.sessionState === 'in_progress' && session.question && session.roundState === 'round_results' ? (
        <div className="page-grid page-grid--projector-results">
          <section className="card projector-stage stack">
            <div className="row-between">
              <div className="stack" style={{ gap: '0.2rem' }}>
                <span className="brand-badge">Round results</span>
                <h1 className="display-title">{session.quizTitle}</h1>
              </div>
              <span className="pill">{totalResponses} responses</span>
            </div>
            <h2 className="section-title">{session.question.prompt}</h2>
            <div className="projector-answer-grid answer-grid">
              {session.question.options.map((option) => {
                const optionCount = getRevealOptionCount(revealOptionCounts, option.id)
                const optionPercentage = getRevealOptionPercentage(revealOptionCounts, option.id)
                return (
                  <div key={option.id} className={`projector-answer-tile ${getOptionToneClass(option.position)} ${session.reveal?.correctOptionId === option.id ? 'is-correct' : ''}`}>
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
            <Leaderboard entries={session.reveal?.leaderboard ?? []} showRoundScore />
          </section>
        </div>
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
          <Leaderboard entries={session.finalResults?.leaderboard ?? []} showRoundScore={false} />
        </section>
      ) : null}

      {showHostPanels && session.sessionState === 'lobby' ? (
        <section className="card stack live-session-participants">
          <div className="row-between">
            <strong>Participants</strong>
            <span className="pill">{participants.length} joined</span>
          </div>
          {participants.length === 0 ? <p className="muted">Waiting for players to join the lobby.</p> : <div className="participant-list">{participants.map((participant) => <div key={participant.id} className="participant-chip">{participant.nickname}</div>)}</div>}
        </section>
      ) : null}

      {showHostPanels && session.sessionState === 'in_progress' && session.question ? (
        <section className="card stack live-session-participants">
          <div className="row-between">
            <strong>Player status</strong>
            <span className="pill">{participants.length} participants</span>
          </div>
          <div className="subtle-grid">
            {participants.map((participant) => (
              <div key={participant.id} className="podium-row">
                <strong>{participant.nickname}</strong>
                <span className={`pill ${participant.hasAnswered ? 'status-pill-success' : 'status-pill-muted'}`}>{participant.hasAnswered ? 'Answered' : 'Waiting'}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {hostControls}
    </div>
  )
}
