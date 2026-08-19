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

-- 5. Create System Settings Table
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_by UUID
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

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
REVOKE ALL ON TABLE public.home_sections FROM anon, authenticated;

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
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';

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

-- 16. SECURITY HARDENING: all DB access flows through server routes
--     using the service role (createAdminClient). Nothing reads the
--     database from the browser, so anon/authenticated roles are fully
--     revoked on every table. RLS stays enabled as defense in depth.
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;

-- 17. users.token_version: bump to force every issued JWT invalid
--     (admin "force re-login" action).
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 0;

-- 18. auth_lockouts: per-account/IP failed-login tracking.
CREATE TABLE IF NOT EXISTS public.auth_lockouts (
  lock_key TEXT PRIMARY KEY,
  failed_count INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  last_fail_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.auth_lockouts ENABLE ROW LEVEL SECURITY;

-- 19. rate_limits: cross-instance sliding-window counters.
CREATE TABLE IF NOT EXISTS public.rate_limits (
  fingerprint TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (fingerprint, endpoint, window_start)
);
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- 20. Cleanup jobs (pg_cron).
SELECT cron.unschedule('contact-session-cleanup') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'contact-session-cleanup'
);
SELECT cron.schedule(
  'contact-session-cleanup',
  '0 3 * * *',
  $cron$
  DELETE FROM public.contact_sessions WHERE expires_at < NOW()
  $cron$
);

SELECT cron.unschedule('rate-limit-cleanup') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'rate-limit-cleanup'
);
SELECT cron.schedule(
  'rate-limit-cleanup',
  '0 * * * *',
  $cron$
  DELETE FROM public.rate_limits WHERE window_start < NOW() - INTERVAL '2 hours'
  $cron$
);

SELECT cron.unschedule('lockout-cleanup') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'lockout-cleanup'
);
SELECT cron.schedule(
  'lockout-cleanup',
  '15 * * * *',
  $cron$
  DELETE FROM public.auth_lockouts
  WHERE (locked_until IS NULL OR locked_until < NOW() - INTERVAL '1 day')
    AND last_fail_at < NOW() - INTERVAL '1 day'
  $cron$
);

