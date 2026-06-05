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
  userId: string
  username: string // public display name
  score: number
  totalQuestions: number
  timeTaken: number
  date: string
  categories: QuizCategory[]
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string // public display name only
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

// ===== USER PROFILE =====
// Private info (email, real name) stored separately — never shown on leaderboard
// Public info (username) is what appears on leaderboard

export interface UserProfile {
  id: string
  username: string // public — shown on leaderboard
  fullName: string // private — for prize delivery
  email: string // private — for prize notification
  createdAt: string
}

// ===== PRIZE SYSTEM =====

export type PrizeStatus = 'available' | 'awarded' | 'claimed'

export interface Prize {
  id: string
  businessName: string
  businessEmail: string
  prizeDescription: string // e.g. "Free coffee & cake for 2"
  prizeValue?: string // e.g. "£15"
  weekStarting: string // ISO date of the Monday the prize is for
  status: PrizeStatus
  winnerId?: string // userId of winner
  winnerUsername?: string
  awardedAt?: string
}

export interface WeeklyPrizePool {
  weekStarting: string // ISO date of Monday
  prizes: Prize[]
  winnerId?: string
  winnerUsername?: string
  isDrawn: boolean
}

// ===== BUSINESS SIGNUP =====

export interface BusinessSignup {
  id: string
  businessName: string
  contactName: string
  email: string
  phone?: string
  website?: string
  tier: 'basic' | 'standard' | 'premium'
  
  // Prize offering (required)
  prizeDescription: string // What they'll give weekly
  prizeValue: string // Approximate value
  prizeFrequency: 'weekly' | 'monthly' // How often they contribute
  
  // Status
  status: 'pending' | 'active' | 'paused'
  signedUpAt: string
}
