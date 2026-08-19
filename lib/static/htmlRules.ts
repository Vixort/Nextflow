// Shared extraction rules between the client-side live extractor
// (htmlTextEdits.ts, DOMParser) and the server-side DB extractor
// (htmlContent.ts, linkedom). Keep these in sync — they define what counts
// as editable copy in a static HTML template.

// Tags whose text content is code or not visible copy.
export const SKIP_TAGS = new Set([
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

// Per-file cap on extracted slots (keeps AI prompts bounded).
export const MAX_ITEMS = 25
export const MAX_TEXT_LEN = 200

export const collapse = (s: string): string => s.replace(/\s+/g, ' ').trim()
