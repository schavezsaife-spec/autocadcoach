
CREATE TABLE public.lesson_images (
  lesson_id TEXT NOT NULL,
  slot TEXT NOT NULL,
  url TEXT NOT NULL,
  storage_path TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  PRIMARY KEY (lesson_id, slot)
);

GRANT SELECT ON public.lesson_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_images TO authenticated;
GRANT ALL ON public.lesson_images TO service_role;

ALTER TABLE public.lesson_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lesson images"
  ON public.lesson_images FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert lesson images"
  ON public.lesson_images FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update lesson images"
  ON public.lesson_images FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete lesson images"
  ON public.lesson_images FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Storage policies for the lesson-screenshots bucket
CREATE POLICY "Public can read lesson screenshots"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'lesson-screenshots');

CREATE POLICY "Authenticated can upload lesson screenshots"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'lesson-screenshots');

CREATE POLICY "Authenticated can update lesson screenshots"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'lesson-screenshots');

CREATE POLICY "Authenticated can delete lesson screenshots"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'lesson-screenshots');
