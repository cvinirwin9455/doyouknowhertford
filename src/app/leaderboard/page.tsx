'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Score } from '@/lib/types'
import { getLeaderboard } from '@/lib/db'

type Period = 'all' | 'week' | 'today'

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('week')
  const [entries, setEntries] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [period])

  const loadLeaderboard = async () => {
    setLoading(true)
    const data = await getLeaderboard(period)
    setEntries(data)
    setLoading(false)
  }

  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1: return <span className="text-2xl">🥇</span>
      case 2: return <span className="text-2xl">🥈</span>
      case 3: return <span className="text-2xl">🥉</span>
      default: return <span className="text-gray-400 font-bold">#{rank}</span>
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 pt-28">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-sm font-semibold text-hertford-green uppercase tracking-wider mb-3">Competition</p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Leaderboard
        </h1>
        <p className="text-gray-500 text-lg">
          Who knows Hertford best? Play the quiz to get on the board.
        </p>
      </div>

      {/* Period Tabs */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-gray-100 rounded-full p-1">
          {[
            { key: 'today' as Period, label: 'Today' },
            { key: 'week' as Period, label: 'This Week' },
            { key: 'all' as Period, label: 'All Time' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setPeriod(tab.key)}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all ${
                period === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-hertford-green/20 border-t-hertford-green rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading scores...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="card-elevated text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-50 flex items-center justify-center">
            <span className="text-4xl">🎯</span>
          </div>
          <h3 className="font-heading text-xl font-bold mb-2">No scores yet</h3>
          <p className="text-gray-500 mb-8">
            Be the first to make it onto the leaderboard!
          </p>
          <Link href="/quiz" className="btn-primary">
            Play the Quiz
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                index < 3
                  ? 'bg-gradient-to-r from-hertford-gold/5 to-transparent border border-hertford-gold/20'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <div className="w-10 text-center">
                {getRankDisplay(index + 1)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">@{entry.username}</p>
                <p className="text-xs text-gray-400">
                  {new Date(entry.played_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  {' · '}{entry.time_taken}s
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{entry.score}/{entry.total_questions}</p>
                <p className={`text-xs font-semibold ${
                  (entry.score / entry.total_questions) >= 0.8 ? 'text-green-600' :
                  (entry.score / entry.total_questions) >= 0.5 ? 'text-yellow-600' :
                  'text-red-500'
                }`}>
                  {Math.round((entry.score / entry.total_questions) * 100)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="text-center mt-12">
        <Link href="/quiz" className="btn-primary">
          Play the Quiz
        </Link>
      </div>
    </div>
  )
}
