import { SignJWT, jwtVerify } from 'jose'
import { NextRequest } from 'next/server'
import type { UserRole } from '@/types/supabase'

export interface JWTPayload {
  id: string
  email: string
  username: string
  role: UserRole
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-jwt-key-nextflow-2026-secure-hash'
)

export async function signToken(payload: JWTPayload, expiresIn: string = '7d'): Promise<string> {
  return new SignJWT({ ...payload })
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

export async function getAuthSession(request: NextRequest): Promise<JWTPayload | null> {
  // Check Authorization Header
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    return verifyToken(token)
  }

  // Check HTTP-Only Cookie
  const cookieToken = request.cookies.get('token')?.value
  if (cookieToken) {
    return verifyToken(cookieToken)
  }

  return null
}
