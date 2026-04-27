import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Quizzer',
  description: 'Quiz authoring and live lobby hosting',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
