'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true)
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleReset = async () => {
    setError('')

    if (!password.trim()) { setError('Please enter a new password'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (password !== confirmPassword) { setError('Passwords do not match'); return }

    setIsSubmitting(true)

    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setIsSubmitting(false)
    } else {
      setSuccess(true)
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 pt-32">
        <div className="card-elevated text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-hertford-green to-hertford-green-light flex items-center justify-center">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="font-heading text-2xl font-bold mb-2">Password Reset!</h2>
          <p className="text-gray-500 mb-8">Your password has been updated. You can now sign in.</p>
          <Link href="/quiz" className="btn-primary w-full text-center">Go to Quiz</Link>
        </div>
      </div>
    )
  }

  if (!sessionReady) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 pt-32">
        <div className="card-elevated text-center">
          <div className="w-8 h-8 border-4 border-hertford-green/20 border-t-hertford-green rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Verifying your reset link...</p>
          <p className="text-gray-400 text-xs mt-4">
            If this takes too long, the link may have expired. <Link href="/quiz" className="text-hertford-green hover:underline">Request a new one</Link>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-20 pt-32">
      <div className="card-elevated text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-hertford-green to-hertford-green-light flex items-center justify-center">
          <span className="text-3xl">🔑</span>
        </div>
        <h2 className="font-heading text-2xl font-bold mb-2">Set New Password</h2>
        <p className="text-gray-500 text-sm mb-6">Choose a new password for your account.</p>

        <div className="space-y-4 text-left mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Type it again"
              className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all"
              onKeyDown={(e) => { if (e.key === 'Enter') handleReset() }}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button onClick={handleReset} disabled={isSubmitting} className="btn-primary w-full disabled:opacity-50">
          {isSubmitting ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </div>
  )
}
