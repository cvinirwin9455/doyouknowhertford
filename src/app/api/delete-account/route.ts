import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { playerId, authId } = await request.json()

    if (!playerId || !authId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create admin client with service role key (can delete auth users)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Delete player answers
    await supabaseAdmin.from('player_answers').delete().eq('player_id', playerId)

    // Delete scores
    await supabaseAdmin.from('scores').delete().eq('player_id', playerId)

    // Delete player profile
    await supabaseAdmin.from('players').delete().eq('id', playerId)

    // Delete the auth user completely
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(authId)

    if (authError) {
      console.error('Error deleting auth user:', authError)
      return NextResponse.json({ error: 'Failed to delete auth record' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Delete account error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
