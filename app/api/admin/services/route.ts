import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthSession } from '@/lib/auth/jwt'
import { isAdminLevel } from '@/types/supabase'
import { createAdminClient } from '@/lib/db/client'
import { logActivity } from '@/lib/activity'
import {
  getServices,
  createService,
  updateService,
  deleteService,
  slugify,
} from '@/lib/services/catalog'
import { SERVICE_TYPES } from '@/lib/validations/contact'

export const dynamic = 'force-dynamic'

const stringList = z.array(z.string().trim().min(1).max(200)).max(30)

const serviceSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(160).optional(),
  icon: z.string().trim().min(1).max(60).default('Globe'),
  color: z.string().trim().min(1).max(120).default('from-cyan-400 to-blue-600'),
  description: z.string().trim().max(2000),
  features: stringList.default([]),
  outcome: z.string().trim().max(2000),
  deliverables: stringList.default([]),
  best_for: stringList.default([]),
  timeline: z.string().trim().max(200),
  contact_service: z
    .enum(SERVICE_TYPES, { message: 'Contact service must be one of the selectable options' })
    .default('Something else'),
  sort_order: z.number().int().min(0).max(9999).optional(),
  is_active: z.boolean().default(true),
})

const updateSchema = z
  .object({
    title: z.string().trim().min(2).max(120),
    slug: z.string().trim().min(2).max(160),
    icon: z.string().trim().min(1).max(60),
    color: z.string().trim().min(1).max(120),
    description: z.string().trim().max(2000),
    features: stringList,
    outcome: z.string().trim().max(2000),
    deliverables: stringList,
    best_for: stringList,
    timeline: z.string().trim().max(200),
    contact_service: z.enum(SERVICE_TYPES, { message: 'Contact service must be one of the selectable options' }),
    sort_order: z.number().int().min(0).max(9999),
    is_active: z.boolean(),
  })
  .partial()

function errorResponse(status: number, message: string, details?: unknown) {
  return NextResponse.json({ status, error: message, details }, { status })
}

// ─── GET /api/admin/services ─────────────────────────────────────
export async function GET(request: NextRequest) {
  const session = await getAuthSession(request)
  if (!session || !isAdminLevel(session.role)) return errorResponse(403, 'Admin access required')

  try {
    const services = await getServices(false)
    return NextResponse.json({ status: 200, data: { services } })
  } catch (err) {
    return errorResponse(500, err instanceof Error ? err.message : 'Failed to fetch services')
  }
}

// ─── POST /api/admin/services ────────────────────────────────────
export async function POST(request: NextRequest) {
  const session = await getAuthSession(request)
  if (!session || !isAdminLevel(session.role)) return errorResponse(403, 'Admin access required')

  try {
    const raw = await request.json()
    const parsed = serviceSchema.safeParse(raw)
    if (!parsed.success) return errorResponse(400, 'Validation Error', parsed.error.flatten().fieldErrors)

    const input = parsed.data
    // Auto-slug when omitted; ensure uniqueness.
    const slug = input.slug ?? slugify(input.title)
    if (!slug) return errorResponse(400, 'Could not generate a slug — provide one explicitly')

    const supabase = createAdminClient()
    const { data: existing } = await supabase.from('services').select('id').eq('slug', slug).maybeSingle()
    if (existing) return errorResponse(409, `Slug "${slug}" is already in use`)

    const sortOrder = input.sort_order ?? Date.now()

    const service = await createService({
      title: input.title,
      slug,
      icon: input.icon,
      color: input.color,
      description: input.description,
      features: input.features,
      outcome: input.outcome,
      deliverables: input.deliverables,
      best_for: input.best_for,
      timeline: input.timeline,
      contact_service: input.contact_service,
      sort_order: sortOrder,
      is_active: input.is_active,
    })

    logActivity({
      userId: session.id,
      username: session.username,
      userRole: session.role,
      eventType: 'admin.action',
      action: 'SERVICE_CREATE',
      description: `Admin "${session.username}" created service "${service.title}"`,
      path: '/admin',
      metadata: { service_id: service.id, slug: service.slug },
      request,
    }).catch(() => {})

    return NextResponse.json({ status: 201, data: { service } })
  } catch (err) {
    return errorResponse(500, err instanceof Error ? err.message : 'Failed to create service')
  }
}

// ─── PATCH /api/admin/services?id=... ────────────────────────────
export async function PATCH(request: NextRequest) {
  const session = await getAuthSession(request)
  if (!session || !isAdminLevel(session.role)) return errorResponse(403, 'Admin access required')

  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) return errorResponse(400, 'Missing service id')

    const raw = await request.json()
    const parsed = updateSchema.safeParse(raw)
    if (!parsed.success) return errorResponse(400, 'Validation Error', parsed.error.flatten().fieldErrors)

    const input = parsed.data
    if (input.slug) {
      const supabase = createAdminClient()
      const { data: dup } = await supabase
        .from('services')
        .select('id')
        .eq('slug', input.slug)
        .neq('id', id)
        .maybeSingle()
      if (dup) return errorResponse(409, `Slug "${input.slug}" is already in use`)
    }

    const service = await updateService(id, input)

    logActivity({
      userId: session.id,
      username: session.username,
      userRole: session.role,
      eventType: 'admin.action',
      action: 'SERVICE_UPDATE',
      description: `Admin "${session.username}" updated service "${service.title}"`,
      path: '/admin',
      metadata: { service_id: id, updated_fields: Object.keys(input) },
      request,
    }).catch(() => {})

    return NextResponse.json({ status: 200, data: { service } })
  } catch (err) {
    return errorResponse(500, err instanceof Error ? err.message : 'Failed to update service')
  }
}

// ─── DELETE /api/admin/services?id=... ───────────────────────────
export async function DELETE(request: NextRequest) {
  const session = await getAuthSession(request)
  if (!session || !isAdminLevel(session.role)) return errorResponse(403, 'Admin access required')

  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) return errorResponse(400, 'Missing service id')

    await deleteService(id)

    logActivity({
      userId: session.id,
      username: session.username,
      userRole: session.role,
      eventType: 'admin.action',
      action: 'SERVICE_DELETE',
      description: `Admin "${session.username}" deleted service (id: ${id})`,
      path: '/admin',
      metadata: { service_id: id },
      request,
    }).catch(() => {})

    return NextResponse.json({ status: 200, message: 'Service deleted' })
  } catch (err) {
    return errorResponse(500, err instanceof Error ? err.message : 'Failed to delete service')
  }
}