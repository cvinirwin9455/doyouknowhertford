import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import UserStatus from '@/components/UserStatus'
import CookieConsent from '@/components/CookieConsent'

export const metadata: Metadata = {
  title: 'Do You Know Hertford? | The Ultimate Hertford Quiz',
  description: 'Test your knowledge of Hertford, Hertfordshire! Free quiz with a shared leaderboard. 10 questions, 20 seconds each — compete with other locals!',
  openGraph: {
    title: 'Do You Know Hertford? — Play the Free Local Quiz Now!',
    description: 'Test your knowledge of Hertford! Free quiz with leaderboards. 10 questions, 20 seconds each. How well do you really know our county town?',
    url: 'https://doyouknowhertford.com',
    siteName: 'Do You Know Hertford?',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Do You Know Hertford? — Play the Free Local Quiz Now!',
    description: 'Test your knowledge of Hertford! Free quiz with leaderboards. Compete with other locals!',
  },
  metadataBase: new URL('https://doyouknowhertford.com'),
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
              <img src="/logo.png" alt="Do You Know Hertford?" className="h-12 sm:h-14 w-auto" />
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
