import { describe, expect, it } from 'vitest'
import {
  buildFinalLeaderboard,
  buildLeaderboard,
  calculateAnswerScore,
  calculateSpeedBonus,
  getRevealOptionCount,
  getRevealOptionPercentage,
  getRevealTotalResponses,
  getOptionLabel,
  getOptionToneClass,
} from '../lib/gameplay'

describe('gameplay helpers', () => {
  it('labels options and clamps tone classes', () => {
    expect(getOptionLabel(1)).toBe('A')
    expect(getOptionLabel(4)).toBe('D')
    expect(getOptionLabel(5)).toBe('5')

    expect(getOptionToneClass(1)).toBe('option-tone-1')
    expect(getOptionToneClass(4)).toBe('option-tone-4')
    expect(getOptionToneClass(9)).toBe('option-tone-4')
  })

  it('awards faster answers a larger bonus', () => {
    expect(calculateSpeedBonus(0, 10000)).toBe(500)
    expect(calculateSpeedBonus(5000, 10000)).toBe(250)
    expect(calculateSpeedBonus(12000, 10000)).toBe(0)
  })

  it('calculates exact answer scores', () => {
    expect(calculateAnswerScore(true, 5000, 10000)).toEqual({ bonus: 250, score: 1250 })
    expect(calculateAnswerScore(false, 5000, 10000)).toEqual({ bonus: 0, score: 0 })
  })

  it('builds shared-rank leaderboards with movement', () => {
    const leaderboard = buildLeaderboard([
      { participantId: 'p1', nickname: 'Ada', totalScore: 1500, previousScore: 1400, roundScore: 200, joinedAt: '2026-04-28T10:00:00.000Z' },
      { participantId: 'p2', nickname: 'Bea', totalScore: 1500, previousScore: 1500, roundScore: 300, joinedAt: '2026-04-28T10:01:00.000Z' },
      { participantId: 'p3', nickname: 'Cy', totalScore: 900, previousScore: 1200, roundScore: 0, joinedAt: '2026-04-28T10:02:00.000Z' },
    ])

    expect(leaderboard).toEqual([
      {
        participantId: 'p1',
        nickname: 'Ada',
        totalScore: 1500,
        roundScore: 200,
        rank: 1,
        previousRank: 2,
        movement: 1,
      },
      {
        participantId: 'p2',
        nickname: 'Bea',
        totalScore: 1500,
        roundScore: 300,
        rank: 1,
        previousRank: 1,
        movement: 0,
      },
      {
        participantId: 'p3',
        nickname: 'Cy',
        totalScore: 900,
        roundScore: 0,
        rank: 3,
        previousRank: 3,
        movement: 0,
      },
    ])
  })

  it('builds stable final leaderboards without movement', () => {
    const leaderboard = buildFinalLeaderboard([
      { participantId: 'p1', nickname: 'Ada', totalScore: 2000, joinedAt: '2026-04-28T10:00:00.000Z' },
      { participantId: 'p2', nickname: 'Bea', totalScore: 2000, joinedAt: '2026-04-28T10:01:00.000Z' },
      { participantId: 'p3', nickname: 'Cy', totalScore: 1200, joinedAt: '2026-04-28T10:02:00.000Z' },
    ])

    expect(leaderboard).toEqual([
      {
        participantId: 'p1',
        nickname: 'Ada',
        totalScore: 2000,
        roundScore: 0,
        rank: 1,
        previousRank: 1,
        movement: 0,
      },
      {
        participantId: 'p2',
        nickname: 'Bea',
        totalScore: 2000,
        roundScore: 0,
        rank: 1,
        previousRank: 1,
        movement: 0,
      },
      {
        participantId: 'p3',
        nickname: 'Cy',
        totalScore: 1200,
        roundScore: 0,
        rank: 3,
        previousRank: 3,
        movement: 0,
      },
    ])
  })

  it('derives public reveal counts and percentages by option id', () => {
    const optionCounts = [
      { optionId: 'o1', position: 1, count: 7 },
      { optionId: 'o2', position: 2, count: 3 },
      { optionId: 'o3', position: 3, count: 0 },
      { optionId: 'o4', position: 4, count: 10 },
    ]

    expect(getRevealOptionCount(optionCounts, 'o1')).toBe(7)
    expect(getRevealOptionCount(optionCounts, 'missing')).toBe(0)
    expect(getRevealTotalResponses(optionCounts)).toBe(20)
    expect(getRevealOptionPercentage(optionCounts, 'o2')).toBe(15)
    expect(getRevealOptionPercentage(optionCounts, 'o3')).toBe(0)
  })

  it('returns zero percentage when no public responses were recorded', () => {
    const optionCounts = [
      { optionId: 'o1', position: 1, count: 0 },
      { optionId: 'o2', position: 2, count: 0 },
    ]

    expect(getRevealTotalResponses(optionCounts)).toBe(0)
    expect(getRevealOptionPercentage(optionCounts, 'o1')).toBe(0)
  })
})
