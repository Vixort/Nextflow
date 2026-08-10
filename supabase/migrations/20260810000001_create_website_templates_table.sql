-- ============================================================
-- CREATE WEBSITE TEMPLATES TABLE FOR PUCK STUDIO
-- Execute this migration if public.website_templates does not exist yet.
-- ============================================================

-- 1. Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create website_templates table
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

-- 3. Enable RLS & Configure Table Permissions
ALTER TABLE public.website_templates ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.website_templates FROM anon, authenticated;

-- 4. Create Index on updated_at
CREATE INDEX IF NOT EXISTS website_templates_updated_at_idx 
  ON public.website_templates (updated_at DESC);

-- 5. Updated At Trigger Function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger for Automatic updated_at Update
DROP TRIGGER IF EXISTS update_website_templates_updated_at ON public.website_templates;
CREATE TRIGGER update_website_templates_updated_at
  BEFORE UPDATE ON public.website_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
