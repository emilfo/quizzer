import { cookies } from 'next/headers'
import Link from 'next/link'
import { LiveSessionRefresh } from '@/components/live-session-refresh'
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
      <main className="page-shell">
        <div className="container stack">
          <section className="card hero-card stack center-card">
            <span className="brand-badge">Join error</span>
            <h1 className="display-title">That code needs a second look.</h1>
            <p className="hero-copy">Enter the 6-character join code shown on the projector screen.</p>
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
      <main className="page-shell">
        <div className="container stack">
          <section className="card hero-card stack center-card">
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
  const correctOptionId = activeState.reveal?.correctOptionId ?? null
  const revealOptionCounts = activeState.reveal?.optionCounts ?? []
  const totalResponses = getRevealTotalResponses(revealOptionCounts)
  const finalResult = playerState?.finalResult ?? null

  return (
    <main className="page-shell">
      <div className="container stack">
        <LiveSessionRefresh mode="public" sessionId={publicState.sessionId} />

        <div className="page-grid page-grid--play">
          <section className="card stack hero-card">
            <span className="brand-badge">Player join</span>
            <h1 className="display-title">{publicState.quizTitle}</h1>
            <div className="surface-note">Join code: {publicState.joinCode}</div>
            {query.joined === '1' ? <div className="success">Joined successfully.</div> : null}
            {query.answered === '1' ? <div className="success">Answer submitted.</div> : null}
            {query.error ? <div className="error">{errorMessages[query.error] ?? 'Unable to join that session.'}</div> : null}
            {canJoin ? (
              <form action={joinLiveSession.bind(null, publicState.joinCode)} className="join-form">
                <label className="field">
                  <span>Nickname</span>
                  <input className="auth-input" maxLength={32} name="nickname" placeholder="Quiz hero" required />
                </label>
                <button className="button" type="submit">
                  Join session
                </button>
              </form>
            ) : null}
            {!canJoin && !joinedParticipant ? <p className="surface-note">This lobby is closed to new joins.</p> : null}
          </section>

          <section className="card stack">
            <div className="row-between">
              <strong>{joinedParticipant ? `Joined as ${joinedParticipant.nickname}` : 'Join status'}</strong>
              <span className="pill">{publicState.participantCount} in session</span>
            </div>

            {publicState.sessionState === 'lobby' ? (
              <p className={joinedParticipant ? 'success' : 'surface-note'}>
                {joinedParticipant ? 'You are checked in and waiting for the host.' : 'Enter a nickname to join while the lobby is open.'}
              </p>
            ) : null}

            {joinedParticipant && activeState.question && activeState.roundState === 'question_open' ? (
              <section className="stack">
                <div className="row-between">
                  <span className="pill">Question {activeState.question.position}</span>
                  <span className="pill">{hasAnswered ? 'Locked in' : 'Choose one'}</span>
                </div>
                <h2 className="section-title">{activeState.question.prompt}</h2>

                {hasAnswered ? (
                  <p className="success">Your answer is locked in. Waiting for the host to close the round.</p>
                ) : (
                  <p className="surface-note">Pick one large color pad. You only get one submission.</p>
                )}

                {hasAnswered ? (
                  <div className="answer-grid">
                    {activeState.question.options.map((option) => (
                      <div
                        key={option.id}
                        className={`answer-tile ${getOptionToneClass(option.position)} ${selectedOptionId === option.id ? 'is-selected' : ''}`}
                      >
                        <div className="option-label">{getOptionLabel(option.position)}</div>
                        <strong className="answer-text">{option.text}</strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <form action={submitPlayerAnswer.bind(null, publicState.joinCode)} className="answer-grid">
                    {activeState.question.options.map((option) => (
                      <button
                        key={option.id}
                        className={`answer-tile answer-tile--button ${getOptionToneClass(option.position)}`}
                        name="optionId"
                        type="submit"
                        value={option.id}
                      >
                        <div className="option-label">{getOptionLabel(option.position)}</div>
                        <strong className="answer-text">{option.text}</strong>
                      </button>
                    ))}
                  </form>
                )}
              </section>
            ) : null}

            {joinedParticipant && activeState.question && activeState.roundState === 'round_results' ? (
              <section className="stack">
                <div className="row-between">
                  <span className="pill">Round results</span>
                  <span className={playerCorrect === true ? 'pill status-pill-success' : playerCorrect === false ? 'pill status-pill-muted' : 'pill'}>
                    {playerCorrect === true ? 'Correct' : playerCorrect === false ? 'Incorrect' : 'No answer'}
                  </span>
                </div>
                <h2 className="section-title">{activeState.question.prompt}</h2>
                <div className={playerCorrect === true ? 'success' : playerCorrect === false ? 'error' : 'surface-note'}>
                  {playerCorrect === true
                    ? 'Nice work — you picked the right answer.'
                    : playerCorrect === false
                      ? 'Close one — the correct answer is highlighted below.'
                      : 'No answer was submitted for this round.'}
                </div>
                <p className="surface-note">{totalResponses} total responses came in before the reveal closed.</p>
                <div className="answer-grid">
                  {activeState.question.options.map((option) => {
                    const classes = [
                      'answer-tile',
                      getOptionToneClass(option.position),
                      selectedOptionId === option.id ? 'is-selected' : '',
                      correctOptionId === option.id ? 'is-correct' : '',
                      selectedOptionId === option.id && correctOptionId !== option.id ? 'is-incorrect' : '',
                    ]
                    const optionCount = getRevealOptionCount(revealOptionCounts, option.id)
                    const optionPercentage = getRevealOptionPercentage(revealOptionCounts, option.id)

                    return (
                      <div key={option.id} className={classes.filter(Boolean).join(' ')}>
                        <div className="option-label">{getOptionLabel(option.position)}</div>
                        <strong className="answer-text">{option.text}</strong>
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

            {publicState.sessionState === 'in_progress' && !joinedParticipant ? (
              <p className="surface-note">This game is already in progress. New joins stay closed after the lobby.</p>
            ) : null}

            {publicState.sessionState === 'finished' && joinedParticipant && finalResult ? (
              <section className="stack">
                <span className="pill">Final result</span>
                <h2 className="section-title">You finished #{finalResult.rank}</h2>
                <p className="success">Total score: {finalResult.totalScore}</p>
              </section>
            ) : null}

            {publicState.sessionState === 'finished' && !joinedParticipant ? (
              <p className="surface-note">This quiz is finished. New joins are closed.</p>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  )
}
