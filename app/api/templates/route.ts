import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/db/client'
import { mergeStoredTemplate } from '@/lib/puck/textMerge'
import type { NextRequest } from 'next/server'

// Merges v2 (puck_layout + puck_texts) rows back into a full puck_data so
// every downstream consumer keeps working untouched. v1 rows pass through.
function mergeRow(row: Record<string, unknown>): Record<string, unknown> {
  const { merged } = mergeStoredTemplate(row)
  return { ...row, puck_data: merged }
}

export async function GET(request: NextRequest) {
  const supabase = createAdminClient()

  // Optional tag filter: ?tag=<tagname>
  const tag = request.nextUrl.searchParams.get('tag')
  const tagFilter = tag && tag.trim() ? tag.trim() : null

  let query = supabase
    .from('website_templates')
    .select('id, name, description, category, tags, thumbnail_url, global_css, puck_data, puck_layout, puck_texts, render_mode, updated_at')
    .eq('is_active', true)

  if (tagFilter) {
    query = query.contains('tags', [tagFilter])
  }

  const { data, error } = await query.order('updated_at', { ascending: false })

  if (error) {
    return NextResponse.json({ status: 500, error: 'Failed to fetch templates' }, { status: 500 })
  }

  const templates = Array.isArray(data)
    ? data.map((row: Record<string, unknown>) => mergeRow(row))
    : []

  return NextResponse.json({ status: 200, data: { templates } })
}