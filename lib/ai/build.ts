import { createAdminClient } from '@/lib/db/client'
import { sanitizeText } from '@/lib/static/htmlTextEdits'
import type { LayoutProject, PuckTextsByPage } from '@/lib/puck/textMerge'

// ====================================================================
// /build server pipeline (stage 1 + 2 helpers)
//
// Stage 1: the AI picks the single best-fit template from a compact
// catalog of BUILD-READY rows (render_mode=puck + v2 storage, i.e.
// puck_layout + puck_texts present — their text lives in the DB).
// Stage 2: the AI rewrites that template's copy PER COMPONENT INSTANCE,
// validated against the component ids and text fields read from the DB.
// ====================================================================

export interface BuildableTemplate {
  id: string
  name: string
  category: string | null
  tags: string[] | null
  description: string | null
  renderMode: 'puck' | 'static'
}

// Both engine families are buildable: Puck templates with v2 storage
// (puck_layout + puck_texts) and static HTML templates with separated
// content (html_layout + html_texts) — their editable copy lives in the DB.
export async function fetchBuildableTemplates(): Promise<BuildableTemplate[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('website_templates')
    .select('id, name, category, tags, description, render_mode')
    .eq('is_active', true)
    .or('render_mode.eq.puck,puck_layout.not.is.null|render_mode.eq.static,html_layout.not.is.null')
    .order('updated_at', { ascending: false })
    .limit(40)

  if (error) {
    console.error('Failed to fetch buildable templates:', error)
    return []
  }
  return ((data ?? []) as unknown[]).map((row) => {
    const r = row as Record<string, unknown>
    return {
      id: String(r.id ?? ''),
      name: String(r.name ?? ''),
      category: r.category == null ? null : String(r.category),
      tags: Array.isArray(r.tags) ? (r.tags as string[]) : null,
      description: r.description == null ? null : String(r.description),
      renderMode: r.render_mode === 'static' ? 'static' : 'puck',
    }
  })
}

export function formatCatalog(templates: BuildableTemplate[]): string {
  return templates
    .map((t) => {
      const tags = Array.isArray(t.tags) && t.tags.length > 0 ? `tags: ${t.tags.join(', ')}` : 'tags: none'
      const desc = t.description ? ` — ${t.description}` : ''
      const engine = t.renderMode === 'static' ? ' [static HTML]' : ''
      return `[id: ${t.id}] ${t.name}${engine} (category: ${t.category || 'General'} | ${tags})${desc}`
    })
    .join('\n')
}

export interface InstanceTextEntry {
  pageId: string
  componentId: string
  componentType: string
  fields: Record<string, string>
}

// Walks a v2 layout + texts row and lists every component instance whose
// copy lives in puck_texts. Returns the valid instance map + inventory lines.
export function collectInstanceTexts(
  layout: unknown,
  texts: unknown,
): { instances: Map<string, InstanceTextEntry>; inventory: string } {
  const instances = new Map<string, InstanceTextEntry>()
  const lines: string[] = []

  const pages = Array.isArray((layout as LayoutProject | null)?.pages) ? (layout as LayoutProject).pages : []
  const textsByPage = (texts ?? {}) as PuckTextsByPage

  for (const page of pages) {
    const data = page?.data
    if (!data || typeof data !== 'object') continue
    const items: unknown[] = []
    if (Array.isArray((data as Record<string, unknown>).content)) {
      items.push(...((data as Record<string, unknown>).content as unknown[]))
    }
    const zones = (data as Record<string, unknown>).zones
    if (zones && typeof zones === 'object') {
      for (const zoneItems of Object.values(zones as Record<string, unknown[]>)) {
        if (Array.isArray(zoneItems)) items.push(...zoneItems)
      }
    }
    for (const item of items) {
      const obj = item as Record<string, unknown> | null
      if (!obj || typeof obj.type !== 'string' || typeof obj.id !== 'string') continue
      const componentTexts = textsByPage[page.id]?.[obj.id]
      if (!componentTexts || typeof componentTexts !== 'object') continue
      const fields = Object.entries(componentTexts).reduce<Record<string, string>>((acc, [field, value]) => {
        if (typeof value === 'string' && value.trim().length > 0) acc[field] = value
        return acc
      }, {})
      if (Object.keys(fields).length === 0) continue
      const entry: InstanceTextEntry = {
        pageId: page.id,
        componentId: obj.id,
        componentType: obj.type,
        fields,
      }
      instances.set(obj.id, entry)
      const values = Object.entries(fields).map(([field, value]) => `${field}="${value}"`).join(', ')
      lines.push(`${page.id}/${obj.id} (${obj.type}): ${values}`)
    }
  }

  return { instances, inventory: lines.join('\n') }
}

