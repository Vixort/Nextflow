import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/db/client'
import { getContactSettings } from '@/lib/contact/settings'
import { isValidSessionKey, sanitizeEvents, type SessionEvent } from '@/lib/contact/session'

export const dynamic = 'force-dynamic'

const trackSchema = z.object({
  sessionKey: z.string().min(1).max(80),
  events: z.array(z.record(z.string(), z.unknown())).max(50),
})

// Fire-and-forget append of form interaction events to a session log.
// Tracking is only accepted while the contact feature is enabled.
export async function POST(request: NextRequest) {
  try {
    const settings = await getContactSettings()
    if (!settings.enabled) {
      return NextResponse.json({ ok: false }, { status: 503 })
    }

    const body = await request.json().catch(() => null)
    const parsed = trackSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 })
    }

    if (!isValidSessionKey(parsed.data.sessionKey)) {
      return NextResponse.json({ ok: false, error: 'Invalid session key' }, { status: 400 })
    }

    const events = sanitizeEvents(parsed.data.events)
    if (events.length === 0) {
      return NextResponse.json({ ok: true })
    }

    const supabase = createAdminClient()
    const { data: existing } = await supabase
      .from('contact_sessions')
      .select('id, events')
      .eq('session_key', parsed.data.sessionKey)
      .maybeSingle()

    const merged: SessionEvent[] = existing?.events
      ? [...(existing.events as SessionEvent[]), ...events]
      : events
    const final = merged.slice(-200) // hard cap per session

    const upsert = await supabase.from('contact_sessions').upsert(
      {
        session_key: parsed.data.sessionKey,
        events: final,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'session_key' },
    )
    if (upsert.error) {
      console.warn('[Contact Track] persist failed:', upsert.error.message)
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.warn('[Contact Track]', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}