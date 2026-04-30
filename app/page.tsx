import Link from 'next/link'
import { signInWithGoogle, signInWithPassword, signOut, signUpWithPassword } from '@/app/auth/actions'
import { openJoinCode } from '@/app/play/actions'
import { isLocalSupabaseAuthEnabled } from '@/lib/auth-mode'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ joinError?: string }>
}) {
  const supabase = await createClient()
  const localAuthEnabled = isLocalSupabaseAuthEnabled()
  const query = await searchParams
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="page-shell">
      <div className="container subtle-grid">
        <section className="card hero-card stack">
          <span className="brand-badge">Quizzer · Playful Rally</span>
          <h1 className="display-title">Warm, colorful live quizzes.</h1>
          <p className="hero-copy">
            Launch a lively room, keep the projector readable from across the classroom, and let players tap bold color pads on their phones.
          </p>

          <div className="hero-metrics">
            <div className="hero-metric">
              <strong>Projector-led</strong>
              <span>Questions and results do the storytelling.</span>
            </div>
            <div className="hero-metric">
              <strong>Color-first</strong>
              <span>Players answer with large, friendly tap targets.</span>
            </div>
          </div>
        </section>

        <div className="page-grid page-grid--entry">
          <section className="card stack entry-join">
            <div className="stack" style={{ gap: '0.45rem' }}>
              <span className="kicker">Player join</span>
              <h2 className="section-title">Enter a live join code</h2>
              <p className="surface-note">Use the 6-character code shown on the projector screen.</p>
            </div>
            {query.joinError === 'invalid-code' ? <div className="error">Enter a valid 6-character join code.</div> : null}
            <form action={openJoinCode} className="join-form">
              <input className="join-input" maxLength={6} name="joinCode" placeholder="ABC123" />
              <button className="button" type="submit">
                Join session
              </button>
            </form>
          </section>

          <section className="card stack">
            <div className="stack" style={{ gap: '0.45rem' }}>
              <span className="kicker">Host access</span>
              <h2 className="section-title">Keep the room moving</h2>
              <p className="surface-note">Hosts get a calm, operational console for publishing quizzes and launching sessions.</p>
            </div>

            {user ? (
              <div className="join-cta">
                <Link className="button" href="/host">
                  Open host dashboard
                </Link>
                <form action={signOut}>
                  <button className="button secondary" type="submit">
                    Sign out
                  </button>
                </form>
              </div>
            ) : localAuthEnabled ? (
              <>
                <p className="surface-note">Local Supabase detected. Use email/password auth instead of Google for development.</p>
                <form action={signInWithPassword} className="auth-form">
                  <label className="field" htmlFor="email">
                    <span>Email</span>
                    <input className="auth-input" id="email" name="email" type="email" defaultValue="host@example.com" required />
                  </label>
                  <label className="field" htmlFor="password">
                    <span>Password</span>
                    <input
                      className="auth-input"
                      id="password"
                      name="password"
                      type="password"
                      defaultValue="quizzer-local-password"
                      minLength={8}
                      required
                    />
                  </label>
                  <button className="button" type="submit">
                    Sign in locally
                  </button>
                </form>
                <form action={signUpWithPassword}>
                  <input name="fullName" type="hidden" value="Local Host" />
                  <input name="email" type="hidden" value="host@example.com" />
                  <input name="password" type="hidden" value="quizzer-local-password" />
                  <button className="button secondary" type="submit">
                    Create default local host user
                  </button>
                </form>
              </>
            ) : (
              <form action={signInWithGoogle}>
                <button className="button" type="submit">
                  Continue with Google
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
