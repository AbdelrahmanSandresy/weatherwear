-- Create the public outfit-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('outfit-images', 'outfit-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload into their own folder
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'outfit-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Public read access
CREATE POLICY "Public can view outfit images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'outfit-images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'outfit-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
