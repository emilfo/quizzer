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
          <div className="stack" style={{ gap: '0.35rem' }}>
            <span className="pill">Signed in</span>
            <div>
              <strong>{user.user_metadata.full_name ?? user.email}</strong>
            </div>
            <div className="muted">{user.email}</div>
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
