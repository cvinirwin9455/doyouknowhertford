'use client'

import { useState, useEffect } from 'react'
import { LeaderboardEntry } from '@/lib/types'
import { getLeaderboard } from '@/lib/leaderboard'
import { getRecentWinners, getCurrentWeekPrizes, formatWeekDisplay, getCurrentWeekStart } from '@/lib/prizes'
import { Prize } from '@/lib/types'
import Link from 'next/link'

type Period = 'all' | 'week' | 'today'

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('week')
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [recentWinners, setRecentWinners] = useState<Prize[]>([])
  const [weekPrizes, setWeekPrizes] = useState<Prize[]>([])

  useEffect(() => {
    setEntries(getLeaderboard(period))
    setRecentWinners(getRecentWinners())
    setWeekPrizes(getCurrentWeekPrizes())
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
    <div className="max-w-4xl mx-auto px-4 py-12 pt-28">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-sm font-semibold text-hertford-green uppercase tracking-wider mb-3">Competition</p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Leaderboard
        </h1>
        <p className="text-gray-500 text-lg">
          Top the weekly leaderboard to win prizes from local businesses!
        </p>
      </div>

      {/* This Week's Prizes Banner */}
      <div className="bg-gradient-to-r from-hertford-gold/10 via-amber-50 to-hertford-gold/10 border border-hertford-gold/20 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🎁</span>
          <div>
            <h3 className="font-bold text-gray-900">This Week&apos;s Prizes</h3>
            <p className="text-xs text-gray-500">Week of {formatWeekDisplay(getCurrentWeekStart())}</p>
          </div>
        </div>
        {weekPrizes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {weekPrizes.map((prize) => (
              <div key={prize.id} className="bg-white rounded-xl p-3 border border-amber-100">
                <p className="font-semibold text-sm text-gray-900">{prize.prizeDescription}</p>
                <p className="text-xs text-gray-500">from {prize.businessName}</p>
                {prize.prizeValue && <p className="text-xs text-hertford-green font-medium mt-1">Worth {prize.prizeValue}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-amber-700">
            Prizes from local Hertford businesses are awarded to the top scorer each week. 
            Play the quiz and climb the board!
          </p>
        )}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main leaderboard */}
        <div className="lg:col-span-2">
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
                  key={`${entry.userId}-${entry.date}`}
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
                    <p className="font-semibold text-gray-900 truncate">@{entry.username}</p>
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
                  {entry.rank === 1 && period === 'week' && (
                    <div className="hidden sm:block">
                      <span className="px-2 py-1 bg-hertford-gold/20 text-amber-700 text-xs font-bold rounded-full">
                        🎁 Prize Leader
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar — Recent Winners */}
        <div>
          <div className="card-elevated">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🏆</span> Recent Winners
            </h3>
            {recentWinners.length > 0 ? (
              <div className="space-y-4">
                {recentWinners.map((winner) => (
                  <div key={winner.id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <p className="font-semibold text-sm">@{winner.winnerUsername}</p>
                    <p className="text-xs text-gray-500">{winner.prizeDescription}</p>
                    <p className="text-xs text-gray-400">from {winner.businessName}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400 text-sm">
                  No winners yet! Be the first to top the weekly leaderboard.
                </p>
              </div>
            )}
          </div>

          {/* How prizes work */}
          <div className="card mt-4">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span>❓</span> How Prizes Work
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>1. Play the quiz as many times as you like</p>
              <p>2. Your best score each week counts</p>
              <p>3. Top scorer at week&apos;s end wins</p>
              <p>4. Winner contacted via email</p>
              <p>5. Prize collected from the business</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <Link href="/quiz" className="btn-primary">
          Play the Quiz
        </Link>
      </div>
    </div>
  )
}
