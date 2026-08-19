import { NextRequest, NextResponse } from 'next/server'
import { loginSchema } from '@/lib/validations/auth'
import { comparePassword } from '@/lib/auth/password'
import { signToken } from '@/lib/auth/jwt'
import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'
import { logActivity } from '@/lib/activity'
import { checkLockout, registerFailure, clearFailures } from '@/lib/auth/lockout'
import { getSecuritySettings } from '@/lib/auth/securitySettings'

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate Input
    const parseResult = loginSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json(
        {
          status: 400,
          error: 'Validation Error',
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { account, password } = parseResult.data
    const ip = clientIp(request)

    // Lockout pre-check (failed attempts from this IP+account).
    const lockCheck = await checkLockout(ip, account)
    if (lockCheck.locked) {
      return NextResponse.json(
        {
          status: 423,
          error: 'Too many failed attempts — account temporarily locked',
          retryAfter: lockCheck.retryAfterSeconds,
        },
        {
          status: 423,
          headers: { 'Retry-After': String(lockCheck.retryAfterSeconds) },
        }
      )
    }

    const supabase = createAdminClient()

    // Query User by Username or Email
    const { data: user, error: queryError } = await supabase
      .from('users')
      .select('id, email, username, password_hash, role, token_version')
      .or(`email.eq.${account},username.eq.${account}`)
      .maybeSingle()

    if (queryError || !user) {
      // Log failed login attempt
      await registerFailure(ip, account)
      await logActivity({
        eventType: 'auth.login',
        action: 'LOGIN_FAILED',
        description: `Failed login attempt for account "${account}" (User not found)`,
        path: '/login',
        request,
      })

      return NextResponse.json(
        { status: 401, error: 'Invalid username/email or password' },
        { status: 401 }
      )
    }

    // Verify Password Hash with Bcrypt
    const isPasswordValid = await comparePassword(password, user.password_hash)
    if (!isPasswordValid) {
      // Log failed password attempt
      const { newlyLocked } = await registerFailure(ip, account)
      await logActivity({
        userId: user.id,
        username: user.username,
        userRole: user.role,
        eventType: 'auth.login',
        action: 'LOGIN_FAILED',
        description: newlyLocked
          ? `Login locked for "${user.username}" after repeated failures`
          : `Failed login attempt for user "${user.username}" (Incorrect password)`,
        path: '/login',
        request,
      })

      return NextResponse.json(
        { status: 401, error: 'Invalid username/email or password' },
        { status: 401 }
      )
    }

    await clearFailures(ip, account)

    // Issue JWT Token (embeds the current token_version; expiry follows
    // System Settings → Security → Session Expiry)
    const security = await getSecuritySettings()
    const token = await signToken(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        tv: user.token_version,
      },
      `${security.session_timeout_days}d`
    )

    const userProfile = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    }

    // Log successful login
    await logActivity({
      userId: user.id,
      username: user.username,
      userRole: user.role,
      eventType: 'auth.login',
      action: 'LOGIN_SUCCESS',
      description: `User "${user.username}" logged in successfully as [${user.role.toUpperCase()}]`,
      path: '/login',
      toPath: user.role === 'admin' || user.role === 'owner' ? '/admin' : '/',
      metadata: { account, role: user.role },
      request,
    })

    const response = NextResponse.json({
      status: 200,
      message: 'Login successful',
      data: {
        user: userProfile,
        token,
      },
    })

    // Set HTTP-Only Cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return response
  } catch (error: any) {
    logger.error('Error in /api/auth/login', error)
    return NextResponse.json(
      { status: 500, error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
