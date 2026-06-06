export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  category: QuizCategory
  difficulty: 'easy' | 'medium' | 'hard'
  source: string
}

export type QuizCategory =
  | 'history'
  | 'landmarks'
  | 'people'
  | 'events'
  | 'food-drink'
  | 'local-business'
  | 'geography'
  | 'culture'

export interface Player {
  id: string
  username: string
  full_name: string
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
