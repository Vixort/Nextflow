-- ============================================================
-- NEXTFLOW CONTACT SYSTEM: settings, session logs & cleanup
-- Run in Supabase SQL Editor after the base schema + inquiries.
-- Sessions are service-role only (no anon/authenticated access).
-- ============================================================

-- 1. Contact feature settings (toggles + content + retention).
--    Stored in the existing system_settings KV row 'contact'.
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

-- 2. Contact session logs: every form session's interaction trail
--    (what the visitor selected and typed, in order), linked to the
--    final inquiry row when submitted. Service role only.
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

-- No SELECT/INSERT policies: only the service role (server routes) may
-- read or write session logs. Anonymous/authenticated sessions get nothing.
ALTER TABLE public.contact_sessions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.contact_sessions FROM anon, authenticated;

-- 3. Retention cleanup: delete session logs older than the configured
--    retention_days (read from the settings row on every run, so the
--    admin can change the window without touching the schedule).
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.unschedule('contact-session-cleanup') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'contact-session-cleanup'
);
SELECT cron.schedule(
  'contact-session-cleanup',
  '0 3 * * *',
  $cron$
  DELETE FROM public.contact_sessions
  WHERE started_at < NOW() - (COALESCE(
    (SELECT value->>'retention_days' FROM public.system_settings WHERE key = 'contact'),
    '15'
  )::int) * INTERVAL '1 day'
  $cron$
);
