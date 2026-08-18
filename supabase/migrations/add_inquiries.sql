-- Contact/inquiry submissions for the /contact page.
-- Insert-only from the public form; admin reads via service role.

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

CREATE POLICY "Allow public insert on inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON public.inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_status_idx ON public.inquiries (status);