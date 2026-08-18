import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth/jwt'
import { createAdminClient } from '@/lib/supabase/admin'
import { logActivity } from '@/lib/activity'

export const DEFAULT_HOME_SECTIONS = [
  { id: 'hero', name: 'Cinematic Hero Banner', type: 'builtin', section_order: 1, visible: true, is_builtin: true, custom_data: {} },
  { id: 'manifesto', name: 'Manifesto Statement', type: 'builtin', section_order: 2, visible: true, is_builtin: true, custom_data: {} },
  { id: 'social_proof', name: 'Social Proof & Trusted Logos', type: 'builtin', section_order: 3, visible: true, is_builtin: true, custom_data: {} },
  { id: 'value_prop', name: 'Value Proposition Bento Grid', type: 'builtin', section_order: 4, visible: true, is_builtin: true, custom_data: {} },
  { id: 'stats', name: 'Animated Stats Band', type: 'builtin', section_order: 5, visible: true, is_builtin: true, custom_data: {} },
  { id: 'why_us', name: 'Why Us (Problem vs Solution)', type: 'builtin', section_order: 6, visible: true, is_builtin: true, custom_data: {} },
  { id: 'process', name: 'Process (How We Work)', type: 'builtin', section_order: 7, visible: true, is_builtin: true, custom_data: {} },
  { id: 'services', name: 'Services & Capabilities', type: 'builtin', section_order: 8, visible: true, is_builtin: true, custom_data: {} },
  { id: 'portfolio', name: 'Portfolio & Case Studies', type: 'builtin', section_order: 9, visible: true, is_builtin: true, custom_data: {} },
  { id: 'testimonials', name: 'Client Testimonials', type: 'builtin', section_order: 10, visible: true, is_builtin: true, custom_data: {} },
  { id: 'events', name: 'Immersive Events Showcase', type: 'builtin', section_order: 11, visible: true, is_builtin: true, custom_data: {} },
  { id: 'final_cta', name: 'Final Conversion CTA Banner', type: 'builtin', section_order: 12, visible: true, is_builtin: true, custom_data: {} },
]

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()

    // 1. Try reading from home_sections table in Supabase
    const { data: dbSections, error: dbErr } = await supabase
      .from('home_sections')
      .select('*')
      .order('section_order', { ascending: true })

    if (!dbErr && dbSections && dbSections.length > 0) {
      let sections = dbSections.map(s => ({
        ...s,
        order: s.section_order,
      }))

      // Auto-inject any missing built-in default sections (events, manifesto, etc.)
      const missingDefaults = DEFAULT_HOME_SECTIONS.filter(
        d => !sections.some((s: any) => s.id === d.id),
      )
      if (missingDefaults.length > 0) {
        missingDefaults.forEach(d => {
          sections.push({ ...d, order: d.section_order } as any)
        })
        sections.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
      }

      return NextResponse.json({
        status: 200,
        data: {
          sections,
          source: 'home_sections_table',
        },
      })
    }

    // 2. Fallback to system_settings key 'home_page_sections'
    const { data: setting } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'home_page_sections')
      .single()

    if (setting && setting.value && Array.isArray(setting.value)) {
      return NextResponse.json({
        status: 200,
        data: {
          sections: setting.value,
          source: 'system_settings',
        },
      })
    }

    // 3. Fallback to default built-in sections
    return NextResponse.json({
      status: 200,
      data: {
        sections: DEFAULT_HOME_SECTIONS.map(s => ({ ...s, order: s.section_order })),
        source: 'default',
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, error: 'Failed to load home sections' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await getAuthSession(request)

  if (!session) {
    return NextResponse.json(
      { status: 401, error: 'Unauthorized. Token missing or invalid.' },
      { status: 401 }
    )
  }

  if (session.role !== 'owner' && session.role !== 'admin') {
    return NextResponse.json(
      { status: 403, error: 'Forbidden. Owner or Admin privileges required.' },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    const { sections } = body

    if (!Array.isArray(sections)) {
      return NextResponse.json(
        { status: 400, error: 'Invalid sections array' },
        { status: 400 }
      )
    }

    // Ensure built-in section integrity
    const defaultIds = DEFAULT_HOME_SECTIONS.map(s => s.id)
    defaultIds.forEach(defId => {
      if (!sections.some((s: any) => s.id === defId)) {
        const defObj = DEFAULT_HOME_SECTIONS.find(s => s.id === defId)!
        sections.push({ ...defObj, order: sections.length + 1 })
      }
    })

    // Sort order
    sections.forEach((sec: any, index: number) => {
      sec.order = index + 1
      sec.section_order = index + 1
    })

    const supabase = createAdminClient()

    // 1. Save to dedicated home_sections table in Supabase
    const dbPayload = sections.map((s: any) => ({
      id: String(s.id),
      name: String(s.name || 'Untitled Section'),
      type: String(s.type || 'custom'),
      section_order: Number(s.order || s.section_order || 1),
      visible: Boolean(s.visible ?? true),
      is_builtin: Boolean(s.is_builtin ?? false),
      custom_data: s.custom_data || {},
      updated_at: new Date().toISOString(),
      updated_by: session.id,
    }))

    // Upsert into home_sections table
    const { error: upsertDbErr } = await supabase
      .from('home_sections')
      .upsert(dbPayload, { onConflict: 'id' })

    if (upsertDbErr) {
      console.warn('Upsert home_sections table notice:', upsertDbErr.message)
    }

    // Also delete any removed custom sections from DB
    const currentIds = sections.map(s => String(s.id))
    const { data: existingDb } = await supabase.from('home_sections').select('id')
    if (existingDb) {
      const idsToDelete = existingDb.map(e => e.id).filter(id => !currentIds.includes(id))
      if (idsToDelete.length > 0) {
        await supabase.from('home_sections').delete().in('id', idsToDelete)
      }
    }

    // 2. Also save to system_settings for legacy fallback
    await supabase
      .from('system_settings')
      .upsert({
        key: 'home_page_sections',
        value: sections as any,
        updated_at: new Date().toISOString(),
        updated_by: session.id,
      })

    // Log Activity
    logActivity({
      userId: session.id,
      username: session.username,
      userRole: session.role,
      eventType: 'admin.action',
      action: 'UPDATE_HOME_SECTIONS',
      description: `Admin "${session.username}" saved Home Page components layout to Supabase`,
      path: '/admin',
      metadata: { total_sections: sections.length, section_ids: currentIds },
      request,
    }).catch(() => {})

    return NextResponse.json({
      status: 200,
      message: 'Home Page sections saved to Supabase successfully',
      data: {
        sections,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
