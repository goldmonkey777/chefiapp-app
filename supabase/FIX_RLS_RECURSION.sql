-- ============================================================================
-- FIX: Infinite Recursion in RLS Policy for profiles table
-- ============================================================================
-- 
-- PROBLEMA:
-- A política "Users can view company profiles" está causando recursão infinita
-- porque ela faz SELECT na tabela profiles dentro da própria política RLS.
--
-- SOLUÇÃO:
-- Usar uma função SECURITY DEFINER que bypassa RLS para verificar company_id
-- OU simplificar a política para não fazer SELECT na própria tabela.
--
-- ============================================================================

-- Remover a política problemática
DROP POLICY IF EXISTS "Users can view company profiles" ON public.profiles;

-- Criar função auxiliar SECURITY DEFINER para verificar company_id sem recursão
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

-- Recriar a política usando a função auxiliar (evita recursão)
CREATE POLICY "Users can view company profiles" ON public.profiles
  FOR SELECT USING (
    -- Usuário pode ver seu próprio perfil
    id = auth.uid() OR
    -- OU se não tem company_id (perfis sem empresa)
    company_id IS NULL OR
    -- OU se está na mesma empresa (usando função que bypassa RLS)
    company_id = public.get_user_company_id(auth.uid())
  );

-- ============================================================================
-- ALTERNATIVA MAIS SIMPLES (se a função acima não funcionar):
-- ============================================================================
-- 
-- DROP POLICY IF EXISTS "Users can view company profiles" ON public.profiles;
-- 
-- CREATE POLICY "Users can view company profiles" ON public.profiles
--   FOR SELECT USING (
--     -- Usuário sempre pode ver seu próprio perfil
--     id = auth.uid() OR
--     -- OU se o perfil não tem company_id
--     company_id IS NULL
--   );
-- 
-- -- Criar política separada para ver perfis da mesma empresa
-- -- (isso requer que o usuário já tenha um perfil criado)
-- CREATE POLICY "Users can view profiles from same company" ON public.profiles
--   FOR SELECT USING (
--     company_id IS NOT NULL AND
--     company_id IN (
--       SELECT company_id 
--       FROM public.profiles 
--       WHERE id = auth.uid() 
--       LIMIT 1
--     )
--   );
--
-- ============================================================================

-- Verificar se as políticas foram criadas corretamente
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

