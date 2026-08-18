import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(), // Make it optional so it doesn't break everything if missing, but we can check it
  RESEND_API_KEY: z.string().optional(), // Contact form email delivery (Resend). Optional: DB still stores submissions without it.
  CONTACT_RECIPIENT_EMAIL: z.string().email().optional(), // Inbox that receives contact form inquiries
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

export function getEnv() {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_RECIPIENT_EMAIL: process.env.CONTACT_RECIPIENT_EMAIL,
    NODE_ENV: process.env.NODE_ENV,
  })

  if (!result.success) {
    console.error('❌ Environment Variable Validation Error:', result.error.format())
    // Fallback safe defaults or throw informative error
    return {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
      RESEND_API_KEY: process.env.RESEND_API_KEY || '',
      CONTACT_RECIPIENT_EMAIL: process.env.CONTACT_RECIPIENT_EMAIL || '',
      NODE_ENV: process.env.NODE_ENV || 'development',
      isValid: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  return { ...result.data, isValid: true }
}
