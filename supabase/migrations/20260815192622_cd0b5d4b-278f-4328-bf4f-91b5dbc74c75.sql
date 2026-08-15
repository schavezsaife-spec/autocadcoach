CREATE OR REPLACE FUNCTION public.is_lesson_image_owner()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT auth.uid() = '64e4bf0f-ddf0-4e00-945a-b2949a47e789'::uuid
$$;

GRANT EXECUTE ON FUNCTION public.is_lesson_image_owner() TO authenticated, anon, service_role;

DROP POLICY IF EXISTS "Admins can insert lesson images" ON public.lesson_images;
DROP POLICY IF EXISTS "Admins can update lesson images" ON public.lesson_images;
DROP POLICY IF EXISTS "Admins can delete lesson images" ON public.lesson_images;

CREATE POLICY "Owner can insert lesson images"
ON public.lesson_images FOR INSERT TO authenticated
WITH CHECK (public.is_lesson_image_owner());

CREATE POLICY "Owner can update lesson images"
ON public.lesson_images FOR UPDATE TO authenticated
USING (public.is_lesson_image_owner())
WITH CHECK (public.is_lesson_image_owner());

CREATE POLICY "Owner can delete lesson images"
ON public.lesson_images FOR DELETE TO authenticated
USING (public.is_lesson_image_owner());

DROP POLICY IF EXISTS "Admins can upload lesson screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update lesson screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete lesson screenshots" ON storage.objects;

CREATE POLICY "Owner can upload lesson screenshots"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'lesson-screenshots' AND public.is_lesson_image_owner());

CREATE POLICY "Owner can update lesson screenshots"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'lesson-screenshots' AND public.is_lesson_image_owner())
WITH CHECK (bucket_id = 'lesson-screenshots' AND public.is_lesson_image_owner());

CREATE POLICY "Owner can delete lesson screenshots"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'lesson-screenshots' AND public.is_lesson_image_owner());