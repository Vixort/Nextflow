import { NextRequest, NextResponse } from 'next/server'
import path from 'node:path'
import { createAdminClient } from '@/lib/db/client'
import { getStorage } from '@/lib/storage'
import { applyHtmlTextEdits, sanitizeText, type HtmlTextEdit } from '@/lib/static/htmlTextEdits'

type StaticRouteCtx = {
  params: Promise<{ id: string; path: string[] }>
}

const CONTENT_TYPES: Record<string, string> = {
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

export async function GET(request: NextRequest, context: StaticRouteCtx) {
  const { id, path: segments = [] } = await context.params

  const relPath = segments.join('/').replace(/\\/g, '/')
  const normalized = path.posix.normalize(relPath)
  if (normalized === '..' || normalized.startsWith('../') || normalized.startsWith('/')) {
    return new NextResponse('Bad request', { status: 400 })
  }

  const fileName = normalized || 'index.html'

  const supabase = createAdminClient()

  // Resolve the template's storage folder.
  const { data: template } = await supabase
    .from('website_templates')
    .select('storage_path, render_mode')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (!template || template.render_mode !== 'static' || !template.storage_path) {
    return new NextResponse('Template not found', { status: 404 })
  }

  const storagePath =
    fileName === 'index.html'
      ? `${template.storage_path}/index.html`
      : `${template.storage_path}/${fileName}`

  let fileBody: Uint8Array
  try {
    fileBody = await getStorage().download(storagePath)
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }

  const ext = path.extname(fileName).toLowerCase()
  const contentType = CONTENT_TYPES[ext] || 'application/octet-stream'

  const body = Buffer.from(fileBody)

  // Inject visitor theme overrides (colors only) for the HTML entry.
  const isHtml = /\.html?$/i.test(fileName)
  let finalBody: ArrayBuffer = body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength) as ArrayBuffer
  if (isHtml) {
    const injected = injectThemeCss(body, request)
    finalBody = injected.buffer.slice(injected.byteOffset, injected.byteOffset + injected.byteLength) as ArrayBuffer
  }

  // AI text adaptation (preview-only): apply oldText→value replacements on the
  // raw HTML source. The values were sanitized by the ai-chat route already;
  // re-sanitize here anyway (defense in depth).
  if (isHtml) {
    const edits = parseAiEdits(request.nextUrl.searchParams.get('aiEdits'))
    if (edits.length > 0) {
      const src = Buffer.from(finalBody).toString('utf8')
      const { html } = applyHtmlTextEdits(src, edits)
      finalBody = Buffer.from(html, 'utf8').buffer as ArrayBuffer
    }
  }

  return new NextResponse(finalBody, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(finalBody.byteLength),
      'Cache-Control': 'private, max-age=0, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

const CSS_HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

// Parse the ?aiEdits= URL param: JSON array of { oldText, value } text swaps.
// Only used on the HTML entry, preview-only. Heavily validated — this blends
// into a query string and returns modified HTML.
function parseAiEdits(raw: string | null): HtmlTextEdit[] {
  if (!raw || raw.length > 12_000) return []
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return []
  }
  if (!Array.isArray(parsed)) return []

  const edits: HtmlTextEdit[] = []
  for (const item of parsed) {
    if (edits.length >= 12) break
    if (!item || typeof item !== 'object') continue
    const oldText = (item as Record<string, unknown>).oldText
    const value = (item as Record<string, unknown>).value
    if (typeof oldText !== 'string' || typeof value !== 'string') continue
    const cleanOld = oldText.slice(0, 500)
    const cleanValue = sanitizeText(value)
    if (!cleanOld || cleanOld.length < 3 || cleanValue.length < 2 || cleanOld === cleanValue) continue
    edits.push({ oldText: cleanOld, value: cleanValue })
  }
  return edits
}

// Build a theme override stylesheet that recolors the page globally without
// touching the template's source files (visitor preview-only colors).
function injectThemeCss(body: Buffer, request: NextRequest): Buffer {
  const url = request.nextUrl
  const bg = url.searchParams.get('bg') || ''
  const text = url.searchParams.get('text') || ''
  const accent = url.searchParams.get('accent') || ''

  if (bg && !CSS_HEX.test(bg)) return body
  if (text && !CSS_HEX.test(text)) return body
  if (accent && !CSS_HEX.test(accent)) return body

  // Skip injection when no theme is requested (keep the original as-is).
  if (!bg && !text && !accent) return body

  const rules: string[] = []

  if (bg) {
    rules.push(`html,body{background:${bg}!important;background-color:${bg}!important}`)
  }
  if (text) {
    rules.push(`html,body,body *{color:${text}!important}`)
  }
  if (accent) {
    rules.push(
      `a,a:hover,a:visited,button,.btn,.hero-btn{color:${accent}!important}`,
      `[style*="background"],[style*="background-color"]{transition:background-color .3s ease}`,
    )
  }

  const style = `<style data-nextflow-theme>${rules.join('\n')}</style>`

  const html = body.toString('utf8')
  const lower = html.toLowerCase()

  // Prefer injecting before </head>; fall back to the start of <body>.
  if (lower.includes('</head>')) {
    const idx = lower.lastIndexOf('</head>')
    const out = html.slice(0, idx) + style + '\n' + html.slice(idx)
    return Buffer.from(out, 'utf8')
  }
  const bodyStart = lower.indexOf('<body')
  if (bodyStart !== -1) {
    const tagEnd = html.indexOf('>', bodyStart) + 1
    const out = html.slice(0, tagEnd) + '\n' + style + html.slice(tagEnd)
    return Buffer.from(out, 'utf8')
  }
  return body
}