import { cookies } from 'next/headers'
import Link from 'next/link'
import { LiveSessionRefresh } from '@/components/live-session-refresh'
import { PlayerQuestionPanel } from '@/components/player-question-panel'
import {
  getOptionLabel,
  getOptionToneClass,
  getRevealOptionCount,
  getRevealOptionPercentage,
  getRevealTotalResponses,
  type PlayerSessionView,
  type PublicSessionView,
} from '@/lib/gameplay'
import {
  isSessionJoinOpen,
  isValidJoinCode,
  normalizeJoinCode,
  parseParticipantCookie,
  PARTICIPANT_COOKIE_NAME,
} from '@/lib/live-session'
import { createClient } from '@/lib/supabase/server'
import { joinLiveSession, submitPlayerAnswer } from '../actions'

const errorMessages: Record<string, string> = {
  'duplicate-nickname': 'That nickname is already taken in this session.',
  'join-closed': 'This session is no longer accepting new players.',
  'join-failed': 'Unable to join the session right now. Retry in a moment.',
  'missing-nickname': 'Enter a nickname before joining.',
  'nickname-too-long': 'Nickname must be 32 characters or fewer.',
  'duplicate-answer': 'You already answered this question.',
  'round-closed': 'That round is already closed.',
  'answer-failed': 'Unable to submit that answer right now.',
  'rejoin-required': 'Your player session could not be restored. Join again if the lobby is still open.',
  'session-not-found': 'That join code does not match an active session.',
}

