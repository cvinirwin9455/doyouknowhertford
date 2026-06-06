export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  source: string
}

export interface Player {
  id: string
  auth_id: string
  username: string
  email: string
  created_at: string
}

export interface Score {
  id: string
  player_id: string
  username: string
  score: number
  total_questions: number
  time_taken: number
  played_at: string
}

export interface QuizState {
  currentQuestionIndex: number
  answers: (number | null)[]
  score: number
  isComplete: boolean
  startTime: number
  endTime?: number
}
