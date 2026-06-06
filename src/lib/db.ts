import { supabase } from './supabase'
import { Player, Score, QuizQuestion } from './types'

// ===== AUTH =====

/**
 * Send a magic link to the user's email
 */
export async function sendMagicLink(email: string): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: typeof window !== 'undefined' ? window.location.origin + '/quiz' : undefined,
    },
  })
  return { error: error?.message || null }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Sign out
 */
export async function signOut() {
  await supabase.auth.signOut()
}

// ===== PLAYERS =====

/**
 * Get player profile by auth user ID
 */
export async function getPlayerByAuthId(authId: string): Promise<Player | null> {
  const { data } = await supabase
    .from('players')
    .select()
    .eq('auth_id', authId)
    .single()
  return data
}

/**
 * Create player profile (after first login)
 */
export async function createPlayer(authId: string, username: string, email: string): Promise<Player | null> {
  const { data, error } = await supabase
    .from('players')
    .insert({ auth_id: authId, username, email })
    .select()
    .single()

  if (error) {
    console.error('Error creating player:', error)
    return null
  }
  return data
}

/**
 * Check if username is taken
 */
export async function isUsernameTaken(username: string): Promise<boolean> {
  const { data } = await supabase
    .from('players')
    .select('id')
    .eq('username', username)
    .single()
  return !!data
}

// ===== QUESTIONS =====

/**
 * Get questions the player hasn't answered yet
 */
export async function getUnansweredQuestions(playerId: string, count: number = 10): Promise<QuizQuestion[]> {
  // Get IDs of questions this player has already answered
  const { data: answered } = await supabase
    .from('player_answers')
    .select('question_id')
    .eq('player_id', playerId)

  const answeredIds = (answered || []).map(a => a.question_id)

  // Fetch questions not in the answered list
  let query = supabase.from('questions').select('*')
  
  if (answeredIds.length > 0) {
    query = query.not('id', 'in', `(${answeredIds.join(',')})`)
  }

  const { data: unanswered } = await query

  if (!unanswered || unanswered.length === 0) {
    // Player has seen all questions — reset and get any questions
    await supabase.from('player_answers').delete().eq('player_id', playerId)
    const { data: allQuestions } = await supabase.from('questions').select('*')
    const shuffled = (allQuestions || []).sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count).map(mapDbQuestion)
  }

  // Shuffle and take the requested count
  const shuffled = unanswered.sort(() => Math.random() - 0.5)
  
  // If not enough unanswered, supplement with answered ones
  if (shuffled.length < count) {
    const { data: extra } = await supabase
      .from('questions')
      .select('*')
      .in('id', answeredIds)
    const shuffledExtra = (extra || []).sort(() => Math.random() - 0.5)
    const combined = [...shuffled, ...shuffledExtra.slice(0, count - shuffled.length)]
    return combined.slice(0, count).map(mapDbQuestion)
  }

  return shuffled.slice(0, count).map(mapDbQuestion)
}

/**
 * Record that a player answered a question
 */
export async function recordAnswer(playerId: string, questionId: string, wasCorrect: boolean): Promise<void> {
  await supabase.from('player_answers').upsert({
    player_id: playerId,
    question_id: questionId,
    was_correct: wasCorrect,
  }, { onConflict: 'player_id,question_id' })
}

/**
 * Map database question to app type
 */
function mapDbQuestion(dbQ: any): QuizQuestion {
  return {
    id: dbQ.id,
    question: dbQ.question,
    options: dbQ.options,
    correctAnswer: dbQ.correct_answer,
    category: dbQ.category,
    difficulty: dbQ.difficulty,
    source: dbQ.source,
  }
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
 * Get leaderboard
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
  if (error) { console.error('Error fetching leaderboard:', error); return [] }
  return data || []
}
