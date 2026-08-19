import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth/jwt'
import { createAdminClient } from '@/lib/db/client'
import { comparePassword, hashPassword } from '@/lib/auth/password'
import { logActivity } from '@/lib/activity'

import { Database } from '@/types/supabase'

export async function GET(request: NextRequest) {
  const session = await getAuthSession(request)

  if (!session) {
    return NextResponse.json(
      { status: 401, error: 'Unauthorized. Token missing or invalid.' },
      { status: 401 }
    )
  }

  const supabase = createAdminClient()
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, username, full_name, avatar_url, role, created_at')
    .eq('id', session.id)
    .single()

  if (error || !user) {
    return NextResponse.json(
      { status: 404, error: 'User profile not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    status: 200,
    data: {
      user,
    },
  })
}

export async function PATCH(request: NextRequest) {
  const session = await getAuthSession(request)

  if (!session) {
    return NextResponse.json(
      { status: 401, error: 'Unauthorized. Token missing or invalid.' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { full_name, avatar_url, current_password, new_password } = body

    const updatePayload: Database['public']['Tables']['users']['Update'] = {}

    if (avatar_url !== undefined) {
      if (typeof avatar_url !== 'string') {
        return NextResponse.json({ status: 400, error: 'Invalid avatar_url' }, { status: 400 })
      }
      updatePayload.avatar_url = avatar_url
    }

    if (full_name !== undefined) {
      if (typeof full_name !== 'string') {
        return NextResponse.json({ status: 400, error: 'Invalid full_name' }, { status: 400 })
      }
      updatePayload.full_name = full_name
    }

    const supabase = createAdminClient()

    // Handle Password Change
    if (new_password) {
      if (!current_password) {
        return NextResponse.json({ status: 400, error: 'Current password is required to set a new password' }, { status: 400 })
      }

      if (new_password.length < 6) {
        return NextResponse.json({ status: 400, error: 'New password must be at least 6 characters' }, { status: 400 })
      }

      // Fetch user password_hash
      const { data: userWithPass, error: fetchErr } = await supabase
        .from('users')
        .select('password_hash')
        .eq('id', session.id)
        .single()

      if (fetchErr || !userWithPass) {
        return NextResponse.json({ status: 404, error: 'User not found' }, { status: 404 })
      }

      const isValid = await comparePassword(current_password, userWithPass.password_hash)
      if (!isValid) {
        return NextResponse.json({ status: 401, error: 'Incorrect current password' }, { status: 401 })
      }

      updatePayload.password_hash = await hashPassword(new_password)
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ status: 400, error: 'No fields to update' }, { status: 400 })
    }

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updatePayload)
      .eq('id', session.id)
      .select('id, email, username, full_name, avatar_url, role, created_at')
      .single()

    if (error || !updatedUser) {
      return NextResponse.json(
        { status: 500, error: 'Failed to update user profile' },
        { status: 500 }
      )
    }

    // Log Activity
    logActivity({
      userId: session.id,
      username: session.username,
      userRole: session.role,
      eventType: 'user.action',
      action: 'PROFILE_UPDATE',
      description: `User "${session.username}" updated their account profile settings`,
      path: '/settings',
      metadata: { updated_fields: Object.keys(updatePayload).filter(k => k !== 'password_hash') },
      request,
    }).catch(() => {})

    return NextResponse.json({
      status: 200,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
