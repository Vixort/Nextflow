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
  thumbnail_url TEXT,
  puck_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  global_css TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

ALTER TABLE public.website_templates ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.website_templates FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS website_templates_updated_at_idx ON public.website_templates (updated_at DESC);

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
