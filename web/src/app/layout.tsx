import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Skills Lego - Compose AI Skills',
  description: 'Build AI agent skills like LEGO blocks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white min-h-screen">{children}</body>
    </html>
  )
}
