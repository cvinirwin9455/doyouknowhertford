'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { QuizQuestion, QuizState, Player } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import {
  sendMagicLink, getCurrentUser, getPlayerByAuthId,
  createPlayer, isUsernameTaken,
  getUnansweredQuestions, recordAnswer, saveScore
} from '@/lib/db'

const SECONDS_PER_QUESTION = 20

type Screen = 'loading' | 'login' | 'check-email' | 'create-username' | 'ready' | 'playing' | 'results'

export default function QuizPage() {
  const [screen, setScreen] = useState<Screen>('loading')
  const [player, setPlayer] = useState<Player | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: [],
    score: 0,
    isComplete: false,
    startTime: Date.now(),
  })
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [scoreSaved, setScoreSaved] = useState(false)

  // Login state
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check auth on mount
  useEffect(() => {
    checkAuth()

    // Listen for auth changes (magic link callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkPlayerProfile(session.user.id, session.user.email || '')
      }
    })

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuth = async () => {
    const user = await getCurrentUser()
    if (user) {
      await checkPlayerProfile(user.id, user.email || '')
    } else {
      setScreen('login')
    }
  }

  const checkPlayerProfile = async (authId: string, email: string) => {
    const existingPlayer = await getPlayerByAuthId(authId)
    if (existingPlayer) {
      setPlayer(existingPlayer)
      setScreen('ready')
    } else {
      // First time — need to choose a username
      setEmail(email)
      setScreen('create-username')
    }
  }

  const handleSendMagicLink = async () => {
    if (!email.trim() || !email.includes('@')) {
      setLoginError('Please enter a valid email')
      return
    }
    setIsSubmitting(true)
    setLoginError('')

    const { error } = await sendMagicLink(email.trim())
    if (error) {
      setLoginError(error)
      setIsSubmitting(false)
    } else {
      setScreen('check-email')
      setIsSubmitting(false)
    }
  }

  const handleCreateUsername = async () => {
    if (!username.trim() || !/^[a-zA-Z0-9_]{3,20}$/.test(username.trim())) {
      setLoginError('Username: 3-20 characters, letters/numbers/underscores only')
      return
    }
    setIsSubmitting(true)
    setLoginError('')

    const taken = await isUsernameTaken(username.trim())
    if (taken) {
      setLoginError('Username already taken — try another')
      setIsSubmitting(false)
      return
    }

    const user = await getCurrentUser()
    if (!user) { setLoginError('Session expired — please log in again'); setScreen('login'); return }

    const newPlayer = await createPlayer(user.id, username.trim(), user.email || email)
    if (!newPlayer) {
      setLoginError('Something went wrong — try again')
      setIsSubmitting(false)
      return
    }

    setPlayer(newPlayer)
    setScreen('ready')
    setIsSubmitting(false)
  }

  const startQuiz = async () => {
    if (!player) return
    const qs = await getUnansweredQuestions(player.id, 10)
    if (qs.length === 0) {
      setLoginError('No questions available — check back soon!')
      return
    }
    setQuestions(qs)
    setQuizState({
      currentQuestionIndex: 0,
      answers: Array(qs.length).fill(null),
      score: 0,
      isComplete: false,
      startTime: Date.now(),
    })
    setTimeLeft(SECONDS_PER_QUESTION)
    setScoreSaved(false)
    setScreen('playing')
  }

  const currentQuestion = questions[quizState.currentQuestionIndex]

  const moveToNextQuestion = useCallback(() => {
    setShowFeedback(false)
    setSelectedAnswer(null)
    setTimeLeft(SECONDS_PER_QUESTION)

    if (quizState.currentQuestionIndex >= questions.length - 1) {
      setQuizState(prev => ({ ...prev, isComplete: true, endTime: Date.now() }))
      setScreen('results')
    } else {
      setQuizState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }))
    }
  }, [quizState.currentQuestionIndex, questions.length])

  // Timer
  useEffect(() => {
    if (screen !== 'playing' || showFeedback) return
    if (timeLeft <= 0) { handleAnswer(-1); return }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearInterval(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, screen, showFeedback])

  // Save score when complete
  useEffect(() => {
    if (screen === 'results' && player && !scoreSaved) {
      const timeTaken = quizState.endTime ? Math.round((quizState.endTime - quizState.startTime) / 1000) : 0
      saveScore(player.id, player.username, quizState.score, questions.length, timeTaken)
      setScoreSaved(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen])

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return
    setSelectedAnswer(answerIndex)
    setShowFeedback(true)

    const isCorrect = answerIndex === currentQuestion.correctAnswer
    const newAnswers = [...quizState.answers]
    newAnswers[quizState.currentQuestionIndex] = answerIndex

    setQuizState(prev => ({ ...prev, answers: newAnswers, score: isCorrect ? prev.score + 1 : prev.score }))

    // Record this answer in the database
    if (player) {
      recordAnswer(player.id, currentQuestion.id, isCorrect)
    }

    setTimeout(moveToNextQuestion, 1800)
  }

  const getOptionClass = (i: number) => {
    if (!showFeedback) return selectedAnswer === i ? 'quiz-option quiz-option-selected' : 'quiz-option'
    if (i === currentQuestion.correctAnswer) return 'quiz-option quiz-option-correct'
    if (i === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) return 'quiz-option quiz-option-incorrect'
    return 'quiz-option opacity-50'
  }

  // ===== LOADING =====
  if (screen === 'loading') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 pt-32 text-center">
        <div className="w-8 h-8 border-4 border-hertford-green/20 border-t-hertford-green rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    )
  }

  // ===== LOGIN (MAGIC LINK) =====
  if (screen === 'login') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 pt-32">
        <div className="card-elevated text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-hertford-green to-hertford-green-light flex items-center justify-center">
            <span className="text-3xl">🎯</span>
          </div>
          <h2 className="font-heading text-2xl font-bold mb-2">Sign In to Play</h2>
          <p className="text-gray-500 text-sm mb-6">
            Enter your email and we&apos;ll send you a magic link — no password needed!
          </p>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all mb-4 text-center"
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMagicLink() }}
          />

          {loginError && (
            <p className="text-red-600 text-sm mb-4">{loginError}</p>
          )}

          <button
            onClick={handleSendMagicLink}
            disabled={isSubmitting}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send Magic Link'}
          </button>

          <p className="text-xs text-gray-400 mt-4">
            We&apos;ll email you a link to sign in. No password required.
          </p>
        </div>
      </div>
    )
  }

  // ===== CHECK EMAIL =====
  if (screen === 'check-email') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 pt-32">
        <div className="card-elevated text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
            <span className="text-3xl">📧</span>
          </div>
          <h2 className="font-heading text-2xl font-bold mb-2">Check Your Email</h2>
          <p className="text-gray-500 mb-6">
            We sent a magic link to <strong className="text-gray-700">{email}</strong>
          </p>
          <p className="text-gray-400 text-sm mb-8">
            Click the link in the email to sign in. It may take a moment to arrive.
          </p>
          <button
            onClick={() => setScreen('login')}
            className="text-hertford-green font-medium hover:underline text-sm"
          >
            ← Use a different email
          </button>
        </div>
      </div>
    )
  }

  // ===== CREATE USERNAME =====
  if (screen === 'create-username') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 pt-32">
        <div className="card-elevated text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-hertford-green to-hertford-green-light flex items-center justify-center">
            <span className="text-3xl">👋</span>
          </div>
          <h2 className="font-heading text-2xl font-bold mb-2">Choose Your Username</h2>
          <p className="text-gray-500 text-sm mb-6">
            This is what appears on the leaderboard. Pick something fun!
          </p>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
            placeholder="e.g. hertford_harry"
            className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all mb-2 text-center"
            maxLength={20}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreateUsername() }}
          />
          <p className="text-xs text-gray-400 mb-4">3-20 characters, letters, numbers & underscores</p>

          {loginError && (
            <p className="text-red-600 text-sm mb-4">{loginError}</p>
          )}

          <button
            onClick={handleCreateUsername}
            disabled={isSubmitting}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Let\'s Go!'}
          </button>
        </div>
      </div>
    )
  }

  // ===== READY TO PLAY =====
  if (screen === 'ready') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 pt-32">
        <div className="card-elevated text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-hertford-green to-hertford-green-light flex items-center justify-center">
            <span className="text-3xl">🎯</span>
          </div>
          <h2 className="font-heading text-2xl font-bold mb-2">Welcome, @{player?.username}!</h2>
          <p className="text-gray-500 mb-8">Ready to test your Hertford knowledge?</p>

          <button onClick={startQuiz} className="btn-primary w-full">
            Start Quiz — 10 questions
          </button>
          <p className="text-xs text-gray-400 mt-4">20 seconds per question. Good luck!</p>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <Link href="/leaderboard" className="text-hertford-green font-medium text-sm hover:underline">
              View Leaderboard →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ===== RESULTS =====
  if (screen === 'results') {
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
            <p className="text-gray-400 text-sm">{percentage}% correct &middot; {timeTaken}s</p>
          </div>

          {/* Answers & Sources */}
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
            <button onClick={startQuiz} className="btn-primary w-full">Play Again</button>
            <Link href="/leaderboard" className="btn-outline w-full text-center">View Leaderboard</Link>
          </div>
        </div>
      </div>
    )
  }

  // ===== PLAYING =====
  if (!currentQuestion) return null

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
          <span className={`px-3 py-0.5 text-xs font-medium rounded-full capitalize ${currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' : currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
            {currentQuestion.difficulty}
          </span>
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
