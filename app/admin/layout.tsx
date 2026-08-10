import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/auth/jwt'
import { isAdminLevel } from '@/types/supabase'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect('/login')
  }

  const payload = await verifyToken(token)

  // Only owner and admin can access admin dashboard
  if (!payload || !isAdminLevel(payload.role)) {
    redirect('/')
  }

  return <>{children}</>
}
