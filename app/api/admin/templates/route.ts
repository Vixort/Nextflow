import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth/jwt'
import { createAdminClient } from '@/lib/supabase/admin'
import { logActivity } from '@/lib/activity'

export const SAMPLE_STARTER_TEMPLATE = {
  name: 'SaaS Launchpad Template',
  description: 'High-converting dark editorial landing page template with cyan accents.',
  category: 'Landing Page',
  thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
  html_code: `<section style="padding: 80px 20px; background-color: #090a0f; color: #ffffff; text-align: center;">
  <span class="btn-glow" style="display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-bottom: 16px;">NEW RELEASE</span>
  <h1 style="font-size: 3rem; font-weight: 800; margin-bottom: 16px; color: #ffffff;">Build SaaS Apps 10x Faster</h1>
  <p style="color: #94a3b8; max-width: 600px; margin: 0 auto 32px auto; font-size: 1.1rem;">Custom GrapesJS website template designed for Nextflow developers.</p>
  <a href="#" style="display: inline-block; padding: 12px 28px; background-color: #ffffff; color: #090a0f; font-weight: bold; border-radius: 8px; text-decoration: none;">Get Started</a>
</section>`,
  css_code: ``,
  global_css: `.btn-glow { background: rgba(6, 182, 212, 0.15); color: #22d3ee; border: 1px solid rgba(6, 182, 212, 0.4); }\n.glass-card { background: rgba(15, 17, 26, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); }`,
  grapesjs_data: {},
}

export async function GET(request: NextRequest) {
  const session = await getAuthSession(request)

  if (!session) {
    return NextResponse.json(
      { status: 401, error: 'Unauthorized. Token missing or invalid.' },
      { status: 401 }
    )
  }

  try {
    const supabase = createAdminClient()

    const { data: templates, error } = await supabase
      .from('website_templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('Notice fetching website_templates:', error.message)
      return NextResponse.json({
        status: 200,
        data: {
          templates: [
            {
              id: 'sample-starter-1',
              ...SAMPLE_STARTER_TEMPLATE,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ],
        },
      })
    }

    // If empty DB, return default starter template in array
    if (!templates || templates.length === 0) {
      return NextResponse.json({
        status: 200,
        data: {
          templates: [
            {
              id: 'sample-starter-1',
              ...SAMPLE_STARTER_TEMPLATE,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ],
        },
      })
    }

    return NextResponse.json({
      status: 200,
      data: {
        templates,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, error: 'Failed to fetch website templates' },
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
    const { name, description, category, thumbnail_url, grapesjs_data, puck_data, html_code, css_code, global_css } = body

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ status: 400, error: 'Template name is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: newTemplate, error } = await supabase
      .from('website_templates')
      .insert({
        name,
        description: description || 'Custom Puck Studio website template',
        category: category || 'Landing Page',
        thumbnail_url: thumbnail_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        grapesjs_data: puck_data || grapesjs_data || {},
        html_code: html_code || '',
        css_code: css_code || '',
        global_css: global_css || '',
        is_active: true,
        created_by: session.id,
        updated_by: session.id,
      })
      .select('*')
      .single()

    if (error || !newTemplate) {
      return NextResponse.json({ status: 500, error: 'Failed to create template in database' }, { status: 500 })
    }

    // Log Activity
    logActivity({
      userId: session.id,
      username: session.username,
      userRole: session.role,
      eventType: 'admin.action',
      action: 'CREATE_WEBSITE_TEMPLATE',
      description: `Admin "${session.username}" created website template "${name}"`,
      path: '/admin',
      metadata: { template_id: newTemplate.id, template_name: name },
      request,
    }).catch(() => {})

    return NextResponse.json({
      status: 200,
      message: 'Website template created successfully',
      data: {
        template: newTemplate,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
