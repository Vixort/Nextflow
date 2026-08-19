-- ============================================================
-- SECURITY HARDENING: close RLS holes + auth lockout + DB rate
-- limiting + token revocation support.
--
-- All app DB access flows through server routes using the
-- service role (createAdminClient). Nothing reads the database
-- from the browser, so anon/authenticated roles are fully
-- revoked on every table — same pattern as contact_sessions.
-- ============================================================

-- 1. Drop the permissive policies that exposed data / allowed writes.
DROP POLICY IF EXISTS "Allow public select on users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Allow self update on users" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Allow public select on system_settings" ON public.system_settings;
DROP POLICY IF EXISTS "Allow public insert/update on system_settings" ON public.system_settings;
DROP POLICY IF EXISTS "Allow public insert on activity_logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Allow public select on activity_logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Allow public select on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public insert on inquiries" ON public.inquiries;

-- 2. Revoke anon/authenticated on every existing and future object.
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;

-- 3. users.token_version: bump to force every issued JWT invalid
--    (admin "force re-login" action).
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 0;

-- 4. auth_lockouts: per-account/IP failed-login tracking for lockout.
--    Service role only (no policies + revoked roles).
CREATE TABLE IF NOT EXISTS public.auth_lockouts (
  lock_key TEXT PRIMARY KEY,
  failed_count INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  last_fail_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.auth_lockouts ENABLE ROW LEVEL SECURITY;

-- 5. rate_limits: cross-instance sliding-window counters (works on
--    serverless where in-memory maps are per-instance).
CREATE TABLE IF NOT EXISTS public.rate_limits (
  fingerprint TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (fingerprint, endpoint, window_start)
);
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- 6. Cleanup jobs (pg_cron is already installed).
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
