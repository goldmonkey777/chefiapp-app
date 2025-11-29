-- ============================================
-- CHEFIAPP™ - STORAGE POLICIES
-- Execute APÓS criar os buckets no dashboard
-- ============================================

-- ============================================
-- BUCKET: task-photos
-- Criar no dashboard primeiro:
-- - Name: task-photos
-- - Public: YES
-- - Size limit: 5 MB
-- - MIME types: image/jpeg, image/png, image/webp
-- ============================================

-- Allow authenticated users to upload photos
CREATE POLICY "Users can upload task photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'task-photos');

-- Allow authenticated users to read photos from their company
CREATE POLICY "Users can view task photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'task-photos');

-- Allow users to update their own photos
CREATE POLICY "Users can update their task photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'task-photos');

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their task photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'task-photos');

-- ============================================
-- BUCKET: profile-photos
-- Criar no dashboard primeiro:
-- - Name: profile-photos
-- - Public: YES
-- - Size limit: 2 MB
-- - MIME types: image/jpeg, image/png, image/webp
-- ============================================

-- Allow authenticated users to upload profile photos
CREATE POLICY "Users can upload profile photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow anyone to view profile photos
CREATE POLICY "Anyone can view profile photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- Allow users to update their own profile photo
CREATE POLICY "Users can update their profile photo"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own profile photo
CREATE POLICY "Users can delete their profile photo"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- BUCKET: company-logos
-- Criar no dashboard primeiro:
-- - Name: company-logos
-- - Public: YES
-- - Size limit: 1 MB
-- - MIME types: image/png, image/svg+xml, image/webp
-- ============================================

-- Only ADMIN can upload company logos
CREATE POLICY "Only admins can upload company logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'company-logos' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- Anyone can view company logos
CREATE POLICY "Anyone can view company logos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'company-logos');

-- Only ADMIN can update company logos
CREATE POLICY "Only admins can update company logos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'company-logos' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- Only ADMIN can delete company logos
CREATE POLICY "Only admins can delete company logos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'company-logos' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);
