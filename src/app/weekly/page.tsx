'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { QuizQuestion, QuizState, Player } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, getPlayerByAuthId, saveScore } from '@/lib/db'

const SECONDS_PER_QUESTION = 20
const QUESTIONS_PER_CHALLENGE = 10

type Screen = 'loading' | 'not-signed-in' | 'challenge-info' | 'already-played' | 'playing' | 'results' | 'closed'

// Get the Monday of the current week at 9:00 AM
function getWeekStart(): Date {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(now)
  monday.setDate(diff)
  monday.setHours(9, 0, 0, 0)
  return monday
}

// Get the Sunday of the current week at 23:59
function getWeekEnd(): Date {
  const monday = getWeekStart()
  const sunday = new Date(monday)
  sunday.setDate(sunday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  return sunday
}

// Check if challenge is currently open
function isChallengeOpen(): boolean {
  const now = new Date()
  return now >= getWeekStart() && now <= getWeekEnd()
}

// Get time remaining until challenge closes
function getTimeRemaining(): string {
  const end = getWeekEnd()
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  
  if (diff <= 0) return 'Closed'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) return `${days}d ${hours}h remaining`
  if (hours > 0) return `${hours}h ${minutes}m remaining`
  return `${minutes}m remaining`
}

// Format date nicely
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

