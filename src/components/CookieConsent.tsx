'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const COOKIE_KEY = 'hertford_cookie_consent'

export default function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY)
    if (!consent) {
      setShow(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-5 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 text-sm text-gray-600">
          <p>
            We use only <strong>essential cookies</strong> to keep you signed in. No tracking, no ads, no third-party cookies.{' '}
            <Link href="/privacy" className="text-hertford-green hover:underline font-medium">
              Privacy Policy
            </Link>
          </p>
        </div>
        <button
          onClick={handleAccept}
          className="bg-hertford-green text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-hertford-green-light transition-all whitespace-nowrap"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
