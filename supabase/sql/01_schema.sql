-- ============================================
-- CHEFIAPP™ - DATABASE SCHEMA
-- Execute este script PRIMEIRO
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('ADMIN', 'MANAGER', 'STAFF');
CREATE TYPE sector AS ENUM ('KITCHEN', 'BAR', 'RECEPTION', 'HOUSEKEEPING', 'MAINTENANCE', 'MANAGEMENT');
CREATE TYPE shift_status AS ENUM ('CHECKED_IN', 'CHECKED_OUT', 'OFFLINE');
CREATE TYPE task_status AS ENUM ('PENDING', 'IN_PROGRESS', 'DONE');
CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE auth_method AS ENUM ('GOOGLE', 'APPLE', 'EMAIL', 'MAGIC_LINK', 'QR_CODE');

-- ============================================
-- TABLE: companies
-- ============================================

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo TEXT,
  invite_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unique index on invite_code
CREATE UNIQUE INDEX companies_invite_code_idx ON companies(invite_code);

-- ============================================
-- TABLE: profiles
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  role user_role NOT NULL DEFAULT 'STAFF',
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  sector sector,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  shift_status shift_status DEFAULT 'OFFLINE',
  last_check_in TIMESTAMP WITH TIME ZONE,
  last_check_out TIMESTAMP WITH TIME ZONE,
  profile_photo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  auth_method auth_method DEFAULT 'EMAIL'
);

-- Indexes
CREATE INDEX profiles_company_id_idx ON profiles(company_id);
CREATE INDEX profiles_email_idx ON profiles(email);
CREATE INDEX profiles_xp_idx ON profiles(xp DESC);

-- ============================================
-- TABLE: tasks
-- ============================================

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status task_status DEFAULT 'PENDING',
  priority task_priority DEFAULT 'MEDIUM',
  xp_reward INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  photo_proof TEXT,
  duration INTEGER -- em segundos
);

-- Indexes
CREATE INDEX tasks_company_id_idx ON tasks(company_id);
CREATE INDEX tasks_assigned_to_idx ON tasks(assigned_to);
CREATE INDEX tasks_status_idx ON tasks(status);
CREATE INDEX tasks_created_at_idx ON tasks(created_at DESC);

-- ============================================
-- TABLE: notifications
-- ============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX notifications_company_id_idx ON notifications(company_id);
CREATE INDEX notifications_read_idx ON notifications(read);
CREATE INDEX notifications_created_at_idx ON notifications(created_at DESC);

-- ============================================
-- TABLE: activity_log
-- ============================================

CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX activity_log_user_id_idx ON activity_log(user_id);
CREATE INDEX activity_log_company_id_idx ON activity_log(company_id);
CREATE INDEX activity_log_created_at_idx ON activity_log(created_at DESC);
