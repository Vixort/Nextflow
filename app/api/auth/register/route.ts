import { NextRequest, NextResponse } from 'next/server'
import { registerSchema } from '@/lib/validations/auth'
import { hashPassword } from '@/lib/auth/password'
import { signToken } from '@/lib/auth/jwt'
import { createAdminClient } from '@/lib/db/client'
import { logger } from '@/lib/logger'
import { getGeneralSettings, getSecuritySettings } from '@/lib/auth/securitySettings'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate Input
    const parseResult = registerSchema.safeParse(body)
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

    // Public registration can be disabled from admin Settings.
    const general = await getGeneralSettings()
    if (!general.public_registration) {
      return NextResponse.json(
        {
          status: 403,
          error: 'Registration is currently disabled',
          message: 'การสมัครสมาชิกถูกปิดชั่วคราว กรุณาติดต่อผู้ดูแลระบบ',
        },
        { status: 403 }
      )
    }

    const { email, username, password } = parseResult.data
    const supabase = createAdminClient()

    // Check Duplicate Email or Username
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email, username')
      .or(`email.eq.${email},username.eq.${username}`)
      .maybeSingle()

    if (existingUser) {
      const isEmailDup = existingUser.email === email
      return NextResponse.json(
        {
          status: 409,
          error: isEmailDup ? 'Email already in use' : 'Username already taken',
        },
        { status: 409 }
      )
    }

    // Hash Password with Bcrypt
    const passwordHash = await hashPassword(password)

    // Insert New User
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        username,
        password_hash: passwordHash,
        role: 'user', // always 'user' — admin roles are granted by admins only
      })
      .select('id, email, username, role, created_at')
      .single()

    if (insertError || !newUser) {
      logger.error('Failed to create user record', insertError)
      return NextResponse.json(
        { status: 500, error: 'Database error during registration' },
        { status: 500 }
      )
    }

    // Issue JWT Token (expiry follows System Settings → Security → Session Expiry)
    const security = await getSecuritySettings()
    const token = await signToken(
      {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
      },
      `${security.session_timeout_days}d`
    )

    const response = NextResponse.json(
      {
        status: 201,
        message: 'User registered successfully',
        data: {
          user: newUser,
          token,
        },
      },
      { status: 201 }
    )

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
    logger.error('Error in /api/auth/register', error)
    return NextResponse.json(
      { status: 500, error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
