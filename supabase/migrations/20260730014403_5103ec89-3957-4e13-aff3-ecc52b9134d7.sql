CREATE OR REPLACE FUNCTION public.email_auth_provider(_email text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN EXISTS (
      SELECT 1 FROM auth.identities i
      JOIN auth.users u ON u.id = i.user_id
      WHERE lower(u.email) = lower(_email) AND i.provider = 'google'
    )
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i
      JOIN auth.users u ON u.id = i.user_id
      WHERE lower(u.email) = lower(_email) AND i.provider = 'email'
    )
    THEN 'google'
    ELSE NULL
  END;
$$;

REVOKE ALL ON FUNCTION public.email_auth_provider(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.email_auth_provider(text) TO anon, authenticated;