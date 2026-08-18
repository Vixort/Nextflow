import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthSession } from '@/lib/auth/jwt'
import { logActivity } from '@/lib/activity'
import { assertTemplateProject } from '@/lib/puck/project'
import { mergeStoredTemplate } from '@/lib/puck/textMerge'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Json } from '@/types/supabase'

const templatePatchSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(1_000).nullable().optional(),
  category: z.string().trim().min(1).max(80).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
  thumbnail_url: z.string().url().max(2_000).nullable().optional(),
  puck_data: z.unknown().optional(),
  puck_layout: z.unknown().optional(),
  puck_texts: z.unknown().optional(),
  global_css: z.string().max(50_000).optional(),
  is_active: z.boolean().optional(),
}).refine((value) => Object.keys(value).length > 0, 'No fields to update')

function isEditor(role: string): boolean { return role === 'owner' || role === 'admin' }

export async function GET(request: NextRequest, context: RouteContext<'/api/admin/templates/[id]'>) {
  const session = await getAuthSession(request)
  if (!session || !isEditor(session.role)) return NextResponse.json({ status: 403, error: 'Forbidden' }, { status: 403 })
  const { id } = await context.params
  const { data, error } = await createAdminClient().from('website_templates').select('*').eq('id', id).single()
  if (error || !data) return NextResponse.json({ status: 404, error: 'Template not found' }, { status: 404 })
  const { merged } = mergeStoredTemplate(data)
  return NextResponse.json({ status: 200, data: { template: { ...data, puck_data: merged } } })
}

export async function PATCH(request: NextRequest, context: RouteContext<'/api/admin/templates/[id]'>) {
  const session = await getAuthSession(request)
  if (!session || !isEditor(session.role)) return NextResponse.json({ status: 403, error: 'Forbidden' }, { status: 403 })
  const parsed = templatePatchSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ status: 400, error: 'Invalid template payload', details: parsed.error.flatten() }, { status: 400 })
  const { id } = await context.params
  let puckData = parsed.data.puck_data
  if (puckData !== undefined) {
    try {
      puckData = assertTemplateProject(puckData)
    } catch (err) {
      return NextResponse.json({
        status: 400,
        error: 'Invalid Puck project JSON',
        details: err instanceof Error ? err.message : String(err)
      }, { status: 400 })
    }
  }

  const isUuid = typeof session.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(session.id)
  const validUserId = isUuid ? session.id : null

  const updateFields = {
    name: parsed.data.name,
    description: parsed.data.description,
    category: parsed.data.category,
    tags: parsed.data.tags,
    thumbnail_url: parsed.data.thumbnail_url,
    global_css: parsed.data.global_css,
    is_active: parsed.data.is_active,
    updated_by: validUserId,
    ...(puckData !== undefined ? { puck_data: puckData as Json } : {}),
    ...(parsed.data.puck_layout !== undefined ? { puck_layout: parsed.data.puck_layout as Json } : {}),
    ...(parsed.data.puck_texts !== undefined ? { puck_texts: parsed.data.puck_texts as Json } : {}),
  }

  const { data, error } = await createAdminClient()
    .from('website_templates')
    .update(updateFields)
    .eq('id', id)
    .select('*')
    .single()

  if (error || !data) {
    console.error('Failed to update website_template:', error)
    return NextResponse.json({
      status: 500,
      error: error?.message || 'Failed to save template',
      details: error?.details || error?.hint || null
    }, { status: 500 })
  }

  void logActivity({ userId: session.id, username: session.username, userRole: session.role, eventType: 'admin.action', action: 'SAVE_PUCK_TEMPLATE', description: `Saved Puck template "${data.name}"`, path: '/admin', metadata: { template_id: id }, request })
  return NextResponse.json({ status: 200, data: { template: data } })
}

export async function DELETE(request: NextRequest, context: RouteContext<'/api/admin/templates/[id]'>) {
  const session = await getAuthSession(request)
  if (!session || !isEditor(session.role)) return NextResponse.json({ status: 403, error: 'Forbidden' }, { status: 403 })
  const { id } = await context.params

  const supabase = createAdminClient()

  // For static templates, remove their storage assets first.
  const { data: existing } = await supabase
    .from('website_templates')
    .select('storage_path, render_mode')
    .eq('id', id)
    .single()

  if (existing?.render_mode === 'static' && existing.storage_path) {
    try {
      await supabase
        .storage
        .from('template-assets')
        .remove([`${existing.storage_path}/`])
    } catch (err) {
      console.warn('Failed to remove template storage assets on delete:', err)
    }
  }

  const { error } = await supabase.from('website_templates').delete().eq('id', id)
  if (error) return NextResponse.json({ status: 500, error: 'Failed to delete template' }, { status: 500 })
  return NextResponse.json({ status: 200, data: { id } })
}
