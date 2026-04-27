import Link from 'next/link'
import { signInWithGoogle, signOut } from '@/app/auth/actions'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="page-shell">
      <div className="container stack">
        <section className="card stack">
          <span className="pill">Milestone 1</span>
          <h1>Quizzer host authoring</h1>
          <p className="muted">
            Create quizzes, add valid questions, and publish them when they are ready to host.
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
