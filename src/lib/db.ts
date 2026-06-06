import { supabase } from './supabase'
import { Player, Score } from './types'

// ===== PLAYERS =====

/**
 * Register a new player
 */
export async function createPlayer(username: string, fullName: string, email: string): Promise<Player | null> {
  const { data, error } = await supabase
    .from('players')
    .insert({ username, full_name: fullName, email })
    .select()
    .single()

  if (error) {
    console.error('Error creating player:', error)
    return null
  }
  return data
}

/**
 * Get a player by username
 */
export async function getPlayerByUsername(username: string): Promise<Player | null> {
  const { data, error } = await supabase
    .from('players')
    .select()
    .eq('username', username)
    .single()

  if (error) return null
  return data
}

/**
 * Check if a username is already taken
 */
export async function isUsernameTaken(username: string): Promise<boolean> {
  const { data } = await supabase
    .from('players')
    .select('id')
    .eq('username', username)
    .single()

  return !!data
}

// ===== SCORES =====

/**
 * Save a quiz score
 */
export async function saveScore(
  playerId: string,
  username: string,
  score: number,
  totalQuestions: number,
  timeTaken: number
): Promise<boolean> {
  const { error } = await supabase
    .from('scores')
    .insert({
      player_id: playerId,
      username,
      score,
      total_questions: totalQuestions,
      time_taken: timeTaken,
    })

  if (error) {
    console.error('Error saving score:', error)
    return false
  }
  return true
}

/**
 * Get leaderboard — top scores for a given period
 */
export async function getLeaderboard(period: 'all' | 'week' | 'today' = 'all'): Promise<Score[]> {
  let query = supabase
    .from('scores')
    .select('*')
    .order('score', { ascending: false })
    .order('time_taken', { ascending: true })
    .limit(50)

  if (period === 'today') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    query = query.gte('played_at', today.toISOString())
  } else if (period === 'week') {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    query = query.gte('played_at', weekAgo.toISOString())
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }
  return data || []
}
