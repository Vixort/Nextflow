import { createAdminClient } from '@/lib/db/client'
import { getAiSettings, pickKeyPool, envFallbackKeys } from './settings'
import { generateText } from './providers'
import { AiError, type AiProviderId, type PromptKey } from './types'

export const DEFAULT_PROMPTS: Record<PromptKey, string> = {
  template_filter: `
You are an expert AI assistant for the 'Nextflow' website template marketplace.
The available tags to filter templates are: {{tags}}.
Your task is to help the user find the right template for their needs.

Respond in a helpful, concise, and professional tone. Do not use emojis (Anti-AI-Slop design rule).

Suggest ONE active tag from the available tags if the user is looking for a specific type of template.
If the request is too broad or conversational, suggestedTag is null.

You MUST respond strictly in the following JSON format:
{
  "reply": "Your message to the user here.",
  "suggestedTag": "The exact tag name from the list, or null if none apply.",
  "overrides": []
}
Do not include any markdown formatting like \`\`\`json. Return only raw JSON.
  `.trim(),

  template_pick: `
You are an expert template selector for the 'Nextflow' website template marketplace.
The user typed "/build" — you must pick the SINGLE best-fit website template from the
catalog below. The chosen template's copy is automatically rewritten afterwards, so
choose by project type and structure fit, never by the current placeholder copy.

TEMPLATE CATALOG (only these ids are selectable; format: "[id: <id>] <name> (category: <c> | tags: <tags>) — <description>"):
{{catalog}}

Rules:
- Choose the ONE template whose category, tags and description best match the user's
  request (project type, niche, tone, audience, needed sections such as pricing / FAQ / contact).
- Prefer exact keyword matches: e.g. restaurant → food/restaurant, portfolio → portfolio,
  shop / store / e-commerce → e-commerce category.
- Return the exact "id" string shown in the catalog. NEVER invent, alter or guess ids.
- If several templates look equally close, pick the one that covers the most requested sections.
- If NO template genuinely fits, templateId must be null — never force a weak match.
- reply: name the chosen template and state in one short line what will be adapted.
- Respond in a helpful, concise, professional tone. Do not use emojis (Anti-AI-Slop design rule).

You MUST respond strictly in the following JSON format:
{
  "reply": "Your message to the user here, naming the chosen template.",
  "templateId": "the exact template id from the catalog, or null"
}
Do not include any markdown formatting like \`\`\`json. Return only raw JSON.
  `.trim(),

  template_build: `
You are an expert AI copywriter for the 'Nextflow' website template marketplace.
The user wants you to rewrite the copy of the SELECTED template to fit their project:
"{{request}}"

Below is the EDITABLE TEXT INVENTORY of the chosen template — every text field of every
component or HTML element, identified by its id (Puck: "pageId/componentId"; static HTML:
"file/slotId") with the current value in quotes.

Rules:
- Rewrite copy across the WHOLE template: hero, navbar, features, stats, pricing,
  testimonials, FAQ, CTA banners, and footer. Target MANY ids, not one.
- You may ONLY target ids listed in the inventory. Never invent ids or fields.
- For Puck templates (inventory lines like "pageId/componentId (Type): field=\"value\""),
  return overrides with componentId + field. For static HTML templates (inventory lines like
  "file/slotId [tag]: text"), return overrides with file + id. Match the format of the inventory.
- Values must be short, punchy, on-brand plain text under 40 words. Do not touch urls, css, images.
- Keep every fact (prices, emails, phone numbers, addresses, existing brand names) unless the
  user explicitly asks to change it.
- Respond in a helpful, concise, professional tone. No emojis (Anti-AI-Slop design rule).

EDITABLE TEXT INVENTORY:
{{inventory}}
(If the inventory is empty, return an empty overrides array.)

You MUST respond strictly in the following JSON format:
{
  "reply": "Your message to the user here.",
  "overrides": [
    { "componentId": "hero-1", "field": "title", "value": "Train Harder. Recover Faster." }
  ]
}
For static templates the overrides entries look like:
{ "file": "index.html", "id": "i0", "value": "New nav label" }
Include only items you actually changed. Do not include any markdown formatting like \`\`\`json. Return only raw JSON.
  `.trim(),

  static_copy: `
You are a copy editor for a plain HTML website template. There is no component system — only raw
visible text on the page. The user asks you to adapt the page copy to their request (brand, niche, tone).

Below is the STATIC TEXT INVENTORY: the visible text of the page, each item with an id and its element tag.

Rules:
- Rewrite ONLY the items that genuinely need to change for the request. Keep every fact (prices, emails,
  phone numbers, addresses, existing brand names) unless the user explicitly asks to change it.
- Values are plain text only: no HTML tags, no markdown, no surrounding quotes.
- Keep the new text similar in length to the original.
- Never invent items or ids that are not listed in the inventory.
- Respond in a helpful, concise, professional tone. No emojis (Anti-AI-Slop design rule).

STATIC TEXT INVENTORY:
{{inventory}}

You MUST respond strictly in the following JSON format:
{
  "reply": "Your message to the user here.",
  "overrides": [
    { "id": "t0", "value": "new text" }
  ]
}
Include only items you changed; if nothing needs changing return "overrides": [].
Do not include any markdown formatting like \`\`\`json. Return only raw JSON.
  `.trim(),

  contact_expand: `
You are a professional copy assistant for a web development studio's contact form.
The user typed a short message and wants it {{action}} (mode: expand = richer brief,
polish = more professional wording keeping every fact, concise = shorter and to the point).

Rules:
- Return ONLY the rewritten message as plain text: no JSON, no markdown, no quotes, no HTML.
- Keep every fact the user mentioned (budget, goals, constraints, contact details). Never invent data.
- {{action_rule}}
- Respond in a helpful, concise, professional tone. No emojis (Anti-AI-Slop design rule).
  `.trim(),
}

