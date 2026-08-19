import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/db/client'
import { getAuthSession } from '@/lib/auth/jwt'

export interface LogParams {
  userId?: string | null
  username?: string | null
  userRole?: string | null
  eventType: 'auth.login' | 'auth.logout' | 'page_view' | 'user.action' | 'admin.action'
  action: string
  description: string
  path?: string | null
  fromPath?: string | null
  toPath?: string | null
  metadata?: Record<string, any>
  request?: NextRequest
}

export async function logActivity(params: LogParams) {
  try {
    const supabase = createAdminClient()

    let ipAddress: string | null = null
    let userAgent: string | null = null

    if (params.request) {
      ipAddress = params.request.headers.get('x-forwarded-for') ||
                  params.request.headers.get('x-real-ip') ||
                  null
      userAgent = params.request.headers.get('user-agent') || null
    }

    let userId = params.userId
    let username = params.username
    let userRole = params.userRole

    // Auto-resolve session if request is provided and user details are omitted
    if (params.request && (!userId || !username)) {
      const session = await getAuthSession(params.request)
      if (session) {
        userId = userId || session.id
        username = username || session.username
        userRole = userRole || session.role
      }
    }

    const { error } = await supabase.from('activity_logs').insert({
      user_id: userId || null,
      username: username || 'Anonymous',
      user_role: userRole || 'guest',
      event_type: params.eventType,
      action: params.action,
      description: params.description,
      path: params.path || null,
      from_path: params.fromPath || null,
      to_path: params.toPath || null,
      metadata: params.metadata || {},
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    if (error) {
      console.error('[ActivityLogger] Failed to insert activity log:', error)
    }
  } catch (err) {
    console.error('[ActivityLogger] Error logging activity:', err)
  }
}