-- 21. rate_limit_tick: atomic counter increment used by the middleware
--     rate limiter (service role only — anon/authenticated cannot call it).
CREATE OR REPLACE FUNCTION public.rate_limit_tick(
  p_fingerprint TEXT,
  p_endpoint TEXT,
  p_window_start TIMESTAMPTZ,
  p_max INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  INSERT INTO public.rate_limits (fingerprint, endpoint, window_start, count)
  VALUES (p_fingerprint, p_endpoint, p_window_start, 1)
  ON CONFLICT (fingerprint, endpoint, window_start)
  DO UPDATE SET count = public.rate_limits.count + 1
  RETURNING count INTO v_count;

  DELETE FROM public.rate_limits WHERE window_start < NOW() - INTERVAL '2 hours';

  RETURN v_count;
END;
$$;
REVOKE ALL ON FUNCTION public.rate_limit_tick(TEXT, TEXT, TIMESTAMPTZ, INTEGER) FROM anon, authenticated;

-- 22. bump_token_versions: invalidates every issued JWT (admin
--     "force re-login"). WHERE true keeps postgREST happy.
CREATE OR REPLACE FUNCTION public.bump_token_versions()
RETURNS INTEGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  v_rows INTEGER;
BEGIN
  UPDATE public.users SET token_version = token_version + 1 WHERE true;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  RETURN v_rows;
END;
$$;
REVOKE ALL ON FUNCTION public.bump_token_versions() FROM anon, authenticated;
-- ============================================================
-- Services catalog: the services grid + every "Learn more"
-- detail is DB-driven (admin-editable, service role only).
-- ============================================================
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT 'Globe',
  color TEXT NOT NULL DEFAULT 'from-cyan-400 to-blue-600',
  description TEXT NOT NULL DEFAULT '',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  outcome TEXT NOT NULL DEFAULT '',
  deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
  best_for JSONB NOT NULL DEFAULT '[]'::jsonb,
  timeline TEXT NOT NULL DEFAULT '',
  contact_service TEXT NOT NULL DEFAULT 'Something else',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_services_sort ON public.services (sort_order);

-- Seed the six existing services (safe re-runnable).
INSERT INTO public.services (title, slug, icon, color, description, features, outcome, deliverables, best_for, timeline, contact_service, sort_order, is_active) VALUES
(
  'Custom Web Platforms', 'custom-web-platforms', 'Globe', 'from-cyan-400 to-blue-600',
  'Awwwards-grade websites and full-scale web platforms built with modern frameworks. Blazing-fast, SEO-optimized, and engineered to scale from launch day.',
  '["Enterprise Next.js apps","High-performance front-ends","Headless CMS & e-commerce"]',
  'A production-grade web platform your team can actually grow with — fast, SEO-ready, and easy to extend without rewriting everything in a year.',
  '["Pixel-perfect responsive web app","SEO + Core Web Vitals optimization","Content management (headless CMS)","Analytics & conversion tracking","Design system + component library","Deployment, CI/CD & documentation"]',
  '["Companies outgrowing template sites","Startups needing a launch-ready product","Brands that need a standout web presence"]',
  '3–8 weeks for a full platform',
  'Web Platform', 1, true
),
(
  'SaaS & Cloud Architecture', 'saas-cloud-architecture', 'Boxes', 'from-purple-400 to-indigo-600',
  'We design resilient, multi-tenant SaaS products — from data modeling and auth to billing, observability, and infrastructure that holds under real load.',
  '["Multi-tenant backends","Cloud infrastructure (AWS/GCP)","CI/CD & observability"]',
  'A backend that stays fast and reliable as you onboard new customers — without the “works on my machine” surprises or surprise cloud bills.',
  '["Multi-tenant data architecture","Auth, roles & billing integration","Scalable cloud infrastructure (AWS/GCP)","CI/CD pipelines & automated testing","Observability: logs, metrics, alerts","Cost monitoring & optimization"]',
  '["SaaS founders on an MVP or v2","Products about to scale users","Teams drowning in tech debt"]',
  '4–12 weeks depending on scope',
  'SaaS Architecture', 2, true
),
(
  'Mobile Applications', 'mobile-applications', 'Smartphone', 'from-emerald-400 to-teal-600',
  'Native and cross-platform mobile apps with a mobile-first philosophy. Seamless UX, offline support, and app-store-ready quality.',
  '["iOS & Android","React Native / Flutter","Push, payments & offline"]',
  'An app your users install and keep — smooth on slow networks, offline-capable, and polished enough for the App Store review gauntlet.',
  '["iOS & Android app (single codebase)","Push notifications & deep links","In-app payments / subscriptions","Offline-first data sync","App Store / Play Store submission","Crash monitoring & updates"]',
  '["Businesses reaching customers on phones","Field teams needing offline tools","Startups shipping a companion app"]',
  '6–12 weeks for v1',
  'Mobile Application', 3, true
),
(
  'Event Technology', 'event-technology', 'Cpu', 'from-orange-400 to-pink-600',
  'Hardware and software integration for events — interactive booths, live IoT, real-time telemetry, and immersive digital orchestration.',
  '["Interactive booths & kiosks","Live IoT & sensors","Real-time dashboards"]',
  'An event experience that runs itself: interactive touchpoints, live data flowing to screens and dashboards, and zero “can you fix the projector” drama.',
  '["Interactive booth & kiosk software","IoT sensor & device integration","Real-time dashboards & telemetry","Live content orchestration","On-site support & dry-run","Post-event analytics report"]',
  '["Event agencies going digital","Venues upgrading their tech","Brands doing interactive activations"]',
  '2–6 weeks before the event',
  'Event Technology', 4, true
),
(
  'Bespoke Software Projects', 'bespoke-software-projects', 'Rocket', 'from-sky-400 to-cyan-600',
  'Custom platforms, internal tools, and complex integrations. We turn unique operational challenges into streamlined digital solutions that scale.',
  '["Internal tools & portals","System integrations","Legacy modernization"]',
  'A custom tool built around how your team actually works — killing the spreadsheet chaos and manual handoffs that slow everyone down.',
  '["Custom internal tools & portals","Third-party system integrations","Legacy system modernization","Automated workflows & reports","Training & handover sessions","Maintenance & support retainer"]',
  '["Operations with manual workflows","Teams stuck on legacy systems","Businesses needing unique tooling"]',
  'Scoped per project — 3 weeks typical starting point',
  'Something else', 5, true
),
(
  'Security & Reliability', 'security-reliability', 'ShieldCheck', 'from-amber-400 to-red-600',
  'Security is not an afterthought. We build SOC-2-minded systems with audit trails, encrypted data, RBAC, and reliability baked into the architecture.',
  '["Security audits","RBAC & encryption","SLOs & uptime guarantees"]',
  'Peace of mind: your system is hardened against the attacks that actually happen, with audit trails and uptime you can put in front of clients.',
  '["Full security audit & report","Penetration test & remediation","RBAC & encryption hardening","Audit logging & compliance docs","SLOs, monitoring & on-call setup","Incident response runbooks"]',
  '["Apps handling customer data","Products needing SOC-2 readiness","Teams with no security headcount"]',
  '1–3 weeks per audit cycle',
  'Something else', 6, true
)
ON CONFLICT (slug) DO NOTHING;