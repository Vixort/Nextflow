import type { Data } from '@puckeditor/core'
import type { MultiPageProjectData, SitePage } from './multiPageUtils'
import { normalizeMultiPageData } from './multiPageUtils'

// ====================================================================
// PUCK ENGINE v2 — server-safe merge helpers
//
// This module is importable from server code (API routes / RSC). It only
// depends on plain data + type-only core imports — never on the client-only
// puckConfig (which pulls in React/hooks and must stay out of the RSC graph).
// ====================================================================

export interface LayoutProject {
  schema_version: 2
  pages: LayoutPage[]
  active_page_id: string
}

export interface LayoutPage {
  id: string
  name: string
  slug: string
  isHome: boolean
  data: Data // content/zones/root with text props stripped
}

// { pageId: { componentId: { field: value } } }
export type PuckTextsByPage = Record<string, Record<string, Record<string, string>>>

export interface SplitProjectResult {
  layout: LayoutProject
  texts: PuckTextsByPage
}

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object'

// Merges ONE page: re-inject componentTexts into the matching layout item props.
function mergePageData(layoutData: Data | undefined, texts: Record<string, Record<string, string>> | undefined): Data | undefined {
  if (!layoutData || typeof layoutData !== 'object') return undefined
  const inject = (items: unknown[]): unknown[] =>
    items.map((item) => {
      if (!isObj(item) || typeof item.type !== 'string') return item
      const componentTexts = isObj(texts) ? texts[String(item.id || '')] : undefined
      if (!componentTexts) return item
      const props = isObj(item.props) ? { ...item.props } : {}
      Object.entries(componentTexts).forEach(([field, value]) => {
        props[field] = value ?? ''
      })
      return { ...item, props }
    }) as unknown[]

  const zones: Record<string, unknown> = {}
  const rawZones = (layoutData as Record<string, unknown> | undefined)?.zones
  if (isObj(rawZones)) {
    Object.keys(rawZones).forEach((zoneKey) => {
      const zoneItems = rawZones[zoneKey]
      zones[zoneKey] = Array.isArray(zoneItems) ? inject(zoneItems) : []
    })
  }
  const content = Array.isArray((layoutData as Record<string, unknown>).content)
    ? inject((layoutData as Record<string, unknown>).content as unknown[])
    : []
  const root = isObj((layoutData as Record<string, unknown>).root)
    ? (layoutData as Record<string, unknown>).root
    : { props: {} }
  return { content, zones, root } as Data
}

// Merges layout + texts back into a plain Puck project the renderer/editor
// understands. Missing texts or layout fall back gracefully.
export function mergeProject(
  layout: LayoutProject | MultiPageProjectData | unknown,
  texts: PuckTextsByPage | null | undefined,
): MultiPageProjectData {
  const normalized = normalizeMultiPageData((layout as Record<string, unknown>) ?? {}, 'Home')
  const pages: SitePage[] = normalized.pages.map((page) => {
    const merged = mergePageData(
      page.data,
      texts?.[page.id],
    )
    return { ...page, data: merged ?? page.data }
  })
  return { pages, activePageId: normalized.activePageId }
}

// DB helper: turns a stored row into what the public/admin clients see.
//   - v2 rows (puck_layout + puck_texts): merge back into a full project
//   - legacy rows (puck_data only): returned as-is
export function mergeStoredTemplate(row: {
  puck_data?: unknown
  puck_layout?: unknown
  puck_texts?: unknown
}): { merged: unknown; layout: LayoutProject | null; texts: PuckTextsByPage | null } {
  const hasV2 = row.puck_layout != null
  if (!hasV2) {
    return { merged: row.puck_data ?? {}, layout: null, texts: null }
  }
  const layout = normalizeLayoutProject(row.puck_layout)
  const texts = (row.puck_texts as PuckTextsByPage | null | undefined) ?? null
  return {
    merged: toPuckProjectShape(mergeProject(layout, texts)),
    layout: layout,
    texts,
  }
}

// Turns a persisted layout (schema_version 2) into the LayoutProject type,
// tolerating the merged v1 shape as input too.
export function normalizeLayoutProject(raw: unknown): LayoutProject {
  const project = normalizeMultiPageData((raw as Record<string, unknown>) ?? {}, 'Home')
  const pages: LayoutPage[] = project.pages.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    isHome: !!p.isHome,
    data: p.data,
  }))
  return { schema_version: 2, pages, active_page_id: project.activePageId }
}

// Converts {pages, activePageId} into the persisted camelCase+snake_case
// shape that Puck consumers expect (matches assertTemplateProject output).
export function toPuckProjectShape(project: MultiPageProjectData): unknown {
  return {
    schema_version: 1,
    active_page_id: project.activePageId,
    pages: project.pages.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      isHome: p.isHome,
      data: p.data,
    })),
  }
}
