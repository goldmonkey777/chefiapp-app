-- ============================================================================
-- CORREÇÃO: Criar/Atualizar Perfil após OAuth (Google/Apple)
-- Problema: Dados do OAuth não estão sendo migrados para a tabela profiles
-- Solução: Melhorar função handle_new_user para extrair dados do OAuth
-- ============================================================================

-- IMPORTANTE: Execute este script no Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn/sql/new

-- ============================================================================
-- 1. MELHORAR FUNÇÃO handle_new_user PARA EXTRAIR DADOS DO OAUTH
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  user_name TEXT;
  user_email TEXT;
  user_avatar_url TEXT;
BEGIN
  -- Extrair nome de diferentes fontes (OAuth pode vir de diferentes lugares)
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',           -- Google
    NEW.raw_user_meta_data->>'name',                -- Apple/Email
    NEW.raw_user_meta_data->>'display_name',        -- Alternativa
    NEW.user_metadata->>'full_name',                -- user_metadata
    NEW.user_metadata->>'name',                     -- user_metadata
    NEW.user_metadata->>'display_name',             -- user_metadata
    split_part(NEW.email, '@', 1),                  -- Fallback: usar parte antes do @
    'New User'                                       -- Último fallback
  );

  -- Extrair email
  user_email := COALESCE(
    NEW.email,
    NEW.raw_user_meta_data->>'email',
    NEW.user_metadata->>'email',
    ''
  );

  -- Extrair avatar URL (se disponível)
  user_avatar_url := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    NEW.user_metadata->>'avatar_url',
    NEW.user_metadata->>'picture',
    ''
  );

  -- Inserir ou atualizar perfil
  INSERT INTO public.profiles (
    id,
    name,
    email,
    role,
    department,
    xp,
    level,
    shift_status,
    profile_photo,
    auth_method
  )
  VALUES (
    NEW.id,
    user_name,
    user_email,
    COALESCE(NEW.raw_user_meta_data->>'role', NEW.user_metadata->>'role', 'EMPLOYEE'),
    COALESCE(NEW.raw_user_meta_data->>'department', NEW.user_metadata->>'department', 'General'),
    0,
    1,
    'offline',
    user_avatar_url,
    COALESCE(NEW.app_metadata->>'provider', 'email')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    profile_photo = COALESCE(EXCLUDED.profile_photo, profiles.profile_photo),
    auth_method = EXCLUDED.auth_method,
    updated_at = NOW();

  RETURN NEW;
END;
$$;

-- ============================================================================
-- 2. VERIFICAR SE O TRIGGER ESTÁ ATIVO
-- ============================================================================

-- Verificar se o trigger existe e está ativo:
-- SELECT 
--   tgname as trigger_name,
--   tgrelid::regclass as table_name,
--   tgenabled as enabled,
--   pg_get_triggerdef(oid) as definition
-- FROM pg_trigger 
-- WHERE tgname = 'on_auth_user_created';

-- Se o trigger não existir, criar:
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 3. CRIAR FUNÇÃO PARA ATUALIZAR PERFIS EXISTENTES (se necessário)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.sync_existing_users_to_profiles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  -- Criar perfis para usuários que existem em auth.users mas não em profiles
  INSERT INTO public.profiles (
    id,
    name,
    email,
    role,
    department,
    xp,
    level,
    shift_status,
    profile_photo,
    auth_method
  )
  SELECT
    u.id,
    COALESCE(
      u.raw_user_meta_data->>'full_name',
      u.raw_user_meta_data->>'name',
      u.user_metadata->>'full_name',
      u.user_metadata->>'name',
      split_part(u.email, '@', 1),
      'New User'
    ),
    COALESCE(u.email, ''),
    COALESCE(u.raw_user_meta_data->>'role', u.user_metadata->>'role', 'EMPLOYEE'),
    COALESCE(u.raw_user_meta_data->>'department', u.user_metadata->>'department', 'General'),
    0,
    1,
    'offline',
    COALESCE(
      u.raw_user_meta_data->>'avatar_url',
      u.raw_user_meta_data->>'picture',
      u.user_metadata->>'avatar_url',
      u.user_metadata->>'picture',
      ''
    ),
    COALESCE(u.app_metadata->>'provider', 'email')
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  WHERE p.id IS NULL;
END;
$$;

-- ============================================================================
-- 4. EXECUTAR SYNC PARA USUÁRIOS EXISTENTES (OPCIONAL)
-- ============================================================================

-- Descomente a linha abaixo para sincronizar usuários existentes:
-- SELECT public.sync_existing_users_to_profiles();

-- ============================================================================
-- ✅ PRONTO!
-- ============================================================================

-- Agora, quando um usuário fizer login com Google/Apple:
-- 1. O Supabase cria o usuário em auth.users
-- 2. O trigger on_auth_user_created é disparado
-- 3. A função handle_new_user extrai os dados do OAuth
-- 4. Um perfil é criado/atualizado em public.profiles
-- 5. Os dados (nome, email, avatar) são salvos corretamente

