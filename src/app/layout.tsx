import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import UserStatus from '@/components/UserStatus'

export const metadata: Metadata = {
  title: 'Do You Know Hertford? | The Ultimate Hertford Quiz',
  description: 'Test your knowledge of Hertford, Hertfordshire! Free quiz with a shared leaderboard.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <nav className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-hertford-green to-hertford-green-light flex items-center justify-center text-white font-bold text-sm shadow-md shadow-hertford-green/20">
                H
              </div>
              <span className="font-heading text-lg font-bold text-gray-900 hidden sm:block">
                Do You Know Hertford?
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/quiz" className="text-gray-600 hover:text-hertford-green transition-colors font-medium text-sm hidden sm:block">
                Quiz
              </Link>
              <Link href="/leaderboard" className="text-gray-600 hover:text-hertford-green transition-colors font-medium text-sm hidden sm:block">
                Leaderboard
              </Link>
              <UserStatus />
            </div>
          </nav>
        </header>

        {/* Main */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-100 py-8">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Do You Know Hertford? All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
