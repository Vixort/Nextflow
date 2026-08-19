import { join } from 'node:path'
import { localStorage } from './local.ts'

// ====================================================================
// Storage abstraction — file assets (static template HTML/ZIP, avatars).
// Single driver: local filesystem under <repo>/storage (gitignored).
// ====================================================================

export interface StorageDriver {
  upload(
    path: string,
    body: Uint8Array | Buffer | string,
    opts?: { contentType?: string; upsert?: boolean }
  ): Promise<void>
  download(path: string): Promise<Uint8Array>
  remove(paths: string[]): Promise<void>
}

export const TEMPLATE_ASSETS_BUCKET = 'template-assets'

// Base directory for the local driver (<repo>/storage — gitignored).
export const STORAGE_ROOT = join(process.cwd(), 'storage')

export function getStorage(): StorageDriver {
  return localStorage
}