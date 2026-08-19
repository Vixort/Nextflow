import { NextRequest, NextResponse } from 'next/server'
import { getServices, getServiceBySlug } from '@/lib/services/catalog'

export const dynamic = 'force-dynamic'

// ─── GET /api/services ───────────────────────────────────────────
// Public: active services for the /services grid (and Learn More pages).
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')

  try {
    if (slug) {
      const service = await getServiceBySlug(slug)
      if (!service) {
        return NextResponse.json({ status: 404, error: 'Service not found' }, { status: 404 })
      }
      return NextResponse.json({ status: 200, data: { service } })
    }
    const services = await getServices(true)
    return NextResponse.json({ status: 200, data: { services } })
  } catch (err) {
    return NextResponse.json(
      { status: 500, error: err instanceof Error ? err.message : 'Failed to fetch services' },
      { status: 500 }
    )
  }
}