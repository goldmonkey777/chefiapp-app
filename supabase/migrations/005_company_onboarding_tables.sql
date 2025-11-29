-- Migration 005: Company Onboarding Tables
-- Cria tabelas necessárias para o onboarding completo da empresa

-- ============================================================================
-- 1. COMPANIES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cnpj_ein TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  logo_url TEXT,
  country TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'pt',
  currency TEXT NOT NULL DEFAULT 'BRL',
  address TEXT NOT NULL,
  address_number TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  complement TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  employee_count_range TEXT,
  opening_time TIME,
  closing_time TIME,
  preset TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. SECTORS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, name)
);

-- ============================================================================
-- 3. POSITIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, name)
);

-- ============================================================================
-- 4. SHIFTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, name)
);

-- ============================================================================
-- 5. ENABLE RLS
-- ============================================================================

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. RLS POLICIES - COMPANIES
-- ============================================================================

-- Owners can view their own companies
CREATE POLICY "Owners can view own companies"
  ON public.companies FOR SELECT
  USING (auth.uid() = owner_id);

-- Owners can insert their own companies
CREATE POLICY "Owners can insert own companies"
  ON public.companies FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Owners can update their own companies
CREATE POLICY "Owners can update own companies"
  ON public.companies FOR UPDATE
  USING (auth.uid() = owner_id);

-- Employees can view companies they belong to (via employee_profile)
CREATE POLICY "Employees can view their company"
  ON public.companies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.employee_profile
      WHERE employee_profile.company_id = companies.id
      AND employee_profile.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 7. RLS POLICIES - SECTORS, POSITIONS, SHIFTS
-- ============================================================================

-- Users can view sectors/positions/shifts of their company
CREATE POLICY "Users can view company sectors"
  ON public.sectors FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = sectors.company_id
      AND (
        companies.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.employee_profile
          WHERE employee_profile.company_id = companies.id
          AND employee_profile.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Owners can insert company sectors"
  ON public.sectors FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = sectors.company_id
      AND companies.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can view company positions"
  ON public.positions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = positions.company_id
      AND (
        companies.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.employee_profile
          WHERE employee_profile.company_id = companies.id
          AND employee_profile.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Owners can insert company positions"
  ON public.positions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = positions.company_id
      AND companies.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can view company shifts"
  ON public.shifts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = shifts.company_id
      AND (
        companies.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.employee_profile
          WHERE employee_profile.company_id = companies.id
          AND employee_profile.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Owners can insert company shifts"
  ON public.shifts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = shifts.company_id
      AND companies.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- 8. CREATE STORAGE BUCKET FOR COMPANY ASSETS
-- ============================================================================

-- Note: This needs to be run in Supabase Dashboard → Storage
-- Bucket name: company-assets
-- Public: false
-- Allowed MIME types: image/*

-- ============================================================================
-- DONE!
-- ============================================================================

