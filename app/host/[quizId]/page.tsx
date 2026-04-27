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
      <div className="card stack">
        <div className="row-between">
          <div className="stack" style={{ gap: '0.25rem' }}>
            <span className="pill">{quiz.status}</span>
            <h1>Edit quiz</h1>
          </div>
          <form action={publishQuiz.bind(null, quiz.id)}>
            <button className="button" type="submit">
              Publish
            </button>
          </form>
        </div>
        <form action={updateQuizTitle.bind(null, quiz.id)} className="row">
          <input name="title" defaultValue={quiz.title} />
          <button className="button secondary" type="submit">
            Save title
          </button>
        </form>
        {!validation.isPublishable ? (
          <div className="error stack">
            {validation.errors.map((error) => (
              <div key={error}>{error}</div>
            ))}
          </div>
        ) : (
          <div className="success">Quiz is ready to publish.</div>
        )}
      </div>

      <form action={addQuestion.bind(null, quiz.id)}>
        <button className="button" type="submit">
          Add question
        </button>
      </form>

      <div className="stack">
        {quiz.questions.map((question, index) => {
          const questionValidation = validation.questionSummaries.find((item) => item.questionId === question.id)
          return (
            <article key={question.id} className="card stack">
              <div className="row-between">
                <strong>Question {index + 1}</strong>
                <div className="row">
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

              <form action={saveQuestion.bind(null, quiz.id, question.id)} className="stack">
                <label className="field">
                  <span>Prompt</span>
                  <textarea name="prompt" defaultValue={question.prompt} />
                </label>

                <div className="stack">
                  {question.options.map((option) => (
                    <label key={option.id} className="field">
                      <span>Option {option.position}</span>
                      <input type="hidden" name={`option-${option.position}-id`} value={option.id} />
                      <input name={`option-${option.position}`} defaultValue={option.optionText} />
                    </label>
                  ))}
                </div>

                <div className="row">
                  {question.options.map((option) => (
                    <label key={option.id} className="row" style={{ alignItems: 'center' }}>
                      <input type="radio" name="correct" value={String(option.position)} defaultChecked={option.isCorrect} />
                      Correct {option.position}
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
