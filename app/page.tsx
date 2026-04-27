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
      <div className="container stack">
        <section className="card stack">
          <span className="pill">Milestones 1-2</span>
          <h1>Quizzer host console</h1>
          <p className="muted">
            Create quizzes, publish them, and launch a live lobby that players can join from their phones.
          </p>
          {user ? (
            <div className="row">
              <Link className="button" href="/host">
                Open host dashboard
              </Link>
              <form action={signOut}>
                <button className="button secondary" type="submit">
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <div className="stack">
              {localAuthEnabled ? (
                <>
                  <p className="muted">
                    Local Supabase detected. Use email/password auth instead of Google for development.
                  </p>
                  <form action={signInWithPassword} className="stack">
                    <label className="stack" htmlFor="email">
                      <span>Email</span>
                      <input id="email" name="email" type="email" defaultValue="host@example.com" required />
                    </label>
                    <label className="stack" htmlFor="password">
                      <span>Password</span>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        defaultValue="quizzer-local-password"
                        minLength={8}
                        required
                      />
                    </label>
                    <div className="row">
                      <button className="button" type="submit">
                        Sign in locally
                      </button>
                    </div>
                  </form>
                  <form action={signUpWithPassword} className="stack">
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
            </div>
          )}
        </section>

        <section className="card stack">
          <span className="pill">Player join</span>
          <h2>Enter a live join code</h2>
          <p className="muted">Use the 6-character code shown on the projector screen.</p>
          {query.joinError === 'invalid-code' ? <div className="error">Enter a valid 6-character join code.</div> : null}
          <form action={openJoinCode} className="row">
            <input maxLength={6} name="joinCode" placeholder="ABC123" style={{ textTransform: 'uppercase' }} />
            <button className="button" type="submit">
              Join session
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
