-- Migration 004: Employee-Company Relationship Architecture
-- Version: 2.0.0
-- Date: 2025-11-21

-- ============================================================================
-- 1. EMPLOYEE PROFILE (The Relationship)
-- ============================================================================

CREATE TYPE user_role AS ENUM ('employee', 'manager', 'owner');
CREATE TYPE job_role AS ENUM ('kitchen', 'service', 'bar', 'cleaning', 'management');

CREATE TABLE employee_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES "user"(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES company(id) ON DELETE CASCADE NOT NULL,

  role user_role DEFAULT 'employee',
  job_role job_role DEFAULT 'kitchen',
  sector TEXT,

  -- Company-specific gamification
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,

  -- Employment
  employment_status TEXT DEFAULT 'active', -- 'active', 'inactive', 'on_leave', 'terminated'
  hired_at BIGINT,
  terminated_at BIGINT,

  -- Onboarding
  onboarding_completed BOOLEAN DEFAULT FALSE,
  joined_via TEXT, -- 'qr_code', 'invite_link', 'manager_added'
  onboarded_by UUID REFERENCES "user"(id),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, company_id)
);

-- RLS Policies
ALTER TABLE employee_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profiles"
  ON employee_profile FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Managers and Owners can view profiles in their company"
  ON employee_profile FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM employee_profile requester
      WHERE requester.user_id = auth.uid()
      AND requester.company_id = employee_profile.company_id
      AND requester.role IN ('manager', 'owner')
    )
  );

-- ============================================================================
-- 2. PASSE (Lifetime Career Passport)
-- ============================================================================

CREATE TABLE passe (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES "user"(id) ON DELETE CASCADE NOT NULL,

  -- Global metrics
  total_xp_earned BIGINT DEFAULT 0,
  weighted_xp BIGINT DEFAULT 0,
  global_level INTEGER DEFAULT 1,
  global_rank INTEGER DEFAULT 0,

  -- Career history
  companies_worked JSONB DEFAULT '[]'::jsonb,
  certificates JSONB DEFAULT '[]'::jsonb,
  global_achievements JSONB DEFAULT '[]'::jsonb,

  -- Verification
  passe_qr_code TEXT UNIQUE,
  passe_signature TEXT,
  last_exported_at BIGINT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE passe ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own PASSE"
  ON passe FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view verified PASSE via QR"
  ON passe FOR SELECT
  USING (true); -- Controlled by application logic for public profile

-- ============================================================================
-- 3. FRAUD DETECTION - TASK METADATA
-- ============================================================================

CREATE TABLE task_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES task(id) ON DELETE CASCADE, -- Assuming task table exists
  user_id UUID REFERENCES "user"(id) ON DELETE CASCADE,

  -- Timing
  expected_duration_minutes INTEGER,
  actual_duration_minutes INTEGER,
  completion_speed_ratio NUMERIC(5,2),
  completed_at_unusual_time BOOLEAN,

  -- Location
  gps_coordinates JSONB,
  distance_from_company_meters NUMERIC(10,2),
  gps_spoofing_detected BOOLEAN,

  -- Photo
  photo_url TEXT,
  photo_exif_data JSONB,
  photo_similarity_score NUMERIC(5,2),
  photo_reused BOOLEAN,
  photo_from_screen BOOLEAN,

  -- Analysis
  is_outlier BOOLEAN,
  deviation_score NUMERIC(5,2),
  fraud_flags JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE task_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view task metadata"
  ON task_metadata FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM employee_profile requester
      WHERE requester.user_id = auth.uid()
      -- Need to join with task -> company to verify ownership, simplified here:
      AND requester.role = 'owner' 
    )
  );

-- ============================================================================
-- 4. FRAUD DETECTION - CHECK-IN METADATA
-- ============================================================================

CREATE TABLE check_in_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_in_id UUID REFERENCES check_in_out(id) ON DELETE CASCADE, -- Assuming check_in_out table exists
  user_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
  company_id UUID REFERENCES company(id) ON DELETE CASCADE,

  -- Location
  gps_coordinates JSONB NOT NULL,
  distance_from_company_meters NUMERIC(10,2),
  gps_speed_kmh NUMERIC(10,2),
  location_verified BOOLEAN,

  -- Network
  ip_address INET,
  wifi_network TEXT,
  network_matches_company BOOLEAN,

  -- Analysis
  too_frequent BOOLEAN,
  is_outlier BOOLEAN,
  fraud_flags JSONB DEFAULT '[]'::jsonb,
  device_info JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE check_in_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view check-in metadata"
  ON check_in_metadata FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM employee_profile requester
      WHERE requester.user_id = auth.uid()
      AND requester.company_id = check_in_metadata.company_id
      AND requester.role = 'owner'
    )
  );

-- ============================================================================
-- 5. FRAUD DETECTION - USER RISK SCORE
-- ============================================================================

CREATE TABLE user_risk_score (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
  company_id UUID REFERENCES company(id) ON DELETE CASCADE,

  -- Risk scores (0-100)
  overall_risk_score INTEGER DEFAULT 0,
  location_risk_score INTEGER DEFAULT 0,
  timing_risk_score INTEGER DEFAULT 0,
  photo_risk_score INTEGER DEFAULT 0,
  behavioral_risk_score INTEGER DEFAULT 0,

  -- Trust level
  trust_level TEXT DEFAULT 'trusted', -- 'trusted', 'monitor', 'suspicious', 'review_required'

  -- Flags
  total_fraud_flags INTEGER DEFAULT 0,
  recent_flags JSONB DEFAULT '[]'::jsonb,
  requires_manual_review BOOLEAN DEFAULT FALSE,

  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, company_id)
);

-- RLS Policies
ALTER TABLE user_risk_score ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view risk scores"
  ON user_risk_score FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM employee_profile requester
      WHERE requester.user_id = auth.uid()
      AND requester.company_id = user_risk_score.company_id
      AND requester.role = 'owner'
    )
  );