// Renders the effective prompt for a key: the admin-edited settings prompt
// wins when non-empty, otherwise the built-in default. Placeholders are
// filled last so custom prompts can reuse the same {{vars}}.
export function renderPrompt(key: PromptKey, vars: Record<string, string>, overrides?: Partial<Record<PromptKey, string | null>>): string {
  const custom = overrides?.[key]
  const template = (custom && custom.trim()) || DEFAULT_PROMPTS[key]
  let out = template
  for (const [name, value] of Object.entries(vars)) {
    out = out.replaceAll(`{{${name}}}`, value)
  }
  return out
}

// Robustly extracts the first JSON object embedded in an AI response. Models
// sometimes wrap the JSON in prose or markdown fences, or append extra text
// after the closing brace — instead of failing, scan for the first balanced
// {...} block (string-aware) and parse just that.
export function extractJsonObject<T = Record<string, unknown>>(text: string): T | null {
  const t = text.trim().replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/, '').trim()

  try {
    return JSON.parse(t) as T
  } catch {
    // fall through to balanced-brace extraction
  }

  let start = -1
  let depth = 0
  let inString = false
  let escaped = false
  for (let i = 0; i < t.length; i++) {
    const ch = t[i]
    if (inString) {
      if (escaped) escaped = false
      else if (ch === '\\') escaped = true
      else if (ch === '"') inString = false
      continue
    }
    if (ch === '"') {
      inString = true
      continue
    }
    if (ch === '{') {
      if (start === -1) start = i
      depth++
    } else if (ch === '}') {
      depth--
      if (depth === 0) {
        try {
          return JSON.parse(t.slice(start, i + 1)) as T
        } catch {
          // malformed block — keep scanning for a later balanced block
          start = -1
        }
      }
    }
  }
  return null
}

// In-memory failure cooldown per key id: a failing key is skipped for 30s so
// the router swaps to the next priority key without hammering a dead one.
const keyCooldown = new Map<string, number>()

interface LogEntry {
  user_id?: string | null
  username?: string | null
  path?: string | null
  provider: AiProviderId | string
  model: string
  mode?: string | null
  prompt?: string | null
  response?: string | null
  prompt_tokens?: number
  completion_tokens?: number
  ip_address?: string | null
  user_agent?: string | null
  duration_ms?: number
  error?: string | null
}

