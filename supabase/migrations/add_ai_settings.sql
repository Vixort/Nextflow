-- ============================================================
-- NEXTFLOW AI SYSTEM: API keys, chat logs & AI settings
-- Run in Supabase SQL Editor after the base schema.
-- Keys and logs are service-role only (no anon/authenticated access).
-- ============================================================

-- 1. AI Provider API Keys (priority = position ASC; auto-swap tries in order)
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

-- No SELECT/INSERT policies: only the service role (admin server routes)
-- may read or write API keys. Anonymous/authenticated sessions get nothing.
ALTER TABLE public.ai_api_keys ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.ai_api_keys FROM anon, authenticated;

-- 2. AI Chat Logs (every AI call: who, what, provider, tokens, timing)
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

-- 3. AI feature settings (toggles + prompts + models + contact key ref).
--    Stored in the existing system_settings KV row 'ai'. No secrets here —
--    keys live in ai_api_keys; contact_key_id references a key row UUID.
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