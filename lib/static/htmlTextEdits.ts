// Client-side helpers for AI text adaptation of plain HTML (static) templates.
// The static pipeline mirrors the Puck override flow: extract an inventory of
// visible text → let Gemini rewrite it → apply exact string replacements on the
// original HTML. Nothing is persisted — preview-only.

export interface HtmlTextItem {
  id: string
  tag: string
  text: string
  rawText: string
}

export interface HtmlTextEdit {
  oldText: string
  value: string
}

// Same guardrails as lib/puck/applyOverrides: no markup, no URLs, no handlers.
function sanitizeText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .slice(0, 400)
    .trim()
}

// Tags whose text content is code or not visible copy.
const SKIP_TAGS = new Set([
  'script',
  'style',
  'noscript',
  'template',
  'textarea',
  'select',
  'option',
  'title',
  'head',
  'svg',
  'math',
])

function isSkipElement(el: Element | null): boolean {
  while (el && el.nodeType === Node.ELEMENT_NODE) {
    const tag = el.tagName.toLowerCase()
    if (SKIP_TAGS.has(tag)) return true
    if (el.hasAttribute('hidden')) return true
    if (el.getAttribute('aria-hidden') === 'true') return true
    el = el.parentElement
  }
  return false
}

const MAX_ITEMS = 25
const MAX_TEXT_LEN = 200

const collapse = (s: string) => s.replace(/\s+/g, ' ').trim()

// Walks the DOM in document order and collects visible, deduped text snippets
// with enough context (tag name) for Gemini to rewrite them sensibly.
export function extractHtmlTextInventory(html: string): HtmlTextItem[] {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)
  const seen = new Set<string>()
  const items: HtmlTextItem[] = []

  let node: Node | null
  while ((node = walker.nextNode()) && items.length < MAX_ITEMS) {
    if (!node.textContent) continue
    if (isSkipElement(node.parentElement)) continue

    const rawText = node.textContent
    const text = collapse(rawText)
    if (!text || text.length < 3 || text.length > MAX_TEXT_LEN) continue
    if (seen.has(text)) continue
    seen.add(text)

    const parent = node.parentElement
    const tag = parent ? parent.tagName.toLowerCase() : 'text'

    items.push({ id: `t${items.length}`, tag, text, rawText })
  }

  return items
}

// Entity-escaped variant of a raw text node's content, used to match the
// original string inside the raw HTML source (entities are decoded by DOMParser).
function escaped(rawText: string): string {
  return rawText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Applies oldText→value replacements on the html source in document order.
// Returns the new source and the count of replacements actually made.
export function applyHtmlTextEdits(
  html: string,
  edits: HtmlTextEdit[],
): { html: string; applied: number } {
  let out = html
  let applied = 0
  let cursor = 0

  for (const edit of edits) {
    const value = sanitizeText(edit.value)
    if (!edit.oldText || !value || value === edit.oldText) continue

    let idx = out.indexOf(edit.oldText, cursor)
    let matched = edit.oldText
    if (idx === -1) {
      const esc = escaped(edit.oldText)
      idx = out.indexOf(esc, cursor)
      matched = esc
    }
    if (idx === -1) continue

    out = out.slice(0, idx) + value + out.slice(idx + matched.length)
    cursor = idx + value.length
    applied += 1
  }

  return { html: out, applied }
}

export { sanitizeText }