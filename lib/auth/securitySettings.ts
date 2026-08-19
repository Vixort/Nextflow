import { createAdminClient } from '@/lib/supabase/admin'

// ====================================================================
// Reads the admin-editable settings from the system_settings KV rows.
// Server-only. getGeneralSettings / getSecuritySettings are used by
// API routes; getRuntimeSettings (lib/settings/runtime.ts) is the
// TTL-cached variant used by middleware (edge).
// ====================================================================

export interface GeneralSettings {
  platform_name: string
  support_email: string
  maintenance_mode: boolean
  maintenance_message: string
  public_registration: boolean
}

export interface SecuritySettings {
  session_timeout_days: number
  max_login_attempts: number
  lockout_minutes: number
}

export interface TrafficSettings {
  rate_limit_enabled: boolean
  rate_limit_per_min: number
  payload_limit_mb: number
}

export const DEFAULT_GENERAL: GeneralSettings = {
  platform_name: 'NEXTFLOW',
  support_email: 'support@nextflow.dev',
  maintenance_mode: false,
  maintenance_message: '',
  public_registration: true,
}

export const DEFAULT_SECURITY: SecuritySettings = {
  session_timeout_days: 7,
  max_login_attempts: 5,
  lockout_minutes: 15,
}

export const DEFAULT_TRAFFIC: TrafficSettings = {
  rate_limit_enabled: true,
  rate_limit_per_min: 60,
  payload_limit_mb: 1,
}

async function readSetting(key: string): Promise<Record<string, unknown>> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle()
    if (data?.value && typeof data.value === 'object') {
      return data.value as Record<string, unknown>
    }
  } catch {
    // fall through to defaults
  }
  return {}
}

export async function getGeneralSettings(): Promise<GeneralSettings> {
  const raw = await readSetting('general')
  return {
    platform_name: typeof raw.platform_name === 'string' ? raw.platform_name : DEFAULT_GENERAL.platform_name,
    support_email: typeof raw.support_email === 'string' ? raw.support_email : DEFAULT_GENERAL.support_email,
    maintenance_mode: typeof raw.maintenance_mode === 'boolean' ? raw.maintenance_mode : DEFAULT_GENERAL.maintenance_mode,
    maintenance_message:
      typeof raw.maintenance_message === 'string' ? raw.maintenance_message : DEFAULT_GENERAL.maintenance_message,
    public_registration:
      typeof raw.public_registration === 'boolean' ? raw.public_registration : DEFAULT_GENERAL.public_registration,
  }
}

export async function getSecuritySettings(): Promise<SecuritySettings> {
  const raw = await readSetting('security')
  const attempts = Number(raw.max_login_attempts)
  const days = Number(raw.session_timeout_days)
  const minutes = Number(raw.lockout_minutes)
  return {
    session_timeout_days: Number.isInteger(days) && days >= 1 && days <= 365 ? days : DEFAULT_SECURITY.session_timeout_days,
    max_login_attempts:
      Number.isInteger(attempts) && attempts >= 1 && attempts <= 20 ? attempts : DEFAULT_SECURITY.max_login_attempts,
    lockout_minutes:
      Number.isInteger(minutes) && minutes >= 1 && minutes <= 1440 ? minutes : DEFAULT_SECURITY.lockout_minutes,
  }
}

export async function getTrafficSettings(): Promise<TrafficSettings> {
  const raw = await readSetting('traffic')
  const perMin = Number(raw.rate_limit_per_min)
  const mb = Number(raw.payload_limit_mb)
  return {
    rate_limit_enabled:
      typeof raw.rate_limit_enabled === 'boolean' ? raw.rate_limit_enabled : DEFAULT_TRAFFIC.rate_limit_enabled,
    rate_limit_per_min:
      Number.isInteger(perMin) && perMin >= 1 && perMin <= 10000 ? perMin : DEFAULT_TRAFFIC.rate_limit_per_min,
    payload_limit_mb: Number.isFinite(mb) && mb >= 0.1 && mb <= 50 ? mb : DEFAULT_TRAFFIC.payload_limit_mb,
  }
}