export default async function PlayerJoinPage({
  params,
  searchParams,
}: {
  params: Promise<{ joinCode: string }>
  searchParams: Promise<{ answered?: string; error?: string; joined?: string }>
}) {
  const { joinCode } = await params
  const query = await searchParams
  const normalizedJoinCode = normalizeJoinCode(joinCode)

  if (!isValidJoinCode(normalizedJoinCode)) {
    return (
      <main className="page-shell player-shell">
        <div className="container player-frame stack">
          <section className="card hero-card stack center-card player-state-card">
            <span className="brand-badge">Join error</span>
            <h1 className="display-title">Invalid join code.</h1>
            <p className="hero-copy">Enter the 6-character code shown on the projector.</p>
            <Link className="button secondary" href="/">
              Return home
            </Link>
          </section>
        </div>
      </main>
    )
  }

  const supabase = await createClient()
  const { data: publicStateData } = await supabase.rpc('get_public_session_state', {
    p_join_code: normalizedJoinCode,
  })

  const publicState = publicStateData as PublicSessionView | null

  if (!publicState) {
    return (
      <main className="page-shell player-shell">
        <div className="container player-frame stack">
          <section className="card hero-card stack center-card player-state-card">
            <span className="brand-badge">Session not found</span>
            <h1 className="display-title">No live room matches that code.</h1>
            <p className="hero-copy">Check the projector code and try again.</p>
            <Link className="button secondary" href="/">
              Return home
            </Link>
          </section>
        </div>
      </main>
    )
  }

  const cookieStore = await cookies()
  const participantCookie = parseParticipantCookie(cookieStore.get(PARTICIPANT_COOKIE_NAME)?.value)
  const joinedParticipant =
    participantCookie?.sessionId === publicState.sessionId
      ? (
          await supabase.rpc('get_session_participant', {
            p_participant_id: participantCookie.participantId,
            p_session_id: publicState.sessionId,
            p_session_token: participantCookie.sessionToken,
          })
        ).data?.[0] ?? null
      : null

  const playerState = joinedParticipant && participantCookie
    ? ((
        await supabase.rpc('get_player_session_state', {
          p_join_code: normalizedJoinCode,
          p_participant_id: joinedParticipant.id,
          p_session_token: participantCookie.sessionToken,
        })
      ).data as PlayerSessionView | null)
    : null

  const canJoin = isSessionJoinOpen(publicState.sessionState) && !joinedParticipant
  const activeState = playerState ?? publicState
  const selectedOptionId = playerState?.player?.selectedOptionId ?? null
  const hasAnswered = playerState?.player?.hasAnswered ?? false
  const playerCorrect = playerState?.player?.isCorrect ?? null
  const playerRoundScore = playerState?.player?.roundScore ?? null
  const pointsBehindNext = playerState?.player?.pointsBehindNext ?? null
  const correctOptionId = activeState.reveal?.correctOptionId ?? null
  const revealOptionCounts = activeState.reveal?.optionCounts ?? []
  const totalResponses = getRevealTotalResponses(revealOptionCounts)
  const finalResult = playerState?.finalResult ?? null

  return (
    <main className="page-shell player-shell">
      <div className="container player-frame stack">
        <LiveSessionRefresh mode="public" sessionId={publicState.sessionId} />

        {canJoin ? (
          <section className="card stack hero-card player-state-card">
            <span className="brand-badge">Join quiz</span>
            <h1 className="display-title">{publicState.joinCode}</h1>
            <p className="hero-copy">Pick a nickname to join {publicState.quizTitle}.</p>
            {query.error ? <div className="error">{errorMessages[query.error] ?? 'Unable to join that session.'}</div> : null}
            <form action={joinLiveSession.bind(null, publicState.joinCode)} className="join-form">
              <label className="field">
                <span>Nickname</span>
                <input className="auth-input" maxLength={32} name="nickname" placeholder="Quiz hero" required />
              </label>
              <button className="button" type="submit">
                Join quiz
              </button>
            </form>
          </section>
        ) : null}

        {joinedParticipant ? (
          <section className="stack player-active-stack">
            <section className="card stack player-state-card player-state-card--compact">
              <div className="row-between player-state-heading">
                <strong>{joinedParticipant.nickname}</strong>
                <span className="pill">{publicState.participantCount} in room</span>
              </div>
              {query.error ? <div className="error">{errorMessages[query.error] ?? 'Unable to update your player state.'}</div> : null}
              {publicState.sessionState === 'lobby' ? <p className="surface-note">Waiting for the host to start the quiz.</p> : null}
            </section>

            {joinedParticipant && activeState.question && activeState.roundState === 'question_open' ? (
              <PlayerQuestionPanel
                hasAnswered={hasAnswered}
                question={activeState.question}
                selectedOptionId={selectedOptionId}
                submitAction={submitPlayerAnswer.bind(null, publicState.joinCode)}
              />
            ) : null}

            {joinedParticipant && activeState.question && activeState.roundState === 'round_results' ? (
              <section className="stack">
                <section className="card stack player-state-card">
                  <div className="row-between player-state-heading">
                    <span className="pill">Round results</span>
                    <span className={playerCorrect === true ? 'pill status-pill-success' : playerCorrect === false ? 'pill status-pill-muted' : 'pill'}>
                      {playerCorrect === true ? 'Correct' : playerCorrect === false ? 'Incorrect' : 'No answer'}
                    </span>
                  </div>
                  <div className="player-result-summary">
                    <div className={playerCorrect === true ? 'success' : playerCorrect === false ? 'error' : 'surface-note'}>
                      {playerCorrect === true
                        ? 'You got it right.'
                        : playerCorrect === false
                          ? 'Not this round.'
                          : 'No answer was submitted.'}
                    </div>
                    <div className="stat-strip">
                      <div className="stat-chip">
                        <strong>{playerRoundScore ?? 0}</strong>
                        <span>points this round</span>
                      </div>
                      <div className="stat-chip">
                        <strong>{pointsBehindNext ?? 0}</strong>
                        <span>{pointsBehindNext === null ? 'currently leading' : 'points to next ahead'}</span>
                      </div>
                    </div>
                    <p className="surface-note">{totalResponses} responses were recorded before the reveal closed.</p>
                  </div>
                </section>

                <div className="player-answer-grid">
                  {activeState.question.options.map((option) => {
                    const classes = [
                      'player-answer-pad',
                      getOptionToneClass(option.position),
                      selectedOptionId === option.id ? 'is-selected' : '',
                      correctOptionId === option.id ? 'is-correct' : '',
                      selectedOptionId === option.id && correctOptionId !== option.id ? 'is-incorrect' : '',
                    ]
                    const optionCount = getRevealOptionCount(revealOptionCounts, option.id)
                    const optionPercentage = getRevealOptionPercentage(revealOptionCounts, option.id)

                    return (
                      <div key={option.id} className={classes.filter(Boolean).join(' ')}>
                        <span className="player-answer-label">{getOptionLabel(option.position)}</span>
                        <div className="result-stat-block">
                          <div className="result-stat-row">
                            <strong>{optionCount}</strong>
                            <span>{optionPercentage}%</span>
                          </div>
                          <div className="result-bar-track">
                            <div className="result-bar-fill" style={{ width: `${optionPercentage}%` }} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            ) : null}

            {publicState.sessionState === 'finished' && finalResult ? (
              <section className="card stack player-state-card player-state-card--compact">
                <span className="pill">Finished</span>
                <h2 className="section-title">You finished #{finalResult.rank}</h2>
                <p className="success">Total score: {finalResult.totalScore}</p>
              </section>
            ) : null}
          </section>
        ) : null}

        {publicState.sessionState === 'lobby' && !joinedParticipant && !canJoin ? (
          <section className="card stack player-state-card player-state-card--compact">
            <span className="pill">Lobby closed</span>
            <p className="surface-note">This lobby is no longer accepting new players.</p>
          </section>
        ) : null}

        {publicState.sessionState === 'in_progress' && !joinedParticipant ? (
          <section className="card stack player-state-card player-state-card--compact">
            <span className="pill">Game in progress</span>
            <p className="surface-note">New joins close after the lobby.</p>
          </section>
        ) : null}

        {publicState.sessionState === 'finished' && !joinedParticipant ? (
          <section className="card stack player-state-card player-state-card--compact">
            <span className="pill">Finished</span>
            <p className="surface-note">This quiz has ended. New joins are closed.</p>
          </section>
        ) : null}
      </div>
    </main>
  )
}
