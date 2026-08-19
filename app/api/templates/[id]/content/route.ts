import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/db/client'
import { getStorage } from '@/lib/storage'
import {
  extractHtmlContent,
  buildHtmlInventory,
} from '@/lib/static/htmlContent'
import type { HtmlLayout, HtmlTexts } from '@/lib/static/htmlContent'

// Server-side inventory source for static templates. The /build pipeline and
// the in-page AI copy editor read a template's separated copy from here —
// DB first (html_layout/html_texts written at import), with a live fallback
// to re-extracting from storage for templates imported before the split
// existed (backfill candidates). Read-only: nothing is written back.

const FILE_KEY_RE = /^[A-Za-z0-9_\-./]+\.html?$/i

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id
  const rawPath = request.nextUrl.searchParams.get('path') || 'index.html'
  if (!FILE_KEY_RE.test(rawPath) || rawPath.includes('..')) {
    return NextResponse.json({ status: 400, error: 'Invalid path.' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: template } = await supabase
    .from('website_templates')
    .select('id, render_mode, storage_path, html_layout, html_texts')
    .eq('id', id)
    .single()

  if (!template || template.render_mode !== 'static' || !template.storage_path) {
    return NextResponse.json({ status: 404, error: 'Template not found.' }, { status: 404 })
  }

  const layout = (template.html_layout ?? null) as HtmlLayout | null
  const texts = (template.html_texts ?? null) as HtmlTexts | null

  // DB path: inventory from stored, separated copy.
  if (layout && texts) {
    const inventory = buildHtmlInventory(layout, texts, rawPath)
    const knownFiles = Object.keys(layout.files ?? {})
    if (knownFiles.includes(rawPath) || inventory.length > 0) {
      return NextResponse.json({
        status: 200,
        data: {
          path: rawPath,
          source: 'db',
          files: knownFiles,
          inventory,
          layout: layout.files[rawPath] ?? null,
        },
      })
    }
  }

  // Fallback: live extraction from storage (legacy templates).
  try {
    const storagePath = `${template.storage_path}/${rawPath}`
    const fileBody = await getStorage().download(storagePath)
    const html = Buffer.from(fileBody).toString('utf8')
    const { layout: liveLayout, texts: liveTexts } = extractHtmlContent(html)
    const inventory = buildHtmlInventory(
      { schema_version: 1, files: { [rawPath]: liveLayout } },
      { schema_version: 1, files: { [rawPath]: liveTexts } },
      rawPath,
    )
    return NextResponse.json({
      status: 200,
      data: {
        path: rawPath,
        source: 'live',
        files: [rawPath],
        inventory,
        layout: liveLayout,
      },
    })
  } catch {
    return NextResponse.json(
      { status: 404, error: `No content for "${rawPath}".` },
      { status: 404 },
    )
  }
}
