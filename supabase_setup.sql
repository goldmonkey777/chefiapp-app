-- ChefIApp - SQL Simplificado para Execução Manual
-- Execute este SQL no Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn/sql/new

-- 1. CRIAR TABELAS
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'EMPLOYEE',
  department text,
  xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  avatar text DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
  streak integer DEFAULT 0,
  status text DEFAULT 'offline',
  next_level_xp integer DEFAULT 100,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  priority text NOT NULL DEFAULT 'MEDIUM',
  status text NOT NULL DEFAULT 'PENDING',
  xp_reward integer NOT NULL DEFAULT 20,
  due_date timestamp with time zone,
  assigned_to uuid REFERENCES auth.users(id),
  started_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tasks_pkey PRIMARY KEY (id)
);

-- 2. HABILITAR RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;

-- 3. CRIAR POLÍTICAS
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view all tasks" ON public.tasks;
CREATE POLICY "Users can view all tasks" ON public.tasks
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert tasks" ON public.tasks;
CREATE POLICY "Users can insert tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update tasks" ON public.tasks;
CREATE POLICY "Users can update tasks" ON public.tasks
  FOR UPDATE USING (true);

-- 4. CRIAR TRIGGER PARA AUTO-CRIAR PERFIL
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, department, xp, level)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'EMPLOYEE'),
    COALESCE(NEW.raw_user_meta_data->>'department', 'General'),
    0,
    1
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- PRONTO! ✅
