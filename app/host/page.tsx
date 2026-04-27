import Link from 'next/link'
import { createQuiz, getHostQuizzes } from './actions'

export default async function HostDashboardPage() {
  const quizzes = await getHostQuizzes()

  return (
    <section className="card stack">
      <div className="row-between">
        <div className="stack" style={{ gap: '0.25rem' }}>
          <h1>Host dashboard</h1>
          <p className="muted">Create quizzes and continue editing published ones in place.</p>
        </div>
        <form action={createQuiz} className="row">
          <input name="title" placeholder="New quiz title" />
          <button className="button" type="submit">
            Create quiz
          </button>
        </form>
      </div>

      <div className="grid two">
        {quizzes.map((quiz) => (
          <article key={quiz.id} className="card stack">
            <div className="row-between">
              <strong>{quiz.title}</strong>
              <span className="pill">{quiz.status}</span>
            </div>
            <Link className="button secondary" href={`/host/${quiz.id}`}>
              Open editor
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
