'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { QuizQuestion, QuizState, Player } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import {
  signUp, signIn, signOut, getCurrentUser, getPlayerByAuthId,
  getUnansweredQuestions, recordAnswer, saveScore, resetPassword
} from '@/lib/db'

const SECONDS_PER_QUESTION = 20

type Screen = 'loading' | 'auth' | 'ready' | 'playing' | 'results' | 'no-questions'

export default function QuizPage() {
  const [screen, setScreen] = useState<Screen>('loading')
  const [player, setPlayer] = useState<Player | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0, answers: [], score: 0, isComplete: false, startTime: Date.now(),
  })
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [scoreSaved, setScoreSaved] = useState(false)

  // Auth state
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authSuccess, setAuthSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if already signed in
  useEffect(() => {
    checkAuth()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadPlayer(session.user.id)
    })
    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuth = async () => {
    const user = await getCurrentUser()
    if (user) {
      await loadPlayer(user.id)
    } else {
      setScreen('auth')
    }
  }

  const loadPlayer = async (authId: string) => {
    const p = await getPlayerByAuthId(authId)
    if (p) {
      setPlayer(p)
      setScreen('ready')
    } else {
      setScreen('auth')
    }
  }

  const handleAuth = async () => {
    if (!password.trim()) {
      setAuthError('Password is required')
      return
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters')
      return
    }

    setIsSubmitting(true)
    setAuthError('')

    if (authMode === 'signup') {
      if (!username.trim()) { setAuthError('Username is required'); setIsSubmitting(false); return }
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(username.trim())) {
        setAuthError('Username: letters, numbers & underscores only (3-20 chars)')
        setIsSubmitting(false); return
      }
      if (!email.trim() || !email.includes('@')) {
        setAuthError('Please enter a valid email address')
        setIsSubmitting(false); return
      }
      const { error } = await signUp(username.trim(), email.trim(), password)
      if (error) { setAuthError(error); setIsSubmitting(false); return }
    } else {
      if (!email.trim() || !email.includes('@')) {
        setAuthError('Please enter your email address')
        setIsSubmitting(false); return
      }
      const { error } = await signIn(email.trim(), password)
      if (error) { setAuthError(error); setIsSubmitting(false); return }
    }

    // Auth successful — load player
    const user = await getCurrentUser()
    if (user) await loadPlayer(user.id)
    setIsSubmitting(false)
  }

  const handleSignOut = async () => {
    await signOut()
    setPlayer(null)
    setScreen('auth')
  }

  const handleForgotPassword = async () => {
    if (!email.trim() || !email.includes('@')) {
      setAuthError('Please enter your email address first')
      return
    }
    setIsSubmitting(true)
    setAuthError('')
    setAuthSuccess('')

    const { error } = await resetPassword(email.trim())
    if (error) {
      setAuthError(error)
    } else {
      setAuthSuccess('Password reset link sent! Check your email.')
    }
    setIsSubmitting(false)
  }

  const startQuiz = async () => {
    if (!player) return
    const qs = await getUnansweredQuestions(player.id, 10)
    if (qs.length === 0) {
      setScreen('no-questions' as Screen)
      return
    }
    setQuestions(qs)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setQuizState({ currentQuestionIndex: 0, answers: Array(qs.length).fill(null), score: 0, isComplete: false, startTime: Date.now() })
    setTimeLeft(SECONDS_PER_QUESTION)
    setScoreSaved(false)
    setScreen('playing')
  }

  const currentQuestion = questions[quizState.currentQuestionIndex]

  const moveToNextQuestion = useCallback(() => {
    // Reset selection state FIRST to prevent carry-over on mobile
    setSelectedAnswer(null)
    setShowFeedback(false)
    setTimeLeft(SECONDS_PER_QUESTION)
    
    // Small delay to ensure state is cleared before re-render
    setTimeout(() => {
      if (quizState.currentQuestionIndex >= questions.length - 1) {
        setQuizState(prev => ({ ...prev, isComplete: true, endTime: Date.now() }))
        setScreen('results')
      } else {
        setQuizState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
        }))
      }
    }, 50)
  }, [quizState.currentQuestionIndex, questions.length])

  useEffect(() => {
    if (screen !== 'playing' || showFeedback) return
    if (timeLeft <= 0) { handleAnswer(-1); return }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearInterval(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, screen, showFeedback])

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
    if (player) recordAnswer(player.id, currentQuestion.id, isCorrect)
    setTimeout(moveToNextQuestion, 1800)
  }

  const getOptionClass = (i: number) => {
    if (!showFeedback) return selectedAnswer === i ? 'quiz-option quiz-option-selected' : 'quiz-option'
    if (i === currentQuestion.correctAnswer) return 'quiz-option quiz-option-correct'
    if (i === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) return 'quiz-option quiz-option-incorrect'
    return 'quiz-option opacity-50'
  }

  // ===== NO MORE QUESTIONS =====
  if (screen === 'no-questions') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 pt-32">
        <div className="card-elevated text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-hertford-gold to-amber-400 flex items-center justify-center shadow-lg">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="font-heading text-2xl font-bold mb-3">You&apos;ve answered all questions!</h2>
          <p className="text-gray-500 mb-6">
            Incredible — you&apos;ve gone through every single question in our database. 
            New questions will be released soon. Check back later!
          </p>
          <div className="bg-hertford-green/5 rounded-2xl p-4 mb-6">
            <p className="text-sm text-hertford-green font-medium">
              💡 Tip: Check the leaderboard to see how you rank against other players!
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/leaderboard" className="btn-primary w-full text-center">View Leaderboard</Link>
            <Link href="/history" className="btn-outline w-full text-center">View My History</Link>
          </div>
        </div>
      </div>
    )
  }

  // ===== LOADING =====
  if (screen === 'loading') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 pt-32 text-center">
        <div className="w-8 h-8 border-4 border-hertford-green/20 border-t-hertford-green rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  // ===== AUTH (Login / Sign Up) =====
  if (screen === 'auth') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 pt-32">
        <div className="card-elevated text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-hertford-green to-hertford-green-light flex items-center justify-center">
            <span className="text-3xl">🎯</span>
          </div>
          <h2 className="font-heading text-2xl font-bold mb-2">
            {authMode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {authMode === 'login' ? 'Welcome back! Enter your details to play.' : 'Choose a username and password to get started.'}
          </p>

          <div className="space-y-4 text-left mb-6">
            {authMode === 'signup' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username <span className="text-gray-400 font-normal">(shown on leaderboard)</span></label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                  placeholder="e.g. hertford_harry"
                  className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all"
                  maxLength={20}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={authMode === 'signup' ? 'At least 6 characters' : 'Your password'}
                className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all"
                onKeyDown={(e) => { if (e.key === 'Enter') handleAuth() }}
              />
            </div>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
              <p className="text-sm text-red-700">{authError}</p>
            </div>
          )}

          <button onClick={handleAuth} disabled={isSubmitting} className="btn-primary w-full disabled:opacity-50">
            {isSubmitting ? 'Please wait...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          {authMode === 'login' && (
            <button
              onClick={handleForgotPassword}
              disabled={isSubmitting}
              className="text-sm text-gray-400 hover:text-hertford-green transition-colors mt-2"
            >
              Forgot your password?
            </button>
          )}

          {authSuccess && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-3 mt-4">
              <p className="text-sm text-green-700">{authSuccess}</p>
            </div>
          )}

          <p className="text-sm text-gray-500 mt-4">
            {authMode === 'login' ? (
              <>Don&apos;t have an account? <button onClick={() => { setAuthMode('signup'); setAuthError(''); setAuthSuccess('') }} className="text-hertford-green font-semibold hover:underline">Sign up</button></>
            ) : (
              <>Already have an account? <button onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess('') }} className="text-hertford-green font-semibold hover:underline">Sign in</button></>
            )}
          </p>
        </div>
      </div>
    )
  }

  // ===== READY =====
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
          <p className="text-xs text-gray-400 mt-4">20 seconds per question</p>

          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
            <Link href="/leaderboard" className="text-hertford-green font-medium text-sm hover:underline">
              Leaderboard →
            </Link>
            <button onClick={handleSignOut} className="text-gray-400 text-sm hover:text-red-500 transition-colors">
              Sign out
            </button>
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
      if (percentage >= 40) return { emoji: '📚', text: 'Not bad! Keep exploring!' }
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
                          <span className="font-semibold">Why?</span>{' '}
                          {q.sourceUrl ? (
                            <a
                              href={q.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {q.source} →
                            </a>
                          ) : (
                            <span>{q.source}</span>
                          )}
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
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-500">Question {quizState.currentQuestionIndex + 1}/{questions.length}</span>
          <span className="text-sm font-semibold text-hertford-green">Score: {quizState.score}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div className="bg-hertford-green h-1.5 rounded-full transition-all duration-300" style={{ width: `${((quizState.currentQuestionIndex) / questions.length) * 100}%` }} />
        </div>
      </div>

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

      {/* Feedback — shown ABOVE the question card when answered */}
      {showFeedback && (
        <div className={`mb-4 p-5 rounded-2xl text-lg font-bold text-center animate-fade-in ${selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-50 text-green-800 border-2 border-green-200' : 'bg-red-50 text-red-800 border-2 border-red-200'}`}>
          {selectedAnswer === currentQuestion.correctAnswer ? (
            <p>✅ Correct!</p>
          ) : selectedAnswer === -1 ? (
            <p>⏰ Time&apos;s up!<br /><span className="text-sm font-medium">Answer: {currentQuestion.options[currentQuestion.correctAnswer]}</span></p>
          ) : (
            <p>❌ Incorrect<br /><span className="text-sm font-medium">Answer: {currentQuestion.options[currentQuestion.correctAnswer]}</span></p>
          )}
        </div>
      )}

      <div className="card-elevated mb-6 animate-fade-in">
        <h2 className="font-heading text-xl md:text-2xl font-bold mb-8 leading-snug">{currentQuestion.question}</h2>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button key={`q${quizState.currentQuestionIndex}-opt${index}`} onClick={() => handleAnswer(index)} disabled={showFeedback} className={getOptionClass(index)}>
              <span className="inline-flex items-center gap-4">
                <span className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-sm font-bold flex-shrink-0 border border-gray-100">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
