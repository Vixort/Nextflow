-- ============================================================
-- Atomic rate-limit ticker used by the middleware rate limiter.
-- Single INSERT ... ON CONFLICT guarantees cross-instance
-- correctness (no read-modify-write races on serverless).
-- ============================================================
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

  -- Opportunistic cleanup of stale windows (pg_cron also runs hourly).
  DELETE FROM public.rate_limits WHERE window_start < NOW() - INTERVAL '2 hours';

  RETURN v_count;
END;
$$;

REVOKE ALL ON FUNCTION public.rate_limit_tick(TEXT, TEXT, TIMESTAMPTZ, INTEGER) FROM anon, authenticated;