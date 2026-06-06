import { supabase } from './supabase'
import { Player, Score, QuizQuestion } from './types'

// ===== AUTH (Username + Password using Supabase Auth) =====

/**
 * Sign up with username, email, and password.
 */
export async function signUp(username: string, email: string, password: string): Promise<{ error: string | null }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) return { error: error.message }

  // Create player profile
  if (data.user) {
    const { error: profileError } = await supabase
      .from('players')
      .insert({ auth_id: data.user.id, username: username.toLowerCase(), email })

    if (profileError) {
      if (profileError.code === '23505') {
        return { error: 'Username already taken — try another' }
      }
      return { error: profileError.message }
    }
  }

  return { error: null }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.includes('Invalid login')) {
      return { error: 'Wrong email or password' }
    }
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: typeof window !== 'undefined' ? window.location.origin + '/quiz' : undefined,
  })
  if (error) return { error: error.message }
  return { error: null }
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

/**
 * Get current user
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
 * Check if username is taken
 */
export async function isUsernameTaken(username: string): Promise<boolean> {
  const { data } = await supabase
    .from('players')
    .select('id')
    .eq('username', username.toLowerCase())
    .single()
  return !!data
}

// ===== QUESTIONS =====

/**
 * Get questions the player hasn't answered yet
 */
export async function getUnansweredQuestions(playerId: string, count: number = 10): Promise<QuizQuestion[]> {
  const { data: answered } = await supabase
    .from('player_answers')
    .select('question_id')
    .eq('player_id', playerId)

  const answeredIds = (answered || []).map(a => a.question_id)

  let query = supabase.from('questions').select('*')
  if (answeredIds.length > 0) {
    query = query.not('id', 'in', `(${answeredIds.join(',')})`)
  }

  const { data: unanswered } = await query

  if (!unanswered || unanswered.length === 0) {
    // All seen — reset
    await supabase.from('player_answers').delete().eq('player_id', playerId)
    const { data: allQuestions } = await supabase.from('questions').select('*')
    const shuffled = (allQuestions || []).sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count).map(mapDbQuestion)
  }

  const shuffled = unanswered.sort(() => Math.random() - 0.5)

  if (shuffled.length < count) {
    const { data: extra } = await supabase.from('questions').select('*').in('id', answeredIds)
    const combined = [...shuffled, ...(extra || []).sort(() => Math.random() - 0.5)]
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

export async function saveScore(playerId: string, username: string, score: number, totalQuestions: number, timeTaken: number): Promise<boolean> {
  const { error } = await supabase.from('scores').insert({
    player_id: playerId,
    username,
    score,
    total_questions: totalQuestions,
    time_taken: timeTaken,
  })
  if (error) { console.error('Error saving score:', error); return false }
  return true
}

export async function getLeaderboard(period: 'all' | 'week' | 'today' = 'all'): Promise<Score[]> {
  let query = supabase
    .from('scores')
    .select('*')
    .order('score', { ascending: false })
    .order('time_taken', { ascending: true })
    .limit(50)

  if (period === 'today') {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    query = query.gte('played_at', today.toISOString())
  } else if (period === 'week') {
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
    query = query.gte('played_at', weekAgo.toISOString())
  }

  const { data, error } = await query
  if (error) { console.error('Error fetching leaderboard:', error); return [] }
  return data || []
}
