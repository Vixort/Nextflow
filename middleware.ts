import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { checkDistributedRateLimit } from '@/lib/middleware/distributedRateLimiter'
import { checkPayloadSize } from '@/lib/utils/guard'

export async function middleware(request: NextRequest) {
  // 1. Check Payload Size Limit (Max 1MB for POST/PUT/PATCH API requests)
  // The template ZIP import endpoint is exempt (it delivers files up to its own limit).
  const isZipImport =
    request.nextUrl.pathname === '/api/admin/templates/import' &&
    request.method === 'POST'
  if (['POST', 'PUT', 'PATCH'].includes(request.method) && request.nextUrl.pathname.startsWith('/api') && !isZipImport) {
    const payloadCheck = checkPayloadSize(request, 1 * 1024 * 1024) // 1MB limit
    if (!payloadCheck.valid && payloadCheck.response) {
      return payloadCheck.response
    }
  }

  // 2. Apply Distributed Multi-factor Rate Limiting to API and Auth routes
  if (request.nextUrl.pathname.startsWith('/api') || request.nextUrl.pathname.startsWith('/auth')) {
    const limitResult = await checkDistributedRateLimit(request, {
      maxRequests: 60,
      windowSeconds: 60,
    })
    if (!limitResult.success && limitResult.response) {
      return limitResult.response
    }
  }

  // 3. Update Supabase Auth Session Cookies
  const { supabaseResponse } = await updateSession(request)
  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (.svg, .png, .jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
