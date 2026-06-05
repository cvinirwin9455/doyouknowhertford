'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <nav className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hertford-green to-hertford-green-light flex items-center justify-center text-white font-bold text-lg shadow-md shadow-hertford-green/20 group-hover:shadow-lg group-hover:shadow-hertford-green/30 transition-all">
              H
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold text-gray-900">
                Do You Know Hertford?
              </h1>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-hertford-green transition-colors font-medium">
              Home
            </Link>
            <Link href="/quiz" className="text-gray-600 hover:text-hertford-green transition-colors font-medium">
              Quiz
            </Link>
            <Link href="/leaderboard" className="text-gray-600 hover:text-hertford-green transition-colors font-medium">
              Leaderboard
            </Link>
            <Link href="/advertise" className="text-gray-600 hover:text-hertford-green transition-colors font-medium">
              For Business
            </Link>
            <Link href="/quiz" className="bg-hertford-green text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-hertford-green-light hover:shadow-md hover:shadow-hertford-green/20 transition-all">
              Play Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 p-2"
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
          <div className="md:hidden mt-4 pt-4 border-t border-gray-100 flex flex-col gap-4 pb-4 animate-fade-in">
            <Link href="/" className="text-gray-700 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/quiz" className="text-gray-700 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              Quiz
            </Link>
            <Link href="/leaderboard" className="text-gray-700 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              Leaderboard
            </Link>
            <Link href="/advertise" className="text-gray-700 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              For Business
            </Link>
            <Link href="/quiz" className="btn-primary !text-base mt-2" onClick={() => setMobileMenuOpen(false)}>
              Play Free
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
