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
      <div className="container stack" style={{ maxWidth: '56rem' }}>
        <section className="card hero-card stack center-card">
          <span className="brand-badge">Quizzer</span>
          <h1 className="display-title">Start fast. Play together.</h1>
        </section>

        <section className="card stack entry-join">
          <div className="stack" style={{ gap: '0.45rem' }}>
            <span className="kicker">Join quiz</span>
            <h2 className="section-title">Enter a live join code</h2>
            <p className="surface-note">Use the 6-character code shown on the projector.</p>
          </div>
          {query.joinError === 'invalid-code' ? <div className="error">Enter a valid 6-character join code.</div> : null}
          <form action={openJoinCode} className="join-form">
            <input className="join-input" maxLength={6} name="joinCode" placeholder="ABC123" />
            <button className="button" type="submit">
              Join quiz
            </button>
          </form>
        </section>

        <section className="card stack">
          <div className="stack" style={{ gap: '0.45rem' }}>
            <span className="kicker">Create quizzes</span>
            <h2 className="section-title">Sign in to host</h2>
            <p className="surface-note">Creating quizzes starts with login.</p>
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
                  Sign in
                </button>
              </form>
              <form action={signUpWithPassword}>
                <input name="fullName" type="hidden" value="Local Host" />
                <input name="email" type="hidden" value="host@example.com" />
                <input name="password" type="hidden" value="quizzer-local-password" />
                <button className="button secondary" type="submit">
                  Create local host user
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
    </main>
  )
}
