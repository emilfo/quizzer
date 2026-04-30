import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <main className="page-shell">
      <div className="container stack">
        <section className="card stack hero-card">
          <span className="brand-badge">Sign-in detour</span>
          <h1 className="display-title">That login took a wrong turn.</h1>
          <p className="hero-copy">Check your Supabase auth settings and credentials, then try again.</p>
          <div className="join-cta">
            <Link className="button secondary" href="/">
              Return home
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
