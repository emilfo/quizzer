import { cookies } from 'next/headers'
import { LiveSessionRefresh } from '@/components/live-session-refresh'
import { getOptionLabel, getOptionToneClass, type PlayerSessionView, type PublicSessionView } from '@/lib/gameplay'
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
          <section className="card stack">
            <h1>Unknown join code</h1>
            <p className="muted">Enter a 6-character join code from the projector screen.</p>
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
          <section className="card stack">
            <h1>Session not found</h1>
            <p className="muted">Check the join code and try again.</p>
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
  const finalResult = playerState?.finalResult ?? null

  return (
    <main className="page-shell">
      <div className="container stack">
        <LiveSessionRefresh mode="public" sessionId={publicState.sessionId} />

        <section className="card stack">
          <span className="pill">Player join</span>
          <h1>{publicState.quizTitle}</h1>
          <div className="muted">Join code: {publicState.joinCode}</div>
          {query.joined === '1' ? <div className="success">Joined successfully.</div> : null}
          {query.answered === '1' ? <div className="success">Answer submitted.</div> : null}
          {query.error ? <div className="error">{errorMessages[query.error] ?? 'Unable to join that session.'}</div> : null}
          {canJoin ? (
            <form action={joinLiveSession.bind(null, publicState.joinCode)} className="stack">
              <label className="field">
                <span>Nickname</span>
                <input maxLength={32} name="nickname" placeholder="Quiz hero" required />
              </label>
              <div className="row">
                <button className="button" type="submit">
                  Join session
                </button>
              </div>
            </form>
          ) : null}
          {!canJoin && !joinedParticipant ? (
            <p className="muted">This lobby is closed to new joins.</p>
          ) : null}
        </section>

        <section className="card stack">
          <div className="row-between">
            <strong>{joinedParticipant ? `Joined as ${joinedParticipant.nickname}` : 'Join status'}</strong>
            <span className="pill">{publicState.participantCount} in session</span>
          </div>

          {publicState.sessionState === 'lobby' ? (
            <p className={joinedParticipant ? 'success' : 'muted'}>
              {joinedParticipant ? 'You are checked in and waiting for the host.' : 'Enter a nickname to join while the lobby is open.'}
            </p>
          ) : null}

          {joinedParticipant && activeState.question && activeState.roundState === 'question_open' ? (
            <section className="stack">
              <div className="pill">Question {activeState.question.position}</div>
              <h2 className="question-prompt">{activeState.question.prompt}</h2>

              {hasAnswered ? (
                <p className="success">Your answer is locked in. Waiting for the host to close the round.</p>
              ) : (
                <p className="muted">Choose one answer. You only get one submission.</p>
              )}

              {hasAnswered ? (
                <div className="option-grid">
                  {activeState.question.options.map((option) => (
                    <div
                      key={option.id}
                      className={`option-card ${getOptionToneClass(option.position)} ${selectedOptionId === option.id ? 'is-selected' : ''}`}
                    >
                      <div className="option-label">{getOptionLabel(option.position)}</div>
                      <strong>{option.text}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <form action={submitPlayerAnswer.bind(null, publicState.joinCode)} className="option-grid">
                  {activeState.question.options.map((option) => (
                    <button
                      key={option.id}
                      className={`option-card option-button ${getOptionToneClass(option.position)}`}
                      name="optionId"
                      type="submit"
                      value={option.id}
                    >
                      <div className="option-label">{getOptionLabel(option.position)}</div>
                      <strong>{option.text}</strong>
                    </button>
                  ))}
                </form>
              )}
            </section>
          ) : null}

          {joinedParticipant && activeState.question && activeState.roundState === 'round_results' ? (
            <section className="stack">
              <div className="pill">Round results</div>
              <h2 className="question-prompt">{activeState.question.prompt}</h2>
              <p className={playerCorrect === true ? 'success' : playerCorrect === false ? 'error' : 'muted'}>
                {playerCorrect === true
                  ? 'Correct.'
                  : playerCorrect === false
                    ? 'Incorrect.'
                    : 'No answer was submitted for this round.'}
              </p>
              <div className="option-grid">
                {activeState.question.options.map((option) => {
                  const classes = [
                    'option-card',
                    getOptionToneClass(option.position),
                    selectedOptionId === option.id ? 'is-selected' : '',
                    correctOptionId === option.id ? 'is-correct' : '',
                    selectedOptionId === option.id && correctOptionId !== option.id ? 'is-incorrect' : '',
                  ]

                  return (
                    <div key={option.id} className={classes.filter(Boolean).join(' ')}>
                      <div className="option-label">{getOptionLabel(option.position)}</div>
                      <strong>{option.text}</strong>
                    </div>
                  )
                })}
              </div>
            </section>
          ) : null}

          {publicState.sessionState === 'in_progress' && !joinedParticipant ? (
            <p className="muted">This game is already in progress. New joins stay closed after the lobby.</p>
          ) : null}

          {publicState.sessionState === 'finished' && joinedParticipant && finalResult ? (
            <section className="stack">
              <div className="pill">Final result</div>
              <h2>You finished #{finalResult.rank}</h2>
              <p className="success">Total score: {finalResult.totalScore}</p>
            </section>
          ) : null}

          {publicState.sessionState === 'finished' && !joinedParticipant ? (
            <p className="muted">This quiz is finished. New joins are closed.</p>
          ) : null}
        </section>
      </div>
    </main>
  )
}
