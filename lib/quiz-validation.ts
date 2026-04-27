export type QuizOptionDraft = {
  id: string
  optionText: string
  isCorrect: boolean
  position: number
}

export type QuizQuestionDraft = {
  id: string
  prompt: string
  position: number
  options: QuizOptionDraft[]
}

export type QuizDraft = {
  id: string
  title: string
  status: 'draft' | 'published'
  questions: QuizQuestionDraft[]
}

export type QuizValidationResult = {
  isPublishable: boolean
  errors: string[]
  questionSummaries: Array<{
    questionId: string
    isValid: boolean
    errors: string[]
  }>
}

export function validateQuizForPublish(quiz: QuizDraft): QuizValidationResult {
  const errors: string[] = []
  const trimmedTitle = quiz.title.trim()

  if (!trimmedTitle) {
    errors.push('Add a quiz title before publishing.')
  }

  if (quiz.questions.length === 0) {
    errors.push('Add at least one question before publishing.')
  }

  const questionSummaries = quiz.questions.map((question) => {
    const questionErrors: string[] = []
    const filledOptions = question.options.filter((option) => option.optionText.trim().length > 0)
    const correctOptions = question.options.filter((option) => option.isCorrect)

    if (!question.prompt.trim()) {
      questionErrors.push('Question prompt is required.')
    }

    if (question.options.length !== 4) {
      questionErrors.push('Question must have exactly 4 answer options.')
    }

    if (filledOptions.length !== 4) {
      questionErrors.push('All 4 answer options must be filled in.')
    }

    if (correctOptions.length !== 1) {
      questionErrors.push('Question must have exactly 1 correct answer.')
    }

    return {
      questionId: question.id,
      isValid: questionErrors.length === 0,
      errors: questionErrors,
    }
  })

  if (quiz.questions.length > 0 && !questionSummaries.some((question) => question.isValid)) {
    errors.push('Add at least one complete valid question before publishing.')
  }

  return {
    isPublishable: errors.length === 0 && questionSummaries.every((question) => question.isValid),
    errors,
    questionSummaries,
  }
}
