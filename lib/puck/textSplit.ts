import type { Data } from '@puckeditor/core'
import { puckConfig } from './puckConfig'
import type { MultiPageProjectData, SitePage } from './multiPageUtils'
import { normalizeMultiPageData } from './multiPageUtils'
import { mergeProject, toPuckProjectShape, type LayoutProject, type PuckTextsByPage } from './textMerge'

export type { PuckTextsByPage, LayoutProject, SplitProjectResult } from './textMerge'

// ====================================================================
// PUCK ENGINE v2 — layout/text split (CLIENT ONLY)
//
// Storage model (website_templates.puck_layout / puck_texts):
//   - puck_layout: versioned project WITHOUT copy fields in props — only
//     structure (component ids/types/order) and non-text props (urls, css,
//     images, booleans, numbers).
//   - puck_texts:  { [pageId]: { [componentId]: { [field]: string } } } —
//     every visible copy string lives here, keyed by component id so the AI
//     (or any tool) can rewrite text without ever touching the layout.
//
// This module imports puckConfig (a React/hooks client module), so it must
// only be imported from client components. Server-side code (API routes)
// must use ./textMerge instead.
// ====================================================================

// Field names matching these are never copy — urls, styles, images or
// binary payloads that editors/the AI must not treat as plain text.
const SKIP_FIELD = /url|href|src|srcset|css|customcss|class|image|img|icon|avatar|photo|video|poster|thumbnail|storage|path|import|json/i

const TEXT_FIELD_TYPES = new Set(['text', 'textarea'])

interface RawField {
  type?: string
  [key: string]: unknown
}

// Builds the copy (text/textarea) fields for a component by introspecting the
// Puck config itself. Covers all ~160 components without a hand-maintained
// allowlist. Only safe user-facing text props are kept.
function getEditableFieldsFor(componentType: string): string[] {
  const component = (puckConfig.components as Record<string, { fields?: Record<string, RawField> } | undefined>)[componentType]
  if (!component?.fields) return []

  return Object.entries(component.fields)
    .filter(([name, field]) => {
      const type = field?.type
      const isTextual = typeof type === 'string' && TEXT_FIELD_TYPES.has(type)
      const isSafe = !SKIP_FIELD.test(name)
      return isTextual && isSafe
    })
    .map(([name]) => name)
}

const editableFieldCache = new Map<string, string[]>()

function editableFields(componentType: string): string[] {
  if (!editableFieldCache.has(componentType)) {
    editableFieldCache.set(componentType, getEditableFieldsFor(componentType))
  }
  return editableFieldCache.get(componentType) ?? []
}

// PUBLIC: the exact copy fields the AI/editor may rewrite for a component.
export function getEditableFields(componentType: string): string[] {
  return editableFields(componentType)
}

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object'

// Splits ONE Puck page Data into (layoutData, componentTexts).
function splitPageData(data: Data | undefined, texts: Record<string, Record<string, string>>): Data | undefined {
  if (!data || typeof data !== 'object') return undefined
  const copy = (raw?: Data): Data | undefined => {
    const strip = (items: unknown[]): unknown[] =>
      items
        .map((item) => {
          if (!isObj(item) || typeof item.type !== 'string') return item
          const allowed = editableFields(item.type)
          if (allowed.length === 0) return item
          const props = isObj(item.props) ? { ...item.props } : {}
          const componentTexts: Record<string, string> = {}
          let hasText = false
          allowed.forEach((field) => {
            if (typeof props[field] === 'string') {
              componentTexts[field] = props[field]
              delete props[field]
              hasText = true
            }
          })
          if (hasText) {
            if (typeof item.id === 'string') texts[item.id] = componentTexts
            return { ...item, props }
          }
          return item
        })
        .filter(Boolean) as unknown[]

    const zones: Record<string, unknown> = {}
    const rawZones = (raw as Record<string, unknown> | undefined)?.zones
    if (isObj(rawZones)) {
      Object.keys(rawZones).forEach((zoneKey) => {
        const zoneItems = rawZones[zoneKey]
        zones[zoneKey] = Array.isArray(zoneItems) ? strip(zoneItems) : []
      })
    }
    const content = Array.isArray((raw as Record<string, unknown> | undefined)?.content)
      ? strip((raw as Record<string, unknown>).content as unknown[])
      : []
    const root = isObj((raw as Record<string, unknown> | undefined)?.root)
      ? (raw as Record<string, unknown>).root
      : { props: {} }
    return { content, zones, root } as Data
  }
  return copy(data)
}

// Splits a full (merged) project into its layout + per-page texts halves.
export function splitProject(project: MultiPageProjectData): { layout: LayoutProject; texts: PuckTextsByPage } {
  const texts: PuckTextsByPage = {}
  const pages: LayoutProject['pages'] = project.pages.map((page) => {
    const pageTexts: Record<string, Record<string, string>> = {}
    const layoutData = splitPageData(page.data, pageTexts)
    if (Object.keys(pageTexts).length > 0) texts[page.id] = pageTexts
    return {
      id: page.id,
      name: page.name,
      slug: page.slug,
      isHome: !!page.isHome,
      data: layoutData ?? { content: [], zones: {}, root: { props: {} } },
    }
  })
  const active_page_id = project.activePageId
  return { layout: { schema_version: 2, pages, active_page_id }, texts }
}

