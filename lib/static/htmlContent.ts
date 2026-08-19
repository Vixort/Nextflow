// Server-side structure/content splitter for plain HTML (static) templates.
//
// Mirrors the Puck v2 split (puck_layout / puck_texts) for raw HTML sites:
// each .html file is reduced to
//   html_layout — the text-bearing elements with their attributes (structure)
//   html_texts  — the copy inside those elements, keyed by stable slot ids
// so the /build AI pipeline can read a template's copy straight from the DB
// without parsing files. Same extraction rules as the client-side live
// extractor (lib/static/htmlTextEdits.ts) — see htmlRules.ts.
//
// Server-only module (uses linkedom). Do not import from client components.

import { parseHTML } from 'linkedom'
import type { HtmlTextItem } from './htmlTextEdits'
import { SKIP_TAGS, MAX_ITEMS, MAX_TEXT_LEN, collapse } from './htmlRules'

export interface HtmlSlot {
  id: string
  tag: string
  path: string
  attrs: Record<string, string>
  hasAlt?: boolean
}

export interface HtmlFileLayout {
  title: string
  slots: HtmlSlot[]
}

export interface HtmlLayout {
  schema_version: 1
  files: Record<string, HtmlFileLayout>
}

export type HtmlSlotTexts =
  | { text: string; rawText: string }
  | { alt: string }

export interface HtmlTexts {
  schema_version: 1
  files: Record<string, Record<string, HtmlSlotTexts>>
}

// Attribute whitelist kept in the structure side (never content).
const STRUCTURE_ATTRS = ['class', 'id', 'href', 'src', 'type', 'role']
const ATTR_MAX_LEN = 200

function isSkipTag(tag: string): boolean {
  return SKIP_TAGS.has(tag)
}

// Builds the index path of an element, e.g. "body>header[0]>nav[0]>a[0]".
// Positions are element-sibling indices; the root element's own index is
// dropped (html/body are always position 0 in practice).
function buildPath(stack: { tag: string; idx: number }[]): string {
  const path = stack.map((s) => `${s.tag}[${s.idx}]`).join('>')
  return path.replace(/^(?:html|body)\[\d+\]/, (m) => m.slice(0, m.indexOf('[')))
}

function elementIndex(el: Element): number {
  let idx = 0
  let prev = el.previousElementSibling
  while (prev) {
    idx += 1
    prev = prev.previousElementSibling
  }
  return idx
}

function pickAttrs(el: Element): Record<string, string> {
  const attrs: Record<string, string> = {}
  for (const name of STRUCTURE_ATTRS) {
    const value = el.getAttribute(name)
    if (!value) continue
    const v = value.trim()
    if (!v || v.startsWith('data:')) continue
    attrs[name] = v.slice(0, ATTR_MAX_LEN)
  }
  return attrs
}

interface WalkState {
  seen: Set<string>
  slots: HtmlSlot[]
  texts: Record<string, HtmlSlotTexts>
  stack: { tag: string; idx: number }[]
}

// Single pass in document order: pushes a path entry for every element,
// collects img alt copy and text-node copy, and never descends into
// skip/hidden subtrees.
function walk(el: Element, state: WalkState): void {
  const tag = el.tagName.toLowerCase()
  state.stack.push({ tag, idx: elementIndex(el) })
  const path = buildPath(state.stack)

  const isHidden = el.hasAttribute('hidden') || el.getAttribute('aria-hidden') === 'true'

  if (tag === 'img') {
    const alt = collapse(el.getAttribute('alt') || '')
    if (
      alt &&
      alt.length >= 3 &&
      alt.length <= MAX_TEXT_LEN &&
      !state.seen.has(alt) &&
      state.slots.length < MAX_ITEMS
    ) {
      const id = `i${state.slots.length}`
      state.seen.add(alt)
      state.slots.push({ id, tag, path, attrs: pickAttrs(el), hasAlt: true })
      state.texts[id] = { alt }
    }
  }

  if (!isHidden && !isSkipTag(tag)) {
    for (const node of el.childNodes ?? []) {
      if (node.nodeType === 3 /* TEXT_NODE */) {
        const rawText = node.textContent ?? ''
        const text = collapse(rawText)
        if (
          text &&
          text.length >= 3 &&
          text.length <= MAX_TEXT_LEN &&
          !state.seen.has(text) &&
          state.slots.length < MAX_ITEMS
        ) {
          const id = `i${state.slots.length}`
          state.seen.add(text)
          state.slots.push({ id, tag, path, attrs: pickAttrs(el) })
          state.texts[id] = { text, rawText: rawText.trim() }
        }
      } else if (node.nodeType === 1 /* ELEMENT_NODE */) {
        walk(node as Element, state)
      }
    }
  }

  state.stack.pop()
}

// Splits one HTML source into { layout, texts } for a single file.
export function extractHtmlContent(html: string): {
  layout: HtmlFileLayout
  texts: Record<string, HtmlSlotTexts>
} {
  const { document } = parseHTML(html)
  const state: WalkState = { seen: new Set(), slots: [], texts: {}, stack: [] }

  const root = document.querySelector('body') ?? document.documentElement
  if (root) walk(root as Element, state)

  const title = document.querySelector('title')?.textContent?.trim().slice(0, 200) ?? ''

  return {
    layout: { title, slots: state.slots },
    texts: state.texts,
  }
}

// Builds the client-compatible inventory (id/tag/text/rawText) from stored
// DB data for one file — no file parsing needed.
export function buildHtmlInventory(
  layout: HtmlLayout | null | undefined,
  texts: HtmlTexts | null | undefined,
  file: string,
): HtmlTextItem[] {
  const slots = layout?.files?.[file]?.slots ?? []
  const fileTexts = texts?.files?.[file] ?? {}
  const items: HtmlTextItem[] = []

  for (const slot of slots) {
    const value = fileTexts[slot.id]
    if (!value || typeof value !== 'object') continue
    if ('alt' in value) {
      items.push({ id: slot.id, tag: slot.tag, text: value.alt, rawText: value.alt })
    } else if (typeof value.text === 'string') {
      items.push({ id: slot.id, tag: slot.tag, text: value.text, rawText: value.rawText ?? value.text })
    }
  }
  return items
}

// Applies AI copy overrides to a stored html_texts map (immutable).
export function applyHtmlTextsOverrides(
  texts: HtmlTexts | null | undefined,
  overrides: { file: string; id: string; value: string }[],
): HtmlTexts {
  const base: HtmlTexts = { schema_version: 1, files: {} }
  for (const [file, entries] of Object.entries(texts?.files ?? {})) {
    base.files[file] = { ...entries }
  }
  for (const ov of overrides) {
    const file = base.files[ov.file]
    if (!file) continue
    const current = file[ov.id]
    if (typeof current === 'object' && 'alt' in current) {
      file[ov.id] = { alt: ov.value }
    } else if (current && typeof current === 'object') {
      file[ov.id] = { text: ov.value, rawText: ov.value }
    }
  }
  return base
}
