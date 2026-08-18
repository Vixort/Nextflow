-- ============================================================
-- NEXTFLOW FULL PRODUCT DATABASE SCHEMA & SEED SCRIPT
-- Execute this script in Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Users Table (with expanded roles: owner, admin, moderator, user)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('owner', 'admin', 'moderator', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Ensure Constraint allows new roles if table already existed
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('owner', 'admin', 'moderator', 'user'));

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow self update on users" ON public.users FOR UPDATE USING (true);

-- 3. Create Profiles Table (Legacy compatibility)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('owner', 'admin', 'moderator', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select on profiles" ON public.profiles FOR SELECT USING (true);

-- 4. Create Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  username TEXT,
  user_role TEXT,
  event_type TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  path TEXT,
  from_path TEXT,
  to_path TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_event_type ON public.activity_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select on activity_logs" ON public.activity_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert on activity_logs" ON public.activity_logs FOR INSERT WITH CHECK (true);

-- 5. Create System Settings Table
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_by UUID
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select on system_settings" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on system_settings" ON public.system_settings FOR ALL USING (true);

-- 6. Create Dedicated Home Sections Table (Dynamic No-Code Layout Builder)
CREATE TABLE IF NOT EXISTS public.home_sections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'custom',
  section_order INT NOT NULL DEFAULT 1,
  visible BOOLEAN NOT NULL DEFAULT true,
  is_builtin BOOLEAN NOT NULL DEFAULT false,
  custom_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

ALTER TABLE public.home_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select on home_sections" ON public.home_sections FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on home_sections" ON public.home_sections FOR ALL USING (true);

-- 7. Create Custom Website Templates Table (Puck Studio project JSON)
CREATE TABLE IF NOT EXISTS public.website_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Landing Page',
  tags TEXT[] DEFAULT '{}'::text[],
  thumbnail_url TEXT,
  puck_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  puck_layout JSONB,
  puck_texts JSONB,
  global_css TEXT DEFAULT '',
  render_mode TEXT NOT NULL DEFAULT 'puck' CHECK (render_mode IN ('puck', 'static')),
  storage_path TEXT,
  file_name TEXT,
  storage_size_bytes BIGINT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

ALTER TABLE public.website_templates ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.website_templates FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS website_templates_updated_at_idx ON public.website_templates (updated_at DESC);
CREATE INDEX IF NOT EXISTS website_templates_tags_idx ON public.website_templates USING GIN (tags);

-- 8. Create Contact/Inquiry Submissions Table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_type TEXT NOT NULL,
  business_type TEXT,
  budget TEXT,
  channel TEXT,
  message TEXT,
  source TEXT DEFAULT 'contact-page',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
-- Anyone can submit an inquiry (public contact form); rows are only
-- selectable through the service role / admin paths.
CREATE POLICY "Allow public insert on inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON public.inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_status_idx ON public.inquiries (status);

-- 8. Automatic Timestamp Trigger Function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_website_templates_updated_at
  BEFORE UPDATE ON public.website_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Seed Admin / Owner User
INSERT INTO public.users (id, email, username, password_hash, full_name, role)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'admin@nextflow.com',
  'admin',
  '$2a$10$eE0m7aGzY8kX5M4f4cZ0u.qW5g1.G8K7n4V6l3b2A1c0D9e8F7g6h',
  'System Owner',
  'owner'
)
ON CONFLICT (email) DO UPDATE SET role = 'owner';

