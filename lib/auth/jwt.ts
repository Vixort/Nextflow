import { SignJWT, jwtVerify } from 'jose'
import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { UserRole } from '@/types/supabase'

export interface JWTPayload {
  id: string
  email: string
  username: string
  role: UserRole
  tv: number // token_version — bumped to force re-login
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-jwt-key-nextflow-2026-secure-hash'
)

export async function signToken(
  payload: Omit<JWTPayload, 'tv'> & { tv?: number },
  expiresIn: string = '7d'
): Promise<string> {
  return new SignJWT({ ...payload, tv: payload.tv ?? 0 })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JWTPayload
  } catch (error) {
    return null
  }
}

// Checks the token's embedded token_version against the live users row.
// A mismatch (e.g. admin bumped the version to force re-login) rejects
// the session. Server-only; one indexed PK lookup per request.
export async function isTokenVersionValid(payload: JWTPayload): Promise<boolean> {
  if (typeof payload.tv !== 'number' || !payload.id) return false
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('users')
      .select('token_version')
      .eq('id', payload.id)
      .maybeSingle()
    if (!data) return false // user deleted
    return data.token_version === payload.tv
  } catch {
    return false
  }
}

export async function getAuthSession(request: NextRequest): Promise<JWTPayload | null> {
  // Check Authorization Header
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    const payload = await verifyToken(token)
    if (payload && (await isTokenVersionValid(payload))) return payload
    return null
  }

  // Check HTTP-Only Cookie
  const cookieToken = request.cookies.get('token')?.value
  if (cookieToken) {
    const payload = await verifyToken(cookieToken)
    if (payload && (await isTokenVersionValid(payload))) return payload
    return null
  }

  return null
}