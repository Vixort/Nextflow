import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth/jwt'
import { createAdminClient } from '@/lib/db/client'
import { outranks, isAdminLevel } from '@/types/supabase'
import type { UserRole, Database } from '@/types/supabase'
import { logActivity } from '@/lib/activity'

const VALID_ROLES: UserRole[] = ['owner', 'admin', 'moderator', 'user']

type UserUpdatePayload = Database['public']['Tables']['users']['Update']

/**
 * PATCH /api/admin/users/[id]
 * Update a user's role or profile.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: targetUserId } = await params
  const session = await getAuthSession(request)

  if (!session || !isAdminLevel(session.role)) {
    return NextResponse.json({ status: 403, error: 'Forbidden' }, { status: 403 })
  }

  if (session.id === targetUserId) {
    return NextResponse.json({ status: 400, error: 'Cannot modify your own account through this endpoint. Use /settings instead.' }, { status: 400 })
  }

  const body = await request.json()
  const { role: newRole, full_name } = body

  const supabase = createAdminClient()

  const { data: targetUser, error: fetchError } = await supabase
    .from('users')
    .select('id, role, username, email')
    .eq('id', targetUserId)
    .single()

  if (fetchError || !targetUser) {
    return NextResponse.json({ status: 404, error: 'User not found' }, { status: 404 })
  }

  const callerRole = session.role as UserRole
  const targetCurrentRole = targetUser.role as UserRole

  if (!outranks(callerRole, targetCurrentRole)) {
    return NextResponse.json({
      status: 403,
      error: `You cannot manage a user with role "${targetCurrentRole}". Your role "${callerRole}" does not outrank it.`
    }, { status: 403 })
  }

  const updateData: UserUpdatePayload = {}

  if (newRole !== undefined) {
    if (!VALID_ROLES.includes(newRole)) {
      return NextResponse.json({ status: 400, error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` }, { status: 400 })
    }

    if (!outranks(callerRole, newRole as UserRole)) {
      return NextResponse.json({
        status: 403,
        error: `You cannot assign the role "${newRole}". You can only assign roles lower than "${callerRole}".`
      }, { status: 403 })
    }

    updateData.role = newRole
  }

  if (full_name !== undefined) {
    updateData.full_name = full_name
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ status: 400, error: 'No valid fields to update' }, { status: 400 })
  }

  const { data: updatedUser, error: updateError } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', targetUserId)
    .select('id, email, username, full_name, avatar_url, role, created_at, updated_at')
    .single()

  if (updateError || !updatedUser) {
    return NextResponse.json({ status: 500, error: 'Failed to update user' }, { status: 500 })
  }

  // Log admin action
  await logActivity({
    userId: session.id,
    username: session.username,
    userRole: session.role,
    eventType: 'admin.action',
    action: 'ROLE_UPDATE',
    description: `Admin "${session.username}" [${session.role}] changed user "${targetUser.username}" role from [${targetUser.role}] to [${newRole || targetUser.role}]`,
    path: '/admin',
    metadata: {
      target_user_id: targetUserId,
      target_username: targetUser.username,
      old_role: targetUser.role,
      new_role: newRole,
      updated_fields: Object.keys(updateData),
    },
    request,
  })

  return NextResponse.json({ status: 200, data: { user: updatedUser } })
}

/**
 * DELETE /api/admin/users/[id]
 * Delete a user account.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: targetUserId } = await params
  const session = await getAuthSession(request)

  if (!session || !isAdminLevel(session.role)) {
    return NextResponse.json({ status: 403, error: 'Forbidden' }, { status: 403 })
  }

  if (session.id === targetUserId) {
    return NextResponse.json({ status: 400, error: 'Cannot delete your own account' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: targetUser, error } = await supabase
    .from('users')
    .select('id, role, username')
    .eq('id', targetUserId)
    .single()

  if (error || !targetUser) {
    return NextResponse.json({ status: 404, error: 'User not found' }, { status: 404 })
  }

  const callerRole = session.role as UserRole
  const targetRole = targetUser.role as UserRole

  if (!outranks(callerRole, targetRole)) {
    return NextResponse.json({
      status: 403,
      error: `Cannot delete a "${targetRole}" user. Your role "${callerRole}" does not outrank it.`
    }, { status: 403 })
  }

  const { error: deleteError } = await supabase
    .from('users')
    .delete()
    .eq('id', targetUserId)

  if (deleteError) {
    return NextResponse.json({ status: 500, error: 'Failed to delete user' }, { status: 500 })
  }

  // Log admin action
  await logActivity({
    userId: session.id,
    username: session.username,
    userRole: session.role,
    eventType: 'admin.action',
    action: 'USER_DELETE',
    description: `Admin "${session.username}" [${session.role}] deleted user account "${targetUser.username}" [${targetRole}]`,
    path: '/admin',
    metadata: {
      deleted_user_id: targetUserId,
      deleted_username: targetUser.username,
      deleted_role: targetRole,
    },
    request,
  })

  return NextResponse.json({ status: 200, message: `User "${targetUser.username}" has been deleted.` })
}
