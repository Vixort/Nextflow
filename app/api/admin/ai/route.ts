import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthSession } from '@/lib/auth/jwt'
import { isAdminLevel } from '@/types/supabase'
import { createAdminClient } from '@/lib/db/client'
import { getAiSettings, maskKey, resolveKeySecret, envFallbackKeys } from '@/lib/ai'

export const dynamic = 'force-dynamic'

const PROVIDER_IDS = ['gemini', 'openrouter', 'openai', 'groq', 'custom'] as const

// Groups raw log modes into the four feature families the admin dashboard
// reports on (chat / /build / static editor / contact AI).
const MODE_GROUP: Record<string, 'chat' | 'build' | 'static' | 'contact' | 'other'> = {
  filter: 'chat',
  build: 'build',
  'build-pick': 'build',
  static: 'static',
  expand: 'contact',
  polish: 'contact',
  concise: 'contact',
}

interface WeekSlot {
  date: string
  label: string
  requests: number
  errors: number
  byMode: Record<'chat' | 'build' | 'static' | 'contact' | 'other', number>
}

// Aggregates the last 7 days (UTC): per-day stacked-by-mode columns plus
// totals grouped by command family, provider and user.
function buildWeekAnalytics(rows: {
  username: string | null
  provider: string
  mode: string | null
  prompt_tokens: number | null
  completion_tokens: number | null
  error: string | null
  created_at: string
}[]) {
  const since = new Date()
  since.setDate(since.getDate() - 6)
  since.setHours(0, 0, 0, 0)

  const emptyModes = (): Record<'chat' | 'build' | 'static' | 'contact' | 'other', number> => ({
    chat: 0,
    build: 0,
    static: 0,
    contact: 0,
    other: 0,
  })

  const byDay: WeekSlot[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(since)
    d.setDate(since.getDate() + i)
    return {
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en', { weekday: 'short' }),
      requests: 0,
      errors: 0,
      byMode: emptyModes(),
    }
  })
  const dayIndex = new Map(byDay.map((s, i) => [s.date, i]))

  const byMode = new Map<string, { mode: string; requests: number; errors: number }>()
  const byProvider = new Map<string, { provider: string; requests: number; tokens: number }>()
  const byUser = new Map<string, { user: string; requests: number; tokens: number; errors: number }>()

  for (const r of rows) {
    const mode = MODE_GROUP[r.mode || ''] || 'other'
    const tokens = (r.prompt_tokens || 0) + (r.completion_tokens || 0)

    const idx = r.created_at ? dayIndex.get(r.created_at.slice(0, 10)) : undefined
    if (idx !== undefined) {
      const slot = byDay[idx]
      slot.requests += 1
      slot.byMode[mode] += 1
      if (r.error) slot.errors += 1
    }

    let m = byMode.get(mode)
    if (!m) {
      m = { mode, requests: 0, errors: 0 }
      byMode.set(mode, m)
    }
    m.requests += 1
    if (r.error) m.errors += 1

    const provider = r.provider || 'unknown'
    const p = byProvider.get(provider) || { provider, requests: 0, tokens: 0 }
    p.requests += 1
    p.tokens += tokens
    byProvider.set(provider, p)

    const user = r.username || 'anonymous'
    const u = byUser.get(user) || { user, requests: 0, tokens: 0, errors: 0 }
    u.requests += 1
    u.tokens += tokens
    if (r.error) u.errors += 1
    byUser.set(user, u)
  }

  const totalRequests = byDay.reduce((sum, s) => sum + s.requests, 0)
  const totalErrors = byDay.reduce((sum, s) => sum + s.errors, 0)

  return {
    byDay,
    byMode: [...byMode.values()].sort((a, b) => b.requests - a.requests),
    byProvider: [...byProvider.values()].sort((a, b) => b.requests - a.requests),
    byUser: [...byUser.values()].sort((a, b) => b.requests - a.requests),
    totalRequests,
    totalErrors,
    contactRequests: byMode.get('contact')?.requests ?? 0,
    buildRequests: byMode.get('build')?.requests ?? 0,
  }
}

