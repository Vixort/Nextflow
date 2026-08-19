import { createAdminClient } from '@/lib/db/client'
import {
  DEFAULT_GENERAL,
  DEFAULT_TRAFFIC,
  type GeneralSettings,
  type TrafficSettings,
} from '@/lib/auth/securitySettings'

// ====================================================================
// TTL-cached runtime settings for middleware (edge runtime).
// Supabase reads are cached in-process for RUNTIME_TTL_MS so the edge
// hot path doesn't hit the DB on every request. Admin saves become
// visible within one TTL window (instantly in development).
// ====================================================================

export interface RuntimeSettings {
  maintenance_mode: boolean
  maintenance_message: string
  platform_name: string
  support_email: string
  rate_limit_enabled: boolean
  rate_limit_per_min: number
  payload_limit_mb: number
}

const RUNTIME_TTL_MS = 15_000

const DEFAULTS: RuntimeSettings = {
  maintenance_mode: DEFAULT_GENERAL.maintenance_mode,
  maintenance_message: DEFAULT_GENERAL.maintenance_message,
  platform_name: DEFAULT_GENERAL.platform_name,
  support_email: DEFAULT_GENERAL.support_email,
  rate_limit_enabled: DEFAULT_TRAFFIC.rate_limit_enabled,
  rate_limit_per_min: DEFAULT_TRAFFIC.rate_limit_per_min,
  payload_limit_mb: DEFAULT_TRAFFIC.payload_limit_mb,
}

let cache: { data: RuntimeSettings; expiresAt: number } | null = null

function merge(
  base: GeneralSettings,
  traffic: TrafficSettings
): RuntimeSettings {
  return {
    maintenance_mode: base.maintenance_mode,
    maintenance_message: base.maintenance_message,
    platform_name: base.platform_name,
    support_email: base.support_email,
    rate_limit_enabled: traffic.rate_limit_enabled,
    rate_limit_per_min: traffic.rate_limit_per_min,
    payload_limit_mb: traffic.payload_limit_mb,
  }
}

export async function getRuntimeSettings(): Promise<RuntimeSettings> {
  const now = Date.now()
  if (cache && cache.expiresAt > now) return cache.data

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('system_settings')
      .select('key, value')
      .in('key', ['general', 'traffic'])

    const raw: Record<string, Record<string, unknown>> = {}
    if (!error && data) {
      for (const row of data) {
        if (row.value && typeof row.value === 'object') {
          raw[row.key] = row.value as Record<string, unknown>
        }
      }
    }

    const general: GeneralSettings = { ...DEFAULT_GENERAL, ...(raw.general ?? {}) }
    const traffic: TrafficSettings = { ...DEFAULT_TRAFFIC, ...(raw.traffic ?? {}) }

    // Clamp values to sane ranges regardless of what's stored.
    general.platform_name =
      typeof general.platform_name === 'string' && general.platform_name.trim()
        ? general.platform_name.trim().slice(0, 60)
        : DEFAULT_GENERAL.platform_name
    general.support_email =
      typeof general.support_email === 'string' && general.support_email.includes('@')
        ? general.support_email.trim().slice(0, 120)
        : DEFAULT_GENERAL.support_email
    general.maintenance_message =
      typeof general.maintenance_message === 'string'
        ? general.maintenance_message.slice(0, 500)
        : DEFAULT_GENERAL.maintenance_message
    traffic.rate_limit_per_min =
      Number.isInteger(traffic.rate_limit_per_min) && traffic.rate_limit_per_min >= 1 && traffic.rate_limit_per_min <= 10000
        ? traffic.rate_limit_per_min
        : DEFAULT_TRAFFIC.rate_limit_per_min
    traffic.payload_limit_mb =
      Number.isFinite(traffic.payload_limit_mb) && traffic.payload_limit_mb >= 0.1 && traffic.payload_limit_mb <= 50
        ? traffic.payload_limit_mb
        : DEFAULT_TRAFFIC.payload_limit_mb

    // Skip caching in development so admin changes apply instantly.
    if (process.env.NODE_ENV !== 'development') {
      cache = { data: merge(general, traffic), expiresAt: now + RUNTIME_TTL_MS }
    }
    return merge(general, traffic)
  } catch {
    cache = { data: DEFAULTS, expiresAt: now + RUNTIME_TTL_MS }
    return DEFAULTS
  }
}