-- 9. Seed Default System Settings
INSERT INTO public.system_settings (key, value) VALUES
  ('general', '{"platform_name": "NEXTFLOW", "support_email": "support@nextflow.dev", "maintenance_mode": false, "public_registration": true}'::jsonb),
  ('security', '{"session_timeout_days": 7, "max_login_attempts": 5, "require_email_verify": false, "mfa_required": false}'::jsonb),
  ('workflow', '{"max_concurrent_jobs": 10, "default_timeout_minutes": 30, "log_retention_days": 30, "auto_retry_failed": true}'::jsonb),
  ('notifications', '{"alert_email": "admin@nextflow.com", "slack_webhook": "", "notify_on_failure": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 10. Seed Default Home Sections
INSERT INTO public.home_sections (id, name, type, section_order, visible, is_builtin) VALUES
  ('hero', 'Cinematic Hero Banner', 'builtin', 1, true, true),
  ('social_proof', 'Social Proof & Trusted Logos', 'builtin', 2, true, true),
  ('value_prop', 'Value Proposition Bento Grid', 'builtin', 3, true, true),
  ('why_us', 'Why Us (Problem vs Solution)', 'builtin', 4, true, true),
  ('services', 'Services & Capabilities', 'builtin', 5, true, true),
  ('portfolio', 'Portfolio & Case Studies', 'builtin', 6, true, true),
  ('final_cta', 'Final Conversion CTA Banner', 'builtin', 7, true, true)
ON CONFLICT (id) DO NOTHING;

-- 11. AI Provider API Keys (priority = position ASC; auto-swap tries in order)
CREATE TABLE IF NOT EXISTS public.ai_api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL CHECK (provider IN ('gemini', 'openrouter', 'openai', 'groq', 'custom')),
  label TEXT NOT NULL DEFAULT '',
  key_value TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  model TEXT,
  base_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS ai_api_keys_provider_pos_idx ON public.ai_api_keys (provider, position);

-- No SELECT/INSERT policies: only the service role may read/write API keys.
ALTER TABLE public.ai_api_keys ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.ai_api_keys FROM anon, authenticated;

-- 12. AI Chat Logs (every AI call: who, what, provider, tokens, timing)
CREATE TABLE IF NOT EXISTS public.ai_chat_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  username TEXT,
  path TEXT,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  mode TEXT,
  prompt TEXT,
  response TEXT,
  prompt_tokens INT,
  completion_tokens INT,
  ip_address TEXT,
  user_agent TEXT,
  duration_ms INT,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS ai_chat_logs_created_at_idx ON public.ai_chat_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS ai_chat_logs_user_id_idx ON public.ai_chat_logs (user_id);
CREATE INDEX IF NOT EXISTS ai_chat_logs_provider_idx ON public.ai_chat_logs (provider);

ALTER TABLE public.ai_chat_logs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.ai_chat_logs FROM anon, authenticated;

-- 13. AI feature settings (toggles + prompts + models + contact key ref).
--     Stored in the existing system_settings KV row 'ai'. No secrets here —
--     keys live in ai_api_keys; contact_key_id references a key row UUID.
INSERT INTO public.system_settings (key, value) VALUES (
  'ai',
  '{
    "enabled": true,
    "contact_enabled": true,
    "require_login": true,
    "contact_key_id": null,
    "prompts": {
      "template_filter": null,
      "template_pick": null,
      "template_build": null,
      "static_copy": null,
      "contact_expand": null
    }
  }'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- 14. Contact session logs (per-form-session interaction trail).
--     Service role only; linked to inquiries on submit.
CREATE TABLE IF NOT EXISTS public.contact_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_key TEXT NOT NULL,
  inquiry_id UUID REFERENCES public.inquiries(id) ON DELETE CASCADE,
  events JSONB NOT NULL DEFAULT '[]'::jsonb,
  name TEXT,
  email TEXT,
  phone TEXT,
  service_type TEXT,
  business_type TEXT,
  budget TEXT,
  channel TEXT,
  message TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS contact_sessions_session_key_idx ON public.contact_sessions (session_key);
CREATE INDEX IF NOT EXISTS contact_sessions_started_at_idx ON public.contact_sessions (started_at DESC);
CREATE INDEX IF NOT EXISTS contact_sessions_inquiry_id_idx ON public.contact_sessions (inquiry_id);

ALTER TABLE public.contact_sessions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.contact_sessions FROM anon, authenticated;

-- 15. Contact feature settings (toggles + content + retention).
--     Stored in the existing system_settings KV row 'contact'.
INSERT INTO public.system_settings (key, value) VALUES (
  'contact',
  '{
    "enabled": true,
    "retention_days": 15,
    "content": {
      "heading": "Tell us what you need.",
      "heading_accent": "We''ll do the rest.",
      "intro": "A few quick choices — no long forms, no hassle. Every inquiry goes straight to our engineering inbox.",
      "success_title": "Message received!",
      "success_text": "Thanks {name} — we''ve got your {service} inquiry and will get back to you within 1–2 business days.",
      "closed_title": "We''re not accepting new inquiries right now",
      "closed_text": "We''ll be back soon — please check again later. You can still email us directly at support@nextflow.dev.",
      "submit_label": "Send inquiry",
      "show_phone": true,
      "show_message": true,
      "services": ["Web Platform", "SaaS Architecture", "Mobile Application", "Event Technology", "AI & Workflow", "Something else"],
      "business_types": ["Company", "Startup", "Agency", "Freelancer", "Student", "Personal"],
      "budgets": ["Under ฿50K", "฿50K – ฿200K", "฿200K – ฿1M", "฿1M+", "Not sure yet"],
      "channels": ["Email", "Phone", "WhatsApp"]
    }
  }'::jsonb
) ON CONFLICT (key) DO NOTHING;
