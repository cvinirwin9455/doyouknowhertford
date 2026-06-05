import { QuizCategory } from './types'

export type SubmissionStatus = 'pending' | 'approved' | 'rejected'
export type VerificationType = 'source-verified' | 'needs-admin-review'

export interface QuestionSubmission {
  id: string
  businessName: string
  businessEmail: string
  question: string
  options: [string, string, string, string]
  correctAnswer: number
  category: QuizCategory
  difficulty: 'easy' | 'medium' | 'hard'
  
  // Verification
  verificationType: VerificationType
  sourceUrl?: string // URL to verified source
  sourceDescription?: string // Brief description of source
  justification?: string // Required if no valid source URL
  
  // Status
  status: SubmissionStatus
  submittedAt: string
  reviewedAt?: string
  adminNotes?: string
}

const STORAGE_KEY = 'hertford_quiz_submissions'

/**
 * Generate a unique ID
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

/**
 * Get all submissions from storage
 */
export function getSubmissions(): QuestionSubmission[] {
  if (typeof window === 'undefined') return []
  
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/**
 * Save a new submission
 */
export function saveSubmission(
  submission: Omit<QuestionSubmission, 'id' | 'status' | 'submittedAt'>
): QuestionSubmission {
  const newSubmission: QuestionSubmission = {
    ...submission,
    id: generateId(),
    status: 'pending',
    submittedAt: new Date().toISOString(),
  }
  
  const existing = getSubmissions()
  existing.push(newSubmission)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
  
  return newSubmission
}

/**
 * Update submission status (admin action)
 */
export function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus,
  adminNotes?: string
): void {
  const submissions = getSubmissions()
  const index = submissions.findIndex(s => s.id === id)
  
  if (index !== -1) {
    submissions[index].status = status
    submissions[index].reviewedAt = new Date().toISOString()
    if (adminNotes) {
      submissions[index].adminNotes = adminNotes
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions))
  }
}

/**
 * Get submissions filtered by status
 */
export function getSubmissionsByStatus(status: SubmissionStatus): QuestionSubmission[] {
  return getSubmissions().filter(s => s.status === status)
}

/**
 * Check if a URL looks like a valid source
 */
export function isValidSourceUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    // Must be http or https
    if (!['http:', 'https:'].includes(parsed.protocol)) return false
    // Must have a proper domain
    if (!parsed.hostname.includes('.')) return false
    return true
  } catch {
    return false
  }
}
