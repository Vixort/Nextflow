import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth/jwt'
import { createAdminClient } from '@/lib/supabase/admin'
import { logActivity } from '@/lib/activity'
import { isAdminLevel } from '@/types/supabase'

/**
 * POST /api/activity
 * Client-side route to log navigation, page views, clicks, and user events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_type, action, description, path, from_path, to_path, metadata } = body

    if (!event_type || !action || !description) {
      return NextResponse.json({ status: 400, error: 'Missing required log fields' }, { status: 400 })
    }

    await logActivity({
      eventType: event_type,
      action,
      description,
      path,
      fromPath: from_path,
      toPath: to_path,
      metadata,
      request,
    })

    return NextResponse.json({ status: 200, message: 'Activity logged' })
  } catch (error) {
    return NextResponse.json({ status: 500, error: 'Failed to record log' }, { status: 500 })
  }
}

/**
 * GET /api/activity
 * Admin-only route to retrieve detailed activity logs with pagination & filtering
 */
export async function GET(request: NextRequest) {
  const session = await getAuthSession(request)

  if (!session || !isAdminLevel(session.role)) {
    return NextResponse.json({ status: 403, error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const eventType = searchParams.get('event_type')
  const userId = searchParams.get('user_id')
  const search = searchParams.get('search')
  const limit = parseInt(searchParams.get('limit') || '100', 10)

  const supabase = createAdminClient()
  let query = supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (eventType && eventType !== 'all') {
    query = query.eq('event_type', eventType as any)
  }

  if (userId) {
    query = query.eq('user_id', userId)
  }

  if (search) {
    query = query.or(`username.ilike.%${search}%,description.ilike.%${search}%,path.ilike.%${search}%`)
  }

  const { data: logs, error } = await query

  if (error) {
    return NextResponse.json({ status: 500, error: 'Failed to fetch logs' }, { status: 500 })
  }

  return NextResponse.json({ status: 200, data: { logs } })
}
