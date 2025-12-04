-- ============================================================================
-- CHEFIAPP™ - SETUP COMPLETO DO BANCO DE DADOS
-- Execute este script no Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/[SEU_PROJECT]/sql/new
-- ============================================================================

-- ============================================================================
-- 1. CRIAR TABELA COMPANIES PRIMEIRO (necessária para foreign keys)
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
-- 2. ATUALIZAR TABELA PROFILES (adicionar campos faltantes)
-- ============================================================================

-- Adicionar campos se não existirem
DO $$ 
BEGIN
  -- company_id (agora companies já existe)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'company_id'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;
  END IF;

  -- email
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'email'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN email TEXT;
  END IF;

  -- sector
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'sector'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN sector TEXT;
  END IF;

  -- shift_status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'shift_status'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN shift_status TEXT DEFAULT 'offline';
  END IF;

  -- last_check_in
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'last_check_in'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN last_check_in TIMESTAMPTZ;
  END IF;

  -- last_check_out
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'last_check_out'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN last_check_out TIMESTAMPTZ;
  END IF;

  -- profile_photo
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'profile_photo'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN profile_photo TEXT;
  END IF;

  -- auth_method
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'auth_method'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN auth_method TEXT DEFAULT 'email';
  END IF;
END $$;

-- ============================================================================
-- 3. CRIAR TABELA SECTORS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, name)
);

-- ============================================================================
-- 4. CRIAR TABELA POSITIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, name)
);

-- ============================================================================
-- 5. CRIAR TABELA SHIFTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, name)
);

-- ============================================================================
-- 6. CRIAR TABELA TASKS (se não existir)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'MEDIUM',
  status TEXT NOT NULL DEFAULT 'PENDING',
  xp_reward INTEGER NOT NULL DEFAULT 20,
  due_date TIMESTAMPTZ,
  due_time TEXT,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_to UUID REFERENCES auth.users(id),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  estimated_time TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT tasks_pkey PRIMARY KEY (id)
);

-- Adicionar company_id se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tasks' 
    AND column_name = 'company_id'
  ) THEN
    ALTER TABLE public.tasks ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================================================
-- 7. CRIAR TABELA CHECK_INS (se não existir)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  check_in_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  check_out_time TIMESTAMPTZ,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. CRIAR TABELA NOTIFICATIONS (se não existir)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('task_assigned', 'task_completed', 'achievement', 'system')),
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 9. CRIAR TABELA ACTIVITIES (se não existir)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('check_in', 'check_out', 'task_completed', 'xp_gained', 'level_up', 'achievement_unlocked')),
  description TEXT NOT NULL,
  xp_change INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 10. CRIAR TABELA ACHIEVEMENTS (se não existir)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  xp INTEGER NOT NULL,
  trigger_type TEXT NOT NULL,
  trigger_value INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 11. CRIAR TABELA USER_ACHIEVEMENTS (se não existir)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id TEXT REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ============================================================================
-- 12. HABILITAR RLS EM TODAS AS TABELAS
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 13. CRIAR POLÍTICAS RLS - PROFILES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK ((select auth.uid()) = id);

-- Users can view profiles in their company
-- FIX: Usar função SECURITY DEFINER para evitar recursão infinita
CREATE OR REPLACE FUNCTION public.get_user_company_id(user_uuid UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
STABLE
AS $$
DECLARE
  result UUID;
BEGIN
  SELECT company_id INTO result
  FROM public.profiles
  WHERE id = user_uuid;
  RETURN result;
END;
$$;

DROP POLICY IF EXISTS "Users can view company profiles" ON public.profiles;
CREATE POLICY "Users can view company profiles" ON public.profiles
  FOR SELECT USING (
    -- Usuário pode ver seu próprio perfil
    id = (select auth.uid()) OR
    -- OU se não tem company_id (perfis sem empresa)
    company_id IS NULL OR
    -- OU se está na mesma empresa (usando função que bypassa RLS)
    company_id = public.get_user_company_id((select auth.uid()))
  );

-- ============================================================================
-- 14. CRIAR POLÍTICAS RLS - COMPANIES
-- ============================================================================

DROP POLICY IF EXISTS "Owners can view own companies" ON public.companies;
CREATE POLICY "Owners can view own companies" ON public.companies
  FOR SELECT USING ((select auth.uid()) = owner_id);

DROP POLICY IF EXISTS "Owners can insert own companies" ON public.companies;
CREATE POLICY "Owners can insert own companies" ON public.companies
  FOR INSERT WITH CHECK ((select auth.uid()) = owner_id);

DROP POLICY IF EXISTS "Owners can update own companies" ON public.companies;
CREATE POLICY "Owners can update own companies" ON public.companies
  FOR UPDATE USING ((select auth.uid()) = owner_id);

DROP POLICY IF EXISTS "Employees can view their company" ON public.companies;
CREATE POLICY "Employees can view their company" ON public.companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.company_id = companies.id
    )
  );

