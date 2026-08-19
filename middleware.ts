import { NextResponse, type NextRequest } from 'next/server'
import { checkDistributedRateLimit } from '@/lib/middleware/distributedRateLimiter'
import { checkPayloadSize } from '@/lib/utils/guard'
import { getRuntimeSettings } from '@/lib/settings/runtime'
import { verifyToken } from '@/lib/auth/jwt'
import { isAdminLevel } from '@/types/supabase'

// ====================================================================
// Middleware — edge runtime.
// 1. Maintenance mode (admin sessions bypass)
// 2. Payload size limit (configurable via System Settings → Traffic)
// 3. Distributed rate limiting for /api and /auth
// Runtime settings are read through a 15s TTL cache, so admin changes
// take effect within seconds (instantly in dev).
// ====================================================================

function maintenancePageHtml(platformName: string, message: string, supportEmail: string): NextResponse {
  const body = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${platformName} — Maintenance</title>
  <style>
    body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: #09090b; color: #e2e8f0; font-family: ui-sans-serif, system-ui, sans-serif; }
    .card { text-align: center; padding: 3rem 2rem; max-width: 480px; }
    .badge { display: inline-flex; align-items: center; gap: .5rem; padding: .35rem .9rem; border-radius: 999px;
      background: rgba(6,182,212,.1); border: 1px solid rgba(6,182,212,.3); color: #67e8f9;
      font-size: .7rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; }
    .dot { width: .45rem; height: .45rem; border-radius: 999px; background: #22d3ee; animation: pulse 1.4s infinite; }
    @keyframes pulse { 50% { opacity: .3; } }
    h1 { margin: 1.5rem 0 .75rem; font-size: 2.2rem; font-weight: 900; color: #fff; letter-spacing: -.03em; }
    p { color: #94a3b8; font-size: .95rem; line-height: 1.6; margin: 0; }
    a { color: #22d3ee; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge"><span class="dot"></span>Maintenance</span>
    <h1>We'll be right back</h1>
    <p>${message || `${platformName} is undergoing scheduled maintenance. Please check back shortly.`}</p>
    ${supportEmail ? `<p style="margin-top:1.2rem;font-size:.8rem;">Questions? <a href="mailto:${supportEmail}">${supportEmail}</a></p>` : ''}
  </div>
</body>
</html>`
  return new NextResponse(body, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': '300',
      'Cache-Control': 'no-store',
    },
  })
}

function maintenanceJson(): NextResponse {
  return NextResponse.json(
    { status: 503, error: 'Service Unavailable', message: 'System is under maintenance. Please try again later.' },
    { status: 503 }
  )
}

async function isAdminRequest(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return false
  try {
    const payload = await verifyToken(token)
    return !!payload && isAdminLevel(payload.role)
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  // 1. Maintenance mode — blocks every route for non-admin users.
  // Admin sessions bypass so the dashboard stays reachable during updates.
  const runtime = await getRuntimeSettings()

  if (runtime.maintenance_mode && !(await isAdminRequest(request))) {
    if (request.nextUrl.pathname.startsWith('/api') || request.nextUrl.pathname.startsWith('/auth')) {
      return maintenanceJson()
    }
    return maintenancePageHtml(runtime.platform_name, runtime.maintenance_message, runtime.support_email)
  }

  // 2. Check Payload Size Limit (configurable, default 1MB for POST/PUT/PATCH API requests)
  // The template ZIP import endpoint is exempt (it delivers files up to its own limit).
  const isZipImport =
    request.nextUrl.pathname === '/api/admin/templates/import' &&
    request.method === 'POST'
  if (['POST', 'PUT', 'PATCH'].includes(request.method) && request.nextUrl.pathname.startsWith('/api') && !isZipImport) {
    const payloadCheck = checkPayloadSize(request, runtime.payload_limit_mb * 1024 * 1024)
    if (!payloadCheck.valid && payloadCheck.response) {
      return payloadCheck.response
    }
  }

  // 3. Apply Distributed Rate Limiting to API and Auth routes.
  // Per-endpoint windows live in the rate limiter config (e.g. the
  // public contact-AI expander gets a strict 6/min budget). Counters
  // are DB-backed (shared across serverless instances).
  if (request.nextUrl.pathname.startsWith('/api') || request.nextUrl.pathname.startsWith('/auth')) {
    const limitResult = await checkDistributedRateLimit(request)
    if (!limitResult.success && limitResult.response) {
      return limitResult.response
    }
  }

  return NextResponse.next()
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