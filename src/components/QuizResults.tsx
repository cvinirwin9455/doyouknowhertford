'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { QuizQuestion, QuizState } from '@/lib/types'
import { saveScore } from '@/lib/leaderboard'

interface QuizResultsProps {
  quizState: QuizState
  questions: QuizQuestion[]
  playerName: string
}

export default function QuizResults({ quizState, questions, playerName }: QuizResultsProps) {
  const percentage = Math.round((quizState.score / questions.length) * 100)
  const timeTaken = quizState.endTime 
    ? Math.round((quizState.endTime - quizState.startTime) / 1000) 
    : 0

  useEffect(() => {
    saveScore({
      playerName,
      score: quizState.score,
      totalQuestions: questions.length,
      timeTaken,
      date: new Date().toISOString(),
      categories: [...new Set(questions.map(q => q.category))],
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getMessage = () => {
    if (percentage === 100) return { emoji: '🏆', text: 'Perfect Score! You truly know Hertford!' }
    if (percentage >= 80) return { emoji: '🌟', text: 'Excellent! You really know your stuff!' }
    if (percentage >= 60) return { emoji: '👏', text: 'Well done! A solid Hertford knowledge!' }
    if (percentage >= 40) return { emoji: '📚', text: 'Not bad! Time to explore Hertford more!' }
    return { emoji: '🤔', text: 'Keep trying! Hertford has so much to discover!' }
  }

  const result = getMessage()

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="card text-center">
        <div className="text-6xl mb-4">{result.emoji}</div>
        <h2 className="font-heading text-3xl font-bold mb-2">Quiz Complete!</h2>
        <p className="text-gray-600 mb-6">{result.text}</p>

        <div className="bg-hertford-cream rounded-xl p-6 mb-6">
          <div className="text-5xl font-bold text-hertford-green mb-1">
            {quizState.score}/{questions.length}
          </div>
          <p className="text-gray-500 text-sm">
            {percentage}% correct in {timeTaken} seconds
          </p>
        </div>

        <div className="text-left mb-6">
          <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wide mb-3">
            Your Answers
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {questions.map((q, index) => {
              const userAnswer = quizState.answers[index]
              const isCorrect = userAnswer === q.correctAnswer
              return (
                <div key={q.id} className="flex items-start gap-2 text-sm">
                  <span className={`flex-shrink-0 mt-0.5 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  <div>
                    <p className="font-medium">{q.question}</p>
                    {!isCorrect && (
                      <p className="text-gray-500 text-xs">
                        Answer: {q.options[q.correctAnswer]}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/quiz" className="btn-primary w-full text-center">
            🔄 Play Again
          </Link>
          <Link href="/leaderboard" className="btn-secondary w-full text-center">
            🏆 View Leaderboard
          </Link>
          <button
            onClick={() => {
              const text = `I scored ${quizState.score}/${questions.length} (${percentage}%) on Do You Know Hertford! 🏛️ Can you beat me? doyouknowhertford.com`
              if (navigator.share) {
                navigator.share({ text })
              } else {
                navigator.clipboard.writeText(text)
                alert('Result copied to clipboard!')
              }
            }}
            className="text-hertford-green font-medium hover:underline"
          >
            📤 Share Your Score
          </button>
        </div>
      </div>
    </div>
  )
}
