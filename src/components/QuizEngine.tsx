'use client'

import { useState, useEffect, useCallback } from 'react'
import { QuizQuestion, QuizState } from '@/lib/types'
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
  const [playerName, setPlayerName] = useState('')
  const [quizStarted, setQuizStarted] = useState(false)

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

  // Timer countdown
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

  const getTimerColor = () => {
    if (timeLeft > 10) return 'text-green-600'
    if (timeLeft > 5) return 'text-yellow-600'
    return 'text-red-600 animate-pulse'
  }

  // Name entry screen
  if (!quizStarted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="card text-center">
          <h2 className="font-heading text-2xl font-bold mb-2">Ready to Play?</h2>
          <p className="text-gray-600 mb-6">
            Enter your name to appear on the leaderboard!
          </p>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-center text-lg
                       focus:border-hertford-green focus:outline-none transition-colors mb-4"
            maxLength={30}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && playerName.trim()) setQuizStarted(true)
            }}
          />
          <button
            onClick={() => setQuizStarted(true)}
            disabled={!playerName.trim()}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Quiz ({questions.length} questions)
          </button>
          <p className="text-xs text-gray-400 mt-3">
            20 seconds per question. Good luck!
          </p>
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
        playerName={playerName}
      />
    )
  }

  // Quiz question screen
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {quizState.currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-gray-600">
            Score: {quizState.score}/{quizState.currentQuestionIndex}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-hertford-green h-2 rounded-full transition-all duration-300"
            style={{ width: `${((quizState.currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Timer */}
      <div className="text-center mb-6">
        <span className={`text-4xl font-bold ${getTimerColor()}`}>
          {timeLeft}
        </span>
        <p className="text-xs text-gray-500 mt-1">seconds remaining</p>
      </div>

      {/* Question Card */}
      <div className="card mb-6">
        {/* Category & Difficulty badges */}
        <div className="flex gap-2 mb-4">
          <span className="px-2 py-1 bg-hertford-green/10 text-hertford-green text-xs font-medium rounded-full capitalize">
            {currentQuestion.category.replace('-', ' & ')}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize
            ${currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' : ''}
            ${currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
            ${currentQuestion.difficulty === 'hard' ? 'bg-red-100 text-red-700' : ''}
          `}>
            {currentQuestion.difficulty}
          </span>
          {currentQuestion.businessName && (
            <span className="px-2 py-1 bg-hertford-gold/20 text-hertford-gold text-xs font-medium rounded-full">
              📍 {currentQuestion.businessName}
            </span>
          )}
        </div>

        <h2 className="font-heading text-xl md:text-2xl font-bold mb-6">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showFeedback}
              className={getOptionClass(index)}
            >
              <span className="inline-flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </span>
            </button>
          ))}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            selectedAnswer === currentQuestion.correctAnswer
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {selectedAnswer === currentQuestion.correctAnswer ? (
              <p>✅ Correct! Well done!</p>
            ) : selectedAnswer === -1 ? (
              <p>⏰ Time&apos;s up! The answer was: <strong>{currentQuestion.options[currentQuestion.correctAnswer]}</strong></p>
            ) : (
              <p>❌ Incorrect. The answer was: <strong>{currentQuestion.options[currentQuestion.correctAnswer]}</strong></p>
            )}
            <p className="text-xs mt-1 opacity-75">Source: {currentQuestion.source}</p>
          </div>
        )}
      </div>
    </div>
  )
}
