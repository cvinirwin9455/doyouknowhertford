'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, getPlayerByAuthId } from '@/lib/db'
import { Player } from '@/lib/types'

interface AnsweredQuestion {
  question_id: string
  was_correct: boolean
  answered_at: string
  question: string
  options: string[]
  correct_answer: number
  category: string
  difficulty: string
  source: string
  source_url: string | null
}

export default function HistoryPage() {
  const [player, setPlayer] = useState<Player | null>(null)
  const [answers, setAnswers] = useState<AnsweredQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect'>('all')

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    const user = await getCurrentUser()
    if (!user) { setLoading(false); return }

    const p = await getPlayerByAuthId(user.id)
    if (!p) { setLoading(false); return }
    setPlayer(p)

    // Fetch all answered questions with question details
    const { data, error } = await supabase
      .from('player_answers')
      .select('question_id, was_correct, answered_at, questions(question, options, correct_answer, category, difficulty, source, source_url)')
      .eq('player_id', p.id)
      .order('answered_at', { ascending: false })

    if (!error && data) {
      const mapped = data.map((d: any) => ({
        question_id: d.question_id,
        was_correct: d.was_correct,
        answered_at: d.answered_at,
        question: d.questions?.question || '',
        options: d.questions?.options || [],
        correct_answer: d.questions?.correct_answer || 0,
        category: d.questions?.category || '',
        difficulty: d.questions?.difficulty || '',
        source: d.questions?.source || '',
        source_url: d.questions?.source_url || null,
      }))
      setAnswers(mapped)
    }

    setLoading(false)
  }

  const filteredAnswers = answers.filter(a => {
    if (filter === 'correct') return a.was_correct
    if (filter === 'incorrect') return !a.was_correct
    return true
  })

  const totalCorrect = answers.filter(a => a.was_correct).length
  const totalAnswered = answers.length
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0

  // Calculate category stats
  const categoryStats = answers.reduce((acc, a) => {
    const cat = a.category || 'unknown'
    if (!acc[cat]) acc[cat] = { total: 0, correct: 0 }
    acc[cat].total += 1
    if (a.was_correct) acc[cat].correct += 1
    return acc
  }, {} as Record<string, { total: number; correct: number }>)

  const categoryList = Object.entries(categoryStats)
    .map(([category, stats]) => ({
      category,
      total: stats.total,
      correct: stats.correct,
      accuracy: Math.round((stats.correct / stats.total) * 100),
    }))
    .sort((a, b) => b.accuracy - a.accuracy)

  // Calculate difficulty stats
  const difficultyStats = answers.reduce((acc, a) => {
    const diff = a.difficulty || 'medium'
    if (!acc[diff]) acc[diff] = { total: 0, correct: 0 }
    acc[diff].total += 1
    if (a.was_correct) acc[diff].correct += 1
    return acc
  }, {} as Record<string, { total: number; correct: number }>)

  const difficultyList = ['easy', 'medium', 'hard']
    .filter(d => difficultyStats[d])
    .map(d => ({
      difficulty: d,
      total: difficultyStats[d].total,
      correct: difficultyStats[d].correct,
      accuracy: Math.round((difficultyStats[d].correct / difficultyStats[d].total) * 100),
    }))

  const getCategoryEmoji = (cat: string) => {
    const emojis: Record<string, string> = {
      'history': '🏰', 'landmarks': '⛪', 'people': '👥', 'events': '📅',
      'food-drink': '🍺', 'local-business': '🏪', 'geography': '🗺️', 'culture': '🎭',
    }
    return emojis[cat] || '❓'
  }

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      'history': 'History', 'landmarks': 'Landmarks', 'people': 'People', 'events': 'Events',
      'food-drink': 'Food & Drink', 'local-business': 'Local Business', 'geography': 'Geography', 'culture': 'Culture',
    }
    return labels[cat] || cat
  }

  const getDifficultyEmoji = (diff: string) => {
    const emojis: Record<string, string> = { 'easy': '🟢', 'medium': '🟡', 'hard': '🔴' }
    return emojis[diff] || '⚪'
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 pt-32 text-center">
        <div className="w-8 h-8 border-4 border-hertford-green/20 border-t-hertford-green rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  if (!player) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 pt-32 text-center">
        <div className="card-elevated">
          <h2 className="font-heading text-xl font-bold mb-4">Sign in to see your history</h2>
          <Link href="/quiz" className="btn-primary">Sign In</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 pt-28">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-sm font-semibold text-hertford-green uppercase tracking-wider mb-3">Your Progress</p>
        <h1 className="font-heading text-4xl font-bold tracking-tight mb-3">My History</h1>
        <p className="text-gray-500">Every question you&apos;ve ever answered</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-3xl font-black text-gray-900">{totalAnswered}</p>
          <p className="text-xs text-gray-500 mt-1">Answered</p>
        </div>
        <div className="bg-green-50 rounded-2xl border border-green-100 p-5 text-center">
          <p className="text-3xl font-black text-green-600">{totalCorrect}</p>
          <p className="text-xs text-gray-500 mt-1">Correct</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-3xl font-black text-gray-900">{accuracy}%</p>
          <p className="text-xs text-gray-500 mt-1">Accuracy</p>
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryList.length > 0 && (
        <div className="card-elevated mb-10">
          <h3 className="font-bold text-sm text-gray-900 mb-4">Your Strengths & Weaknesses</h3>
          <div className="space-y-3">
            {categoryList.map((cat) => (
              <div key={cat.category} className="flex items-center gap-3">
                <span className="text-xl w-8 text-center">{getCategoryEmoji(cat.category)}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{getCategoryLabel(cat.category)}</span>
                    <span className="text-xs text-gray-500">{cat.correct}/{cat.total} ({cat.accuracy}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        cat.accuracy >= 80 ? 'bg-green-500' :
                        cat.accuracy >= 50 ? 'bg-yellow-500' :
                        'bg-red-400'
                      }`}
                      style={{ width: `${cat.accuracy}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> 80%+</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> 50-79%</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Below 50%</span>
          </div>
        </div>
      )}

      {/* Difficulty Breakdown */}
      {difficultyList.length > 0 && (
        <div className="card-elevated mb-10">
          <h3 className="font-bold text-sm text-gray-900 mb-4">Performance by Difficulty</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {difficultyList.map((d) => (
              <div key={d.difficulty} className={`rounded-xl p-4 border text-center ${
                d.difficulty === 'easy' ? 'bg-green-50 border-green-100' :
                d.difficulty === 'medium' ? 'bg-yellow-50 border-yellow-100' :
                'bg-red-50 border-red-100'
              }`}>
                <span className="text-xl">{getDifficultyEmoji(d.difficulty)}</span>
                <p className="font-bold capitalize mt-1">{d.difficulty}</p>
                <p className="text-2xl font-black mt-1">{d.accuracy}%</p>
                <p className="text-xs text-gray-500">{d.correct}/{d.total} correct</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-gray-100 rounded-full p-1">
          {[
            { key: 'all' as const, label: `All (${totalAnswered})` },
            { key: 'correct' as const, label: `✓ Correct (${totalCorrect})` },
            { key: 'incorrect' as const, label: `✗ Wrong (${totalAnswered - totalCorrect})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                filter === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions list */}
      {filteredAnswers.length === 0 ? (
        <div className="card-elevated text-center py-12">
          <span className="text-4xl mb-4 block">📭</span>
          <p className="text-gray-500">
            {filter === 'all' ? "You haven't answered any questions yet!" : `No ${filter} answers found.`}
          </p>
          {filter === 'all' && (
            <Link href="/quiz" className="btn-primary mt-6 inline-block">Play the Quiz</Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAnswers.map((answer) => (
            <div
              key={answer.question_id}
              className={`p-5 rounded-2xl border ${
                answer.was_correct
                  ? 'bg-green-50/50 border-green-100'
                  : 'bg-red-50/50 border-red-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  answer.was_correct ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {answer.was_correct ? '✓' : '✗'}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 leading-snug">{answer.question}</p>
                  
                  <p className="text-hertford-green text-sm font-medium mt-2">
                    Correct answer: {answer.options[answer.correct_answer]}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${
                      answer.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      answer.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {answer.difficulty}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full capitalize">
                      {answer.category.replace('-', ' & ')}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    <span className="font-semibold">Source:</span>{' '}
                    {answer.source_url ? (
                      <a
                        href={answer.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {answer.source} →
                      </a>
                    ) : (
                      <span>{answer.source}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="text-center mt-12">
        <Link href="/quiz" className="btn-primary">Play More</Link>
      </div>
    </div>
  )
}
