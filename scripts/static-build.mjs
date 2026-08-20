// Static HTML build: renders the public pages via the running Next.js server
// and strips the JS-dependent "hidden until hydrate" state so the pages
// display content without JavaScript. Assets are downloaded to a local folder
// and URLs rewritten to relative paths — the output can be dropped into a
// plain web server document root (Apache).
//
// Note: interactive app pages (admin, builder, settings, template detail,
// templates list) fetch data from /api at runtime and will show their shell
// without a backend; the marketing/content pages render fully server-side.
//
// Usage:  node scripts/static-build.mjs [base] [out]
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'

const base = process.argv[2] || 'http://localhost:3000'
const outDir = path.resolve(process.argv[3] || 'out-html')

const PAGES = [
  { route: '/', file: 'index.html' },
  { route: '/services', file: 'services.html' },
  { route: '/contact', file: 'contact.html' },
  { route: '/templates', file: 'templates.html' },
  { route: '/login', file: 'login.html' },
  { route: '/register', file: 'register.html' },
]

// --- post-processing to make SSR content visible without JS ---

// Un-hide React streaming/suspense containers. Content is inside
// <div hidden>...</div> until the JS stream resolves; without JS it never
// resolves, so we simply drop the hidden attribute (the content inside is
// already server-rendered). Empty shell markers become harmless empty divs.
const HIDDEN_DIV_RE = /<div hidden(="")?/g

// Drop inline styles that pre-hide content for the JS reveal animation.
const REVEAL_STYLE_RE = /style="will-change:[^"]*opacity:0[^"]*"/gi
const OPACITY0_STYLE_RE = /opacity:0;?/gi

// Remove the opacity-0 utility class (its transition only fires via JS).
const OPACITY0_CLASS_RE = /opacity-0/g

async function fetchText(url) {
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) throw new Error(`${url} -> ${res.status}`)
  return res.text()
}

async function fetchBin(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} -> ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

const written = new Set()
const queued = new Set()

async function save(relPath, body) {
  if (written.has(relPath)) return
  written.add(relPath)
  const target = path.join(outDir, relPath)
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, body)
}

async function crawlAsset(urlPath) {
  if (queued.has(urlPath) || !/^\/(_next|favicon\.ico)/.test(urlPath)) return
  queued.add(urlPath)
  const abs = `${base}${urlPath}`
  try {
    // Browsers send percent-encoded paths and decode them for lookup, so
    // store files under their decoded name (e.g. %5B -> [).
    const decoded = decodeURIComponent(urlPath)
    if (/\.(js|css|json)$/.test(decoded)) {
      const text = await fetchText(abs)
      await save(decoded, rewriteAssetRefs(text))
    } else {
      await save(decoded, await fetchBin(abs))
    }
  } catch (e) {
    console.warn(`  skip asset ${urlPath}: ${e.message}`)
  }
}

function rewriteAssetRefs(content) {
  return content.replace(/(src|href)=(["'])(\/[^"']*)\2/g, (m, attr, quote, url) => {
    if (url.startsWith('//') || /^\/api\//.test(url)) return m
    const rel = url.replace(/^\//, '')
    return `${attr}=${quote}${rel}${quote}`
  })
}

async function main() {
  await mkdir(outDir, { recursive: true })
  console.log(`Static build ${base} -> ${outDir}`)

  for (const p of PAGES) {
    try {
      const html = await fetchText(`${base}${p.route}`)

      // Queue absolute asset URLs from the ORIGINAL html (before rewriting).
      for (const m of html.matchAll(/(?:src|href)=(["'])(\/[^"']*)\1/g)) {
        await crawlAsset(m[2])
      }

      let out = html
      out = out.replace(HIDDEN_DIV_RE, '<div')
      out = out.replace(REVEAL_STYLE_RE, '')
      out = out.replace(OPACITY0_STYLE_RE, '')
      out = out.replace(OPACITY0_CLASS_RE, '')
      out = rewriteAssetRefs(out)

      await save(p.file, out)
      console.log(`  ✓ ${p.route} -> ${p.file}`)
    } catch (e) {
      console.warn(`  ✗ ${p.route}: ${e.message}`)
    }
  }

  // CSS/JS chunks reference more assets (fonts, images, source maps).
  let guard = 0
  for (const rel of Array.from(written)) {
    if (!/\.(css|js|json)$/.test(rel)) continue
    if (guard++ > 2000) break
    const body = await readFile(path.join(outDir, rel), 'utf8')
    for (const m of body.matchAll(/(?:src|href)=(["'])(\/[^"']*)\1/g)) {
      await crawlAsset(m[2])
    }
  }

  console.log(`\nDone. ${written.size} files in ${outDir}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})