import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <main className="page-shell">
      <div className="container stack">
        <section className="card stack">
          <h1>Sign-in failed</h1>
          <p className="muted">
            Check your Supabase auth settings and credentials, then try again.
          </p>
          <div>
            <Link className="button secondary" href="/">
              Return home
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
