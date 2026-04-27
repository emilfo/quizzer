import { describe, expect, it } from 'vitest'
import { validateQuizForPublish, type QuizDraft } from '../lib/quiz-validation'

const validQuestion = {
  id: 'question-1',
  prompt: 'What is 2 + 2?',
  position: 1,
  options: [
    { id: 'o1', optionText: '3', isCorrect: false, position: 1 },
    { id: 'o2', optionText: '4', isCorrect: true, position: 2 },
    { id: 'o3', optionText: '5', isCorrect: false, position: 3 },
    { id: 'o4', optionText: '6', isCorrect: false, position: 4 },
  ],
} satisfies QuizDraft['questions'][number]

const makeQuiz = (overrides: Partial<QuizDraft> = {}): QuizDraft => ({
  id: 'quiz-1',
  title: 'Sample Quiz',
  status: 'draft',
  questions: [validQuestion],
  ...overrides,
})

describe('validateQuizForPublish', () => {
  it('blocks missing title', () => {
    const result = validateQuizForPublish(makeQuiz({ title: '   ' }))

    expect(result.isPublishable).toBe(false)
    expect(result.errors).toContain('Add a quiz title before publishing.')
  })

  it('blocks quizzes with no questions', () => {
    const result = validateQuizForPublish(makeQuiz({ questions: [] }))

    expect(result.isPublishable).toBe(false)
    expect(result.errors).toContain('Add at least one question before publishing.')
  })

  it('blocks incomplete options', () => {
    const result = validateQuizForPublish(
      makeQuiz({
        questions: [
          {
            ...validQuestion,
            options: [
              { id: 'o1', optionText: '3', isCorrect: false, position: 1 },
              { id: 'o2', optionText: '4', isCorrect: true, position: 2 },
              { id: 'o3', optionText: '', isCorrect: false, position: 3 },
              { id: 'o4', optionText: '6', isCorrect: false, position: 4 },
            ],
          },
        ],
      }),
    )

    expect(result.isPublishable).toBe(false)
    expect(result.questionSummaries[0]?.errors).toContain('All 4 answer options must be filled in.')
  })

  it('blocks multiple correct answers', () => {
    const result = validateQuizForPublish(
      makeQuiz({
        questions: [
          {
            ...validQuestion,
            options: [
              { id: 'o1', optionText: '3', isCorrect: false, position: 1 },
              { id: 'o2', optionText: '4', isCorrect: true, position: 2 },
              { id: 'o3', optionText: '22', isCorrect: true, position: 3 },
              { id: 'o4', optionText: '6', isCorrect: false, position: 4 },
            ],
          },
        ],
      }),
    )

    expect(result.isPublishable).toBe(false)
    expect(result.questionSummaries[0]?.errors).toContain('Question must have exactly 1 correct answer.')
  })

  it('allows a valid publishable quiz', () => {
    const result = validateQuizForPublish(makeQuiz())

    expect(result.isPublishable).toBe(true)
    expect(result.errors).toEqual([])
    expect(result.questionSummaries[0]?.isValid).toBe(true)
  })

  it('blocks publish when all questions are invalid even if quiz has questions', () => {
    const result = validateQuizForPublish(
      makeQuiz({
        questions: [
          {
            ...validQuestion,
            prompt: '   ',
          },
          {
            ...validQuestion,
            id: 'question-2',
            options: [
              { id: 'o1', optionText: '3', isCorrect: false, position: 1 },
              { id: 'o2', optionText: '4', isCorrect: true, position: 2 },
              { id: 'o3', optionText: '', isCorrect: false, position: 3 },
              { id: 'o4', optionText: '6', isCorrect: false, position: 4 },
            ],
          },
        ],
      }),
    )

    expect(result.isPublishable).toBe(false)
    expect(result.errors).toContain('Add at least one complete valid question before publishing.')
    expect(result.questionSummaries.every((question) => !question.isValid)).toBe(true)
  })
})
