import type { Database } from '@/lib/supabase/types'

export type SessionState = Database['public']['Enums']['session_state']
export type RoundState = Database['public']['Enums']['round_state']

export type SessionQuestionOption = {
  id: string
  text: string
  position: number
}

export type SessionQuestion = {
  id: string
  position: number
  prompt: string
  options: SessionQuestionOption[]
}

export type LeaderboardEntry = {
  participantId: string
  nickname: string
  totalScore: number
  roundScore: number
  rank: number
  previousRank: number
  movement: number
}

export type RevealOptionCount = {
  optionId: string
  position: number
  count: number
}

export type PublicSessionView = {
  sessionId: string
  joinCode: string
  quizTitle: string
  sessionState: SessionState
  roundState: RoundState
  participantCount: number
  question: SessionQuestion | null
  reveal: {
    correctOptionId: string | null
    optionCounts: RevealOptionCount[]
    leaderboard: LeaderboardEntry[]
  } | null
  finalResults: {
    leaderboard: LeaderboardEntry[]
  } | null
}

export type PlayerSessionView = PublicSessionView & {
  player: {
    participantId: string
    hasAnswered: boolean
    selectedOptionId: string | null
    isCorrect: boolean | null
    roundScore: number | null
    pointsBehindNext: number | null
  } | null
  finalResult: {
    participantId: string
    nickname: string
    rank: number
    totalScore: number
  } | null
}

type RankedEntry = {
  participantId: string
  nickname: string
  joinedAt: string
  totalScore: number
  previousScore: number
  roundScore: number
}

export function getOptionLabel(position: number) {
  return ['A', 'B', 'C', 'D'][position - 1] ?? String(position)
}

export function getOptionToneClass(position: number) {
  return `option-tone-${Math.min(4, Math.max(1, position))}`
}

export function getRevealOptionCount(optionCounts: RevealOptionCount[], optionId: string) {
  return optionCounts.find((optionCount) => optionCount.optionId === optionId)?.count ?? 0
}

export function getRevealTotalResponses(optionCounts: RevealOptionCount[]) {
  return optionCounts.reduce((sum, optionCount) => sum + optionCount.count, 0)
}

export function getRevealOptionPercentage(optionCounts: RevealOptionCount[], optionId: string) {
  const totalResponses = getRevealTotalResponses(optionCounts)
  if (totalResponses === 0) return 0

  return Math.round((getRevealOptionCount(optionCounts, optionId) / totalResponses) * 100)
}

export function calculateSpeedBonus(responseMs: number, roundDurationMs: number, maxBonus = 500) {
  if (roundDurationMs <= 0) return maxBonus

  const clampedResponse = Math.max(0, Math.min(responseMs, roundDurationMs))
  const ratio = 1 - clampedResponse / roundDurationMs
  return Math.round(ratio * maxBonus)
}

export function calculateAnswerScore(isCorrect: boolean, responseMs: number, roundDurationMs: number, baseScore = 1000, maxBonus = 500) {
  if (!isCorrect) {
    return {
      bonus: 0,
      score: 0,
    }
  }

  const bonus = calculateSpeedBonus(responseMs, roundDurationMs, maxBonus)

  return {
    bonus,
    score: baseScore + bonus,
  }
}

function rankByScore<T extends RankedEntry>(entries: T[], getScore: (entry: T) => number) {
  const sorted = [...entries].sort((left, right) => {
    const scoreDiff = getScore(right) - getScore(left)
    if (scoreDiff !== 0) return scoreDiff
    return left.joinedAt.localeCompare(right.joinedAt)
  })

  let lastScore: number | null = null
  let lastRank = 0

  return sorted.map((entry, index) => {
    const score = getScore(entry)
    if (lastScore === null || score !== lastScore) {
      lastRank = index + 1
      lastScore = score
    }

    return {
      ...entry,
      rank: lastRank,
    }
  })
}

export function buildLeaderboard(entries: RankedEntry[]) {
  const current = rankByScore(entries, (entry) => entry.totalScore)
  const previous = rankByScore(entries, (entry) => entry.previousScore)
  const previousRanks = new Map(previous.map((entry) => [entry.participantId, entry.rank]))

  return current.map((entry) => {
    const previousRank = previousRanks.get(entry.participantId) ?? entry.rank
    return {
      participantId: entry.participantId,
      nickname: entry.nickname,
      totalScore: entry.totalScore,
      roundScore: entry.roundScore,
      rank: entry.rank,
      previousRank,
      movement: previousRank - entry.rank,
    }
  })
}

export function buildFinalLeaderboard(entries: Omit<RankedEntry, 'previousScore' | 'roundScore'>[]) {
  return rankByScore(
    entries.map((entry) => ({
      ...entry,
      previousScore: entry.totalScore,
      roundScore: 0,
    })),
    (entry) => entry.totalScore,
  ).map((entry) => ({
    participantId: entry.participantId,
    nickname: entry.nickname,
    totalScore: entry.totalScore,
    roundScore: 0,
    rank: entry.rank,
    previousRank: entry.rank,
    movement: 0,
  }))
}
