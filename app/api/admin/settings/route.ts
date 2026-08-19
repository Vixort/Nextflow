import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth/jwt'
import { createAdminClient } from '@/lib/db/client'
import { isAdminLevel } from '@/types/supabase'
import { logActivity } from '@/lib/activity'

// Default fallback settings
const DEFAULT_SETTINGS = {
  general: {
    platform_name: 'NEXTFLOW',
    support_email: 'support@nextflow.dev',
    maintenance_mode: false,
    maintenance_message: '',
    public_registration: true,
  },
  security: {
    session_timeout_days: 7,
    max_login_attempts: 5,
    lockout_minutes: 15,
  },
  traffic: {
    rate_limit_enabled: true,
    rate_limit_per_min: 60,
    payload_limit_mb: 1,
  },
}

// Every category only accepts its own keys — anything else is dropped.
const ALLOWED_KEYS: Record<string, string[]> = {
  general: ['platform_name', 'support_email', 'maintenance_mode', 'maintenance_message', 'public_registration'],
  security: ['session_timeout_days', 'max_login_attempts', 'lockout_minutes'],
  traffic: ['rate_limit_enabled', 'rate_limit_per_min', 'payload_limit_mb'],
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
        if (item.key in mergedSettings && item.value && typeof item.value === 'object') {
          // Keep only known keys for this category (drops dead/legacy fields).
          const allowed = ALLOWED_KEYS[item.key] ?? []
          const clean: Record<string, unknown> = {}
          for (const key of allowed) {
            if (key in (item.value as Record<string, unknown>)) clean[key] = (item.value as Record<string, unknown>)[key]
          }
          ;(mergedSettings as any)[item.key] = {
            ...(mergedSettings as any)[item.key],
            ...clean,
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
    const { action } = body

    // Special action: invalidate every issued session token.
    if (action === 'force-relogin') {
      const supabase = createAdminClient()
      const { data: affected, error } = await supabase.rpc('bump_token_versions')
      if (error) {
        console.error('[Settings Force Relogin Error]:', error)
        return NextResponse.json({ status: 500, error: 'Failed to revoke sessions' }, { status: 500 })
      }

      logActivity({
        userId: session.id,
        username: session.username,
        userRole: session.role,
        eventType: 'admin.action',
        action: 'FORCE_RELOGIN',
        description: `Admin "${session.username}" revoked all active sessions (${affected ?? 0} accounts)`,
        path: '/admin',
        metadata: { affected_accounts: affected ?? 0 },
        request,
      }).catch(() => {})

      return NextResponse.json({
        status: 200,
        message: `All active sessions revoked (${affected ?? 0} accounts). Every user must log in again.`,
        data: { affected: affected ?? 0 },
      })
    }

    const { category, settings } = body

    if (!category || !settings || typeof settings !== 'object') {
      return NextResponse.json({ status: 400, error: 'Invalid settings payload' }, { status: 400 })
    }

    if (!(category in ALLOWED_KEYS)) {
      return NextResponse.json({ status: 400, error: 'Invalid settings category' }, { status: 400 })
    }

    // Keep only known keys for this category (drops dead/legacy fields).
    const allowed = ALLOWED_KEYS[category]
    const clean: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in settings) clean[key] = (settings as Record<string, unknown>)[key]
    }

    const supabase = createAdminClient()

    // Upsert into system_settings table
    const { error } = await supabase
      .from('system_settings')
      .upsert(
        {
          key: category,
          value: clean,
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
