// Serves the static HTML snapshot (./out) and proxies the app's API + storage
// to a running Next.js backend, so the snapshot behaves like the live site.
//
// The site is client-rendered: pages start at opacity:0 and hydrate via JS,
// and most content is fetched from /api at runtime — opening the HTML via
// file:// (or a plain static server) shows a blank page. Run this instead:
//
//   node scripts/serve-snapshot.mjs [port] [api-origin]
//
// Defaults: port 8080, API origin http://localhost:3000 (the dev/prod server).
import http from 'node:http'
import { createReadStream, existsSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '..', 'out')
const port = Number(process.argv[2] || 8080)
const apiOrigin = process.argv[3] || 'http://localhost:3000'

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
}

function contentType(p) {
  return CONTENT_TYPES[path.extname(p).toLowerCase()] || 'application/octet-stream'
}

async function proxyApi(req, res) {
  const target = `${apiOrigin}${req.url}`
  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers: {
        ...Object.fromEntries(
          ['cookie', 'authorization', 'content-type', 'x-forwarded-for', 'user-agent']
            .filter((h) => req.headers[h])
            .map((h) => [h, req.headers[h]]),
        ),
      },
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : req,
      redirect: 'manual',
    })
    const body = Buffer.from(await upstream.arrayBuffer())
    res.writeHead(upstream.status, {
      'content-type': upstream.headers.get('content-type') || 'application/json',
      'cache-control': 'no-store',
      ...(upstream.headers.get('set-cookie') ? { 'set-cookie': upstream.headers.get('set-cookie') } : {}),
    })
    res.end(body)
  } catch (err) {
    res.writeHead(502, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ error: 'API proxy unreachable', detail: String(err.message) }))
  }
}

async function serveStatic(req, res) {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  let filePath = path.normalize(path.join(outDir, urlPath))
  if (!filePath.startsWith(outDir)) {
    res.writeHead(403).end('Forbidden')
    return
  }
  // Directory → index.html; unknown extension → serve the SPA shell.
  if (urlPath === '/' || urlPath.endsWith('/')) filePath = path.join(filePath, 'index.html')
  if (!path.extname(filePath)) filePath += '.html'
  if (!existsSync(filePath)) {
    // SPA fallback: any non-asset route renders the app shell.
    filePath = path.join(outDir, 'index.html')
  }
  try {
    const s = await stat(filePath)
    res.writeHead(200, {
      'content-type': contentType(filePath),
      'content-length': s.size,
      'cache-control': 'no-cache',
    })
    createReadStream(filePath).pipe(res)
  } catch {
    res.writeHead(404).end('Not found')
  }
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/') || req.url.startsWith('/storage/')) {
    return proxyApi(req, res)
  }
  return serveStatic(req, res)
})

server.listen(port, () => {
  console.log(`Static snapshot server: http://localhost:${port}`)
  console.log(`  serving  ${outDir}`)
  console.log(`  proxying /api + /storage -> ${apiOrigin}`)
  console.log(`  requires the Next.js backend running (npm run dev / npm run start)`)
})