import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth/jwt'
import { createAdminClient } from '@/lib/supabase/admin'
import { logActivity } from '@/lib/activity'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getAuthSession(request)

  if (!session) {
    return NextResponse.json({ status: 401, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createAdminClient()

    const { data: template, error } = await supabase
      .from('website_templates')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !template) {
      return NextResponse.json({ status: 404, error: 'Template not found' }, { status: 404 })
    }

    return NextResponse.json({
      status: 200,
      data: { template },
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, error: 'Failed to fetch template' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getAuthSession(request)

  if (!session || (session.role !== 'owner' && session.role !== 'admin')) {
    return NextResponse.json({ status: 403, error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { name, description, category, thumbnail_url, grapesjs_data, puck_data, html_code, css_code, global_css, is_active } = body

    const supabase = createAdminClient()

    const updatePayload: any = {
      updated_at: new Date().toISOString(),
      updated_by: session.id,
    }

    if (name !== undefined) updatePayload.name = name
    if (description !== undefined) updatePayload.description = description
    if (category !== undefined) updatePayload.category = category
    if (thumbnail_url !== undefined) updatePayload.thumbnail_url = thumbnail_url
    if (puck_data !== undefined) updatePayload.grapesjs_data = puck_data
    else if (grapesjs_data !== undefined) updatePayload.grapesjs_data = grapesjs_data
    if (html_code !== undefined) updatePayload.html_code = html_code
    if (css_code !== undefined) updatePayload.css_code = css_code
    if (global_css !== undefined) updatePayload.global_css = global_css
    if (is_active !== undefined) updatePayload.is_active = is_active

    const { data: updatedTemplate, error } = await supabase
      .from('website_templates')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ status: 500, error: error.message }, { status: 500 })
    }

    // Log Activity
    logActivity({
      userId: session.id,
      username: session.username,
      userRole: session.role,
      eventType: 'admin.action',
      action: 'UPDATE_WEBSITE_TEMPLATE',
      description: `Admin "${session.username}" saved website template "${updatedTemplate?.name || id}"`,
      path: '/admin',
      metadata: { template_id: id },
      request,
    }).catch(() => {})

    return NextResponse.json({
      status: 200,
      message: 'Template updated successfully',
      data: { template: updatedTemplate },
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getAuthSession(request)

  if (!session || (session.role !== 'owner' && session.role !== 'admin')) {
    return NextResponse.json({ status: 403, error: 'Forbidden' }, { status: 403 })
  }

  try {
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('website_templates')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ status: 500, error: error.message }, { status: 500 })
    }

    // Log Activity
    logActivity({
      userId: session.id,
      username: session.username,
      userRole: session.role,
      eventType: 'admin.action',
      action: 'DELETE_WEBSITE_TEMPLATE',
      description: `Admin "${session.username}" deleted website template ID "${id}"`,
      path: '/admin',
      metadata: { template_id: id },
      request,
    }).catch(() => {})

    return NextResponse.json({
      status: 200,
      message: 'Template deleted successfully',
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, error: 'Internal Server Error' }, { status: 500 })
  }
}