// ─── GET: settings + masked keys + today usage + recent logs ──────────
export async function GET(request: NextRequest) {
  const session = await getAuthSession(request)
  if (!session || !isAdminLevel(session.role)) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const { settings, keys } = await getAiSettings()
    const supabase = createAdminClient()

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const since = new Date()
    since.setDate(since.getDate() - 6)
    since.setHours(0, 0, 0, 0)

    const [usageRes, logsRes, weekRes] = await Promise.all([
      supabase
        .from('ai_chat_logs')
        .select('provider, prompt_tokens, completion_tokens, user_id, username, mode, error, created_at')
        .gte('created_at', startOfDay.toISOString()),
      supabase
        .from('ai_chat_logs')
        .select('id, username, provider, model, mode, prompt, response, prompt_tokens, completion_tokens, ip_address, duration_ms, error, created_at')
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('ai_chat_logs')
        .select('username, provider, mode, prompt_tokens, completion_tokens, error, created_at')
        .gte('created_at', since.toISOString()),
    ])

    const rows = usageRes.data || []
    const byUser = new Map<string, { user: string; requests: number; tokens: number; errors: number }>()
    const byProvider = new Map<string, { provider: string; requests: number; tokens: number }>()
    let totalTokens = 0

    for (const r of rows) {
      const user = r.username || (r.user_id ? 'user' : 'anonymous')
      const u = byUser.get(user) || { user, requests: 0, tokens: 0, errors: 0 }
      u.requests += 1
      u.tokens += (r.prompt_tokens || 0) + (r.completion_tokens || 0)
      if (r.error) u.errors += 1
      byUser.set(user, u)

      const p = byProvider.get(r.provider) || { provider: r.provider, requests: 0, tokens: 0 }
      p.requests += 1
      p.tokens += (r.prompt_tokens || 0) + (r.completion_tokens || 0)
      byProvider.set(r.provider, p)

      totalTokens += (r.prompt_tokens || 0) + (r.completion_tokens || 0)
    }

    return NextResponse.json({
      data: {
        settings,
        keys: keys.map((k) => ({ ...k, key_value: maskKey(k.key_value) })),
        envFallbackEnabled: envFallbackKeys().length > 0,
        usage: {
          totalRequests: rows.length,
          totalTokens,
          byUser: [...byUser.values()].sort((a, b) => b.requests - a.requests),
          byProvider: [...byProvider.values()].sort((a, b) => b.requests - a.requests),
        },
        analytics: buildWeekAnalytics((weekRes.data || []) as unknown as Parameters<typeof buildWeekAnalytics>[0]),
        logs: logsRes.data || [],
      },
    })
  } catch (error: unknown) {
    console.error('[Admin AI GET]', error)
    return NextResponse.json({ error: 'Failed to load AI settings' }, { status: 500 })
  }
}

// ─── PATCH: save core settings or replace the key pool ────────────────
const coreSchema = z.object({
  enabled: z.boolean(),
  contact_enabled: z.boolean(),
  require_login: z.boolean(),
  contact_key_id: z.union([z.string(), z.null()]).optional(),
  prompts: z.record(z.string(), z.union([z.string(), z.null()])),
})

const keyItemSchema = z.object({
  id: z.string().optional(),
  provider: z.enum(PROVIDER_IDS),
  label: z.string().max(80).default(''),
  key_value: z.string().max(600),
  enabled: z.boolean().default(true),
  model: z.string().max(200).optional().nullable(),
  base_url: z.string().max(500).optional().nullable(),
})

const patchSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('save-core'), value: coreSchema }),
  z.object({ action: z.literal('save-keys'), value: z.array(keyItemSchema).max(30) }),
])

export async function PATCH(request: NextRequest) {
  const session = await getAuthSession(request)
  if (!session || !isAdminLevel(session.role)) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid payload' },
        { status: 400 },
      )
    }

    const supabase = createAdminClient()

    if (parsed.data.action === 'save-core') {
      const { error } = await supabase.from('system_settings').upsert(
        {
          key: 'ai',
          value: {
            enabled: parsed.data.value.enabled,
            contact_enabled: parsed.data.value.contact_enabled,
            require_login: parsed.data.value.require_login,
            contact_key_id: parsed.data.value.contact_key_id ?? null,
            prompts: parsed.data.value.prompts,
          },
          updated_by: session.id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' },
      )
      if (error) throw error

      const { settings, keys } = await getAiSettings()
      return NextResponse.json({
        data: {
          settings,
          keys: keys.map((k) => ({ ...k, key_value: maskKey(k.key_value) })),
        },
      })
    }

    // save-keys: the UI submits the full ordered list; anything not included
    // is deleted. Masked values (starting with •) keep the existing secret.
    const items = parsed.data.value
    const existingRes = await supabase
      .from('ai_api_keys')
      .select('id, key_value')
    const existing = new Map((existingRes.data || []).map((k) => [k.id, k.key_value]))

    const keptIds: string[] = []
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const secret = resolveKeySecret(item.id ? existing.get(item.id) : undefined, item.key_value)
      if (!secret) continue

      if (item.id && existing.has(item.id)) {
        // Keep the original id so the contact_key_id reference stays valid.
        const { data, error } = await supabase
          .from('ai_api_keys')
          .update({
            provider: item.provider,
            label: item.label,
            key_value: secret,
            position: i,
            enabled: item.enabled,
            model: item.model || null,
            base_url: item.base_url || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.id)
          .select('id')
        if (error) throw error
        if (data?.[0]?.id) keptIds.push(data[0].id)
      } else {
        const { data, error } = await supabase
          .from('ai_api_keys')
          .insert({
            provider: item.provider,
            label: item.label,
            key_value: secret,
            position: i,
            enabled: item.enabled,
            model: item.model || null,
            base_url: item.base_url || null,
          })
          .select('id')
        if (error) throw error
        if (data?.[0]?.id) keptIds.push(data[0].id)
      }
    }

    const missing = [...existing.keys()].filter((id) => !keptIds.includes(id))
    if (missing.length > 0) {
      await supabase.from('ai_api_keys').delete().in('id', missing)
    }

    const { settings, keys } = await getAiSettings()
    return NextResponse.json({
      data: {
        settings,
        keys: keys.map((k) => ({ ...k, key_value: maskKey(k.key_value) })),
      },
    })
  } catch (error: unknown) {
    console.error('[Admin AI PATCH]', error)
    return NextResponse.json({ error: 'Failed to save AI settings' }, { status: 500 })
  }
}