import { UserProfile } from './types'

const STORAGE_KEY = 'hertford_quiz_user'

/**
 * Generate a unique user ID
 */
function generateId(): string {
  return 'u_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

/**
 * Get the current user profile (or null if not registered)
 */
export function getCurrentUser(): UserProfile | null {
  if (typeof window === 'undefined') return null

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

/**
 * Create a new user profile
 */
export function createUser(username: string, fullName: string, email: string): UserProfile {
  const user: UserProfile = {
    id: generateId(),
    username: username.trim(),
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    createdAt: new Date().toISOString(),
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  return user
}

/**
 * Update user profile
 */
export function updateUser(updates: Partial<Omit<UserProfile, 'id' | 'createdAt'>>): UserProfile | null {
  const user = getCurrentUser()
  if (!user) return null

  const updated = { ...user, ...updates }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

/**
 * Check if a username is valid (alphanumeric, underscores, 3-20 chars)
 */
export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username)
}

/**
 * Log out (clear user)
 */
export function logoutUser(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
