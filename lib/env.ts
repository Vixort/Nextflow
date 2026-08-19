import { z } from 'zod'

const envSchema = z.object({
  // Legacy Supabase cloud vars — no longer required (MariaDB + local
  // storage); kept optional so old .env files keep validating.
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL').optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required').optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  // MariaDB (primary database). Falls back to local dev defaults.
  DB_HOST: z.string().min(1).default('127.0.0.1'),
  DB_PORT: z.coerce.number().int().min(1).max(65535).default(3306),
  DB_USER: z.string().min(1).default('root'),
  DB_PASSWORD: z.string().default(''),
  DB_NAME: z.string().min(1).default('nextflow'),
  GEMINI_API_KEY: z.string().optional(), // Make it optional so it doesn't break everything if missing, but we can check it
  RESEND_API_KEY: z.string().optional(), // Contact form email delivery (Resend). Optional: DB still stores submissions without it.
  CONTACT_RECIPIENT_EMAIL: z.string().email().optional(), // Inbox that receives contact form inquiries
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  // JWT_SECRET is validated separately: REQUIRED in production (a
  // missing secret would fall back to the hardcoded dev key and make
  // every session token forgeable).
  JWT_SECRET: z.string().min(32).optional(),
})

export function getEnv() {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_RECIPIENT_EMAIL: process.env.CONTACT_RECIPIENT_EMAIL,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
  })

  if (!result.success) {
    console.error('❌ Environment Variable Validation Error:', result.error.format())
    // Fallback safe defaults or throw informative error
    return {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      DB_HOST: process.env.DB_HOST || '127.0.0.1',
      DB_PORT: process.env.DB_PORT || '3306',
      DB_USER: process.env.DB_USER || 'root',
      DB_PASSWORD: process.env.DB_PASSWORD || '',
      DB_NAME: process.env.DB_NAME || 'nextflow',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
      RESEND_API_KEY: process.env.RESEND_API_KEY || '',
      CONTACT_RECIPIENT_EMAIL: process.env.CONTACT_RECIPIENT_EMAIL || '',
      NODE_ENV: process.env.NODE_ENV || 'development',
      isValid: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  // Hard requirement: the JWT signing secret must never be the
  // hardcoded dev fallback in production.
  if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be set in production — without it every session token is forgeable')
  }

  return { ...result.data, isValid: true }
}
