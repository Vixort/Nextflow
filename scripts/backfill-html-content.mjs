// ============================================================
// Backfill html_layout / html_texts for static templates that were
// imported before the structure/content split existed (columns null).
// Re-parses each .html file from local storage with the same engine
// used at import time (linkedom) and writes the split back.
//
// Usage:  node scripts/backfill-html-content.mjs
// Env:    DB_HOST / DB_USER / DB_PASSWORD / DB_NAME
//         (defaults: 127.0.0.1 / root / '' / nextflow)
//         STORAGE_ROOT (default ./storage/template-assets)
// ============================================================
import mysql from 'mysql2/promise'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { parseHTML } from 'linkedom'

const host = process.env.DB_HOST || '127.0.0.1'
const user = process.env.DB_USER || 'root'
const password = process.env.DB_PASSWORD || ''
const database = process.env.DB_NAME || 'nextflow'
const storageRoot = path.resolve(process.env.STORAGE_ROOT || './storage/template-assets')

// Keep in sync with lib/static/htmlRules.ts + lib/static/htmlContent.ts.
const SKIP_TAGS = new Set(['script', 'style', 'noscript', 'template', 'textarea', 'select', 'option', 'title', 'head', 'svg', 'math'])
const MAX_ITEMS = 25
const MAX_TEXT_LEN = 200
const STRUCTURE_ATTRS = ['class', 'id', 'href', 'src', 'type', 'role']
const collapse = (s) => s.replace(/\s+/g, ' ').trim()

function pickAttrs(el) {
  const attrs = {}
  for (const name of STRUCTURE_ATTRS) {
    const value = el.getAttribute(name)
    if (!value) continue
    const v = value.trim()
    if (!v || v.startsWith('data:')) continue
    attrs[name] = v.slice(0, 200)
  }
  return attrs
}

function elementIndex(el) {
  let idx = 0
  let prev = el.previousElementSibling
  while (prev) {
    idx += 1
    prev = prev.previousElementSibling
  }
  return idx
}

function buildPath(stack) {
  const p = stack.map((s) => `${s.tag}[${s.idx}]`).join('>')
  return p.replace(/^(?:html|body)\[\d+\]/, (m) => m.slice(0, m.indexOf('[')))
}

function walk(el, state) {
  const tag = el.tagName.toLowerCase()
  state.stack.push({ tag, idx: elementIndex(el) })
  const path = buildPath(state.stack)
  const isHidden = el.hasAttribute('hidden') || el.getAttribute('aria-hidden') === 'true'

  if (tag === 'img') {
    const alt = collapse(el.getAttribute('alt') || '')
    if (alt && alt.length >= 3 && alt.length <= MAX_TEXT_LEN && !state.seen.has(alt) && state.slots.length < MAX_ITEMS) {
      const id = `i${state.slots.length}`
      state.seen.add(alt)
      state.slots.push({ id, tag, path, attrs: pickAttrs(el), hasAlt: true })
      state.texts[id] = { alt }
    }
  }

  if (!isHidden && !SKIP_TAGS.has(tag)) {
    for (const node of el.childNodes ?? []) {
      if (node.nodeType === 3) {
        const rawText = node.textContent ?? ''
        const text = collapse(rawText)
        if (text && text.length >= 3 && text.length <= MAX_TEXT_LEN && !state.seen.has(text) && state.slots.length < MAX_ITEMS) {
          const id = `i${state.slots.length}`
          state.seen.add(text)
          state.slots.push({ id, tag, path, attrs: pickAttrs(el) })
          state.texts[id] = { text, rawText: rawText.trim() }
        }
      } else if (node.nodeType === 1) {
        walk(node, state)
      }
    }
  }
  state.stack.pop()
}

function extractHtmlContent(html) {
  const { document } = parseHTML(html)
  const state = { seen: new Set(), slots: [], texts: {}, stack: [] }
  const root = document.querySelector('body') ?? document.documentElement
  if (root) walk(root, state)
  const title = document.querySelector('title')?.textContent?.trim().slice(0, 200) ?? ''
  return { layout: { title, slots: state.slots }, texts: state.texts }
}

async function listHtmlFiles(dir) {
  const out = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...(await listHtmlFiles(full)))
    } else if (/\.html?$/i.test(entry.name)) {
      out.push(full)
    }
  }
  return out
}

async function main() {
  const conn = await mysql.createConnection({ host, user, password, database })
  try {
    await conn.query("SET time_zone = '+00:00'")

    const [rows] = await conn.execute(
      `SELECT id, name, storage_path FROM website_templates
       WHERE render_mode = 'static' AND html_layout IS NULL AND html_texts IS NULL`
    )

    let done = 0
    let skipped = 0
    for (const row of rows) {
      const folder = path.join(storageRoot, row.storage_path || `templates/${row.id}`)
      const files = await listHtmlFiles(folder)
      const layouts = {}
      const textsByFile = {}
      for (const file of files) {
        try {
          const rel = path.relative(folder, file).split(path.sep).join('/')
          const key = rel === 'index.html' || rel.toLowerCase() === 'index.html' ? 'index.html' : rel
          const html = await readFile(file, 'utf8')
          const { layout, texts } = extractHtmlContent(html)
          if (layout.slots.length > 0) {
            layouts[key] = layout
            textsByFile[key] = texts
          }
        } catch (err) {
          console.warn(`  skip ${file}:`, err.message)
        }
      }
      if (Object.keys(layouts).length === 0) {
        skipped += 1
        continue
      }
      await conn.execute(
        `UPDATE website_templates
         SET html_layout = ?, html_texts = ? WHERE id = ?`,
        [
          JSON.stringify({ schema_version: 1, files: layouts }),
          JSON.stringify({ schema_version: 1, files: textsByFile }),
          row.id,
        ]
      )
      done += 1
      console.log(`  ✓ ${row.name} (${Object.keys(layouts).length} html file(s), ${Object.values(layouts).reduce((n, l) => n + l.slots.length, 0)} slots)`)
    }
    console.log(`\nDone: ${done} template(s) backfilled, ${skipped} skipped (no extractable text).`)
  } finally {
    await conn.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})