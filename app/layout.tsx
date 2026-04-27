import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Quizzer',
  description: 'Single-host quiz authoring',
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
