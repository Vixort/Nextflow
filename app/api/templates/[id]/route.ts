import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { mergeStoredTemplate } from '@/lib/puck/textMerge'

export async function GET(request: NextRequest, context: RouteContext<'/api/templates/[id]'>) {
  const { id } = await context.params
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('website_templates')
    .select('id, name, description, category, tags, thumbnail_url, global_css, puck_data, puck_layout, puck_texts, render_mode, storage_path, updated_at')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return NextResponse.json({ status: 404, error: 'Template not found' }, { status: 404 })
  }

  const { merged } = mergeStoredTemplate(data)
  return NextResponse.json({ status: 200, data: { template: { ...data, puck_data: merged } } })
}
