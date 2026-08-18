import { createAdminClient } from '@/lib/supabase/admin'
import { getEnv } from '@/lib/env'
import type { AiKeyRow, AiProviderId, AiSettings } from './types'

// Defaults mirror supabase/schema.sql seed for the 'ai' system_settings row.
const DEFAULT_SETTINGS: AiSettings = {
  enabled: true,
  contact_enabled: true,
  require_login: true,
  contact_key_id: null,
  prompts: {
    template_filter: null,
    template_pick: null,
    template_build: null,
    static_copy: null,
    contact_expand: null,
  },
}

export const AI_PROVIDERS: { id: AiProviderId; label: string; baseUrl?: string; isCustom?: boolean }[] = [
  { id: 'gemini', label: 'Gemini' },
  { id: 'openrouter', label: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1' },
  { id: 'openai', label: 'OpenAI (ChatGPT)', baseUrl: 'https://api.openai.com/v1' },
  { id: 'groq', label: 'Groq', baseUrl: 'https://api.groq.com/openai/v1' },
  { id: 'custom', label: 'Custom (OpenAI-compatible)', isCustom: true },
]

function mergeSettings(raw: unknown): AiSettings {
  const obj = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const s = structuredClone(DEFAULT_SETTINGS)

  if (typeof obj.enabled === 'boolean') s.enabled = obj.enabled
  if (typeof obj.contact_enabled === 'boolean') s.contact_enabled = obj.contact_enabled
  if (typeof obj.require_login === 'boolean') s.require_login = obj.require_login
  if (typeof obj.contact_key_id === 'string' && obj.contact_key_id) s.contact_key_id = obj.contact_key_id

  const prompts = (obj.prompts as Record<string, unknown>) || {}
  for (const k of Object.keys(s.prompts)) {
    const value = typeof prompts[k] === 'string' ? (prompts[k] as string) : null
    s.prompts[k as keyof typeof s.prompts] = value
  }

  return s
}

// Loads the AI settings row (toggles/prompts/models) plus all API keys
// ordered by priority (position ASC). Server-only; requires service role.
export async function getAiSettings(): Promise<{ settings: AiSettings; keys: AiKeyRow[] }> {
  const supabase = createAdminClient()

  const [settingsRes, keysRes] = await Promise.all([
    supabase.from('system_settings').select('value').eq('key', 'ai').maybeSingle(),
    supabase
      .from('ai_api_keys')
      .select('id, provider, label, key_value, position, enabled, model, base_url, created_at')
      .order('position', { ascending: true }),
  ])

  const keys: AiKeyRow[] = (keysRes.data || []).map((k) => ({
    id: k.id,
    provider: k.provider,
    label: k.label || '',
    key_value: k.key_value,
    position: k.position ?? 0,
    enabled: k.enabled ?? true,
    model: k.model || null,
    base_url: k.base_url || null,
  }))

  return { settings: mergeSettings(settingsRes.data?.value), keys }
}

// Masked view for the admin UI: never ship full keys back to the browser.
export function maskKey(key: string): string {
  if (!key) return ''
  if (key.length <= 8) return '••••'
  return `••••••••${key.slice(-4)}`
}

// A persisted key can be saved from the admin UI with a masked value meaning
// "keep the existing secret". Resolves the final secret for storage.
export function resolveKeySecret(existing: string | undefined, incoming: string): string {
  if (!incoming || incoming.startsWith('•')) return existing || ''
  return incoming.trim()
}

// Picks the effective key pool for a request context.
//   - contact: dedicated contact_key_id first, then fall back to the
//     priority-ordered pool (contact must work without login).
//   - templates: the whole priority-ordered pool.
export function pickKeyPool(
  settings: AiSettings,
  keys: AiKeyRow[],
  context: 'templates' | 'contact',
): AiKeyRow[] {
  const usable = keys.filter((k) => k.enabled && k.key_value.trim().length > 0)

  if (context === 'contact' && settings.contact_key_id) {
    const dedicated = usable.find((k) => k.id === settings.contact_key_id)
    if (dedicated) return [dedicated]
  }

  return usable
}

// Fallback key from env (backward compat when no DB keys exist yet).
export function envFallbackKeys(): AiKeyRow[] {
  const env = getEnv()
  if (!env.GEMINI_API_KEY) return []
  return [
    {
      id: 'env-gemini',
      provider: 'gemini',
      label: 'ENV GEMINI_API_KEY',
      key_value: env.GEMINI_API_KEY,
      position: -1,
      enabled: true,
      model: null,
      base_url: null,
    },
  ]
}