import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth/jwt'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminLevel } from '@/types/supabase'
import { logActivity } from '@/lib/activity'

// Default fallback settings
const DEFAULT_SETTINGS = {
  general: {
    platform_name: 'NEXTFLOW',
    support_email: 'support@nextflow.dev',
    maintenance_mode: false,
    public_registration: true,
  },
  security: {
    session_timeout_days: 7,
    max_login_attempts: 5,
    require_email_verify: false,
    mfa_required: false,
  },
  workflow: {
    max_concurrent_jobs: 10,
    default_timeout_minutes: 30,
    log_retention_days: 30,
    auto_retry_failed: true,
  },
  notifications: {
    alert_email: 'admin@nextflow.com',
    slack_webhook: '',
    notify_on_failure: true,
  },
}

/**
 * GET /api/admin/settings
 * Fetch all system settings categories for the admin dashboard
 */
export async function GET(request: NextRequest) {
  const session = await getAuthSession(request)

  if (!session || !isAdminLevel(session.role)) {
    return NextResponse.json({ status: 403, error: 'Forbidden' }, { status: 403 })
  }

  const mergedSettings = { ...DEFAULT_SETTINGS }

  try {
    const supabase = createAdminClient()
    const { data: dbSettings, error } = await supabase.from('system_settings').select('*')

    if (!error && dbSettings && dbSettings.length > 0) {
      dbSettings.forEach(item => {
        if (item.key in mergedSettings) {
          (mergedSettings as any)[item.key] = {
            ...(mergedSettings as any)[item.key],
            ...(item.value as any),
          }
        }
      })
    }
  } catch (err) {
    console.warn('[Settings GET] Falling back to default settings:', err)
  }

  return NextResponse.json({ status: 200, data: { settings: mergedSettings } })
}

/**
 * PATCH /api/admin/settings
 * Update a specific system settings category
 */
export async function PATCH(request: NextRequest) {
  const session = await getAuthSession(request)

  if (!session || !isAdminLevel(session.role)) {
    return NextResponse.json({ status: 403, error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { category, settings } = body

    if (!category || !settings || typeof settings !== 'object') {
      return NextResponse.json({ status: 400, error: 'Invalid settings payload' }, { status: 400 })
    }

    if (!['general', 'security', 'workflow', 'notifications'].includes(category)) {
      return NextResponse.json({ status: 400, error: 'Invalid settings category' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Upsert into system_settings table
    const { error } = await supabase
      .from('system_settings')
      .upsert(
        {
          key: category,
          value: settings,
          updated_at: new Date().toISOString(),
          updated_by: session.id || null,
        },
        { onConflict: 'key' }
      )

    if (error) {
      console.error('[Settings PATCH Error]:', error)
      return NextResponse.json({
        status: 500,
        error: `Supabase Error (${error.code || 'DB'}): ${error.message}. Please run setup_all.sql in Supabase SQL Editor if table is missing.`
      }, { status: 500 })
    }

    // Audit Log (non-blocking)
    logActivity({
      userId: session.id,
      username: session.username,
      userRole: session.role,
      eventType: 'admin.action',
      action: 'SETTINGS_UPDATE',
      description: `Admin "${session.username}" updated system settings category [${category.toUpperCase()}]`,
      path: '/admin',
      metadata: {
        category,
        updated_fields: Object.keys(settings),
        new_values: settings,
      },
      request,
    }).catch(() => {})

    return NextResponse.json({
      status: 200,
      message: `System settings category "${category}" updated successfully`,
      data: { category, value: settings },
    })
  } catch (err: any) {
    console.error('[Settings PATCH Catch]:', err)
    return NextResponse.json({ status: 500, error: err?.message || 'Internal Server Error' }, { status: 500 })
  }
}
