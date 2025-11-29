-- ============================================================================
-- CORREÇÃO DE SEGURANÇA: Função handle_new_user
-- Problema: search_path mutável (vulnerabilidade de segurança)
-- Solução: Adicionar SET search_path explícito
-- ============================================================================

-- IMPORTANTE: Esta correção deve ser aplicada
-- Execute este script no Supabase SQL Editor

-- ============================================================================
-- CORREÇÃO: Função handle_new_user encontrada em COMPLETE_SETUP.sql (linha 516)
-- Versão original não tinha SET search_path
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

-- ============================================================================
-- VERIFICAÇÃO
-- ============================================================================

-- 1. Verificar se a função foi criada corretamente:
-- SELECT 
--   proname as function_name,
--   prosecdef as security_definer,
--   proconfig as search_path_config
-- FROM pg_proc 
-- WHERE proname = 'handle_new_user';

-- O campo proconfig deve mostrar: {search_path=public,pg_catalog}

-- 2. Verificar se o trigger ainda está ativo:
-- SELECT 
--   tgname as trigger_name,
--   tgrelid::regclass as table_name,
--   tgenabled as enabled
-- FROM pg_trigger 
-- WHERE tgname = 'on_auth_user_created';

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================

-- ✅ SET search_path = public, pg_catalog
--    - Garante que apenas schemas confiáveis sejam usados
--    - Previne ataques de shadowing de objetos
--    - Torna o comportamento da função previsível
--    - OBRIGATÓRIO para funções SECURITY DEFINER

-- ✅ SECURITY DEFINER
--    - A função executa com privilégios do criador
--    - Permite inserir em public.profiles mesmo que o usuário não tenha permissão direta
--    - Combinado com SET search_path, é seguro

-- ✅ Schema-qualified names
--    - public.profiles está qualificado (bom!)
--    - NEW.raw_user_meta_data usa o schema auth implicitamente (OK, vem do trigger)

-- ============================================================================
-- ✅ CORREÇÃO APLICADA!
-- ============================================================================

