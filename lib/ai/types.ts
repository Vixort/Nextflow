export type AiProviderId = 'gemini' | 'openrouter' | 'openai' | 'groq' | 'custom'

// A stored API key (service-role only; never exposed full to the browser).
export interface AiKeyRow {
  id: string
  provider: AiProviderId
  label: string
  key_value: string
  position: number
  enabled: boolean
  model: string | null
  base_url: string | null
}

export type PromptKey = 'template_filter' | 'template_pick' | 'template_build' | 'static_copy' | 'contact_expand'

// Catalog of every prompt the admin can customize in AI Settings. Single
// source of truth — client (admin UI) and server (prompt rendering) share it.
export const PROMPT_KEYS: { key: PromptKey; label: string; hint: string }[] = [
  {
    key: 'template_filter',
    label: 'Template filter chat',
    hint: 'Catalog chat in normal mode — suggests a tag for the user request.',
  },
  {
    key: 'template_pick',
    label: 'Template /build picker',
    hint: '/build stage 1 — picks the single best-fit Puck template (v2 storage).',
  },
  {
    key: 'template_build',
    label: 'Template /build (auto-adapt copy)',
    hint: '/build stage 2 — rewrites the chosen template copy per component instance.',
  },
  {
    key: 'static_copy',
    label: 'Static HTML copy editor',
    hint: 'AI copy editor on plain HTML template previews.',
  },
  {
    key: 'contact_expand',
    label: 'Contact form AI assist',
    hint: 'Expand / polish / shorten the contact message (no login needed).',
  },
]

export interface AiSettings {
  enabled: boolean // master switch for template AI
  contact_enabled: boolean // contact expand AI (works without login)
  require_login: boolean // force login for template AI
  contact_key_id: string | null // dedicated key for the contact page
  prompts: Record<PromptKey, string | null>
}

// Result of a single provider call.
export interface AiCallResult {
  text: string
  promptTokens: number
  completionTokens: number
}

export class AiError extends Error {
  code: 'disabled' | 'no-keys' | 'all-failed' | 'auth' | 'rate-limit'
  status: number
  constructor(code: AiError['code'], status: number, message: string) {
    super(message)
    this.code = code
    this.status = status
  }
}