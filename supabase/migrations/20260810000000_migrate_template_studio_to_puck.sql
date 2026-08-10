-- Puck is the only editor. Keep the old payload long enough to migrate existing templates.
ALTER TABLE public.website_templates
  ADD COLUMN IF NOT EXISTS puck_data JSONB;

UPDATE public.website_templates
SET puck_data = grapesjs_data
WHERE puck_data IS NULL
  AND grapesjs_data IS NOT NULL;

ALTER TABLE public.website_templates
  ALTER COLUMN puck_data SET DEFAULT '{}'::jsonb;

ALTER TABLE public.website_templates
  ALTER COLUMN puck_data SET NOT NULL;

-- The application uses its server-side JWT authorization plus the service role for mutations.
-- Do not expose template source or editing permissions through the Supabase Data API.
DROP POLICY IF EXISTS "Allow public select on website_templates" ON public.website_templates;
DROP POLICY IF EXISTS "Allow public all on website_templates" ON public.website_templates;
REVOKE ALL ON TABLE public.website_templates FROM anon, authenticated;

CREATE INDEX IF NOT EXISTS website_templates_updated_at_idx
  ON public.website_templates (updated_at DESC);

DROP TRIGGER IF EXISTS update_website_templates_updated_at ON public.website_templates;
CREATE TRIGGER update_website_templates_updated_at
  BEFORE UPDATE ON public.website_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
