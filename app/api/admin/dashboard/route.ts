import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth/jwt'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminLevel } from '@/types/supabase'

export async function GET(request: NextRequest) {
  const session = await getAuthSession(request)

  if (!session || !isAdminLevel(session.role)) {
    return NextResponse.json(
      { status: 403, error: 'Forbidden. Admin access required.' },
      { status: 403 }
    )
  }

  const supabase = createAdminClient()

  // Fetch all users from the database
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, email, username, full_name, avatar_url, role, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (usersError) {
    return NextResponse.json(
      { status: 500, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }

  // Compute stats by role
  const totalUsers = users?.length || 0
  const ownerCount = users?.filter(u => u.role === 'owner').length || 0
  const adminCount = users?.filter(u => u.role === 'admin').length || 0
  const moderatorCount = users?.filter(u => u.role === 'moderator').length || 0
  const userCount = users?.filter(u => u.role === 'user').length || 0

  // Users registered in the last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recentUsers = users?.filter(u => new Date(u.created_at) > sevenDaysAgo).length || 0

  return NextResponse.json({
    status: 200,
    data: {
      users,
      stats: {
        totalUsers,
        ownerCount,
        adminCount,
        moderatorCount,
        userCount,
        recentUsers,
      },
    },
  })
}