export interface BuiltOverride {
  componentId: string
  field: string
  value: string
}

// Filters the AI's per-instance overrides down to real component ids + real
// text fields of the chosen template. Returns the sanitized overrides and
// the applied keys (pageId/componentId.field) for the preview banner.
export function validateBuildOverrides(
  rawOverrides: unknown,
  instances: Map<string, InstanceTextEntry>,
): { overrides: BuiltOverride[]; applied: string[] } {
  const overrides: BuiltOverride[] = []
  const applied: string[] = []

  if (!Array.isArray(rawOverrides)) return { overrides, applied }

  for (const raw of rawOverrides) {
    const ov = raw as Record<string, unknown> | null
    if (!ov || typeof ov !== 'object') continue
    const componentId = typeof ov.componentId === 'string' ? ov.componentId.trim() : ''
    const field = typeof ov.field === 'string' ? ov.field.trim() : ''
    const value = sanitizeText(ov.value)
    if (!componentId || !field || !value) continue
    const instance = instances.get(componentId)
    if (!instance || !(field in instance.fields)) continue
    overrides.push({ componentId, field, value })
    applied.push(`${instance.pageId}/${componentId}.${field}`)
  }

  return { overrides, applied }
}

// ====================================================================
// Static HTML engine: inventory from html_layout/html_texts
// ====================================================================

export interface HtmlSlotEntry {
  file: string
  slotId: string
  tag: string
  text: string
}

// Reads the stored structure/copy split of a static template and lists every
// editable slot (id + tag + current copy) — the direct analog of
// collectInstanceTexts for the Puck engine.
export function collectHtmlTexts(
  layout: unknown,
  texts: unknown,
): { slots: Map<string, HtmlSlotEntry>; inventory: string } {
  const slots = new Map<string, HtmlSlotEntry>()
  const lines: string[] = []

  const layoutObj = (layout ?? {}) as { files?: Record<string, { title?: string; slots?: { id: string; tag: string; path?: string }[] }> }
  const textsObj = (texts ?? {}) as { files?: Record<string, Record<string, unknown>> }

  for (const [file, fileLayout] of Object.entries(layoutObj.files ?? {})) {
    const fileTexts = textsObj.files?.[file] ?? {}
    for (const slot of fileLayout?.slots ?? []) {
      const value = fileTexts[slot.id]
      let text = ''
      if (value && typeof value === 'object') {
        const v = value as Record<string, unknown>
        if (typeof v.alt === 'string') text = v.alt
        else if (typeof v.text === 'string') text = v.text
      }
      if (!text.trim()) continue
      const key = `${file}/${slot.id}`
      slots.set(key, { file, slotId: slot.id, tag: slot.tag || 'text', text })
      lines.push(`${key} [${slot.tag || 'text'}]: ${text}`)
    }
  }

  return { slots, inventory: lines.join('\n') }
}

export interface HtmlBuildOverride {
  file: string
  id: string
  value: string
}

// Filters the AI's slot overrides down to real files + real slot ids of the
// chosen static template. Values are sanitized exactly like the Puck path.
export function validateHtmlBuildOverrides(
  rawOverrides: unknown,
  slots: Map<string, HtmlSlotEntry>,
): { overrides: HtmlBuildOverride[]; applied: string[] } {
  const overrides: HtmlBuildOverride[] = []
  const applied: string[] = []

  if (!Array.isArray(rawOverrides)) return { overrides, applied }

  for (const raw of rawOverrides) {
    const ov = raw as Record<string, unknown> | null
    if (!ov || typeof ov !== 'object') continue
    const file = typeof ov.file === 'string' ? ov.file.trim() : ''
    const id = typeof ov.id === 'string' ? ov.id.trim() : ''
    const value = sanitizeText(ov.value)
    if (!file || !id || !value) continue
    const key = `${file}/${id}`
    if (!slots.has(key)) continue
    overrides.push({ file, id, value })
    applied.push(key)
  }

  return { overrides, applied }
}
