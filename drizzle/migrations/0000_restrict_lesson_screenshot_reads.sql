DROP POLICY IF EXISTS "Public can read lesson screenshots" ON storage.objects;

CREATE POLICY "Owner can read lesson screenshots"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'lesson-screenshots' AND public.is_lesson_image_owner());