import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <main className="page-shell">
      <div className="container stack">
        <section className="card stack hero-card center-card">
          <span className="brand-badge">Auth error</span>
          <h1 className="display-title">Login failed.</h1>
          <p className="hero-copy">Check your auth settings or credentials, then try again.</p>
          <Link className="button secondary" href="/">
            Return home
          </Link>
        </section>
      </div>
    </main>
  )
}
