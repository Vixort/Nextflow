import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthSession } from '@/lib/auth/jwt'
import { logActivity } from '@/lib/activity'
import { assertTemplateProject, createEmptyTemplateProject } from '@/lib/puck/project'
import { createAdminClient } from '@/lib/supabase/admin'

const templateInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(1_000).optional().default(''),
  category: z.string().trim().min(1).max(80).optional().default('Landing Page'),
  thumbnail_url: z.string().url().max(2_000).optional().nullable(),
  puck_data: z.unknown().optional(),
  global_css: z.string().max(50_000).optional().default(''),
})

function isEditor(role: string): boolean {
  return role === 'owner' || role === 'admin'
}

export async function GET(request: NextRequest) {
  const session = await getAuthSession(request)
  if (!session || !isEditor(session.role)) return NextResponse.json({ status: 403, error: 'Forbidden' }, { status: 403 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('website_templates')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) return NextResponse.json({ status: 500, error: 'Failed to fetch templates' }, { status: 500 })
  return NextResponse.json({ status: 200, data: { templates: data } })
}

export async function POST(request: NextRequest) {
  const session = await getAuthSession(request)
  if (!session || !isEditor(session.role)) return NextResponse.json({ status: 403, error: 'Forbidden' }, { status: 403 })

  const parsed = templateInputSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ status: 400, error: 'Invalid template payload', details: parsed.error.flatten() }, { status: 400 })

  const input = parsed.data
  let project
  try {
    project = input.puck_data ? assertTemplateProject(input.puck_data) : createEmptyTemplateProject(input.name)
  } catch (err) {
    return NextResponse.json({
      status: 400,
      error: 'Invalid Puck project JSON',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 400 })
  }

  // Validate session.id as UUID format to avoid Postgres 23503 foreign key violation
  const isUuid = typeof session.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(session.id)
  const validUserId = isUuid ? session.id : null

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('website_templates')
    .insert({
      name: input.name,
      description: input.description || null,
      category: input.category,
      thumbnail_url: input.thumbnail_url ?? null,
      puck_data: project,
      global_css: input.global_css,
      is_active: true,
      created_by: validUserId,
      updated_by: validUserId,
    })
    .select('*')
    .single()

  if (error || !data) {
    console.error('Failed to insert website_template:', error)
    return NextResponse.json({
      status: 500,
      error: error?.message || 'Failed to create template',
      details: error?.details || error?.hint || null
    }, { status: 500 })
  }

  void logActivity({ userId: session.id, username: session.username, userRole: session.role, eventType: 'admin.action', action: 'CREATE_PUCK_TEMPLATE', description: `Created Puck template "${data.name}"`, path: '/admin', metadata: { template_id: data.id }, request })
  return NextResponse.json({ status: 201, data: { template: data } })
}
