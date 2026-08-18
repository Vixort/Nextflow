// ====================================================================
// Contact session tracking: shared sanitization for the interaction
// trail a visitor leaves on the contact form (each pick + keystroke
// burst, capped aggressively). Server routes only.
// ====================================================================

// Fields the form may emit as events (whitelist — never accept more).
export const SESSION_TRACK_FIELDS = [
  'serviceType',
  'businessType',
  'budget',
  'channel',
  'name',
  'email',
  'phone',
  'message',
] as const

export type SessionTrackField = (typeof SESSION_TRACK_FIELDS)[number]

export interface SessionEvent {
  t: number // epoch ms when the event happened
  k: string // field key
  v: string // value (option label or typed text)
}

export const MAX_EVENTS_PER_REQUEST = 50
export const MAX_EVENTS_PER_SESSION = 200
export const MAX_EVENT_VALUE_LEN = 300

// Coerces unknown input into a clean, bounded event list.
export function sanitizeEvents(events: unknown): SessionEvent[] {
  if (!Array.isArray(events)) return []
  const out: SessionEvent[] = []
  for (const raw of events.slice(0, MAX_EVENTS_PER_REQUEST)) {
    const e = raw as Record<string, unknown> | null
    if (!e || typeof e !== 'object') continue
    const k = typeof e.k === 'string' ? e.k : ''
    const v = typeof e.v === 'string' ? e.v.trim().slice(0, MAX_EVENT_VALUE_LEN) : ''
    const t = typeof e.t === 'number' && Number.isFinite(e.t) ? Math.round(e.t) : Date.now()
    if (!SESSION_TRACK_FIELDS.includes(k as SessionTrackField)) continue
    if (!v) continue
    out.push({ t, k, v })
  }
  return out
}

// Last value seen per field in a session trail (for the admin transcript
// summary without reading the inquiry row).
export function lastValues(events: SessionEvent[]): Partial<Record<SessionTrackField, string>> {
  const out: Partial<Record<SessionTrackField, string>> = {}
  for (const e of events) out[e.k as SessionTrackField] = e.v
  return out
}

export function isValidSessionKey(key: unknown): key is string {
  return typeof key === 'string' && key.length > 0 && key.length <= 80
}