-- ============================================================================
-- 15. CRIAR POLÍTICAS RLS - SECTORS, POSITIONS, SHIFTS
-- ============================================================================

-- Sectors
DROP POLICY IF EXISTS "Users can view company sectors" ON public.sectors;
CREATE POLICY "Users can view company sectors" ON public.sectors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = sectors.company_id
      AND (
        companies.owner_id = (select auth.uid())
        OR EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.company_id = companies.id
          AND profiles.id = (select auth.uid())
        )
      )
    )
  );

DROP POLICY IF EXISTS "Owners can insert company sectors" ON public.sectors;
CREATE POLICY "Owners can insert company sectors" ON public.sectors
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = sectors.company_id
      AND companies.owner_id = (select auth.uid())
    )
  );

-- Positions
DROP POLICY IF EXISTS "Users can view company positions" ON public.positions;
CREATE POLICY "Users can view company positions" ON public.positions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = positions.company_id
      AND (
        companies.owner_id = (select auth.uid())
        OR EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.company_id = companies.id
          AND profiles.id = (select auth.uid())
        )
      )
    )
  );

DROP POLICY IF EXISTS "Owners can insert company positions" ON public.positions;
CREATE POLICY "Owners can insert company positions" ON public.positions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = positions.company_id
      AND companies.owner_id = (select auth.uid())
    )
  );

-- Shifts
DROP POLICY IF EXISTS "Users can view company shifts" ON public.shifts;
CREATE POLICY "Users can view company shifts" ON public.shifts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = shifts.company_id
      AND (
        companies.owner_id = (select auth.uid())
        OR EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.company_id = companies.id
          AND profiles.id = (select auth.uid())
        )
      )
    )
  );

DROP POLICY IF EXISTS "Owners can insert company shifts" ON public.shifts;
CREATE POLICY "Owners can insert company shifts" ON public.shifts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = shifts.company_id
      AND companies.owner_id = (select auth.uid())
    )
  );

-- ============================================================================
-- 16. CRIAR POLÍTICAS RLS - TASKS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view company tasks" ON public.tasks;
CREATE POLICY "Users can view company tasks" ON public.tasks
  FOR SELECT USING (
    company_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.company_id = tasks.company_id
    )
  );

DROP POLICY IF EXISTS "Users can insert tasks" ON public.tasks;
CREATE POLICY "Users can insert tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update tasks" ON public.tasks;
CREATE POLICY "Users can update tasks" ON public.tasks
  FOR UPDATE USING (
    company_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.company_id = tasks.company_id
    )
  );

-- ============================================================================
-- 17. CRIAR POLÍTICAS RLS - CHECK_INS, NOTIFICATIONS, ACTIVITIES
-- ============================================================================

-- Check-ins
DROP POLICY IF EXISTS "Users can view own checkins" ON public.check_ins;
CREATE POLICY "Users can view own checkins" ON public.check_ins
  FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own checkins" ON public.check_ins;
CREATE POLICY "Users can insert own checkins" ON public.check_ins
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

-- Notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING ((select auth.uid()) = user_id);

-- Activities
DROP POLICY IF EXISTS "Users can view company activities" ON public.activities;
CREATE POLICY "Users can view company activities" ON public.activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.company_id = activities.company_id
    )
  );

-- ============================================================================
-- 18. CRIAR POLÍTICAS RLS - ACHIEVEMENTS
-- ============================================================================

-- Achievements (consulta aberta para usuários autenticados)
DROP POLICY IF EXISTS "Users can view achievements" ON public.achievements;
CREATE POLICY "Users can view achievements" ON public.achievements
  FOR SELECT USING (auth.role() = 'authenticated');

-- User achievements (restritas ao próprio usuário)
DROP POLICY IF EXISTS "Users can view own achievements" ON public.user_achievements;
CREATE POLICY "Users can view own achievements" ON public.user_achievements
  FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own achievements" ON public.user_achievements;
CREATE POLICY "Users can insert own achievements" ON public.user_achievements
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own achievements" ON public.user_achievements;
CREATE POLICY "Users can update own achievements" ON public.user_achievements
  FOR UPDATE USING ((select auth.uid()) = user_id);

-- ============================================================================
-- 19. CRIAR FUNÇÃO PARA AUTO-CRIAR PERFIL
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog  -- ✅ CORREÇÃO: search_path fixo e seguro
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    name, 
    role, 
    department,
    email,
    xp, 
    level,
    shift_status
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'EMPLOYEE'),
    COALESCE(NEW.raw_user_meta_data->>'department', 'General'),
    NEW.email,
    0,
    1,
    'offline'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 20. CRIAR ÍNDICES PARA PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON public.profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_company_id ON public.tasks(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON public.check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_company_id ON public.check_ins(company_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_company_id ON public.activities(company_id);

-- ============================================================================
-- ✅ SETUP COMPLETO!
-- ============================================================================

-- Próximos passos:
-- 1. Criar bucket 'company-assets' no Storage
-- 2. Configurar variáveis de ambiente (.env.local)
-- 3. Testar o app!
