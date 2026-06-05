'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-hertford-dark text-white shadow-lg">
      <nav className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🏛️</span>
            <div>
              <h1 className="font-heading text-xl font-bold text-hertford-gold">
                Do You Know Hertford?
              </h1>
              <p className="text-xs text-gray-400">The Ultimate Local Quiz</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-hertford-gold transition-colors">
              Home
            </Link>
            <Link href="/quiz" className="hover:text-hertford-gold transition-colors">
              Play Quiz
            </Link>
            <Link href="/leaderboard" className="hover:text-hertford-gold transition-colors">
              Leaderboard
            </Link>
            <Link href="/quiz" className="btn-secondary text-sm !py-2 !px-4">
              Play Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-700 flex flex-col gap-3">
            <Link href="/" className="hover:text-hertford-gold transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/quiz" className="hover:text-hertford-gold transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Play Quiz
            </Link>
            <Link href="/leaderboard" className="hover:text-hertford-gold transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Leaderboard
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
