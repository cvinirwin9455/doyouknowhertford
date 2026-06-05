export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  category: QuizCategory
  difficulty: 'easy' | 'medium' | 'hard'
  source: string
  businessId?: string
  businessName?: string
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

export interface QuizResult {
  playerName: string
  score: number
  totalQuestions: number
  timeTaken: number
  date: string
  categories: QuizCategory[]
}

export interface LeaderboardEntry {
  rank: number
  playerName: string
  score: number
  totalQuestions: number
  percentage: number
  date: string
}

export interface QuizState {
  currentQuestionIndex: number
  answers: (number | null)[]
  score: number
  isComplete: boolean
  startTime: number
  endTime?: number
}
