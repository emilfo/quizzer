import { notFound } from 'next/navigation'
import {
  addQuestion,
  deleteQuestion,
  getQuizForEditor,
  moveQuestion,
  publishQuiz,
  saveQuestion,
  updateQuizTitle,
} from '../actions'
import { validateQuizForPublish } from '@/lib/quiz-validation'

export default async function QuizEditorPage({
  params,
}: {
  params: Promise<{ quizId: string }>
}) {
  const { quizId } = await params
  const quiz = await getQuizForEditor(quizId)
  if (!quiz) notFound()

  const validation = validateQuizForPublish(quiz)

  return (
    <section className="stack">
      <section className="card hero-card stack">
        <div className="row-between">
          <div className="stack" style={{ gap: '0.3rem' }}>
            <span className="brand-badge">Quiz editor</span>
            <h1 className="display-title">Build the round without friction.</h1>
          </div>
          <span className="pill">{quiz.status}</span>
        </div>
        <p className="hero-copy">Keep each question crisp, validate the answer set clearly, and publish when the quiz is ready for a live room.</p>
        <div className="control-row">
          <form action={updateQuizTitle.bind(null, quiz.id)} className="control-row" style={{ gridColumn: '1 / -1' }}>
            <input className="editor-input" name="title" defaultValue={quiz.title} />
            <button className="button secondary" type="submit">
              Save title
            </button>
          </form>
          <form action={publishQuiz.bind(null, quiz.id)}>
            <button className="button" type="submit">
              Publish
            </button>
          </form>
        </div>
        {!validation.isPublishable ? (
          <div className="error stack">
            {validation.errors.map((error) => (
              <div key={error}>{error}</div>
            ))}
          </div>
        ) : (
          <div className="success">Quiz is ready to publish.</div>
        )}
      </section>

      <div className="row-between">
        <form action={addQuestion.bind(null, quiz.id)}>
          <button className="button" type="submit">
            Add question
          </button>
        </form>
        <span className="surface-note">Questions stay modular so the host can edit quickly between live rounds.</span>
      </div>

      <div className="subtle-grid">
        {quiz.questions.map((question, index) => {
          const questionValidation = validation.questionSummaries.find((item) => item.questionId === question.id)
          return (
            <article key={question.id} className="card stack stage-card">
              <div className="row-between">
                <div className="stack" style={{ gap: '0.2rem' }}>
                  <span className="kicker">Question {index + 1}</span>
                  <strong>{question.prompt ? 'Live question' : 'Draft question'}</strong>
                </div>
                <div className="join-cta">
                  <form action={moveQuestion.bind(null, quiz.id, question.id, 'up')}>
                    <button className="button secondary" type="submit" disabled={index === 0}>
                      Up
                    </button>
                  </form>
                  <form action={moveQuestion.bind(null, quiz.id, question.id, 'down')}>
                    <button className="button secondary" type="submit" disabled={index === quiz.questions.length - 1}>
                      Down
                    </button>
                  </form>
                  <form action={deleteQuestion.bind(null, quiz.id, question.id)}>
                    <button className="button danger" type="submit">
                      Delete
                    </button>
                  </form>
                </div>
              </div>

              <form action={saveQuestion.bind(null, quiz.id, question.id)} className="editor-form">
                <label className="field">
                  <span>Prompt</span>
                  <textarea className="editor-textarea" name="prompt" defaultValue={question.prompt} />
                </label>

                <div className="subtle-grid">
                  {question.options.map((option) => (
                    <label key={option.id} className="field">
                      <span>Option {option.position}</span>
                      <input type="hidden" name={`option-${option.position}-id`} value={option.id} />
                      <input className="editor-input" name={`option-${option.position}`} defaultValue={option.optionText} />
                    </label>
                  ))}
                </div>

                <div className="chip-row">
                  {question.options.map((option) => (
                    <label key={option.id} className="control-chip" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                      <input type="radio" name="correct" value={String(option.position)} defaultChecked={option.isCorrect} />
                      <span>Correct {option.position}</span>
                    </label>
                  ))}
                </div>

                <div className="row-between">
                  <button className="button" type="submit">
                    Save question
                  </button>
                  {questionValidation && !questionValidation.isValid ? (
                    <div className="error">{questionValidation.errors.join(' ')}</div>
                  ) : null}
                </div>
              </form>
            </article>
          )
        })}
      </div>
    </section>
  )
}
