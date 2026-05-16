import Link from 'next/link'
import { buildPlayerJoinPath, buildProjectorPath } from '@/lib/live-session'
import { createQuiz, getHostActiveSession, getHostQuizzes, startLiveSession } from './actions'

export default async function HostDashboardPage() {
  const [quizzes, activeSession] = await Promise.all([getHostQuizzes(), getHostActiveSession()])

  return (
    <section className="stack">
      <section className="card hero-card stack">
        <span className="brand-badge">Host dashboard</span>
        <h1 className="display-title">What exists, what is ready, what is live.</h1>
        <p className="hero-copy">Create a quiz fast, check its status at a glance, and launch one live session when the room is ready.</p>
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
                <div className="surface-note">Join code {activeSession.join_code} · {activeSession.state}</div>
              </div>
              <span className="pill">{activeSession.state}</span>
            </div>
            <p className="surface-note">The live room is already open. Use the projector and player-join links as the main public surfaces.</p>
            <div className="join-cta">
              <Link className="button" href={buildProjectorPath(activeSession.join_code)}>
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
            <p className="surface-note">Publish a quiz, then start a live session to generate a join code.</p>
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
                  <div className="stack" style={{ gap: '0.25rem' }}>
                    <strong>{quiz.title}</strong>
                    <span className="surface-note">{quiz.status === 'published' ? 'Ready to launch.' : 'Needs editing before publishing.'}</span>
                  </div>
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
