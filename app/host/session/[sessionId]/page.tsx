import Link from 'next/link'
import { LiveSessionPanel } from '@/components/live-session-panel'
import { buildPlayerJoinPath, buildProjectorPath } from '@/lib/live-session'
import { getHostSessionControlData, startQuizSession } from '../../actions'

export default async function HostSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = await params
  const { participants, session } = await getHostSessionControlData(sessionId)

  return (
    <section className="stack">
      <section className="card stack">
        <div className="row-between">
          <div className="stack" style={{ gap: '0.25rem' }}>
            <span className="pill">Host controls</span>
            <h1>{session.quiz_title}</h1>
            <div className="muted">Join code: {session.join_code}</div>
          </div>
          <span className="pill">{session.state}</span>
        </div>
        <div className="row">
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
        </div>
        <p className="muted">
          {session.state === 'lobby'
            ? 'Starting the quiz closes the lobby to new joins.'
            : 'The lobby is closed. Gameplay controls continue in Milestone 3.'}
        </p>
      </section>

      <LiveSessionPanel
        initialParticipantCount={participants.length}
        initialParticipants={participants}
        initialState={session.state}
        mode="host"
        sessionId={session.id}
      />
    </section>
  )
}
