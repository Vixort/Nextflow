import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthSession } from '@/lib/auth/jwt'
import { isAdminLevel } from '@/types/supabase'
import { createAdminClient } from '@/lib/db/client'
import { logActivity } from '@/lib/activity'

const tagInputSchema = z.object({
  name: z.string().trim().min(1).max(40).refine((v) => !v.includes(','), {
    message: 'Tag name cannot contain commas',
  }),
  group: z.string().trim().max(60).optional(),
})

/**
 * GET /api/admin/tags
 * Returns template tags grouped by group (presets first, then custom).
 */
export async function GET(request: NextRequest) {
  const session = await getAuthSession(request)
  if (!session || !isAdminLevel(session.role)) {
    return NextResponse.json({ status: 403, error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('template_tags')
    .select('id, name, group_name, is_preset')
    .order('is_preset', { ascending: false })
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ status: 500, error: 'Failed to fetch tags' }, { status: 500 })
  }

  const presetTags = (data ?? []).filter((t) => t.is_preset)
  const customTags = (data ?? []).filter((t) => !t.is_preset)

  const groups: { group: string; tags: string[] }[] = []
  for (const tag of presetTags) {
    const group = tag.group_name || 'Other'
    let entry = groups.find((g) => g.group === group)
    if (!entry) {
      entry = { group, tags: [] }
      groups.push(entry)
    }
    entry.tags.push(tag.name)
  }

  return NextResponse.json({
    status: 200,
    data: { groups, custom: customTags.map((t) => t.name) },
  })
}

/**
 * POST /api/admin/tags
 * Add a new custom tag (for new tones, themes, etc).
 */
export async function POST(request: NextRequest) {
  const session = await getAuthSession(request)
  if (!session || !isAdminLevel(session.role)) {
    return NextResponse.json({ status: 403, error: 'Forbidden' }, { status: 403 })
  }

  const parsed = tagInputSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { status: 400, error: 'Invalid tag', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { name, group } = parsed.data
  const supabase = createAdminClient()

  const { data: existing } = await supabase
    .from('template_tags')
    .select('id, name')
    .eq('name', name)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ status: 409, error: `Tag "${name}" already exists` }, { status: 409 })
  }

  const { data: tag, error } = await supabase
    .from('template_tags')
    .insert({ name, group_name: group || null, is_preset: false })
    .select('id, name, group_name, is_preset')
    .single()

  if (error || !tag) {
    return NextResponse.json({ status: 500, error: 'Failed to create tag' }, { status: 500 })
  }

  void logActivity({
    userId: session.id,
    username: session.username,
    userRole: session.role,
    eventType: 'admin.action',
    action: 'TAG_CREATE',
    description: `Admin "${session.username}" created template tag "${name}"`,
    path: '/admin',
    metadata: { tag_id: tag.id, tag_name: name, tag_group: group || null },
    request,
  })

  return NextResponse.json({ status: 201, data: { tag } })
}

/**
 * DELETE /api/admin/tags?id=...
 * Delete a custom tag (presets are managed in code/seed and cannot be removed).
 */
export async function DELETE(request: NextRequest) {
  const session = await getAuthSession(request)
  if (!session || !isAdminLevel(session.role)) {
    return NextResponse.json({ status: 403, error: 'Forbidden' }, { status: 403 })
  }

  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ status: 400, error: 'Missing tag id' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: tag } = await supabase
    .from('template_tags')
    .select('id, name, is_preset')
    .eq('id', id)
    .maybeSingle()

  if (!tag) {
    return NextResponse.json({ status: 404, error: 'Tag not found' }, { status: 404 })
  }

  if (tag.is_preset) {
    return NextResponse.json(
      { status: 400, error: `"${tag.name}" is a preset tag and cannot be deleted` },
      { status: 400 }
    )
  }

  const { error } = await supabase.from('template_tags').delete().eq('id', id)
  if (error) {
    return NextResponse.json({ status: 500, error: 'Failed to delete tag' }, { status: 500 })
  }

  void logActivity({
    userId: session.id,
    username: session.username,
    userRole: session.role,
    eventType: 'admin.action',
    action: 'TAG_DELETE',
    description: `Admin "${session.username}" deleted template tag "${tag.name}"`,
    path: '/admin',
    metadata: { tag_id: id, tag_name: tag.name },
    request,
  })

  return NextResponse.json({ status: 200, message: `Tag "${tag.name}" deleted` })
}
