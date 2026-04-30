import Link from 'next/link'
import { buildPlayerJoinPath, buildProjectorPath } from '@/lib/live-session'
import { createQuiz, getHostActiveSession, getHostQuizzes, startLiveSession } from './actions'

export default async function HostDashboardPage() {
  const [quizzes, activeSession] = await Promise.all([getHostQuizzes(), getHostActiveSession()])

  return (
    <section className="stack">
      <section className="card hero-card stack">
        <span className="brand-badge">Host dashboard</span>
        <h1 className="display-title">Calm, vivid quiz control.</h1>
        <p className="hero-copy">Create quizzes, publish them, and run one live lobby at a time without losing the room’s energy.</p>
        <form action={createQuiz} className="control-row">
          <input className="editor-input" name="title" placeholder="New quiz title" />
          <button className="button" type="submit">
            Create quiz
          </button>
        </form>
      </section>

      <div className="page-grid page-grid--dashboard">
        {activeSession ? (
          <section className="card stack stage-card">
            <div className="row-between">
              <div className="stack" style={{ gap: '0.25rem' }}>
                <span className="kicker">Active session</span>
                <h2 className="section-title">{activeSession.quiz_title}</h2>
                <div className="surface-note">Join code: {activeSession.join_code}</div>
              </div>
              <span className="pill">{activeSession.state}</span>
            </div>
            <div className="join-cta">
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
        ) : (
          <section className="card stack">
            <span className="kicker">No live session</span>
            <h2 className="section-title">Nothing on air yet.</h2>
            <p className="surface-note">Publish a quiz to launch a live lobby and generate a join code.</p>
          </section>
        )}

        <section className="card stack">
          <div className="row-between">
            <div className="stack" style={{ gap: '0.2rem' }}>
              <span className="kicker">Quiz library</span>
              <h2 className="section-title">Ready to edit or publish</h2>
            </div>
            <span className="pill">{quizzes.length} quizzes</span>
          </div>

          <div className="subtle-grid">
            {quizzes.map((quiz) => (
              <article key={quiz.id} className="card stack">
                <div className="row-between">
                  <strong>{quiz.title}</strong>
                  <span className="pill">{quiz.status}</span>
                </div>
                <div className="join-cta">
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
      </div>
    </section>
  )
}
