import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({
    status: 200,
    message: 'Logged out successfully',
  })

  // Clear HTTP-Only Cookie
  response.cookies.set('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  })

  return response
}
