# Supabase Storage Setup for Driver Documents

## Create Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Click "Create a new bucket"
3. Bucket name: `docs`
4. **Public bucket**: ✅ YES (Check this)
5. Click "Create bucket"

## Set Bucket Policies

After creating the bucket, set up these policies:

### 1. Allow Authenticated Users to Upload
```sql
-- Policy Name: "Authenticated users can upload their own documents"
-- Allowed operation: INSERT
-- Target roles: authenticated
-- USING expression:
bucket_id = 'docs' AND (storage.foldername(name))[1] = auth.uid()::text

-- WITH CHECK expression:
bucket_id = 'docs' AND (storage.foldername(name))[1] = auth.uid()::text
```

### 2. Allow Public Read Access
```sql
-- Policy Name: "Public read access"
-- Allowed operation: SELECT
-- Target roles: public, authenticated
-- USING expression:
bucket_id = 'docs'
```

### 3. Allow Users to Update Their Documents
```sql
-- Policy Name: "Users can update their own documents"
-- Allowed operation: UPDATE
-- Target roles: authenticated
-- USING expression:
bucket_id = 'docs' AND (storage.foldername(name))[1] = auth.uid()::text

-- WITH CHECK expression:
bucket_id = 'docs' AND (storage.foldername(name))[1] = auth.uid()::text
```

### 4. Allow Users to Delete Their Documents
```sql
-- Policy Name: "Users can delete their own documents"
-- Allowed operation: DELETE
-- Target roles: authenticated
-- USING expression:
bucket_id = 'docs' AND (storage.foldername(name))[1] = auth.uid()::text
```

## Folder Structure

Documents will be automatically organized by user ID:
```
docs/
  ├── {user_id_1}/
  │   ├── drivingLicense_1234567890.jpg
  │   ├── aadhaar_1234567890.pdf
  │   ├── pan_1234567890.jpg
  │   ├── photo_1234567890.jpg
  │   └── accountDetails_1234567890.pdf
  ├── {user_id_2}/
  │   └── ...
```

## Document Types Uploaded

1. **Driving License** - `license_doc_url`
2. **Aadhaar Card** - `aadhaar_doc_url`
3. **PAN Card** - `pan_doc_url`
4. **Profile Photo** - `photo_url`
5. **Bank Account Details** - `account_details_doc_url`

## File Constraints

- **Maximum file size**: 5MB
- **Allowed formats**: JPG, PNG, PDF
- **File naming**: `{docType}_{timestamp}.{extension}`

## Quick Setup via SQL (Alternative)

Run this in the Supabase SQL Editor to set up policies programmatically:

```sql
-- Enable storage for the docs bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('docs', 'docs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy: Authenticated users can upload their own documents
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'docs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Public can view all documents
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'docs');

-- Policy: Users can update their own documents
CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'docs' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'docs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own documents
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'docs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## Verification Workflow

1. **Driver** uploads documents → Stored in `docs/{user_id}/`
2. **System** updates profile table with document URLs
3. **Admin** views documents in Admin Dashboard
4. **Admin** approves/rejects each document
5. **System** updates verification flags (`license_verified`, `aadhaar_verified`, etc.)
6. **Driver** can see booking list only after `documents_verified = true`

## Testing

After setup, test by:
1. Logging in as a driver
2. Going to Documents tab
3. Uploading a test image
4. Check Storage → docs → {your_user_id} for the file
5. Verify the URL is saved in the profiles table
