'use server'

import { safeAction, ActionResult } from '@/lib/utils/actionHandler'
import { loginSchema, registerSchema, LoginInput, RegisterInput } from '@/lib/validations/auth'
import { hashPassword, comparePassword } from '@/lib/auth/password'
import { signToken } from '@/lib/auth/jwt'
import { createAdminClient } from '@/lib/supabase/admin'

export async function loginAction(input: LoginInput): Promise<ActionResult<{ user: any; token: string }>> {
  return safeAction('loginAction', loginSchema, input, async (validatedInput) => {
    const supabase = createAdminClient()

    const { data: user, error: queryError } = await supabase
      .from('users')
      .select('id, email, username, password_hash, role')
      .or(`email.eq.${validatedInput.account},username.eq.${validatedInput.account}`)
      .maybeSingle()

    if (queryError || !user) {
      throw new Error('Invalid username/email or password')
    }

    const isValid = await comparePassword(validatedInput.password, user.password_hash)
    if (!isValid) {
      throw new Error('Invalid username/email or password')
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    })

    return {
      user: { id: user.id, email: user.email, username: user.username, role: user.role },
      token,
    }
  })
}

export async function registerAction(input: RegisterInput): Promise<ActionResult<{ user: any; token: string }>> {
  return safeAction('registerAction', registerSchema, input, async (validatedInput) => {
    const supabase = createAdminClient()

    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email, username')
      .or(`email.eq.${validatedInput.email},username.eq.${validatedInput.username}`)
      .maybeSingle()

    if (existingUser) {
      const isEmailDup = existingUser.email === validatedInput.email
      throw new Error(isEmailDup ? 'Email already in use' : 'Username already taken')
    }

    const passwordHash = await hashPassword(validatedInput.password)

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email: validatedInput.email,
        username: validatedInput.username,
        password_hash: passwordHash,
        role: validatedInput.role,
      })
      .select('id, email, username, role, created_at')
      .single()

    if (insertError || !newUser) {
      throw new Error('Database error during user registration')
    }

    const token = await signToken({
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
    })

    return { user: newUser, token }
  })
}
