import Link from 'next/link'
import { redirect } from 'next/navigation'
import { signOut } from '@/app/auth/actions'
import { createClient } from '@/lib/supabase/server'

export default async function HostLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return (
    <main className="page-shell">
      <div className="container stack">
        <header className="card row-between">
          <div className="stack" style={{ gap: '0.45rem' }}>
            <span className="brand-badge">Host control room</span>
            <div className="stack" style={{ gap: '0.15rem' }}>
              <strong>{user.user_metadata.full_name ?? user.email}</strong>
              <div className="surface-note">{user.email}</div>
            </div>
          </div>
          <div className="row">
            <Link className="button secondary" href="/host">
              Dashboard
            </Link>
            <form action={signOut}>
              <button className="button secondary" type="submit">
                Sign out
              </button>
            </form>
          </div>
        </header>
        {children}
      </div>
    </main>
  )
}
