import type { Metadata } from 'next'
import { Baloo_2, Nunito_Sans } from 'next/font/google'
import './globals.css'

const displayFont = Baloo_2({
  subsets: ['latin'],
  variable: '--font-display',
})

const bodyFont = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-body',
})

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
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>{children}</body>
    </html>
  )
}
