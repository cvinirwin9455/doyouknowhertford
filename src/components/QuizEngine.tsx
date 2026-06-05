'use client'

import { useState, useEffect, useCallback } from 'react'
import { QuizQuestion, QuizState, UserProfile } from '@/lib/types'
import { getCurrentUser, createUser, isValidUsername } from '@/lib/users'
import QuizResults from './QuizResults'

const SECONDS_PER_QUESTION = 20

interface QuizEngineProps {
  questions: QuizQuestion[]
}

export default function QuizEngine({ questions }: QuizEngineProps) {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: Array(questions.length).fill(null),
    score: 0,
    isComplete: false,
    startTime: Date.now(),
  })
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)

  // User profile state
  const [user, setUser] = useState<UserProfile | null>(null)
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [profileErrors, setProfileErrors] = useState<string[]>([])

  // Load existing user on mount
  useEffect(() => {
    const existing = getCurrentUser()
    if (existing) setUser(existing)
  }, [])

  const currentQuestion = questions[quizState.currentQuestionIndex]

  const moveToNextQuestion = useCallback(() => {
    setShowFeedback(false)
    setSelectedAnswer(null)
    setTimeLeft(SECONDS_PER_QUESTION)

    if (quizState.currentQuestionIndex >= questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        isComplete: true,
        endTime: Date.now(),
      }))
    } else {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }))
    }
  }, [quizState.currentQuestionIndex, questions.length])

  useEffect(() => {
    if (!quizStarted || quizState.isComplete || showFeedback) return

    if (timeLeft <= 0) {
      handleAnswer(-1)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, quizStarted, quizState.isComplete, showFeedback])

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

    setTimeout(moveToNextQuestion, 2000)
  }

  const handleCreateProfile = () => {
    const errors: string[] = []

    if (!username.trim()) errors.push('Username is required')
    else if (!isValidUsername(username.trim())) errors.push('Username must be 3-20 characters (letters, numbers, underscores only)')
    
    if (!fullName.trim()) errors.push('Full name is required (for prize delivery)')
    if (!email.trim() || !email.includes('@')) errors.push('Valid email is required (for prize notifications)')

    setProfileErrors(errors)
    if (errors.length > 0) return

    const newUser = createUser(username.trim(), fullName.trim(), email.trim())
    setUser(newUser)
  }

  const handleStartQuiz = () => {
    if (user) {
      setQuizStarted(true)
    }
  }

  const getOptionClass = (optionIndex: number) => {
    if (!showFeedback) {
      return selectedAnswer === optionIndex ? 'quiz-option quiz-option-selected' : 'quiz-option'
    }

    if (optionIndex === currentQuestion.correctAnswer) {
      return 'quiz-option quiz-option-correct'
    }

    if (optionIndex === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) {
      return 'quiz-option quiz-option-incorrect'
    }

    return 'quiz-option opacity-50'
  }

  // Profile creation / login screen
  if (!quizStarted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 pt-32">
        <div className="card-elevated text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-hertford-green to-hertford-green-light flex items-center justify-center">
            <span className="text-3xl">🎯</span>
          </div>

          {/* Already have a profile */}
          {user ? (
            <>
              <h2 className="font-heading text-2xl font-bold mb-2">Welcome back, {user.username}!</h2>
              <p className="text-gray-500 mb-6">
                Ready to play? Top the weekly leaderboard to win prizes from local businesses!
              </p>

              {/* Prize teaser */}
              <div className="bg-gradient-to-r from-hertford-gold/10 to-amber-50 border border-hertford-gold/20 rounded-2xl p-4 mb-6 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🎁</span>
                  <span className="font-semibold text-sm text-amber-800">Weekly Prizes!</span>
                </div>
                <p className="text-xs text-amber-700">
                  The top scorer each week wins prizes from local Hertford businesses. Keep playing to stay on top!
                </p>
              </div>

              <button
                onClick={handleStartQuiz}
                className="btn-primary w-full"
              >
                Start Quiz — {questions.length} questions
              </button>
              <p className="text-xs text-gray-400 mt-4">
                20 seconds per question. Your username &quot;{user.username}&quot; will appear on the leaderboard.
              </p>
            </>
          ) : (
            <>
              <h2 className="font-heading text-2xl font-bold mb-2">Create Your Profile</h2>
              <p className="text-gray-500 mb-2">
                Set up a quick profile to play and be eligible for weekly prizes!
              </p>
              <p className="text-xs text-gray-400 mb-6">
                Only your username is shown publicly. Your name and email are kept private for prize delivery only.
              </p>

              {/* Profile form */}
              <div className="space-y-4 text-left mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Username <span className="text-gray-400 font-normal">(public — shown on leaderboard)</span>
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                    placeholder="e.g. hertford_harry"
                    className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all"
                    maxLength={20}
                  />
                  <p className="text-xs text-gray-400 mt-1">3-20 characters, letters, numbers & underscores</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Full Name <span className="text-gray-400 font-normal">(private — for prize delivery)</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your real name"
                    className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all"
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email <span className="text-gray-400 font-normal">(private — for prize notifications)</span>
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

              {/* Privacy note */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 text-left">
                <div className="flex gap-2">
                  <span className="text-blue-500">🔒</span>
                  <p className="text-xs text-blue-700">
                    <strong>Privacy:</strong> Your real name and email are never shown publicly. 
                    Only your username appears on the leaderboard. We only use your email to 
                    notify you if you win a prize.
                  </p>
                </div>
              </div>

              {/* Errors */}
              {profileErrors.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4 text-left">
                  {profileErrors.map((err, i) => (
                    <p key={i} className="text-xs text-red-700">• {err}</p>
                  ))}
                </div>
              )}

              <button
                onClick={handleCreateProfile}
                className="btn-primary w-full"
              >
                Create Profile & Play
              </button>
              <p className="text-xs text-gray-400 mt-4">
                One-time setup. You won&apos;t need to do this again.
              </p>
            </>
          )}
        </div>
      </div>
    )
  }

  // Results screen
  if (quizState.isComplete) {
    return (
      <QuizResults
        quizState={quizState}
        questions={questions}
        user={user!}
      />
    )
  }

  // Timer progress
  const timerPercentage = (timeLeft / SECONDS_PER_QUESTION) * 100
  const timerColor = timeLeft > 10 ? 'bg-hertford-green' : timeLeft > 5 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pt-28">
      {/* Progress header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-500">
            Question {quizState.currentQuestionIndex + 1}/{questions.length}
          </span>
          <span className="text-sm font-semibold text-hertford-green">
            Score: {quizState.score}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-hertford-green h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((quizState.currentQuestionIndex) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Timer bar */}
      <div className="mb-8">
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className={`${timerColor} h-2 rounded-full transition-all duration-1000 ease-linear`}
            style={{ width: `${timerPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className={`text-sm font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
            {timeLeft}s
          </span>
          <div className="flex gap-2">
            <span className={`px-3 py-0.5 text-xs font-medium rounded-full capitalize
              ${currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' : ''}
              ${currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
              ${currentQuestion.difficulty === 'hard' ? 'bg-red-100 text-red-700' : ''}
            `}>
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
        {currentQuestion.businessName && (
          <div className="inline-flex items-center gap-2 bg-hertford-gold/10 text-hertford-gold px-3 py-1 rounded-full text-xs font-medium mb-4">
            📍 {currentQuestion.businessName}
          </div>
        )}

        <h2 className="font-heading text-xl md:text-2xl font-bold mb-8 leading-snug">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showFeedback}
              className={getOptionClass(index)}
            >
              <span className="inline-flex items-center gap-4">
                <span className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-sm font-bold flex-shrink-0 border border-gray-100">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`mt-6 p-4 rounded-2xl text-sm animate-fade-in ${
            selectedAnswer === currentQuestion.correctAnswer
              ? 'bg-green-50 text-green-800 border border-green-100'
              : 'bg-red-50 text-red-800 border border-red-100'
          }`}>
            {selectedAnswer === currentQuestion.correctAnswer ? (
              <p className="font-medium">✅ Correct! Well done!</p>
            ) : selectedAnswer === -1 ? (
              <p className="font-medium">⏰ Time&apos;s up! The answer was: <strong>{currentQuestion.options[currentQuestion.correctAnswer]}</strong></p>
            ) : (
              <p className="font-medium">❌ Not quite. The answer was: <strong>{currentQuestion.options[currentQuestion.correctAnswer]}</strong></p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
