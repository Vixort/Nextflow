import JSZip from 'jszip'
import path from 'node:path'

export const TEMPLATE_ASSETS_BUCKET = 'template-assets'
export const TEMPLATE_ZIP_MAX_BYTES = 20 * 1024 * 1024 // 20 MB compressed upload
export const TEMPLATE_MAX_UNCOMPRESSED = 60 * 1024 * 1024 // 60 MB extracted
export const TEMPLATE_MAX_FILES = 500

// Allowed file extensions for extracted template assets.
const ALLOWED_EXTENSIONS = new Set([
  '.html', '.htm', '.css', '.js', '.mjs', '.json',
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.avif',
  '.woff', '.woff2', '.ttf', '.otf', '.eot', '.mp4', '.webm', '.txt', '.xml',
])

export class TemplateImportError extends Error {
  code: string
  constructor(code: string, message: string) {
    super(message)
    this.code = code
  }
}

export interface ExtractedTemplateFile {
  /** Safe, normalized relative path within the archive (uses forward slashes). */
  relPath: string
  /** Buffer of the file content. */
  content: Buffer
}

export interface UnpackedTemplate {
  /** Zip archive path of the primary HTML file (normalized, e.g. "index.html" or "site/index.html"). */
  entryHtml: string
  files: ExtractedTemplateFile[]
}

/** Upload-size guard performed before reading the request body. */
export function assertZipSize(contentLengthBytes: number | null): void {
  if (contentLengthBytes != null && contentLengthBytes > TEMPLATE_ZIP_MAX_BYTES) {
    throw new TemplateImportError(
      'too_large',
      `Zip file exceeds the ${Math.round(TEMPLATE_ZIP_MAX_BYTES / (1024 * 1024))}MB upload limit.`,
    )
  }
}

/**
 * Safely reads a zip buffer and extracts its entries while enforcing hard security limits:
 * - compressed / uncompressed size caps (zip-bomb protection)
 * - max file count
 * - path traversal prevention (rejects `..`, absolute paths, drive letters)
 * - extension allow-list
 */
export async function unpackTemplateZip(zipBuffer: Buffer): Promise<UnpackedTemplate> {
  if (zipBuffer.byteLength > TEMPLATE_ZIP_MAX_BYTES) {
    throw new TemplateImportError(
      'too_large',
      `Zip file exceeds the ${Math.round(TEMPLATE_ZIP_MAX_BYTES / (1024 * 1024))}MB upload limit.`,
    )
  }

  let zip: JSZip
  try {
    zip = await JSZip.loadAsync(zipBuffer, { checkCRC32: true })
  } catch (err) {
    throw new TemplateImportError(
      'invalid_zip',
      `Could not read the uploaded file as a valid zip archive${err instanceof Error ? `: ${err.message}` : ''}.`,
    )
  }

  const entries = Object.values(zip.files)
  if (entries.length === 0) {
    throw new TemplateImportError('empty_zip', 'The zip archive is empty.')
  }
  if (entries.length > TEMPLATE_MAX_FILES) {
    throw new TemplateImportError(
      'too_many_files',
      `Zip contains more than ${TEMPLATE_MAX_FILES} files.`,
    )
  }

  let totalUncompressed = 0
  const extracted: ExtractedTemplateFile[] = []

  const eligible = entries.filter((e) => !e.dir)
  eligible.sort((a, b) => a.name.localeCompare(b.name))

  for (const entry of eligible) {
    const rawName = entry.name.replace(/\\/g, '/')
    const safePath = sanitizePath(rawName)
    if (!safePath) continue // skip unsafe/ignored entries

    const ext = path.extname(safePath).toLowerCase()
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      throw new TemplateImportError(
        'disallowed_extension',
        `File "${rawName}" has a disallowed extension (.${ext || 'none'}). Allowed: html, css, js, images, fonts.`,
      )
    }

    // Skip helper/ignored files that are safe but useless (thumbs/OS metadata)
    const base = path.basename(safePath).toLowerCase()
    if (base === 'thumbs.db' || base === '.ds_store' || base.startsWith('__macosx')) {
      continue
    }

    const content = await entry.async('nodebuffer')
    if (content.byteLength === 0) continue

    totalUncompressed += content.byteLength
    if (totalUncompressed > TEMPLATE_MAX_UNCOMPRESSED) {
      throw new TemplateImportError(
        'zip_bomb',
        `Extracted files exceed the ${Math.round(TEMPLATE_MAX_UNCOMPRESSED / (1024 * 1024))}MB total limit (possible zip bomb).`,
      )
    }

    extracted.push({ relPath: safePath, content })
  }

  // Locate a usable primary HTML entry.
  const htmlEntries = extracted.filter(
    (f) => /\.html?$/i.test(f.relPath) && !f.relPath.startsWith('_'),
  )
  const entryHtml =
    htmlEntries.find((f) => /(^|\/)index\.html?$/i.test(f.relPath))?.relPath ??
    htmlEntries.find((f) => f.relPath.startsWith('index'))?.relPath ??
    htmlEntries[0]?.relPath

  if (!entryHtml) {
    throw new TemplateImportError(
      'missing_index',
      'The zip must contain an index.html file at its root.',
    )
  }

  return { entryHtml, files: extracted }
}

/**
 * Normalizes an archive entry path and rejects any path that could escape the
 * target directory (path traversal). Returns null for unsafe/ignored entries.
 */
function sanitizePath(rawPath: string): string | null {
  const p = rawPath.replace(/^\/+/, '').replace(/\0/g, '')
  if (!p) return null

  const norm = path.posix.normalize(p)
  // Reject anything that normalizes outside the archive root (traversal / absolute).
  if (norm === '..' || norm.startsWith('../') || norm.startsWith('/') || /^[a-zA-Z]:/.test(norm)) {
    throw new TemplateImportError(
      'path_traversal',
      `Archive entry "${rawPath}" uses an unsafe path (directory traversal is not allowed).`,
    )
  }

  // Drop hidden / OS metadata files at any depth.
  const segments = norm.split('/')
  if (segments.some((s) => s === '.git' || s === 'node_modules')) return null

  return norm
}
