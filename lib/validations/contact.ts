import { z } from 'zod'

export const SERVICE_TYPES = [
  'Web Platform',
  'SaaS Architecture',
  'Mobile Application',
  'Event Technology',
  'AI & Workflow',
  'Something else',
] as const

export const BUSINESS_TYPES = [
  'Company',
  'Startup',
  'Agency',
  'Freelancer',
  'Student',
  'Personal',
] as const

export const BUDGETS = [
  'Under ฿50K',
  '฿50K – ฿200K',
  '฿200K – ฿1M',
  '฿1M+',
  'Not sure yet',
] as const

export const CHANNELS = ['Email', 'Phone', 'WhatsApp'] as const

export type OptionKey = 'services' | 'business_types' | 'budgets' | 'channels'

// Admin-editable contact page content (system_settings row 'contact').
// Client-safe — no DB/server imports in this module.
export interface ContactContent {
  heading: string
  heading_accent: string
  intro: string
  success_title: string
  success_text: string
  closed_title: string
  closed_text: string
  submit_label: string
  show_phone: boolean
  show_message: boolean
  services: string[]
  business_types: string[]
  budgets: string[]
  channels: string[]
}

// Canonical option lists (admin-editable via system_settings 'contact').
export const CONTACT_OPTIONS: Record<OptionKey, readonly string[]> = {
  services: SERVICE_TYPES,
  business_types: BUSINESS_TYPES,
  budgets: BUDGETS,
  channels: CHANNELS,
}

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80),
  email: z.string().trim().email('Enter a valid email').max(120),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  serviceType: z.enum(SERVICE_TYPES, { message: 'Pick a service type' }),
  businessType: z.enum(BUSINESS_TYPES, { message: 'Pick a business type' }),
  budget: z.enum(BUDGETS, { message: 'Pick a budget range' }),
  channel: z.enum(CHANNELS, { message: 'Pick a contact channel' }),
  message: z.string().trim().max(3000).optional().or(z.literal('')),
  // Honeypot — bots fill it; real users never see it.
  website: z.string().max(0).optional(),
  sessionKey: z.string().max(80).optional(),
})

// Same shape as contactSchema but the option enums are built from the
// admin-editable lists stored in system_settings (fallback = defaults).
export function buildContactSchema(options: Partial<Record<OptionKey, string[]>> = {}) {
  const pick = (key: OptionKey): [string, ...string[]] => {
    const list = (options[key] && options[key]!.length > 0 ? options[key]! : CONTACT_OPTIONS[key]) as string[]
    return [...new Set(list)] as [string, ...string[]]
  }
  return z.object({
    name: z.string().trim().min(1, 'Name is required').max(80),
    email: z.string().trim().email('Enter a valid email').max(120),
    phone: z.string().trim().max(30).optional().or(z.literal('')),
    serviceType: z.enum(pick('services'), { message: 'Pick a service type' }),
    businessType: z.enum(pick('business_types'), { message: 'Pick a business type' }),
    budget: z.enum(pick('budgets'), { message: 'Pick a budget range' }),
    channel: z.enum(pick('channels'), { message: 'Pick a contact channel' }),
    message: z.string().trim().max(3000).optional().or(z.literal('')),
    website: z.string().max(0).optional(),
    sessionKey: z.string().max(80).optional(),
  })
}

export type ContactPayload = z.infer<typeof contactSchema>