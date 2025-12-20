-- ============================================
-- Admin RLS Policies for Document Verification
-- ============================================
-- Run this SQL in your Supabase SQL Editor

-- Drop existing admin policies if they exist
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON bookings;
DROP POLICY IF EXISTS "Drivers can view available bookings" ON bookings;
DROP POLICY IF EXISTS "Drivers can claim bookings" ON bookings;

-- Create admin policy for profiles (allows document verification)
CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (
    auth.jwt() ->> 'email' IN ('tagverse@admin.com', 'cityprodrive@admin.com')
  );

-- Create admin policy to VIEW all bookings
CREATE POLICY "Admins can view bookings" ON bookings
  FOR SELECT USING (
    auth.jwt() ->> 'email' IN ('tagverse@admin.com', 'cityprodrive@admin.com')
  );

-- Create admin policy to UPDATE bookings (for status management)
CREATE POLICY "Admins can update bookings" ON bookings
  FOR UPDATE USING (
    auth.jwt() ->> 'email' IN ('tagverse@admin.com', 'cityprodrive@admin.com')
  );

-- Create driver policy to VIEW available (unassigned) bookings when verified
CREATE POLICY "Drivers can view available bookings" ON bookings
  FOR SELECT USING (
    driver_id IS NULL AND status = 'pending' AND
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'driver' AND p.documents_verified = TRUE
    )
  );

-- Create driver policy to CLAIM pending bookings and manage their own
CREATE POLICY "Drivers can claim bookings" ON bookings
  FOR UPDATE USING (
    (
      driver_id IS NULL AND status = 'pending' AND
      EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid() AND p.role = 'driver' AND p.documents_verified = TRUE
      )
    )
    OR auth.uid() = driver_id
  )
  WITH CHECK (driver_id = auth.uid());

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('profiles', 'bookings')
ORDER BY tablename, policyname;
