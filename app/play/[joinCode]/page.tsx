import { cookies } from 'next/headers'
import { LiveSessionPanel } from '@/components/live-session-panel'
import {
  isSessionJoinOpen,
  isValidJoinCode,
  normalizeJoinCode,
  parseParticipantCookie,
  PARTICIPANT_COOKIE_NAME,
} from '@/lib/live-session'
import { createClient } from '@/lib/supabase/server'
import { joinLiveSession } from '../actions'

const errorMessages: Record<string, string> = {
  'duplicate-nickname': 'That nickname is already taken in this session.',
  'join-closed': 'This session is no longer accepting new players.',
  'join-failed': 'Unable to join the session right now. Retry in a moment.',
  'missing-nickname': 'Enter a nickname before joining.',
  'nickname-too-long': 'Nickname must be 32 characters or fewer.',
  'session-not-found': 'That join code does not match an active session.',
}

export default async function PlayerJoinPage({
  params,
  searchParams,
}: {
  params: Promise<{ joinCode: string }>
  searchParams: Promise<{ error?: string; joined?: string }>
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
  const { data: session } = await supabase
    .from('public_session_lobbies')
    .select('session_id, join_code, quiz_title, state, participant_count')
    .eq('join_code', normalizedJoinCode)
    .maybeSingle()

  if (!session) {
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
    participantCookie?.sessionId === session.session_id
      ? (
          await supabase.rpc('get_session_participant', {
            p_participant_id: participantCookie.participantId,
            p_session_id: session.session_id,
          })
        ).data?.[0] ?? null
      : null

  const canJoin = isSessionJoinOpen(session.state) && !joinedParticipant

  return (
    <main className="page-shell">
      <div className="container stack">
        <section className="card stack">
          <span className="pill">Player join</span>
          <h1>{session.quiz_title}</h1>
          <div className="muted">Join code: {session.join_code}</div>
          {query.joined === '1' ? <div className="success">Joined successfully.</div> : null}
          {query.error ? <div className="error">{errorMessages[query.error] ?? 'Unable to join that session.'}</div> : null}
          {canJoin ? (
            <form action={joinLiveSession.bind(null, session.join_code)} className="stack">
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

        <LiveSessionPanel
          initialParticipantCount={session.participant_count}
          initialState={session.state}
          joinCode={session.join_code}
          joinedNickname={joinedParticipant?.nickname ?? participantCookie?.nickname ?? null}
          mode="player"
          sessionId={session.session_id}
        />
      </div>
    </main>
  )
}
