import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/db/client'
import { logger } from '@/lib/logger'
import { getRuntimeSettings } from '@/lib/settings/runtime'

export interface RateLimitConfig {
  maxRequests: number
  windowSeconds: number
}

// Per-endpoint limits (more specific prefixes must come first).
// The contact AI expander is the priciest public endpoint, so it gets
// its own strict window; login gets a tighter window too.
const ENDPOINT_LIMITS: (RateLimitConfig & { prefix: string })[] = [
  { prefix: '/api/contact/expand', maxRequests: 6, windowSeconds: 60 },
  { prefix: '/api/contact/track', maxRequests: 30, windowSeconds: 60 },
  { prefix: '/api/contact', maxRequests: 5, windowSeconds: 60 },
  { prefix: '/api/ai-chat', maxRequests: 20, windowSeconds: 60 },
  { prefix: '/api/auth/login', maxRequests: 10, windowSeconds: 60 },
].sort((a, b) => b.prefix.length - a.prefix.length)

const DEFAULT_LIMIT: RateLimitConfig = { maxRequests: 60, windowSeconds: 60 }

// The global default budget comes from System Settings → Traffic
// (rate_limit_per_min); per-endpoint strict rules above always win.
async function defaultLimitOverride(): Promise<number | null> {
  try {
    const runtime = await getRuntimeSettings()
    if (!runtime.rate_limit_enabled) return 0 // 0 = unlimited
    return runtime.rate_limit_per_min
  } catch {
    return null
  }
}

async function limitFor(pathname: string): Promise<RateLimitConfig & { prefix: string }> {
  for (const entry of ENDPOINT_LIMITS) {
    if (pathname.startsWith(entry.prefix)) return entry
  }
  const override = await defaultLimitOverride()
  if (override !== null) {
    return override === 0 ? { maxRequests: Number.MAX_SAFE_INTEGER, windowSeconds: 60, prefix: '' } : { maxRequests: override, windowSeconds: 60, prefix: '' }
  }
  return { ...DEFAULT_LIMIT, prefix: '' }
}

// In-memory fallback map — used only when the DB ticker is unreachable.
interface WindowRecord {
  count: number
  resetTime: number
}
const fingerprintStore = new Map<string, WindowRecord>()

if (typeof window === 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of fingerprintStore.entries()) {
      if (now > record.resetTime) {
        fingerprintStore.delete(key)
      }
    }
  }, 3 * 60 * 1000)
}

/**
 * Generate a multi-factor fingerprint combining IP, User-Agent, and Accept
 * headers to prevent attackers from bypassing rate limits by rotating IP
 * addresses alone.
 */
export function getFingerprint(request: NextRequest): string {
  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'

  const userAgent = request.headers.get('user-agent') || 'unknown-agent'
  const acceptLang = request.headers.get('accept-language') || 'unknown-lang'

  const rawString = `${ip}|${userAgent.slice(0, 40)}|${acceptLang.slice(0, 10)}`
  return Buffer.from(rawString).toString('base64')
}

function rejectResponse(config: RateLimitConfig, retryAfterSeconds: number): NextResponse {
  return new NextResponse(
    JSON.stringify({
      status: 429,
      error: 'Too Many Requests',
      message: `จำนวน Request เกินกำหนดชั่วคราว กรุณาลองใหม่อีกครั้งในอีก ${retryAfterSeconds} วินาที`,
      retryAfter: retryAfterSeconds,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfterSeconds),
        'X-RateLimit-Limit': String(config.maxRequests),
        'X-RateLimit-Remaining': '0',
      },
    }
  )
}

// DB-backed tick: atomic upsert on the rate_limits table so the counter
// is shared across serverless instances. Falls back to the in-memory map.
async function tickDb(request: NextRequest, config: RateLimitConfig): Promise<boolean> {
  try {
    const supabase = createAdminClient()
    const windowStart = new Date(
      Math.floor(Date.now() / (config.windowSeconds * 1000)) * config.windowSeconds * 1000
    ).toISOString()
    const { data, error } = await supabase.rpc('rate_limit_tick', {
      p_fingerprint: getFingerprint(request),
      p_endpoint: request.nextUrl.pathname,
      p_window_start: windowStart,
      p_max: config.maxRequests,
    })
    if (error) throw error
    return (data as number) <= config.maxRequests
  } catch (err) {
    logger.warn('Rate limit DB tick failed, using in-memory fallback', { error: err instanceof Error ? err.message : 'unknown' })
    return tickMemory(request, config)
  }
}

function tickMemory(request: NextRequest, config: RateLimitConfig): boolean {
  const fingerprint = getFingerprint(request)
  const now = Date.now()
  const windowMs = config.windowSeconds * 1000

  const currentRecord = fingerprintStore.get(fingerprint)

  if (!currentRecord || now > currentRecord.resetTime) {
    fingerprintStore.set(fingerprint, { count: 1, resetTime: now + windowMs })
    return true
  }

  currentRecord.count += 1
  return currentRecord.count <= config.maxRequests
}

/**
 * Evaluates the rate limit for the request against the endpoint's window.
 * Returns a 429 response once the budget is exceeded.
 */
export async function checkDistributedRateLimit(
  request: NextRequest
): Promise<{ success: boolean; response?: NextResponse }> {
  const active = await limitFor(request.nextUrl.pathname)
  const allowed = await tickDb(request, active)

  if (!allowed) {
    logger.warn('Rate limit exceeded', {
      endpoint: request.nextUrl.pathname,
      limit: active.maxRequests,
    })
    return { success: false, response: rejectResponse(active, active.windowSeconds) }
  }

  return { success: true }
}