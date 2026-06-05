'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { QuizQuestion, QuizState, UserProfile } from '@/lib/types'
import { saveScore } from '@/lib/leaderboard'

interface QuizResultsProps {
  quizState: QuizState
  questions: QuizQuestion[]
  user: UserProfile
}

export default function QuizResults({ quizState, questions, user }: QuizResultsProps) {
  const percentage = Math.round((quizState.score / questions.length) * 100)
  const timeTaken = quizState.endTime 
    ? Math.round((quizState.endTime - quizState.startTime) / 1000) 
    : 0

  useEffect(() => {
    saveScore({
      userId: user.id,
      username: user.username,
      score: quizState.score,
      totalQuestions: questions.length,
      timeTaken,
      date: new Date().toISOString(),
      categories: [...new Set(questions.map(q => q.category))],
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getMessage = () => {
    if (percentage === 100) return { emoji: '🏆', text: 'Perfect! You truly know Hertford!', color: 'from-yellow-400 to-orange-400' }
    if (percentage >= 80) return { emoji: '🌟', text: 'Excellent! You really know your stuff!', color: 'from-hertford-green to-hertford-green-light' }
    if (percentage >= 60) return { emoji: '👏', text: 'Well done! Solid knowledge!', color: 'from-blue-400 to-indigo-400' }
    if (percentage >= 40) return { emoji: '📚', text: 'Not bad! Time to explore more!', color: 'from-purple-400 to-pink-400' }
    return { emoji: '🤔', text: 'Keep trying! So much to discover!', color: 'from-gray-400 to-gray-500' }
  }

  const result = getMessage()

  return (
    <div className="max-w-lg mx-auto px-4 py-12 pt-28 animate-fade-in">
      <div className="card-elevated text-center">
        {/* Score circle */}
        <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${result.color} flex items-center justify-center shadow-lg`}>
          <span className="text-4xl">{result.emoji}</span>
        </div>
        
        <h2 className="font-heading text-3xl font-bold mb-2">Quiz Complete!</h2>
        <p className="text-gray-500 mb-8">{result.text}</p>

        {/* Score display */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-6">
          <div className="text-5xl font-black gradient-text mb-1">
            {quizState.score}/{questions.length}
          </div>
          <p className="text-gray-400 text-sm">
            {percentage}% correct &middot; {timeTaken}s total
          </p>
        </div>

        {/* Prize eligibility notice */}
        <div className="bg-gradient-to-r from-hertford-gold/10 to-amber-50 border border-hertford-gold/20 rounded-2xl p-4 mb-6 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🎁</span>
            <span className="font-semibold text-sm text-amber-800">Prize Eligible!</span>
          </div>
          <p className="text-xs text-amber-700">
            Your score has been added to this week&apos;s leaderboard. The top scorer at the end 
            of the week wins prizes from local businesses! Keep playing to improve your rank.
          </p>
        </div>

        {/* Answer breakdown with sources */}
        <div className="text-left mb-8">
          <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-wider mb-4">
            Answers & Sources
          </h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {questions.map((q, index) => {
              const userAnswer = quizState.answers[index]
              const isCorrect = userAnswer === q.correctAnswer
              return (
                <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-700 leading-snug">{q.question}</p>
                      <p className="text-hertford-green text-sm font-medium mt-1">
                        Answer: {q.options[q.correctAnswer]}
                      </p>
                      {!isCorrect && userAnswer !== null && userAnswer !== -1 && (
                        <p className="text-red-500 text-xs mt-0.5">
                          You answered: {q.options[userAnswer]}
                        </p>
                      )}
                      {userAnswer === -1 && (
                        <p className="text-red-500 text-xs mt-0.5">
                          Time ran out
                        </p>
                      )}
                      <div className="mt-2 pt-2 border-t border-gray-200/50">
                        <p className="text-xs text-gray-500">
                          <span className="font-semibold">Why?</span> {q.source}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link href="/quiz" className="btn-primary w-full">
            Play Again
          </Link>
          <Link href="/leaderboard" className="btn-outline w-full">
            View Leaderboard
          </Link>
          <button
            onClick={() => {
              const text = `I scored ${quizState.score}/${questions.length} (${percentage}%) on Do You Know Hertford! Can you beat me? doyouknowhertford.com`
              if (navigator.share) {
                navigator.share({ text })
              } else {
                navigator.clipboard.writeText(text)
                alert('Score copied to clipboard!')
              }
            }}
            className="text-gray-500 font-medium hover:text-hertford-green transition-colors text-sm py-2"
          >
            Share your score →
          </button>
        </div>
      </div>
    </div>
  )
}
