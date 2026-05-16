'use client'

import { useEffect, useState } from 'react'
import { getOptionLabel, getOptionToneClass, type SessionQuestion } from '@/lib/gameplay'

type Props = {
  hasAnswered: boolean
  question: SessionQuestion
  selectedOptionId: string | null
  submitAction: (formData: FormData) => void | Promise<void>
}

const ANSWER_DELAY_MS = 2000
const ANSWER_DELAY_SECONDS = ANSWER_DELAY_MS / 1000

export function PlayerQuestionPanel({ hasAnswered, question, selectedOptionId, submitAction }: Props) {
  const [answersVisible, setAnswersVisible] = useState(hasAnswered)
  const [countdown, setCountdown] = useState(ANSWER_DELAY_SECONDS)

  useEffect(() => {
    if (hasAnswered) {
      setAnswersVisible(true)
      setCountdown(0)
      return
    }

    setAnswersVisible(false)
    setCountdown(ANSWER_DELAY_SECONDS)

    const timeout = window.setTimeout(() => {
      setAnswersVisible(true)
      setCountdown(0)
    }, ANSWER_DELAY_MS)

    const interval = window.setInterval(() => {
      setCountdown((current) => (current > 1 ? current - 1 : 1))
    }, 1000)

    return () => {
      window.clearTimeout(timeout)
      window.clearInterval(interval)
    }
  }, [hasAnswered, question.id])

  if (hasAnswered) {
    return (
      <section className="card stack player-state-card player-state-card--compact">
        <span className="pill">Answer registered</span>
        <p className="surface-note">Your answer is locked in. Waiting for the result.</p>
        <div className="player-answer-grid">
          {question.options.map((option) => (
            <div
              key={option.id}
              className={`player-answer-pad ${getOptionToneClass(option.position)} ${selectedOptionId === option.id ? 'is-selected' : ''}`}
            >
              <span className="player-answer-label">{getOptionLabel(option.position)}</span>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (!answersVisible) {
    return (
      <section className="card stack player-state-card player-state-card--compact">
        <span className="pill">Question live</span>
        <p className="surface-note">Answer pads unlock in {countdown}…</p>
      </section>
    )
  }

  return (
    <section className="stack">
      <div className="row-between player-state-heading">
        <span className="pill">Question {question.position}</span>
        <span className="pill">Choose one</span>
      </div>
      <form action={submitAction} className="player-answer-grid">
        {question.options.map((option) => (
          <button
            key={option.id}
            className={`player-answer-pad player-answer-pad--button ${getOptionToneClass(option.position)}`}
            name="optionId"
            type="submit"
            value={option.id}
          >
            <span className="player-answer-label">{getOptionLabel(option.position)}</span>
          </button>
        ))}
      </form>
    </section>
  )
}
