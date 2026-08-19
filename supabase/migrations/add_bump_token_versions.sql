-- ============================================================
-- Bumps users.token_version for every account — invalidates all
-- issued JWTs (admin "force re-login" action). Service role only.
-- ============================================================
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