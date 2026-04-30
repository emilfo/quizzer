import Link from 'next/link'
import { LiveSessionRefresh } from '@/components/live-session-refresh'
import { getOptionLabel, getOptionToneClass } from '@/lib/gameplay'
import { buildPlayerJoinPath, buildProjectorPath } from '@/lib/live-session'
import { advanceQuizSession, closeQuizRound, getHostSessionControlData, startQuizSession } from '../../actions'

export default async function HostSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = await params
  const { answeredCount, finalLeaderboard, leaderboard, participants, question, session } = await getHostSessionControlData(sessionId)

  return (
    <section className="stack">
      <LiveSessionRefresh mode="host" sessionId={session.id} />

      <section className="card hero-card stack">
        <div className="row-between">
          <div className="stack" style={{ gap: '0.25rem' }}>
            <span className="brand-badge">Live control room</span>
            <h1 className="display-title">{session.quiz_title}</h1>
            <div className="surface-note">Join code: {session.join_code}</div>
          </div>
          <span className="pill">{session.state}</span>
        </div>
        <div className="join-cta">
          <Link className="button secondary" href={buildProjectorPath(session.join_code)}>
            Open projector
          </Link>
          <Link className="button secondary" href={buildPlayerJoinPath(session.join_code)}>
            Open player join
          </Link>
          <form action={startQuizSession.bind(null, session.id)}>
            <button className="button" disabled={session.state !== 'lobby'} type="submit">
              Start quiz
            </button>
          </form>
          <form action={closeQuizRound.bind(null, session.id)}>
            <button className="button danger" disabled={session.state !== 'in_progress' || session.round_state !== 'question_open'} type="submit">
              Close round
            </button>
          </form>
          <form action={advanceQuizSession.bind(null, session.id)}>
            <button className="button" disabled={session.state !== 'in_progress' || session.round_state !== 'round_results'} type="submit">
              Continue
            </button>
          </form>
        </div>
        <p className="surface-note">
          {session.state === 'lobby'
            ? 'Starting the quiz closes the lobby to new joins.'
            : session.round_state === 'question_open'
              ? 'The question is live. Players can answer once until you close the round.'
              : session.state === 'finished'
                ? 'This session is finished. Gameplay is locked and final standings are stable.'
                : 'Round results are live. Advance to the next question or finish the quiz.'}
        </p>
      </section>

      <div className="page-grid page-grid--live">
        {session.state === 'lobby' ? (
          <section className="card stack">
          <div className="row-between">
            <strong>Participants</strong>
            <span className="pill">{participants.length} joined</span>
          </div>
          {participants.length === 0 ? (
            <p className="muted">Waiting for players to join the lobby.</p>
          ) : (
            <div className="participant-list">
              {participants.map((participant) => (
                <div key={participant.id} className="participant-chip">
                  {participant.nickname}
                </div>
              ))}
            </div>
          )}
        </section>
        ) : null}

        {session.state === 'in_progress' && question ? (
          <section className="card stack">
            <div className="row-between">
              <div className="stack" style={{ gap: '0.25rem' }}>
                <span className="pill">
                  Question {question.position} · {session.round_state === 'question_open' ? 'Open' : 'Results'}
                </span>
                <h2 className="section-title">{question.prompt}</h2>
              </div>
              <div className="stat-chip">
                <strong>
                  {answeredCount} / {participants.length}
                </strong>
                <span>answers received</span>
              </div>
            </div>

            <div className="answer-grid">
              {question.options.map((option) => (
                <div
                  key={option.id}
                  className={`answer-tile ${getOptionToneClass(option.position)} ${session.round_state === 'round_results' && option.isCorrect ? 'is-correct' : ''}`}
                >
                  <div className="option-label">{getOptionLabel(option.position)}</div>
                  <strong className="answer-text">{option.text}</strong>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="card stack">
          <div className="row-between">
            <strong>{session.state === 'finished' || session.round_state === 'round_results' ? 'Leaderboard' : 'Player status'}</strong>
            <span className="pill">{participants.length} participants</span>
          </div>

          {session.state === 'finished' ? (
            <div className="subtle-grid">
              {finalLeaderboard.map((entry) => (
                <div key={entry.participantId} className="podium-row">
                  <div className="row" style={{ alignItems: 'center' }}>
                    <div className="rank-badge">#{entry.rank}</div>
                    <div>
                      <strong>{entry.nickname}</strong>
                    </div>
                  </div>
                  <div className="leaderboard-score">
                    <strong>{entry.totalScore}</strong>
                  </div>
                </div>
              ))}
            </div>
          ) : session.round_state === 'round_results' ? (
            <div className="subtle-grid">
              {leaderboard.map((entry) => (
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
          ) : (
            <div className="subtle-grid">
              {participants.map((participant) => (
                <div key={participant.id} className="podium-row">
                  <div>
                    <strong>{participant.nickname}</strong>
                  </div>
                  <span className={`pill ${participant.hasAnswered ? 'status-pill-success' : 'status-pill-muted'}`}>
                    {participant.hasAnswered ? 'Answered' : 'Waiting'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  )
}
