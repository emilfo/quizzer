'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SessionState } from '@/lib/live-session'

type Participant = {
  id: string
  nickname: string
}

type LiveSessionPanelProps = {
  sessionId: string
  initialParticipants: Participant[]
  initialState: SessionState
  joinedNickname?: string | null
  mode: 'host' | 'player' | 'projector'
}

export function LiveSessionPanel({
  sessionId,
  initialParticipants,
  initialState,
  joinedNickname,
  mode,
}: LiveSessionPanelProps) {
  const [participants, setParticipants] = useState(initialParticipants)
  const [sessionState, setSessionState] = useState(initialState)

  useEffect(() => {
    const supabase = createClient()

    const refresh = async () => {
      const [{ data: session }, { data: nextParticipants }] = await Promise.all([
        supabase.from('quiz_sessions').select('state').eq('id', sessionId).maybeSingle(),
        supabase.from('participants').select('id, nickname').eq('session_id', sessionId).order('created_at', { ascending: true }),
      ])

      if (session?.state) {
        setSessionState(session.state)
      }

      setParticipants(nextParticipants ?? [])
    }

    const channel = supabase
      .channel(`live-session:${sessionId}:${mode}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quiz_sessions', filter: `id=eq.${sessionId}` }, refresh)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'participants', filter: `session_id=eq.${sessionId}` },
        refresh,
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [mode, sessionId])

  const participantCount = participants.length
  const joinedLabel = useMemo(() => joinedNickname?.trim() ?? '', [joinedNickname])

  if (mode === 'host') {
    return (
      <section className="card stack">
        <div className="row-between">
          <strong>Participants</strong>
          <span className="pill">{participantCount} joined</span>
        </div>
        {participants.length === 0 ? (
          <p className="muted">Waiting for players to join the lobby.</p>
        ) : (
          <div className="participant-list">
            {participants.map((participant) => (
              <div key={participant.id} className="participant-chip">
                {participant.nickname}
              </div>
            ))}
          </div>
        )}
        <p className="muted">
          {sessionState === 'lobby'
            ? 'Lobby sync is live across host, projector, and player views.'
            : 'The quiz has started. Question flow lands in Milestone 3.'}
        </p>
      </section>
    )
  }

  if (mode === 'projector') {
    return (
      <section className="card stack center-card">
        <span className="pill">{sessionState === 'lobby' ? 'Lobby open' : 'Lobby closed'}</span>
        <div className="metric">{participantCount}</div>
        <div className="metric-label">participants</div>
        <p className="muted">
          {sessionState === 'lobby'
            ? 'Ask players to scan the QR code or enter the join code on their phones.'
            : 'The host has started the quiz. Projector gameplay screens land in Milestone 3.'}
        </p>
      </section>
    )
  }

  return (
    <section className="card stack">
      <div className="row-between">
        <strong>{joinedLabel ? `Joined as ${joinedLabel}` : 'Join status'}</strong>
        <span className="pill">{participantCount} in lobby</span>
      </div>
      <p className={joinedLabel ? 'success' : 'muted'}>
        {joinedLabel
          ? 'You are checked in and waiting for the host.'
          : 'Enter a nickname to join while the lobby is open.'}
      </p>
      <p className="muted">
        {sessionState === 'lobby'
          ? 'This page updates automatically as more players join.'
          : 'The host has started the quiz. Player question flow lands in Milestone 3.'}
      </p>
    </section>
  )
}
