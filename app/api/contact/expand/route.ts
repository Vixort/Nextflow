import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAiSettings, renderPrompt, runAi, AiError } from '@/lib/ai'

const requestSchema = z.object({
  message: z
    .string()
    .min(10, 'Write a few words first — the AI needs something to work with')
    .max(3000),
  mode: z.enum(['expand', 'polish', 'concise']).default('expand'),
})

const MODE_RULES: Record<string, string> = {
  expand: 'Noticeably longer and more detailed, adding clearly implied context about goals and scope, without inventing concrete numbers, budgets, or deadlines.',
  polish: 'Professional wording with tighter sentences and correct grammar, keeping roughly the same length and every fact intact.',
  concise: 'Only the essential facts — a few crisp sentences, no filler.',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const parsed = requestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid request' },
        { status: 400 },
      )
    }

    const { message, mode } = parsed.data
    const { settings } = await getAiSettings()

    // The contact assistant is public by design (no login), gated by its own
    // toggle + dedicated key + its own rate limit (middleware).
    if (!settings.contact_enabled) {
      return NextResponse.json(
        { error: 'AI assist is currently disabled.' },
        { status: 503 },
      )
    }

    const system = renderPrompt('contact_expand', {
      action: mode,
      action_rule: MODE_RULES[mode],
    }, settings.prompts)

    const result = await runAi({
      context: 'contact',
      mode,
      path: 'contact-expand',
      system,
      user: message,
      user_id: null,
      username: null,
      ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
      userAgent: request.headers.get('user-agent'),
    })

    const text = result.text.replace(/```[a-z]*\n?/gi, '').trim()
    if (!text) {
      return NextResponse.json(
        { error: 'The AI could not process this right now. Please try again in a moment.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ text })
  } catch (error: unknown) {
    if (error instanceof AiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      )
    }
    console.error('[Contact Expand]', error)
    return NextResponse.json(
      { error: 'The AI could not process this right now. Please try again in a moment.' },
      { status: 500 },
    )
  }
}