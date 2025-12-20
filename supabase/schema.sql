-- ============================================
-- Drive with Confidence - Complete Database Schema
-- ============================================

-- Clean up existing objects for a fresh start
-- Drop tables first (CASCADE will drop dependent triggers)
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- ============================================
-- PROFILES TABLE
-- ============================================
-- Stores user profile information for customers and drivers
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  phone TEXT,
  email TEXT,
  role TEXT CHECK (role IN ('customer', 'driver', 'admin')) NOT NULL DEFAULT 'customer',
  
  -- Verification & Profile Status
  is_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  profile_completion INTEGER DEFAULT 0 CHECK (profile_completion >= 0 AND profile_completion <= 100),
  
  -- Driver-specific fields
  experience TEXT, -- e.g., "5 years", "10+ years"
  address TEXT,
  city TEXT,
  pincode TEXT,
  is_online BOOLEAN DEFAULT FALSE, -- For drivers: online/offline status
  
  -- Additional contact
  alternate_phone TEXT,
  
  -- Document URLs (stored in Supabase Storage)
  license_doc_url TEXT,
  aadhaar_doc_url TEXT,
  pan_doc_url TEXT,
  photo_url TEXT,
  account_details_doc_url TEXT,
  
  -- Document Verification Status
  documents_verified BOOLEAN DEFAULT FALSE,
  license_verified BOOLEAN DEFAULT FALSE,
  aadhaar_verified BOOLEAN DEFAULT FALSE,
  pan_verified BOOLEAN DEFAULT FALSE,
  account_verified BOOLEAN DEFAULT FALSE,
  verification_notes TEXT, -- Admin notes for rejection/clarification
  
  -- Ratings & Performance (for drivers)
  rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  total_trips INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_is_online ON profiles(is_online) WHERE role = 'driver';
CREATE INDEX idx_profiles_email ON profiles(email);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admin can update any profile (for document verification)
CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (
    auth.jwt() ->> 'email' IN ('tagverse@admin.com', 'cityprodrive@admin.com')
  );

-- ============================================
-- BOOKINGS TABLE
-- ============================================
-- Stores all booking/trip information
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Customer Information
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  
  -- Driver Assignment
  driver_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  driver_name TEXT,
  
  -- Trip Details
  service_type TEXT, -- 'hourly', 'daily', 'outstation', 'monthly', etc.
  car_type TEXT, -- 'sedan', 'suv', 'luxury', etc.
  pickup_location TEXT NOT NULL,
  destination TEXT,
  pickup_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  return_date DATE,
  
  -- Duration & Pricing
  duration_hours INTEGER,
  duration_days INTEGER,
  base_amount DECIMAL(10,2) DEFAULT 0,
  gst_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  amount DECIMAL(10,2) DEFAULT 0, -- Total amount
  
  -- Status & Payment
  status TEXT CHECK (status IN ('pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  payment_status TEXT CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')) DEFAULT 'pending',
  payment_method TEXT, -- 'cash', 'card', 'upi', 'wallet', etc.
  
  -- Additional Details
  special_instructions TEXT,
  cancellation_reason TEXT,
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  review TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for faster queries
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_driver_id ON bookings(driver_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_pickup_date ON bookings(pickup_date);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);

-- Set up Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings as customer" ON bookings
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Drivers can view their assigned bookings" ON bookings
  FOR SELECT USING (auth.uid() = driver_id);

-- Verified drivers can view available (unassigned) bookings to accept
CREATE POLICY "Drivers can view available bookings" ON bookings
  FOR SELECT USING (
    driver_id IS NULL AND status = 'pending' AND
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'driver' AND p.documents_verified = TRUE
    )
  );

-- Verified drivers can claim a pending unassigned booking (and then manage their own)
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

CREATE POLICY "Admins can view all bookings" ON bookings
  FOR SELECT USING (
    auth.jwt() ->> 'email' IN ('tagverse@admin.com', 'cityprodrive@admin.com')
  );

CREATE POLICY "Users can insert their own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update their own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = customer_id OR auth.uid() = driver_id);

-- Admin can update any booking (for status management)
CREATE POLICY "Admins can update bookings" ON bookings
  FOR UPDATE USING (
    auth.jwt() ->> 'email' IN ('tagverse@admin.com', 'cityprodrive@admin.com')
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, email_verified)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', ''), 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    COALESCE(NEW.email_confirmed_at IS NOT NULL, FALSE)
  )
  ON CONFLICT (id) DO UPDATE SET
    email_verified = COALESCE(NEW.email_confirmed_at IS NOT NULL, FALSE),
    updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the auth operation
  RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger to handle new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE PROCEDURE public.handle_new_user();

-- Trigger to update updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

-- Trigger to update updated_at on bookings
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- Uncomment below to insert sample data for testing

/*
-- Sample customer profile
INSERT INTO profiles (id, name, email, phone, role, profile_completion, created_at)
VALUES 
  (gen_random_uuid(), 'Test Customer', 'customer@test.com', '+91 98765 43210', 'customer', 100, NOW());

-- Sample driver profile
INSERT INTO profiles (id, name, email, phone, role, experience, address, city, pincode, profile_completion, is_online, rating, created_at)
VALUES 
  (gen_random_uuid(), 'Test Driver', 'driver@test.com', '+91 98765 43211', 'driver', '5 years', '123 Main St', 'Mumbai', '400001', 100, true, 4.8, NOW());
*/