// Generate a seed from the week start date for consistent random order
function seededShuffle(array: any[], seed: string): any[] {
  const arr = [...array]
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  
  for (let i = arr.length - 1; i > 0; i--) {
    hash = ((hash << 5) - hash) + i
    hash = hash & hash
    const j = Math.abs(hash) % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function WeeklyChallengePage() {
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
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining())
  const [weeklyScores, setWeeklyScores] = useState<{username: string, score: number}[]>([])
  const [playerPreviousScore, setPlayerPreviousScore] = useState<number | null>(null)

  useEffect(() => {
    checkAuth()
    // Update countdown every minute
    const interval = setInterval(() => setTimeRemaining(getTimeRemaining()), 60000)
    return () => clearInterval(interval)
  }, [])

  const checkAuth = async () => {
    const user = await getCurrentUser()
    if (!user) { setScreen('not-signed-in'); return }
    
    const p = await getPlayerByAuthId(user.id)
    if (!p) { setScreen('not-signed-in'); return }
    setPlayer(p)

    // Check if challenge is open
    if (!isChallengeOpen()) { setScreen('closed'); return }

    // Check if player already played this week's challenge
    const weekStart = getWeekStart().toISOString()
    const { data: existingScore } = await supabase
      .from('scores')
      .select('score')
      .eq('player_id', p.id)
      .gte('played_at', weekStart)
      .like('username', '%[weekly]%')
      .single()

    if (existingScore) {
      setPlayerPreviousScore(existingScore.score)
      await loadWeeklyScores()
      setScreen('already-played')
      return
    }

    // Load weekly questions
    await loadWeeklyQuestions()
    await loadWeeklyScores()
    setScreen('challenge-info')
  }

  const loadWeeklyQuestions = async () => {
    const { data: allQuestions } = await supabase.from('questions').select('*')
    if (!allQuestions || allQuestions.length === 0) return

    // Use the week start date as a seed so everyone gets the same questions
    const seed = getWeekStart().toISOString()
    const shuffled = seededShuffle(allQuestions, seed)
    const selected = shuffled.slice(0, QUESTIONS_PER_CHALLENGE).map((q: any) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correct_answer,
      category: q.category,
      difficulty: q.difficulty,
      source: q.source,
      sourceUrl: q.source_url || null,
    }))
    setQuestions(selected)
  }

  const loadWeeklyScores = async () => {
    const weekStart = getWeekStart().toISOString()
    const { data } = await supabase
      .from('scores')
      .select('username, score')
      .gte('played_at', weekStart)
      .like('username', '%[weekly]%')
      .order('score', { ascending: false })
      .limit(20)

    if (data) {
      setWeeklyScores(data.map(d => ({ 
        username: d.username.replace(' [weekly]', ''), 
        score: d.score 
      })))
    }
  }

  const startChallenge = () => {
    setQuizState({
      currentQuestionIndex: 0,
      answers: Array(questions.length).fill(null),
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
    setSelectedAnswer(null)
    setShowFeedback(false)
    setTimeLeft(SECONDS_PER_QUESTION)

    setTimeout(() => {
      if (quizState.currentQuestionIndex >= questions.length - 1) {
        setQuizState(prev => ({ ...prev, isComplete: true, endTime: Date.now() }))
        setScreen('results')
      } else {
        setQuizState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }))
      }
    }, 50)
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
      // Save with [weekly] tag to distinguish from regular quiz scores
      saveScore(player.id, player.username + ' [weekly]', quizState.score, questions.length, timeTaken)
      setScoreSaved(true)
      loadWeeklyScores()
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
    setTimeout(moveToNextQuestion, 1800)
  }

  const getOptionClass = (i: number) => {
    if (!showFeedback && selectedAnswer === null) return 'quiz-option'
    if (!showFeedback && selectedAnswer === i) return 'quiz-option quiz-option-selected'
    if (!showFeedback) return 'quiz-option'
    if (i === currentQuestion.correctAnswer) return 'quiz-option quiz-option-correct'
    if (i === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) return 'quiz-option quiz-option-incorrect'
    return 'quiz-option opacity-50'
  }

  // ===== LOADING =====
  if (screen === 'loading') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 pt-32 text-center">
        <div className="w-8 h-8 border-4 border-hertford-green/20 border-t-hertford-green rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  // ===== NOT SIGNED IN =====
  if (screen === 'not-signed-in') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 pt-32">
        <div className="card-elevated text-center">
          <span className="text-4xl mb-4 block">🔒</span>
          <h2 className="font-heading text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-gray-500 mb-6">You need an account to play the Weekly Challenge.</p>
          <Link href="/quiz" className="btn-primary">Sign In / Create Account</Link>
        </div>
      </div>
    )
  }

  // ===== CLOSED =====
  if (screen === 'closed') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 pt-32">
        <div className="card-elevated text-center">
          <span className="text-4xl mb-4 block">⏰</span>
          <h2 className="font-heading text-2xl font-bold mb-2">Challenge Not Open</h2>
          <p className="text-gray-500 mb-6">
            The weekly challenge opens every Monday at 9:00 AM and closes on Sunday at midnight.
          </p>
          <p className="text-sm text-gray-400">Next challenge opens: Monday {formatDate(getWeekStart())}</p>
          <Link href="/quiz" className="btn-primary mt-6 inline-block">Play Regular Quiz</Link>
        </div>
      </div>
    )
  }

  // ===== ALREADY PLAYED =====
  if (screen === 'already-played') {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 pt-28">
        <div className="card-elevated text-center">
          <span className="text-4xl mb-4 block">✅</span>
          <h2 className="font-heading text-2xl font-bold mb-2">Already Completed!</h2>
          <p className="text-gray-500 mb-4">
            You&apos;ve already played this week&apos;s challenge.
          </p>
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <p className="text-sm text-gray-500">Your score</p>
            <p className="text-4xl font-black gradient-text">{playerPreviousScore}/{QUESTIONS_PER_CHALLENGE}</p>
          </div>

          {/* Weekly leaderboard */}
          {weeklyScores.length > 0 && (
            <div className="text-left mb-6">
              <h3 className="font-semibold text-sm text-gray-400 uppercase tracking-wider mb-3">This Week&apos;s Ranking</h3>
              <div className="space-y-2">
                {weeklyScores.slice(0, 10).map((entry, index) => (
                  <div key={`${entry.username}-${index}`} className={`flex items-center gap-3 p-3 rounded-xl ${index < 3 ? 'bg-hertford-gold/5 border border-hertford-gold/20' : 'bg-gray-50'}`}>
                    <span className="w-6 text-center font-bold text-gray-400 text-sm">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </span>
                    <span className="flex-1 font-medium text-sm text-gray-900">@{entry.username}</span>
                    <span className="font-bold text-sm">{entry.score}/{QUESTIONS_PER_CHALLENGE}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400 mb-6">New challenge opens next Monday at 9:00 AM</p>
          <Link href="/quiz" className="btn-outline w-full text-center">Play Regular Quiz</Link>
        </div>
      </div>
    )
  }

  // ===== CHALLENGE INFO (before starting) =====
  if (screen === 'challenge-info') {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 pt-28">
        <div className="card-elevated text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="text-3xl">🏆</span>
          </div>
          <h2 className="font-heading text-2xl font-bold mb-2">Weekly Challenge</h2>
          <p className="text-gray-500 text-sm mb-6">
            Everyone gets the same {QUESTIONS_PER_CHALLENGE} questions this week. One attempt only — make it count!
          </p>

          {/* Timer */}
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-xs text-purple-500 font-semibold">THIS WEEK</p>
                <p className="text-sm text-gray-700">{formatDate(getWeekStart())} – {formatDate(getWeekEnd())}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-purple-500 font-semibold">CLOSES IN</p>
                <p className="text-sm font-bold text-gray-900">{timeRemaining}</p>
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left">
            <h3 className="font-semibold text-sm mb-3">Rules:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">⚡ <span>{QUESTIONS_PER_CHALLENGE} questions, 20 seconds each</span></li>
              <li className="flex gap-2">🎯 <span>Same questions for everyone this week</span></li>
              <li className="flex gap-2">1️⃣ <span>One attempt only — no replays!</span></li>
              <li className="flex gap-2">🏆 <span>Compete for the top of the weekly board</span></li>
            </ul>
          </div>

          {/* Weekly leaderboard preview */}
          {weeklyScores.length > 0 && (
            <div className="text-left mb-6">
              <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-wider mb-3">Current Standings</h3>
              <div className="space-y-2">
                {weeklyScores.slice(0, 5).map((entry, index) => (
                  <div key={`${entry.username}-${index}`} className="flex items-center gap-3 p-2 rounded-xl bg-gray-50">
                    <span className="w-6 text-center font-bold text-gray-400 text-sm">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </span>
                    <span className="flex-1 font-medium text-sm text-gray-900">@{entry.username}</span>
                    <span className="font-bold text-sm">{entry.score}/{QUESTIONS_PER_CHALLENGE}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={startChallenge} className="btn-primary w-full">
            Start Weekly Challenge
          </button>
          <p className="text-xs text-gray-400 mt-3">⚠️ Once you start, you cannot restart</p>
        </div>
      </div>
    )
  }

  // ===== RESULTS =====
  if (screen === 'results') {
    const percentage = Math.round((quizState.score / questions.length) * 100)
    const timeTaken = quizState.endTime ? Math.round((quizState.endTime - quizState.startTime) / 1000) : 0

    return (
      <div className="max-w-lg mx-auto px-4 py-12 pt-28 animate-fade-in">
        <div className="card-elevated text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <span className="text-4xl">{percentage >= 80 ? '🏆' : percentage >= 50 ? '👏' : '💪'}</span>
          </div>
          <h2 className="font-heading text-3xl font-bold mb-2">Challenge Complete!</h2>
          <p className="text-gray-500 mb-6">Your score has been submitted to this week&apos;s leaderboard.</p>

          <div className="bg-gray-50 rounded-2xl p-8 mb-6">
            <div className="text-5xl font-black gradient-text mb-1">{quizState.score}/{questions.length}</div>
            <p className="text-gray-400 text-sm">{percentage}% correct &middot; {timeTaken}s</p>
          </div>

          {/* Answers */}
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
                            <a href={q.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{q.source} →</a>
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
            <Link href="/quiz" className="btn-primary w-full text-center">Play Regular Quiz</Link>
            <Link href="/leaderboard" className="btn-outline w-full text-center">View Leaderboard</Link>
          </div>
        </div>
      </div>
    )
  }

  // ===== PLAYING =====
  if (!currentQuestion) return null
  const timerPercentage = (timeLeft / SECONDS_PER_QUESTION) * 100
  const timerColor = timeLeft > 10 ? 'bg-purple-500' : timeLeft > 5 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pt-28">
      {/* Weekly challenge header */}
      <div className="text-center mb-4">
        <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
          🏆 Weekly Challenge
        </span>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-500">Question {quizState.currentQuestionIndex + 1}/{questions.length}</span>
          <span className="text-sm font-semibold text-purple-600">Score: {quizState.score}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${((quizState.currentQuestionIndex) / questions.length) * 100}%` }} />
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

      {/* Feedback above question */}
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

      {/* Question */}
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
