import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import UserStatus from '@/components/UserStatus'
import CookieConsent from '@/components/CookieConsent'

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
          <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-hertford-green to-hertford-green-light flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md shadow-hertford-green/20">
                H
              </div>
              <span className="font-heading text-sm sm:text-lg font-bold text-gray-900 hidden sm:block">
                Do You Know Hertford?
              </span>
            </Link>
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/quiz" className="text-gray-600 hover:text-hertford-green transition-colors font-medium text-xs sm:text-sm">
                Quiz
              </Link>
              <Link href="/leaderboard" className="text-gray-600 hover:text-hertford-green transition-colors font-medium text-xs sm:text-sm">
                Board
              </Link>
              <Link href="/history" className="text-gray-600 hover:text-hertford-green transition-colors font-medium text-xs sm:text-sm">
                History
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
            <div className="flex justify-center gap-4 mb-3">
              <Link href="/privacy" className="text-gray-400 hover:text-hertford-green transition-colors text-xs">
                Privacy Policy
              </Link>
              <Link href="/delete-account" className="text-gray-400 hover:text-hertford-green transition-colors text-xs">
                Delete Account
              </Link>
            </div>
            <p className="text-gray-400 text-xs">
              &copy; {new Date().getFullYear()} Do You Know Hertford? All rights reserved.
            </p>
          </div>
        </footer>

        {/* Cookie Consent Banner */}
        <CookieConsent />
      </body>
    </html>
  )
}
