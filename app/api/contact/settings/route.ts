import { NextResponse } from 'next/server'
import { getContactSettings } from '@/lib/contact/settings'

export const dynamic = 'force-dynamic'

// Public read of the contact page configuration — always safe to expose
// (no retention settings, no keys). The contact page + form use this to
// render the closed state and the admin-editable copy/options.
export async function GET() {
  try {
    const settings = await getContactSettings()
    return NextResponse.json({ data: { enabled: settings.enabled, content: settings.content } })
  } catch (err) {
    console.warn('[Contact Settings GET]', err)
    // Fail open to the built-in defaults so the page never breaks.
    return NextResponse.json({
      data: {
        enabled: true,
        content: {
          heading: 'Tell us what you need.',
          heading_accent: "We'll do the rest.",
          intro: '',
          success_title: 'Message received!',
          success_text: '',
          closed_title: "We're not accepting new inquiries right now",
          closed_text: '',
          submit_label: 'Send inquiry',
          show_phone: true,
          show_message: true,
          services: [
            'Web Platform',
            'SaaS Architecture',
            'Mobile Application',
            'Event Technology',
            'AI & Workflow',
            'Something else',
          ],
          business_types: ['Company', 'Startup', 'Agency', 'Freelancer', 'Student', 'Personal'],
          budgets: ['Under ฿50K', '฿50K – ฿200K', '฿200K – ฿1M', '฿1M+', 'Not sure yet'],
          channels: ['Email', 'Phone', 'WhatsApp'],
        },
      },
    })
  }
}