// Storage helper: normalizes a merged project (from the Puck editor / seeds)
// into the persisted shape `{ layout, texts }` used by puck_layout/puck_texts
// plus the merged snapshot kept in puck_data for backward compatibility.
export function splitForStorage(project: unknown): {
  layout: LayoutProject
  texts: PuckTextsByPage
  merged: unknown
} {
  const normalized = normalizeMultiPageData((project as Record<string, unknown>) ?? {}, 'Home')
  const { layout, texts } = splitProject(normalized)
  return { layout, texts, merged: toPuckProjectShape(normalized) }
}

// Builds a compact copy inventory of every component INSTANCE present in a
// list of Puck templates, including the current value of each field so the AI
// can write copy that fits the existing text. Line format:
//   pageId/componentId (ComponentType): field1="value1", field2="value2"
export function buildTemplateTextInventory(
  templates: Array<{ name?: string | null; puck_data?: unknown; puck_layout?: unknown; puck_texts?: unknown; render_mode?: string | null }>,
): string {
  const lines: string[] = []
  for (const t of templates) {
    if (t?.render_mode === 'static') continue
    // v2 storage: layout is stripped, texts live separately.
    // legacy storage: puck_data is already fully merged (texts in props).
    const layout = t.puck_layout ?? t.puck_data
    const texts = t.puck_layout ? ((t.puck_texts as PuckTextsByPage | undefined) ?? {}) : undefined
    const project = mergeProject(layout, texts)
    for (const page of project.pages) {
      const walk = (items: unknown[]) => {
        for (const item of items) {
          if (!isObj(item) || typeof item.type !== 'string') continue
          if (!isObj(item.props)) continue
          const editable = editableFields(item.type)
          const values: string[] = []
          for (const field of editable) {
            const raw = item.props[field]
            if (typeof raw !== 'string' || !raw) continue
            const currentValue = texts?.[page.id]?.[String(item.id || '')]?.[field] ?? raw
            values.push(`${field}="${currentValue}"`)
          }
          if (values.length > 0 && typeof item.id === 'string') {
            lines.push(`${page.id}/${item.id} (${item.type}): ${values.join(', ')}`)
          }
        }
      }
      walk(page.data?.content ?? [])
      const pageZones = (page.data as Record<string, unknown> | undefined)?.zones
      if (isObj(pageZones)) {
        Object.keys(pageZones).forEach((zoneKey) => {
          walk((pageZones[zoneKey] as unknown[] | undefined) || [])
        })
      }
    }
  }
  return lines.join('\n')
}

export interface ComponentTextOverride {
  componentId?: unknown
  component?: unknown // legacy: component type, applies to every instance
  field: unknown
  value: unknown
}

// Strip any attempt to smuggle in HTML/URLs/scripts.
export function sanitizeOverrideText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .slice(0, 400)
    .trim()
}

// Applies AI overrides to a MERGED project:
//   - { componentId, field, value } touches ONLY that instance
//   - legacy { component, field, value } touches every instance of the type
// Returns a deep copy of the project pages plus the applied field keys.
export function applyComponentOverrides(
  project: { pages: SitePage[] },
  overrides: unknown[],
): { pages: SitePage[]; overridden: boolean; applied: string[] } {
  const valid = Array.isArray(overrides)
    ? overrides.filter(
        (ov): ov is ComponentTextOverride =>
          !!ov && typeof ov === 'object' && typeof (ov as { field?: unknown }).field === 'string' && typeof (ov as { value?: unknown }).value === 'string',
      )
    : []
  const matched = new Set<string>()

  const pages = project.pages.map((page) => {
    if (!isObj(page)) return page
    const raw = isObj(page.data) ? page.data : null
    const rewrite = (items: unknown[]): unknown[] =>
      items.map((item) => {
        if (!isObj(item) || typeof item.type !== 'string') return item
        const allowed = editableFields(item.type)
        if (allowed.length === 0) return item
        const props = isObj(item.props) ? { ...item.props } : {}
        let changed = false
        valid.forEach((ov) => {
          if (typeof ov.field !== 'string' || typeof ov.value !== 'string') return
          if (!allowed.includes(ov.field)) return
          const byId = typeof ov.componentId === 'string' && ov.componentId.length > 0
          const matches = byId
            ? ov.componentId === String(item.id || '')
            : typeof ov.component === 'string' && ov.component === item.type
          if (!matches) return
          props[ov.field] = sanitizeOverrideText(ov.value)
          matched.add(matches ? `${page.id}/${ov.componentId}.${ov.field}` : `${page.id}/${item.type}.${ov.field}`)
          changed = true
        })
        return changed ? { ...item, props } : item
      })

    const contentSrc = raw && Array.isArray(raw.content) ? (raw.content as unknown[]) : []
    const content = rewrite(contentSrc)

    const zones: Record<string, unknown> = {}
    if (raw && isObj(raw.zones)) {
      Object.keys(raw.zones).forEach((zoneKey) => {
        const zoneItems = (raw.zones as Record<string, unknown[]>)[zoneKey]
        zones[zoneKey] = Array.isArray(zoneItems) ? rewrite(zoneItems) : []
      })
    }

    const data = raw ? { ...raw, content, zones } : { content, zones, root: { props: {} } }
    return { ...page, data: data as Data }
  })

  return { pages, overridden: matched.size > 0, applied: Array.from(matched) }
}
