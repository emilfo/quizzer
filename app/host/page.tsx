import Link from 'next/link'
import { buildPlayerJoinPath, buildProjectorPath } from '@/lib/live-session'
import { createQuiz, getHostActiveSession, getHostQuizzes, startLiveSession } from './actions'

export default async function HostDashboardPage() {
  const [quizzes, activeSession] = await Promise.all([getHostQuizzes(), getHostActiveSession()])

  return (
    <section className="stack">
      <section className="card stack">
        <div className="row-between">
          <div className="stack" style={{ gap: '0.25rem' }}>
            <h1>Host dashboard</h1>
            <p className="muted">Create quizzes, publish them, and run one live lobby at a time.</p>
          </div>
          <form action={createQuiz} className="row">
            <input name="title" placeholder="New quiz title" />
            <button className="button" type="submit">
              Create quiz
            </button>
          </form>
        </div>
      </section>

      {activeSession ? (
        <section className="card stack">
          <div className="row-between">
            <div className="stack" style={{ gap: '0.25rem' }}>
              <span className="pill">Active session</span>
              <strong>{activeSession.quiz_title}</strong>
              <div className="muted">Join code: {activeSession.join_code}</div>
            </div>
            <span className="pill">{activeSession.state}</span>
          </div>
          <div className="row">
            <Link className="button" href={`/host/session/${activeSession.id}`}>
              Open controls
            </Link>
            <Link className="button secondary" href={buildProjectorPath(activeSession.join_code)}>
              Projector
            </Link>
            <Link className="button secondary" href={buildPlayerJoinPath(activeSession.join_code)}>
              Player join
            </Link>
          </div>
        </section>
      ) : null}

      <section className="card stack">
        <div className="grid two">
          {quizzes.map((quiz) => (
            <article key={quiz.id} className="card stack">
              <div className="row-between">
                <strong>{quiz.title}</strong>
                <span className="pill">{quiz.status}</span>
              </div>
              <div className="row">
                <Link className="button secondary" href={`/host/${quiz.id}`}>
                  Open editor
                </Link>
                {quiz.status === 'published' ? (
                  <form action={startLiveSession.bind(null, quiz.id)}>
                    <button className="button" type="submit">
                      Start live session
                    </button>
                  </form>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}
