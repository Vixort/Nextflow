import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { buildContactSchema } from '@/lib/validations/contact'
import { createAdminClient } from '@/lib/db/client'
import { logger } from '@/lib/logger'
import { getEnv } from '@/lib/env'
import { getContactSettings } from '@/lib/contact/settings'
import { isValidSessionKey } from '@/lib/contact/session'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const settings = await getContactSettings()
    if (!settings.enabled) {
      return NextResponse.json(
        { status: 503, error: 'closed', message: 'Contact form is currently closed.' },
        { status: 503 },
      )
    }

    const body = await request.json().catch(() => null)
    const parsed = buildContactSchema({
      services: settings.content.services,
      business_types: settings.content.business_types,
      budgets: settings.content.budgets,
      channels: settings.content.channels,
    }).safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { status: 400, error: 'Validation Error', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const { website, sessionKey, ...payload } = parsed.data

    // Honeypot: silently accept bots pretending to submit.
    if (website && website.length > 0) {
      return NextResponse.json({ status: 200, ok: true })
    }

    // 1. Persist first — the record survives even if email delivery fails.
    const supabase = createAdminClient()
    const { data: inquiry, error: dbError } = await supabase
      .from('inquiries')
      .insert({
        name: payload.name,
        email: payload.email,
        phone: payload.phone || null,
        service_type: payload.serviceType,
        business_type: payload.businessType,
        budget: payload.budget,
        channel: payload.channel,
        message: payload.message || null,
        source: 'contact-page',
      })
      .select('id')
      .single()

    if (dbError) {
      logger.error('Failed to store contact inquiry', { error: dbError.message })
      return NextResponse.json({ status: 500, error: 'Failed to save inquiry' }, { status: 500 })
    }

    // 2. Link the session trail to the inquiry (best-effort).
    if (isValidSessionKey(sessionKey)) {
      const { error: linkError } = await supabase
        .from('contact_sessions')
        .update({
          inquiry_id: inquiry.id,
          name: payload.name,
          email: payload.email,
          phone: payload.phone || null,
          service_type: payload.serviceType,
          business_type: payload.businessType,
          budget: payload.budget,
          channel: payload.channel,
          message: payload.message || null,
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('session_key', sessionKey)
      if (linkError) {
        logger.warn('Failed to link contact session', { error: linkError.message })
      }
    }

    // 2. Notify the owner by email (best-effort — never fail the request on it).
    const env = getEnv()
    const apiKey = env.RESEND_API_KEY
    const recipient = env.CONTACT_RECIPIENT_EMAIL

    if (apiKey && recipient) {
      try {
        const resend = new Resend(apiKey)
        const { error: mailError } = await resend.emails.send({
          from: 'Nextflow <onboarding@resend.dev>',
          to: [recipient],
          replyTo: payload.email,
          subject: `New inquiry: ${payload.serviceType}${payload.budget ? ` · ${payload.budget}` : ''}`,
          html: buildInquiryEmail(payload, request),
        })
        if (mailError) {
          logger.warn('Contact email delivery failed', { error: mailError.message })
        }
      } catch (mailErr) {
        logger.warn('Contact email delivery threw', { error: mailErr instanceof Error ? mailErr.message : 'unknown' })
      }
    } else {
      logger.warn('Email delivery skipped: RESEND_API_KEY or CONTACT_RECIPIENT_EMAIL not set')
    }

    return NextResponse.json({ status: 200, ok: true })
  } catch (err) {
    logger.error('Unexpected error in /api/contact', { error: err instanceof Error ? err.message : 'unknown' })
    return NextResponse.json({ status: 500, error: 'Something went wrong' }, { status: 500 })
  }
}

function buildInquiryEmail(
  p: {
    name: string
    email: string
    phone?: string
    serviceType: string
    businessType: string
    budget: string
    channel: string
    message?: string
  },
  request: NextRequest,
) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 0;color:#71717a;font-weight:600;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0 6px 16px;color:#18181b">${value}</td></tr>`

  return `<!DOCTYPE html>
<html><body style="margin:0;padding:24px;background:#f4f4f5;font-family:Inter,Arial,sans-serif">
<table cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7">
  <tr><td style="background:#09090b;color:#ffffff;padding:20px 24px;font-size:15px;font-weight:700">New Contact Inquiry</td></tr>
  <tr><td style="padding:20px 24px">
    <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">
      ${row('Name', p.name)}
      ${row('Email', p.email)}
      ${row('Phone', p.phone || '—')}
      ${row('Service type', p.serviceType)}
      ${row('Business type', p.businessType)}
      ${row('Budget', p.budget)}
      ${row('Preferred channel', p.channel)}
      ${row('Message', p.message ? p.message.replace(/\n/g, '<br/>') : '—')}
      ${row('Source page', '/contact')}
      ${row('Sent at', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }))}
    </table>
  </td></tr>
  <tr><td style="padding:14px 24px;border-top:1px solid #e4e4e7;color:#a1a1aa;font-size:11px">
    Replied from ${request.headers.get('origin') || 'Nextflow'} · User IP: ${request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'}
  </td></tr>
</table>
</body></html>`
}