async function logAiCall(entry: LogEntry): Promise<void> {
  try {
    const supabase = createAdminClient()
    await supabase.from('ai_chat_logs').insert({
      user_id: entry.user_id || null,
      username: entry.username || null,
      path: entry.path || null,
      provider: entry.provider,
      model: entry.model,
      mode: entry.mode || null,
      prompt: entry.prompt ? String(entry.prompt).slice(0, 2000) : null,
      response: entry.response ? String(entry.response).slice(0, 1000) : null,
      prompt_tokens: entry.prompt_tokens ?? null,
      completion_tokens: entry.completion_tokens ?? null,
      ip_address: entry.ip_address || null,
      user_agent: entry.user_agent ? String(entry.user_agent).slice(0, 300) : null,
      duration_ms: entry.duration_ms ?? null,
      error: entry.error ? String(entry.error).slice(0, 300) : null,
    })
  } catch (err) {
    console.warn('[AI Log] failed to persist:', err)
  }
}

export interface AiRunOptions {
  context: 'templates' | 'contact'
  mode: string
  path?: string
  system: string
  user: string
  history?: { role: 'user' | 'model'; content: string }[]
  user_id?: string | null
  username?: string | null
  ip?: string | null
  userAgent?: string | null
}

export interface AiRunResult {
  text: string
  provider: AiProviderId
  model: string
  keyId: string
}

// Default model per provider, used when a key row has no explicit model.
const DEFAULT_MODELS: Record<AiProviderId, string> = {
  gemini: 'gemini-2.5-flash',
  openrouter: 'openrouter/auto',
  openai: 'gpt-4o-mini',
  groq: 'llama-3.3-70b-versatile',
  custom: '',
}

// Runs the request through the configured key pool in priority order,
// swapping to the next key on failure. Logs every call to ai_chat_logs.
export async function runAi(opts: AiRunOptions): Promise<AiRunResult> {
  const { settings, keys } = await getAiSettings()

  if (opts.context === 'templates' && !settings.enabled) {
    throw new AiError('disabled', 503, 'AI is currently disabled by the admin.')
  }
  if (opts.context === 'contact' && !settings.contact_enabled) {
    throw new AiError('disabled', 503, 'AI assist is currently disabled.')
  }

  const pool = pickKeyPool(settings, keys, opts.context)
  const candidates = pool.length > 0 ? pool : envFallbackKeys()
  if (candidates.length === 0) {
    throw new AiError('no-keys', 503, 'No AI API keys are configured yet.')
  }

  const started = Date.now()
  let lastError: unknown = null

  for (const key of candidates) {
    const cooldownUntil = keyCooldown.get(key.id)
    if (cooldownUntil && cooldownUntil > Date.now()) continue

    const model = key.model || DEFAULT_MODELS[key.provider]
    if (!model) {
      lastError = new Error(`No model configured for key "${key.label || key.id}".`)
      continue
    }
    try {
      const result = await generateText({
        provider: key.provider,
        apiKey: key.key_value,
        model,
        system: opts.system,
        user: opts.user,
        history: opts.history,
        baseUrl: key.base_url,
      })
      keyCooldown.delete(key.id)
      void logAiCall({
        user_id: opts.user_id,
        username: opts.username,
        path: opts.path || null,
        provider: key.provider,
        model,
        mode: opts.mode,
        prompt: opts.user,
        response: result.text,
        prompt_tokens: result.promptTokens,
        completion_tokens: result.completionTokens,
        ip_address: opts.ip,
        user_agent: opts.userAgent,
        duration_ms: Date.now() - started,
      })
      return { text: result.text, provider: key.provider, model, keyId: key.id }
    } catch (err) {
      lastError = err
      keyCooldown.set(key.id, Date.now() + 30_000)
      console.warn(`[AI Router] key ${key.id} (${key.provider}) failed:`, (err as Error)?.message || err)
    }
  }

  void logAiCall({
    user_id: opts.user_id,
    username: opts.username,
    path: opts.path || null,
    provider: 'none',
    model: '—',
    mode: opts.mode,
    prompt: opts.user,
    ip_address: opts.ip,
    user_agent: opts.userAgent,
    duration_ms: Date.now() - started,
    error: lastError instanceof Error ? lastError.message : 'all providers failed',
  })
  throw new AiError('all-failed', 502, 'All AI providers failed. Please try again in a moment.')
}