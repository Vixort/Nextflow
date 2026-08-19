import { createAdminClient } from '@/lib/db/client'
import { getSecuritySettings } from '@/lib/auth/securitySettings'
import { logger } from '@/lib/logger'

// ====================================================================
// Failed-login lockout: counts failures per (IP + account) in the
// auth_lockouts table (service role only). When a key crosses the
// configured max_login_attempts it is locked for a fixed window.
// ====================================================================

export const LOCK_WINDOW_MINUTES = 15

export interface LockoutCheck {
  locked: boolean
  retryAfterSeconds: number
}

function lockKey(ip: string, account: string): string {
  return `${ip.slice(0, 64)}|${account.slice(0, 64)}`
}

// Pre-check before attempting a login. Returns locked=true while the
// window is active. Locked keys with failed_count below the threshold
// simply continue to count.
export async function checkLockout(ip: string, account: string): Promise<LockoutCheck> {
  try {
    const settings = await getSecuritySettings()
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('auth_lockouts')
      .select('locked_until')
      .eq('lock_key', lockKey(ip, account))
      .maybeSingle()
    if (data?.locked_until) {
      const remaining = new Date(data.locked_until).getTime() - Date.now()
      if (remaining > 0) {
        return { locked: true, retryAfterSeconds: Math.ceil(remaining / 1000) }
      }
    }
  } catch {
    // fail open — rate limiting still applies
  }
  return { locked: false, retryAfterSeconds: 0 }
}

export interface FailureResult {
  newlyLocked: boolean
  lockedUntil: string | null
}

// Records one failed attempt. Returns newlyLocked when the key crossed
// the threshold. Automatically clears stale lockouts on the next attempt.
export async function registerFailure(ip: string, account: string): Promise<FailureResult> {
  try {
    const settings = await getSecuritySettings()
    const supabase = createAdminClient()
    const key = lockKey(ip, account)

    const { data: existing, error: readErr } = await supabase
      .from('auth_lockouts')
      .select('failed_count, locked_until, last_fail_at')
      .eq('lock_key', key)
      .maybeSingle()
    if (readErr) logger.warn('[lockout] read failed', { error: readErr.message, key })

    let failedCount = 1
    if (existing) {
      // An expired lockout restarts the counter; otherwise keep counting up.
      const lockExpired = existing.locked_until && new Date(existing.locked_until).getTime() <= Date.now()
      failedCount = lockExpired ? 1 : (existing.failed_count ?? 0) + 1
    }

    const newlyLocked = failedCount >= settings.max_login_attempts
    const lockWindowMinutes = Number.isInteger(settings.lockout_minutes) && settings.lockout_minutes >= 1
      ? settings.lockout_minutes
      : LOCK_WINDOW_MINUTES
    const lockedUntil = newlyLocked
      ? new Date(Date.now() + lockWindowMinutes * 60_000).toISOString()
      : null

    const { error: writeErr } = await supabase.from('auth_lockouts').upsert(
      {
        lock_key: key,
        failed_count: failedCount,
        locked_until: lockedUntil,
        last_fail_at: new Date().toISOString(),
      },
      { onConflict: 'lock_key' },
    )
    if (writeErr) logger.warn('[lockout] write failed', { error: writeErr.message, code: writeErr.code, key })

    return { newlyLocked, lockedUntil }
  } catch {
    return { newlyLocked: false, lockedUntil: null }
  }
}

// Called after a successful login for that key.
export async function clearFailures(ip: string, account: string): Promise<void> {
  try {
    const supabase = createAdminClient()
    await supabase.from('auth_lockouts').delete().eq('lock_key', lockKey(ip, account))
  } catch {
    // non-fatal
  }
}