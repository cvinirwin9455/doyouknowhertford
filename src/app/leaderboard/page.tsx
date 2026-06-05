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
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="font-heading text-4xl font-bold mb-2">🏆 Leaderboard</h1>
        <p className="text-gray-600">
          See who knows Hertford best! Play the quiz to get on the board.
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        {[
          { key: 'today' as Period, label: 'Today' },
          { key: 'week' as Period, label: 'This Week' },
          { key: 'all' as Period, label: 'All Time' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setPeriod(tab.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              period === tab.key
                ? 'bg-hertford-green text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {entries.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="font-heading text-xl font-bold mb-2">No scores yet!</h3>
          <p className="text-gray-600 mb-6">
            Be the first to make it onto the leaderboard.
          </p>
          <Link href="/quiz" className="btn-primary">
            Play the Quiz
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden !p-0">
          <table className="w-full">
            <thead>
              <tr className="bg-hertford-dark text-white text-sm">
                <th className="py-3 px-4 text-left">Rank</th>
                <th className="py-3 px-4 text-left">Player</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4 text-center hidden sm:table-cell">Date</th>
                <th className="py-3 px-4 text-right">%</th>
              </tr>
            </thead>
            <tbody>
              {entries.slice(0, 50).map((entry) => (
                <tr
                  key={`${entry.playerName}-${entry.date}`}
                  className={`border-b border-gray-100 ${
                    entry.rank <= 3 ? 'bg-hertford-gold/5' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-lg">
                    {getRankDisplay(entry.rank)}
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {entry.playerName}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {entry.score}/{entry.totalQuestions}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-500 hidden sm:table-cell">
                    {new Date(entry.date).toLocaleDateString('en-GB')}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                      entry.percentage >= 80 ? 'bg-green-100 text-green-700' :
                      entry.percentage >= 50 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {entry.percentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-center mt-8">
        <Link href="/quiz" className="btn-secondary">
          🎯 Play the Quiz
        </Link>
      </div>
    </div>
  )
}
