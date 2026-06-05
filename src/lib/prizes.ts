import { Prize, WeeklyPrizePool, BusinessSignup, PrizeStatus } from './types'

const PRIZES_KEY = 'hertford_quiz_prizes'
const BUSINESS_SIGNUPS_KEY = 'hertford_quiz_business_signups'

// ===== HELPER =====

function generateId(): string {
  return 'p_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

/**
 * Get the Monday of the current week (ISO format)
 */
export function getCurrentWeekStart(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1) // adjust for Sunday
  const monday = new Date(now.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday.toISOString().split('T')[0]
}

/**
 * Format a week string for display
 */
export function formatWeekDisplay(weekStarting: string): string {
  const start = new Date(weekStarting)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
  return `${start.toLocaleDateString('en-GB', opts)} – ${end.toLocaleDateString('en-GB', opts)}`
}

// ===== PRIZES =====

export function getPrizes(): Prize[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(PRIZES_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function savePrizes(prizes: Prize[]): void {
  localStorage.setItem(PRIZES_KEY, JSON.stringify(prizes))
}

/**
 * Add a prize to the pool (from business signup)
 */
export function addPrize(prize: Omit<Prize, 'id' | 'status'>): Prize {
  const newPrize: Prize = {
    ...prize,
    id: generateId(),
    status: 'available',
  }
  const prizes = getPrizes()
  prizes.push(newPrize)
  savePrizes(prizes)
  return newPrize
}

/**
 * Get prizes for a specific week
 */
export function getPrizesForWeek(weekStarting: string): Prize[] {
  return getPrizes().filter(p => p.weekStarting === weekStarting)
}

/**
 * Get current week's available prizes
 */
export function getCurrentWeekPrizes(): Prize[] {
  const week = getCurrentWeekStart()
  return getPrizes().filter(p => p.weekStarting === week)
}

/**
 * Award a prize to a winner (admin action)
 */
export function awardPrize(prizeId: string, winnerId: string, winnerUsername: string): void {
  const prizes = getPrizes()
  const index = prizes.findIndex(p => p.id === prizeId)
  if (index !== -1) {
    prizes[index].status = 'awarded'
    prizes[index].winnerId = winnerId
    prizes[index].winnerUsername = winnerUsername
    prizes[index].awardedAt = new Date().toISOString()
    savePrizes(prizes)
  }
}

/**
 * Get recent winners (last 4 weeks)
 */
export function getRecentWinners(): Prize[] {
  return getPrizes()
    .filter(p => p.status === 'awarded' || p.status === 'claimed')
    .sort((a, b) => new Date(b.awardedAt || '').getTime() - new Date(a.awardedAt || '').getTime())
    .slice(0, 10)
}

// ===== BUSINESS SIGNUPS =====

export function getBusinessSignups(): BusinessSignup[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(BUSINESS_SIGNUPS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveBusinessSignups(signups: BusinessSignup[]): void {
  localStorage.setItem(BUSINESS_SIGNUPS_KEY, JSON.stringify(signups))
}

/**
 * Register a new business with prize offering
 */
export function registerBusiness(signup: Omit<BusinessSignup, 'id' | 'status' | 'signedUpAt'>): BusinessSignup {
  const newSignup: BusinessSignup = {
    ...signup,
    id: generateId(),
    status: 'pending',
    signedUpAt: new Date().toISOString(),
  }
  const signups = getBusinessSignups()
  signups.push(newSignup)
  saveBusinessSignups(signups)
  return newSignup
}

/**
 * Update business status (admin)
 */
export function updateBusinessStatus(id: string, status: BusinessSignup['status']): void {
  const signups = getBusinessSignups()
  const index = signups.findIndex(s => s.id === id)
  if (index !== -1) {
    signups[index].status = status
    saveBusinessSignups(signups)
  }
}

/**
 * Get active businesses (for prize pool display)
 */
export function getActiveBusinesses(): BusinessSignup[] {
  return getBusinessSignups().filter(b => b.status === 'active')
}
