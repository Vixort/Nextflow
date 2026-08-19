import { createAdminClient } from '@/lib/db/client'
import {
  SERVICE_TYPES,
  BUSINESS_TYPES,
  BUDGETS,
  CHANNELS,
  type OptionKey,
  type ContactContent,
} from '@/lib/validations/contact'

// ====================================================================
// Contact page feature settings + session-log helpers.
//
// Settings live in the system_settings KV row 'contact' (mirrors the
// 'ai' pattern): toggles, retention window and all editable copy +
// form options. Session logs live in contact_sessions (service role
// only) and are auto-purged by pg_cron + a lazy sweep.
// ====================================================================

export interface ContactSettings {
  enabled: boolean
  retention_days: number
  content: ContactContent
}

export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  enabled: true,
  retention_days: 15,
  content: {
    heading: 'Tell us what you need.',
    heading_accent: "We'll do the rest.",
    intro:
      'A few quick choices — no long forms, no hassle. Every inquiry goes straight to our engineering inbox.',
    success_title: 'Message received!',
    success_text:
      "Thanks {name} — we've got your {service} inquiry and will get back to you within 1–2 business days.",
    closed_title: "We're not accepting new inquiries right now",
    closed_text:
      "We'll be back soon — please check again later. You can still email us directly at support@nextflow.dev.",
    submit_label: 'Send inquiry',
    show_phone: true,
    show_message: true,
    services: [...SERVICE_TYPES],
    business_types: [...BUSINESS_TYPES],
    budgets: [...BUDGETS],
    channels: [...CHANNELS],
  },
}

const TEXT_FIELDS: { [K in keyof ContactContent]: ContactContent[K] extends string ? K : never }[keyof ContactContent][] = [
  'heading',
  'heading_accent',
  'intro',
  'success_title',
  'success_text',
  'closed_title',
  'closed_text',
  'submit_label',
]

const OPTION_FIELDS: OptionKey[] = ['services', 'business_types', 'budgets', 'channels']

function pickStrings(value: unknown, fallback: string[], max = 30): string[] {
  if (!Array.isArray(value) || value.length === 0) return fallback
  const cleaned = value
    .filter((v): v is string => typeof v === 'string')
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, max)
  return cleaned.length > 0 ? cleaned : fallback
}

function mergeContent(raw: unknown): ContactContent {
  const obj = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const c = structuredClone(DEFAULT_CONTACT_SETTINGS.content)

  for (const field of TEXT_FIELDS) {
    if (typeof obj[field] === 'string') {
      c[field] = (obj[field] as string).trim()
    }
  }
  if (typeof obj.show_phone === 'boolean') c.show_phone = obj.show_phone
  if (typeof obj.show_message === 'boolean') c.show_message = obj.show_message
  for (const key of OPTION_FIELDS) {
    c[key] = pickStrings(obj[key], c[key])
  }
  return c
}

export function mergeContactSettings(raw: unknown): ContactSettings {
  const obj = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const s = structuredClone(DEFAULT_CONTACT_SETTINGS)
  if (typeof obj.enabled === 'boolean') s.enabled = obj.enabled
  const days = Number(obj.retention_days)
  if (Number.isInteger(days) && days >= 1 && days <= 365) s.retention_days = days
  s.content = mergeContent(obj.content)
  return s
}

// Loads the contact settings row. Server-only; requires service role.
export async function getContactSettings(): Promise<ContactSettings> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('system_settings')
    .select('value')
    .eq('key', 'contact')
    .maybeSingle()
  return mergeContactSettings(data?.value)
}

// Lazily purges session logs older than the configured retention window.
// pg_cron runs the same cleanup nightly; this sweep covers dev/stale cases.
export async function sweepExpiredSessions(): Promise<number> {
  const settings = await getContactSettings()
  const cutoff = new Date(Date.now() - settings.retention_days * 24 * 60 * 60 * 1000).toISOString()
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('contact_sessions')
      .delete()
      .lt('started_at', cutoff)
      .select('id')
    if (error) {
      console.warn('[Contact] retention sweep failed:', error.message)
      return 0
    }
    return data?.length || 0
  } catch (err) {
    console.warn('[Contact] retention sweep threw:', err)
    return 0
  }
}

// Deletes every contact session log (inquiries/leads are kept).
export async function clearAllSessions(): Promise<number> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('contact_sessions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
      .select('id')
    if (error) throw error
    return data?.length || 0
  } catch (err) {
    console.warn('[Contact] clear-all failed:', err)
    return 0
  }
}