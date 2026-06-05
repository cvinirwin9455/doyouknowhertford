import { QuizResult, LeaderboardEntry } from './types'

const STORAGE_KEY = 'hertford_quiz_scores'

export function saveScore(result: QuizResult): void {
  if (typeof window === 'undefined') return
  
  const existing = getScores()
  existing.push(result)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
}

export function getScores(): QuizResult[] {
  if (typeof window === 'undefined') return []
  
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function getLeaderboard(period: 'all' | 'week' | 'today' = 'all'): LeaderboardEntry[] {
  const scores = getScores()
  const now = new Date()

  const filtered = scores.filter((score) => {
    const scoreDate = new Date(score.date)
    
    switch (period) {
      case 'today': {
        return scoreDate.toDateString() === now.toDateString()
      }
      case 'week': {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return scoreDate >= weekAgo
      }
      default:
        return true
    }
  })

  const sorted = filtered.sort((a, b) => {
    const percA = (a.score / a.totalQuestions) * 100
    const percB = (b.score / b.totalQuestions) * 100
    if (percB !== percA) return percB - percA
    return a.timeTaken - b.timeTaken
  })

  return sorted.map((score, index) => ({
    rank: index + 1,
    playerName: score.playerName,
    score: score.score,
    totalQuestions: score.totalQuestions,
    percentage: Math.round((score.score / score.totalQuestions) * 100),
    date: score.date,
  }))
}

export function clearScores(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
