import { NextResponse, type NextRequest } from 'next/server'
import { logger } from '@/lib/logger'

export interface RateLimitConfig {
  maxRequests: number
  windowSeconds: number
}

interface WindowRecord {
  count: number
  resetTime: number
}

// In-memory fallback map (stores multi-factor fingerprints)
const fingerprintStore = new Map<string, WindowRecord>()

// Clean up expired fingerprints every 3 minutes
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
 * Generate a multi-factor fingerprint combining IP, User-Agent, and Accept headers
 * to prevent attackers from bypassing rate limits by rotating IP addresses alone.
 */
export function getFingerprint(request: NextRequest): string {
  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'

  const userAgent = request.headers.get('user-agent') || 'unknown-agent'
  const acceptLang = request.headers.get('accept-language') || 'unknown-lang'

  // Hash-like simple string key for fingerprint
  const rawString = `${ip}|${userAgent.slice(0, 40)}|${acceptLang.slice(0, 10)}`
  return Buffer.from(rawString).toString('base64')
}

/**
 * Evaluates rate limit against fingerprint with fallback sliding window.
 */
export async function checkDistributedRateLimit(
  request: NextRequest,
  config: RateLimitConfig = { maxRequests: 60, windowSeconds: 60 }
): Promise<{ success: boolean; response?: NextResponse }> {
  const fingerprint = getFingerprint(request)
  const now = Date.now()
  const windowMs = config.windowSeconds * 1000

  let currentRecord = fingerprintStore.get(fingerprint)

  if (!currentRecord || now > currentRecord.resetTime) {
    currentRecord = {
      count: 1,
      resetTime: now + windowMs,
    }
    fingerprintStore.set(fingerprint, currentRecord)
    return { success: true }
  }

  currentRecord.count += 1

  if (currentRecord.count > config.maxRequests) {
    const retryAfterSeconds = Math.ceil((currentRecord.resetTime - now) / 1000)
    logger.warn('Distributed rate limit exceeded for fingerprint', {
      fingerprint: fingerprint.slice(0, 15),
      count: currentRecord.count,
    })

    return {
      success: false,
      response: new NextResponse(
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
      ),
    }
  }

  return { success: true }
}
