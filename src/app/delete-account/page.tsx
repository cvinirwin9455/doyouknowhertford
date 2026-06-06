'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, getPlayerByAuthId, signOut } from '@/lib/db'
import { Player } from '@/lib/types'

export default function DeleteAccountPage() {
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const user = await getCurrentUser()
    if (user) {
      const p = await getPlayerByAuthId(user.id)
      setPlayer(p)
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm')
      return
    }
    if (!player) return

    setIsDeleting(true)
    setError('')

    try {
      // Delete player answers
      await supabase.from('player_answers').delete().eq('player_id', player.id)
      
      // Delete scores
      await supabase.from('scores').delete().eq('player_id', player.id)
      
      // Delete player profile
      await supabase.from('players').delete().eq('id', player.id)

      // Sign out
      await signOut()
      
      setDeleted(true)
    } catch (err) {
      setError('Something went wrong. Please try again or contact us.')
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 pt-32 text-center">
        <div className="w-8 h-8 border-4 border-hertford-green/20 border-t-hertford-green rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  if (deleted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 pt-32">
        <div className="card-elevated text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gray-100 flex items-center justify-center">
            <span className="text-3xl">👋</span>
          </div>
          <h2 className="font-heading text-2xl font-bold mb-3">Account Deleted</h2>
          <p className="text-gray-500 mb-6">
            Your account and all associated data have been permanently deleted.
          </p>
          <Link href="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 pt-32">
        <div className="card-elevated text-center">
          <h2 className="font-heading text-xl font-bold mb-4">Sign in first</h2>
          <p className="text-gray-500 mb-6">You need to be signed in to delete your account.</p>
          <Link href="/quiz" className="btn-primary">Sign In</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12 pt-28">
      <div className="card-elevated">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-100 flex items-center justify-center">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="font-heading text-2xl font-bold text-center mb-2">Delete Your Account</h2>
        <p className="text-gray-500 text-center text-sm mb-6">
          This will permanently delete your account and all data associated with it.
        </p>

        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-sm text-red-800 mb-2">This will delete:</h3>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Your account (@{player.username})</li>
            <li>• Your email address</li>
            <li>• All your quiz scores</li>
            <li>• Your answer history</li>
            <li>• Your leaderboard position</li>
          </ul>
          <p className="text-sm text-red-800 font-bold mt-3">This action cannot be undone.</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Type <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">DELETE</span> to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE"
            className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-red-400 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          onClick={handleDelete}
          disabled={isDeleting || confirmText !== 'DELETE'}
          className="w-full bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? 'Deleting...' : 'Permanently Delete My Account'}
        </button>

        <Link href="/quiz" className="block text-center text-sm text-gray-400 hover:text-hertford-green mt-4">
          Cancel — keep my account
        </Link>
      </div>
    </div>
  )
}
