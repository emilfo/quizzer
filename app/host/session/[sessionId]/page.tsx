import Link from 'next/link'
import { LiveSessionRefresh } from '@/components/live-session-refresh'
import { LiveSessionStage } from '@/components/live-session-stage'
import { buildPlayerJoinPath, buildProjectorPath } from '@/lib/live-session'
import { advanceQuizSession, closeQuizRound, getHostSessionControlData, startQuizSession } from '../../actions'

export default async function HostSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = await params
  const { finalLeaderboard, participants, question, reveal, session } = await getHostSessionControlData(sessionId)
  const advanceAction =
    session.state === 'lobby'
      ? { label: 'Start quiz', action: startQuizSession.bind(null, session.id), disabled: false }
      : session.round_state === 'question_open'
        ? { label: 'Reveal / close round', action: closeQuizRound.bind(null, session.id), disabled: false }
        : session.round_state === 'round_results'
          ? { label: 'Next / continue', action: advanceQuizSession.bind(null, session.id), disabled: false }
          : null

  return (
    <main className="page-shell host-session-page">
      <div className="container stack host-session-shell">
      <LiveSessionRefresh mode="host" sessionId={session.id} />

      <div className="host-session-stage-shell">
        <div className="host-session-toolbar" aria-label="Host session links">
          <span className="pill">Host · {session.state}</span>
          <div className="host-nav-links">
            <Link className="button secondary button-compact" href={buildProjectorPath(session.join_code)}>
              Open projector
            </Link>
            <Link className="button secondary button-compact" href={buildPlayerJoinPath(session.join_code)}>
              Open player join
            </Link>
          </div>
        </div>

        <LiveSessionStage
          joinUrl={buildPlayerJoinPath(session.join_code)}
          session={{
            finalResults: session.state === 'finished' ? { leaderboard: finalLeaderboard } : null,
            joinCode: session.join_code,
            participantCount: participants.length,
            question:
              session.state === 'in_progress' && question
                ? {
                    id: question.id,
                    position: question.position,
                    prompt: question.prompt,
                    options: question.options.map((option) => ({ id: option.id, position: option.position, text: option.text })),
                  }
                : null,
            quizTitle: session.quiz_title,
            reveal: reveal,
            roundState: session.round_state,
            sessionId: session.id,
            sessionState: session.state,
          }}
          hostControls={
            <aside className="host-control-strip" aria-label="Host controls">
              <div className="host-control-copy">
                <span className="pill">{session.state === 'lobby' ? 'Lobby' : session.round_state === 'question_open' ? 'Question live' : session.round_state === 'round_results' ? 'Results' : 'Finished'}</span>
                <p className="surface-note">
                  {session.state === 'lobby'
                    ? 'Start when the room is ready.'
                    : session.round_state === 'question_open'
                      ? 'Reveal to close the round.'
                      : session.round_state === 'round_results'
                        ? 'Advance when the standings settle.'
                        : 'Quiz complete.'}
                </p>
              </div>
              {advanceAction ? (
                <div className="host-control-actions">
                  <form action={advanceAction.action}>
                    <button className="button button-compact" type="submit">
                      {advanceAction.label}
                    </button>
                  </form>
                </div>
              ) : null}
            </aside>
          }
        />
      </div>
      </div>
    </main>
  )
}
