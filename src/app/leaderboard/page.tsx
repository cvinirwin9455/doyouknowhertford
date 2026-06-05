'use client'

import { useState, useEffect } from 'react'
import { LeaderboardEntry } from '@/lib/types'
import { getLeaderboard } from '@/lib/leaderboard'
import Link from 'next/link'

type Period = 'all' | 'week' | 'today'

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('all')
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    setEntries(getLeaderboard(period))
  }, [period])

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
          Who knows Hertford best? Play to get on the board.
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

      {/* Leaderboard */}
      {entries.length === 0 ? (
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
          {entries.slice(0, 20).map((entry) => (
            <div
              key={`${entry.playerName}-${entry.date}`}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                entry.rank <= 3 
                  ? 'bg-gradient-to-r from-hertford-gold/5 to-transparent border border-hertford-gold/20' 
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <div className="w-10 text-center">
                {getRankDisplay(entry.rank)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{entry.playerName}</p>
                <p className="text-xs text-gray-400">
                  {new Date(entry.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{entry.score}/{entry.totalQuestions}</p>
                <p className={`text-xs font-semibold ${
                  entry.percentage >= 80 ? 'text-green-600' :
                  entry.percentage >= 50 ? 'text-yellow-600' :
                  'text-red-500'
                }`}>
                  {entry.percentage}%
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
