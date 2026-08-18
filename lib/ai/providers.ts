import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AiCallResult, AiProviderId } from './types'

// Single request to one model on one provider. Throws on failure so the
// key router can fall through to the next key in priority order.

interface ProviderCall {
  provider: AiProviderId
  apiKey: string
  model: string
  system: string
  user: string
  history?: { role: 'user' | 'model'; content: string }[]
  baseUrl?: string | null
}

// Gemini requires a strictly alternating history that ALWAYS starts with a
// 'user' turn. Chat UIs often seed the thread with a system/greeting message
// (role 'model') — drop any leading model turns and collapse consecutive
// duplicate roles so the provider never rejects the request.
function normalizeHistory(history?: { role: 'user' | 'model'; content: string }[]): { role: 'user' | 'model'; content: string }[] {
  const clean: { role: 'user' | 'model'; content: string }[] = []
  for (const m of history || []) {
    const role = m.role === 'user' ? 'user' : 'model'
    const last = clean[clean.length - 1]
    if (last && last.role === role) {
      last.content = `${last.content}\n\n${m.content}`
      continue
    }
    clean.push({ role, content: m.content })
  }
  while (clean.length > 0 && clean[0].role !== 'user') {
    clean.shift()
  }
  return clean
}

const OPENAI_COMPAT_BASE: Record<string, string> = {
  openrouter: 'https://openrouter.ai/api/v1',
  openai: 'https://api.openai.com/v1',
  groq: 'https://api.groq.com/openai/v1',
}

interface CompatResponse {
  text: string
  usage?: { prompt_tokens: number; completion_tokens: number }
}

async function callOpenAICompat(cfg: ProviderCall): Promise<CompatResponse> {
  const base = cfg.baseUrl?.trim() || OPENAI_COMPAT_BASE[cfg.provider]
  if (!base) {
    throw new Error(`No base URL configured for provider "${cfg.provider}".`)
  }
  const messages: { role: string; content: string }[] = [
    { role: 'system', content: cfg.system },
  ]
  for (const m of normalizeHistory(cfg.history)) {
    messages.push({ role: m.role, content: m.content })
  }
  messages.push({ role: 'user', content: cfg.user })

  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cfg.apiKey}`,
      ...(cfg.provider === 'openrouter' ? { 'HTTP-Referer': 'https://nextflow.local', 'X-Title': 'Nextflow' } : {}),
    },
    body: JSON.stringify({
      model: cfg.model,
      messages,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
    signal: AbortSignal.timeout(45_000),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    const err = new Error(
      `${cfg.provider} ${res.status}: ${detail.slice(0, 300)}`,
    ) as Error & { status?: number }
    err.status = res.status
    throw err
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[]
    usage?: { prompt_tokens?: number; completion_tokens?: number }
  }
  return {
    text: data.choices?.[0]?.message?.content || '',
    usage: data.usage
      ? {
          prompt_tokens: data.usage.prompt_tokens || 0,
          completion_tokens: data.usage.completion_tokens || 0,
        }
      : undefined,
  }
}

async function callGemini(cfg: ProviderCall): Promise<AiCallResult> {
  const genAI = new GoogleGenerativeAI(cfg.apiKey)
  const model = genAI.getGenerativeModel({ model: cfg.model })
  const chat = model.startChat({
    history: normalizeHistory(cfg.history).map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    })),
    generationConfig: { temperature: 0.7 },
  })

  const result = await chat.sendMessage(`${cfg.system}\n\nUser: ${cfg.user}`)
  const text = result.response.text()
  const usage = result.response.usageMetadata
  return {
    text,
    promptTokens: usage?.promptTokenCount ?? 0,
    completionTokens: usage?.candidatesTokenCount ?? 0,
  }
}

export async function generateText(cfg: ProviderCall): Promise<AiCallResult> {
  // Gemini uses its native SDK unless a custom base URL is given, in which
  // case it is treated as an OpenAI-compatible endpoint.
  if (cfg.provider === 'gemini' && !cfg.baseUrl) return callGemini(cfg)
  const compat = await callOpenAICompat(cfg)
  return {
    text: compat.text,
    promptTokens: compat.usage?.prompt_tokens ?? 0,
    completionTokens: compat.usage?.completion_tokens ?? 0,
  }
}