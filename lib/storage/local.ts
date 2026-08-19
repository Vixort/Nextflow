import { getStorage, STORAGE_ROOT } from './index.ts'

export { STORAGE_ROOT }
export default getStorage

// ====================================================================
// Local-filesystem storage driver.
// Files live under <repo>/storage/template-assets (see STORAGE_ROOT).
// Paths are sanitized against traversal; folder-style paths ending
// with '/' remove the whole directory tree.
// ====================================================================
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, normalize, sep } from 'node:path'
import type { StorageDriver } from './index.ts'

function safePath(base: string, rawPath: string): string {
  const normalized = normalize(rawPath)
    .replace(/^([/\\])+/, '')
    .replace(/([/\\])+$/, '')
  if (normalized.split(/[/\\]/).some((part) => part === '..' || part === '' && false)) {
    throw new Error(`Invalid storage path: ${rawPath}`)
  }
  const resolved = normalize(join(base, normalized))
  if (!resolved.startsWith(normalize(base) + sep) && resolved !== normalize(base)) {
    throw new Error(`Storage path escapes root: ${rawPath}`)
  }
  return resolved
}

export const localStorage: StorageDriver = {
  async upload(path, body, _opts) {
    const target = safePath(STORAGE_ROOT, path)
    await mkdir(dirname(target), { recursive: true })
    const data = body instanceof Uint8Array ? Buffer.from(body) : Buffer.from(String(body))
    await writeFile(target, data)
  },

  async download(path) {
    const target = safePath(STORAGE_ROOT, path)
    return new Uint8Array(await readFile(target))
  },

  async remove(paths) {
    for (const raw of paths) {
      const isFolder = raw.endsWith('/')
      const target = safePath(STORAGE_ROOT, raw)
      if (isFolder) {
        await rm(target, { recursive: true, force: true })
      } else {
        await rm(target, { force: true })
      }
    }
  },
}