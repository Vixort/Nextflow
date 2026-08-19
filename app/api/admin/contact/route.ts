import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthSession } from '@/lib/auth/jwt'
import { isAdminLevel, type Json } from '@/types/supabase'
import { createAdminClient } from '@/lib/db/client'
import { logActivity } from '@/lib/activity'
import {
  getContactSettings,
  mergeContactSettings,
  sweepExpiredSessions,
  clearAllSessions,
} from '@/lib/contact/settings'

export const dynamic = 'force-dynamic'

const optionList = z
  .array(z.string().trim().min(1).max(60))
  .min(2)
  .max(30)
  .refine((arr) => new Set(arr).size === arr.length, { message: 'Options must be unique' })

const contentSchema = z.object({
  heading: z.string().max(200),
  heading_accent: z.string().max(200),
  intro: z.string().max(1000),
  success_title: z.string().max(200),
  success_text: z.string().max(1000),
  closed_title: z.string().max(200),
  closed_text: z.string().max(1000),
  submit_label: z.string().max(60),
  show_phone: z.boolean(),
  show_message: z.boolean(),
  services: optionList,
  business_types: optionList,
  budgets: optionList,
  channels: optionList,
})

const patchSchema = z.object({
  enabled: z.boolean().optional(),
  retention_days: z.number().int().min(1).max(365).optional(),
  content: contentSchema.partial().optional(),
})
const clearSchema = z.object({ action: z.literal('clear-all') })

// ─── GET: settings + inquiries + session logs (with retention sweep) ──
export async function GET(request: NextRequest) {
  const session = await getAuthSession(request)
  if (!session || !isAdminLevel(session.role)) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    await sweepExpiredSessions()
    const settings = await getContactSettings()
    const supabase = createAdminClient()

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const [inquiriesRes, sessionsRes, countsRes, todayRes] = await Promise.all([
      supabase
        .from('inquiries')
        .select('id, name, email, phone, service_type, business_type, budget, channel, message, status, created_at')
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('contact_sessions')
        .select('id, session_key, inquiry_id, events, name, email, service_type, budget, channel, started_at, updated_at, submitted_at')
        .order('started_at', { ascending: false })
        .limit(50),
      supabase.from('contact_sessions').select('id', { count: 'exact', head: true }),
      supabase.from('inquiries').select('id', { count: 'exact', head: true }).gte('created_at', startOfDay.toISOString()),
    ])

    return NextResponse.json({
      data: {
        settings,
        inquiries: inquiriesRes.data || [],
        sessions: sessionsRes.data || [],
        counts: {
          sessions: countsRes.count ?? 0,
          inquiriesToday: todayRes.count ?? 0,
        },
      },
    })
  } catch (err) {
    console.error('[Admin Contact GET]', err)
    return NextResponse.json({ error: 'Failed to load contact settings' }, { status: 500 })
  }
}

// ─── PATCH: save settings · DELETE: clear all session logs ───────────
export async function PATCH(request: NextRequest) {
  const session = await getAuthSession(request)
  if (!session || !isAdminLevel(session.role)) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const body = await request.json().catch(() => null)
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid payload' },
        { status: 400 },
      )
    }

    const supabase = createAdminClient()
    const existing = await getContactSettings()
    const merged = mergeContactSettings({
      ...existing,
      ...parsed.data,
      content: parsed.data.content
        ? { ...existing.content, ...parsed.data.content }
        : existing.content,
    })
    const { error } = await supabase.from('system_settings').upsert(
      {
        key: 'contact',
        value: merged as unknown as Json,
        updated_by: session.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' },
    )
    if (error) throw error

    logActivity({
      userId: session.id,
      username: session.username,
      userRole: session.role,
      eventType: 'admin.action',
      action: 'CONTACT_SETTINGS_UPDATE',
      description: `Admin "${session.username}" updated contact page settings`,
      path: '/admin',
      metadata: {
        enabled: merged.enabled,
        retention_days: merged.retention_days,
        content_fields: Object.keys(parsed.data.content ?? {}),
      },
      request,
    }).catch(() => {})

    return NextResponse.json({ data: { settings: merged } })
  } catch (err) {
    console.error('[Admin Contact PATCH]', err)
    return NextResponse.json({ error: 'Failed to save contact settings' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getAuthSession(request)
  if (!session || !isAdminLevel(session.role)) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const body = await request.json().catch(() => null)
    const parsed = clearSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const deleted = await clearAllSessions()

    logActivity({
      userId: session.id,
      username: session.username,
      userRole: session.role,
      eventType: 'admin.action',
      action: 'CONTACT_LOGS_CLEARED',
      description: `Admin "${session.username}" cleared all contact session logs (${deleted} rows)`,
      path: '/admin',
      metadata: { deleted },
      request,
    }).catch(() => {})

    return NextResponse.json({ data: { deleted } })
  } catch (err) {
    console.error('[Admin Contact DELETE]', err)
    return NextResponse.json({ error: 'Failed to clear contact logs' }, { status: 500 })
  }
}