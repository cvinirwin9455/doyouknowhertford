'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getPlayerByAuthId, signOut } from '@/lib/db'
import { Player } from '@/lib/types'

export default function UserStatus() {
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadPlayer(session.user.id)
      } else {
        setPlayer(null)
        setLoading(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await loadPlayer(user.id)
    } else {
      setLoading(false)
    }
  }

  const loadPlayer = async (authId: string) => {
    const p = await getPlayerByAuthId(authId)
    setPlayer(p)
    setLoading(false)
  }

  const handleSignOut = async () => {
    await signOut()
    setPlayer(null)
    window.location.href = '/'
  }

  if (loading) return null

  if (!player) {
    return (
      <Link
        href="/quiz"
        className="bg-hertford-green text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-hertford-green-light transition-all"
      >
        Play Free
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
        <div className="w-2 h-2 bg-hertford-green rounded-full" />
        <span className="text-sm font-medium text-gray-700">@{player.username}</span>
      </div>
      <button
        onClick={handleSignOut}
        className="text-gray-400 hover:text-red-500 transition-colors text-xs font-medium"
      >
        Sign out
      </button>
    </div>
  )
}
