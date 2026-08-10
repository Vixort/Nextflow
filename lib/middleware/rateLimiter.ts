import { NextResponse, type NextRequest } from 'next/server'

interface RateLimitStore {
  count: number
  resetTime: number
}

// In-memory sliding window rate limiter
const ipStore = new Map<string, RateLimitStore>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [ip, store] of ipStore.entries()) {
    if (now > store.resetTime) {
      ipStore.delete(ip)
    }
  }
}, 5 * 60 * 1000)

export function rateLimiter(
  request: NextRequest,
  limit: number = 60, // Max requests
  windowMs: number = 60 * 1000 // Window time in ms (1 min)
): { success: boolean; response?: NextResponse } {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || 'anonymous'
  const now = Date.now()

  const currentStore = ipStore.get(ip)

  if (!currentStore || now > currentStore.resetTime) {
    ipStore.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    })
    return { success: true }
  }

  currentStore.count += 1

  if (currentStore.count > limit) {
    const retryAfter = Math.ceil((currentStore.resetTime - now) / 1000)
    return {
      success: false,
      response: new NextResponse(
        JSON.stringify({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(retryAfter),
          },
        }
      ),
    }
  }

  return { success: true }
}
