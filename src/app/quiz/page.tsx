'use client'

import QuizEngine from '@/components/QuizEngine'
import { getQuizQuestions } from '@/data/questions'
import { useState } from 'react'
import { QuizQuestion } from '@/lib/types'

export default function QuizPage() {
  const [questions] = useState<QuizQuestion[]>(() => getQuizQuestions(10))

  return (
    <div className="min-h-[70vh]">
      <QuizEngine questions={questions} />
    </div>
  )
}
