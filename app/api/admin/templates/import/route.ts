import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { getAuthSession } from '@/lib/auth/jwt'
import { logActivity } from '@/lib/activity'
import { createAdminClient } from '@/lib/db/client'
import { getStorage } from '@/lib/storage'
import {
  TEMPLATE_ASSETS_BUCKET,
  assertZipSize,
  unpackTemplateZip,
  TemplateImportError,
} from '@/lib/templateZip'
import { extractHtmlContent } from '@/lib/static/htmlContent'
import type { HtmlLayout, HtmlTexts } from '@/lib/static/htmlContent'

function isEditor(role: string): boolean {
  return role === 'owner' || role === 'admin'
}

export const maxDuration = 60 // zip extraction + upload can be slow

export async function POST(request: NextRequest) {
  const session = await getAuthSession(request)
  if (!session || !isEditor(session.role)) {
    return NextResponse.json({ status: 403, error: 'Forbidden' }, { status: 403 })
  }

  // Early size guard (before buffering the whole body).
  const contentLength = request.headers.get('content-length')
  try {
    assertZipSize(contentLength ? parseInt(contentLength, 10) : null)
  } catch (err) {
    return toError(err)
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ status: 400, error: 'Invalid multipart request.' }, { status: 400 })
  }

  const file = form.get('file')
  if (!file || typeof file === 'string' || !(file instanceof Blob)) {
    return NextResponse.json({ status: 400, error: 'Missing "file" (zip) field.' }, { status: 400 })
  }
  if (!file.type || !/zip/i.test(file.type)) {
    return NextResponse.json(
      { status: 400, error: 'File must be a .zip archive (importing only raw HTML/CSS/JS sites).' },
      { status: 400 },
    )
  }

  const name = String(form.get('name') || '').trim().slice(0, 120)
  const description = String(form.get('description') || '').trim().slice(0, 1_000)
  const category = String(form.get('category') || '').trim().slice(0, 80) || 'Landing Page'
  const thumbnailUrl = String(form.get('thumbnail_url') || '').trim().slice(0, 2_000) || null
  const rawTags = String(form.get('tags') || '')
  const tags = rawTags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20)

  // Optional: re-import into an existing static template.
  const reimportIdRaw = String(form.get('template_id') || '').trim()
  const reimportId =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(reimportIdRaw)
      ? reimportIdRaw
      : null

  if (!name) {
    return NextResponse.json({ status: 400, error: 'Template name is required.' }, { status: 400 })
  }

  const zipBuffer = Buffer.from(await file.arrayBuffer())

  // Parse + validate the archive with hard security limits.
  let unpacked
  try {
    unpacked = await unpackTemplateZip(zipBuffer)
  } catch (err) {
    return toError(err)
  }

  const supabase = createAdminClient()

  // Validate session.id as UUID for FK column.
  const isUuid = typeof session.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(session.id)
  const validUserId = isUuid ? session.id : null

  // If re-importing, reuse the existing static template and its storage folder.
  let templateId: string
  let folder: string
  if (reimportId) {
    const { data: existing } = await supabase
      .from('website_templates')
      .select('id, render_mode, storage_path')
      .eq('id', reimportId)
      .single()
    if (!existing || existing.render_mode !== 'static') {
      return NextResponse.json({ status: 400, error: 'Target template is not a static template.' }, { status: 400 })
    }
    templateId = existing.id
    folder = existing.storage_path || `templates/${templateId}`
  } else {
    templateId = randomUUID()
    folder = `templates/${templateId}`
  }

  const totalBytes = unpacked.files.reduce((sum, f) => sum + f.content.byteLength, 0)

  // Determine the primary HTML entry name on disk (always normalized to index.html).
  const entryFilePath = `${folder}/index.html`

  // Upload every validated asset to storage (replace entire folder for re-import).
  if (reimportId) {
    // Clear obsolete assets before overwriting.
    try {
      await getStorage().remove([`${folder}/`])
    } catch { /* fresh folder */ }
  }

  try {
    for (const f of unpacked.files) {
      const storagePath =
        f.relPath === unpacked.entryHtml ? entryFilePath : `${folder}/${f.relPath}`
      await getStorage().upload(storagePath, f.content, {
        contentType: contentTypeFor(f.relPath),
        upsert: true,
      })
    }
  } catch (err) {
    // Cleanup partial uploads.
    try {
      await getStorage().remove([`${folder}/`])
    } catch { /* ignore */ }
    if (!reimportId) {
      await supabase.from('website_templates').delete().eq('id', templateId)
    }
    console.error('Static template import failed during storage upload:', err)
    return NextResponse.json(
      { status: 500, error: 'Failed to store template files. Nothing was saved.', details: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }

  // Split each HTML file into structure (html_layout) + copy (html_texts),
  // mirroring puck_layout/puck_texts for raw HTML sites. Per-file extraction
  // is tolerant: a file that fails to parse is skipped, not fatal.
  const htmlFiles = unpacked.files.filter((f) => /\.(html?|htm)$/i.test(f.relPath))
  const htmlLayouts: HtmlLayout['files'] = {}
  const htmlTextFiles: HtmlTexts['files'] = {}
  for (const f of htmlFiles) {
    try {
      const key = f.relPath === unpacked.entryHtml ? 'index.html' : f.relPath
      const { layout, texts } = extractHtmlContent(
        Buffer.from(f.content).toString('utf8'),
      )
      if (layout.slots.length > 0) {
        htmlLayouts[key] = layout
        htmlTextFiles[key] = texts
      }
    } catch (err) {
      console.warn(`Skipped HTML content extraction for "${f.relPath}":`, err)
    }
  }
  const hasHtmlContent = Object.keys(htmlLayouts).length > 0
  const htmlLayout: HtmlLayout | null = hasHtmlContent ? { schema_version: 1, files: htmlLayouts } : null
  const htmlTexts: HtmlTexts | null = hasHtmlContent ? { schema_version: 1, files: htmlTextFiles } : null

  // Create or update the template row.
  let created
  if (reimportId) {
    const { data: updated, error: updateError } = await supabase
      .from('website_templates')
      .update({
        name,
        description: description || null,
        category,
        tags,
        thumbnail_url: thumbnailUrl,
        html_layout: htmlLayout,
        html_texts: htmlTexts,
        storage_path: folder,
        file_name: typeof file.name === 'string' ? file.name.slice(0, 255) : null,
        storage_size_bytes: totalBytes,
        updated_by: validUserId,
      })
      .eq('id', templateId)
      .select('*')
      .single()
    if (updateError || !updated) {
      console.error('Failed to update static template:', updateError)
      return NextResponse.json({ status: 500, error: updateError?.message || 'Failed to update template', details: updateError?.details || null }, { status: 500 })
    }
    created = updated
  } else {
    const { data: inserted, error: insertError } = await supabase
      .from('website_templates')
      .insert({
        id: templateId,
        name,
        description: description || null,
        category,
        tags,
        thumbnail_url: thumbnailUrl,
        puck_data: {},
        puck_layout: null,
        puck_texts: null,
        html_layout: htmlLayout,
        html_texts: htmlTexts,
        global_css: '',
        render_mode: 'static',
        storage_path: folder,
        file_name: typeof file.name === 'string' ? file.name.slice(0, 255) : null,
        storage_size_bytes: totalBytes,
        is_active: true,
        created_by: validUserId,
        updated_by: validUserId,
      })
      .select('*')
      .single()
    if (insertError || !inserted) {
      console.error('Failed to insert static template:', insertError)
      return NextResponse.json({ status: 500, error: insertError?.message || 'Failed to create template', details: insertError?.details || null }, { status: 500 })
    }
    created = inserted
  }

  void logActivity({
    userId: session.id,
    username: session.username,
    userRole: session.role,
    eventType: 'admin.action',
    action: reimportId ? 'REIMPORT_STATIC_TEMPLATE' : 'IMPORT_STATIC_TEMPLATE',
    description: `${reimportId ? 'Re-imported' : 'Imported'} static HTML/CSS/JS template "${created.name}"`,
    path: '/admin',
    metadata: { template_id: templateId, files: unpacked.files.length, entry_html: unpacked.entryHtml, bytes: totalBytes },
    request,
  })

  return NextResponse.json(
    { status: 201, message: 'Static template imported successfully.' as string, data: { template: created } },
    { status: 201 },
  )
}

function contentTypeFor(relPath: string): string {
  const ext = path.extname(relPath).toLowerCase()
  const map: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.htm': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.avif': 'image/avif',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.eot': 'application/vnd.ms-fontobject',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml',
  }
  return map[ext] || 'application/octet-stream'
}

function toError(err: unknown): NextResponse {
  if (err instanceof TemplateImportError) {
    return NextResponse.json({ status: 400, error: err.message, details: { code: err.code } }, { status: 400 })
  }
  console.error('Static template import error:', err)
  return NextResponse.json({ status: 400, error: 'Invalid zip archive.' }, { status: 400 })
}
