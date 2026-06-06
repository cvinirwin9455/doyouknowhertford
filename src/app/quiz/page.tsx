'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { QuizQuestion, QuizState, Player } from '@/lib/types'
import { getQuizQuestions } from '@/data/questions'
import { createPlayer, getPlayerByUsername, isUsernameTaken, saveScore } from '@/lib/db'

const SECONDS_PER_QUESTION = 20
const PLAYER_KEY = 'hertford_quiz_player'

export default function QuizPage() {
  const [questions] = useState<QuizQuestion[]>(() => getQuizQuestions(10))
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: Array(10).fill(null),
    score: 0,
    isComplete: false,
    startTime: Date.now(),
  })
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)

  // Player state
  const [player, setPlayer] = useState<Player | null>(null)
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [profileErrors, setProfileErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [scoreSaved, setScoreSaved] = useState(false)

  // Load existing player from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(PLAYER_KEY)
    if (saved) {
      try {
        setPlayer(JSON.parse(saved))
      } catch {}
    }
  }, [])

  const currentQuestion = questions[quizState.currentQuestionIndex]

  const moveToNextQuestion = useCallback(() => {
    setShowFeedback(false)
    setSelectedAnswer(null)
    setTimeLeft(SECONDS_PER_QUESTION)

    if (quizState.currentQuestionIndex >= questions.length - 1) {
      setQuizState(prev => ({ ...prev, isComplete: true, endTime: Date.now() }))
    } else {
      setQuizState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }))
    }
  }, [quizState.currentQuestionIndex, questions.length])

  // Timer
  useEffect(() => {
    if (!quizStarted || quizState.isComplete || showFeedback) return
    if (timeLeft <= 0) { handleAnswer(-1); return }

    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearInterval(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, quizStarted, quizState.isComplete, showFeedback])

  // Save score when quiz completes
  useEffect(() => {
    if (quizState.isComplete && player && !scoreSaved) {
      const timeTaken = quizState.endTime
        ? Math.round((quizState.endTime - quizState.startTime) / 1000)
        : 0
      saveScore(player.id, player.username, quizState.score, questions.length, timeTaken)
      setScoreSaved(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizState.isComplete])

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return
    setSelectedAnswer(answerIndex)
    setShowFeedback(true)

    const isCorrect = answerIndex === currentQuestion.correctAnswer
    const newAnswers = [...quizState.answers]
    newAnswers[quizState.currentQuestionIndex] = answerIndex

    setQuizState(prev => ({
      ...prev,
      answers: newAnswers,
      score: isCorrect ? prev.score + 1 : prev.score,
    }))

    setTimeout(moveToNextQuestion, 1800)
  }

  const handleCreateProfile = async () => {
    const errors: string[] = []
    if (!username.trim()) errors.push('Username is required')
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(username.trim())) errors.push('Username: 3-20 chars, letters/numbers/underscores')
    if (!fullName.trim()) errors.push('Full name is required')
    if (!email.trim() || !email.includes('@')) errors.push('Valid email required')

    if (errors.length > 0) { setProfileErrors(errors); return }

    setIsSubmitting(true)
    setProfileErrors([])

    // Check username availability
    const taken = await isUsernameTaken(username.trim())
    if (taken) {
      setProfileErrors(['Username already taken — try another'])
      setIsSubmitting(false)
      return
    }

    // Create player
    const newPlayer = await createPlayer(username.trim(), fullName.trim(), email.trim())
    if (!newPlayer) {
      setProfileErrors(['Something went wrong — please try again'])
      setIsSubmitting(false)
      return
    }

    localStorage.setItem(PLAYER_KEY, JSON.stringify(newPlayer))
    setPlayer(newPlayer)
    setIsSubmitting(false)
  }

  const getOptionClass = (optionIndex: number) => {
    if (!showFeedback) {
      return selectedAnswer === optionIndex ? 'quiz-option quiz-option-selected' : 'quiz-option'
    }
    if (optionIndex === currentQuestion.correctAnswer) return 'quiz-option quiz-option-correct'
    if (optionIndex === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) return 'quiz-option quiz-option-incorrect'
    return 'quiz-option opacity-50'
  }

  // ===== PROFILE SCREEN =====
  if (!quizStarted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 pt-32">
        <div className="card-elevated text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-hertford-green to-hertford-green-light flex items-center justify-center">
            <span className="text-3xl">🎯</span>
          </div>

          {player ? (
            <>
              <h2 className="font-heading text-2xl font-bold mb-2">Welcome back, @{player.username}!</h2>
              <p className="text-gray-500 mb-8">Ready to test your Hertford knowledge?</p>
              <button onClick={() => setQuizStarted(true)} className="btn-primary w-full">
                Start Quiz — {questions.length} questions
              </button>
              <p className="text-xs text-gray-400 mt-4">20 seconds per question</p>
            </>
          ) : (
            <>
              <h2 className="font-heading text-2xl font-bold mb-2">Create Your Profile</h2>
              <p className="text-gray-500 text-sm mb-6">
                Choose a username for the leaderboard. Your name and email are kept private.
              </p>

              <div className="space-y-4 text-left mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Username <span className="text-gray-400 font-normal">(public)</span>
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                    placeholder="e.g. hertford_harry"
                    className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all"
                    maxLength={20}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Full Name <span className="text-gray-400 font-normal">(private)</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your real name"
                    className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email <span className="text-gray-400 font-normal">(private)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 text-left">
                <p className="text-xs text-blue-700">
                  <strong>🔒 Privacy:</strong> Only your username appears on the leaderboard. Name and email are never shown publicly.
                </p>
              </div>

              {profileErrors.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4 text-left">
                  {profileErrors.map((err, i) => <p key={i} className="text-xs text-red-700">• {err}</p>)}
                </div>
              )}

              <button
                onClick={handleCreateProfile}
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Profile & Play'}
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  // ===== RESULTS SCREEN =====
  if (quizState.isComplete) {
    const percentage = Math.round((quizState.score / questions.length) * 100)
    const timeTaken = quizState.endTime ? Math.round((quizState.endTime - quizState.startTime) / 1000) : 0

    const getMessage = () => {
      if (percentage === 100) return { emoji: '🏆', text: 'Perfect! You truly know Hertford!' }
      if (percentage >= 80) return { emoji: '🌟', text: 'Excellent! You really know your stuff!' }
      if (percentage >= 60) return { emoji: '👏', text: 'Well done! Solid knowledge!' }
      if (percentage >= 40) return { emoji: '📚', text: 'Not bad! Time to explore more!' }
      return { emoji: '🤔', text: 'Keep trying! So much to discover!' }
    }
    const result = getMessage()

    return (
      <div className="max-w-lg mx-auto px-4 py-12 pt-28 animate-fade-in">
        <div className="card-elevated text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-hertford-green to-hertford-green-light flex items-center justify-center shadow-lg">
            <span className="text-4xl">{result.emoji}</span>
          </div>

          <h2 className="font-heading text-3xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-gray-500 mb-8">{result.text}</p>

          <div className="bg-gray-50 rounded-2xl p-8 mb-6">
            <div className="text-5xl font-black gradient-text mb-1">{quizState.score}/{questions.length}</div>
            <p className="text-gray-400 text-sm">{percentage}% correct &middot; {timeTaken}s total</p>
          </div>

          {/* Answer breakdown with sources */}
          <div className="text-left mb-8">
            <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-wider mb-4">Answers & Sources</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
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
                        <p className="font-medium text-gray-700 leading-snug text-sm">{q.question}</p>
                        <p className="text-hertford-green text-sm font-medium mt-1">Answer: {q.options[q.correctAnswer]}</p>
                        {!isCorrect && userAnswer !== null && userAnswer !== -1 && (
                          <p className="text-red-500 text-xs mt-0.5">You answered: {q.options[userAnswer]}</p>
                        )}
                        {userAnswer === -1 && <p className="text-red-500 text-xs mt-0.5">Time ran out</p>}
                        <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200/50">
                          <span className="font-semibold">Why?</span> {q.source}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/quiz" className="btn-primary w-full text-center">Play Again</Link>
            <Link href="/leaderboard" className="btn-outline w-full text-center">View Leaderboard</Link>
            <button
              onClick={() => {
                const text = `I scored ${quizState.score}/${questions.length} (${percentage}%) on Do You Know Hertford! Can you beat me?`
                if (navigator.share) { navigator.share({ text }) }
                else { navigator.clipboard.writeText(text); alert('Score copied!') }
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

  // ===== QUIZ SCREEN =====
  const timerPercentage = (timeLeft / SECONDS_PER_QUESTION) * 100
  const timerColor = timeLeft > 10 ? 'bg-hertford-green' : timeLeft > 5 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pt-28">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-500">Question {quizState.currentQuestionIndex + 1}/{questions.length}</span>
          <span className="text-sm font-semibold text-hertford-green">Score: {quizState.score}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div className="bg-hertford-green h-1.5 rounded-full transition-all duration-300" style={{ width: `${((quizState.currentQuestionIndex) / questions.length) * 100}%` }} />
        </div>
      </div>

      {/* Timer */}
      <div className="mb-8">
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div className={`${timerColor} h-2 rounded-full transition-all duration-1000 ease-linear`} style={{ width: `${timerPercentage}%` }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className={`text-sm font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>{timeLeft}s</span>
          <div className="flex gap-2">
            <span className={`px-3 py-0.5 text-xs font-medium rounded-full capitalize ${currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' : currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
              {currentQuestion.difficulty}
            </span>
            <span className="px-3 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full capitalize">
              {currentQuestion.category.replace('-', ' & ')}
            </span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="card-elevated mb-6 animate-fade-in">
        <h2 className="font-heading text-xl md:text-2xl font-bold mb-8 leading-snug">{currentQuestion.question}</h2>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button key={index} onClick={() => handleAnswer(index)} disabled={showFeedback} className={getOptionClass(index)}>
              <span className="inline-flex items-center gap-4">
                <span className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-sm font-bold flex-shrink-0 border border-gray-100">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </span>
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className={`mt-6 p-4 rounded-2xl text-sm animate-fade-in ${selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
            {selectedAnswer === currentQuestion.correctAnswer ? (
              <p className="font-medium">✅ Correct!</p>
            ) : selectedAnswer === -1 ? (
              <p className="font-medium">⏰ Time&apos;s up! Answer: <strong>{currentQuestion.options[currentQuestion.correctAnswer]}</strong></p>
            ) : (
              <p className="font-medium">❌ Nope. Answer: <strong>{currentQuestion.options[currentQuestion.correctAnswer]}</strong></p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
