
-- 1) Roles infrastructure
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 2) Tighten lesson_images write policies to admins
DROP POLICY IF EXISTS "Authenticated users can insert lesson images" ON public.lesson_images;
DROP POLICY IF EXISTS "Authenticated users can update lesson images" ON public.lesson_images;
DROP POLICY IF EXISTS "Authenticated users can delete lesson images" ON public.lesson_images;

CREATE POLICY "Admins can insert lesson images"
  ON public.lesson_images FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update lesson images"
  ON public.lesson_images FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete lesson images"
  ON public.lesson_images FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3) Tighten lesson-screenshots storage bucket writes to admins
DROP POLICY IF EXISTS "Authenticated users can upload lesson screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update lesson screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete lesson screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload lesson screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update lesson screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete lesson screenshots" ON storage.objects;

CREATE POLICY "Admins can upload lesson screenshots"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'lesson-screenshots' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update lesson screenshots"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'lesson-screenshots' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'lesson-screenshots' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete lesson screenshots"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'lesson-screenshots' AND public.has_role(auth.uid(), 'admin'));

-- 4) Lock down delete_account to signed-in users only
REVOKE EXECUTE ON FUNCTION public.delete_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_account() TO authenticated;
