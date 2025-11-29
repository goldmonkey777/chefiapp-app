-- ============================================================================
-- CORREÇÃO DE SEGURANÇA: Função increment_xp
-- Problema: search_path mutável (vulnerabilidade de segurança)
-- Solução: Adicionar SET search_path explícito
-- ============================================================================

-- IMPORTANTE: Esta correção deve ser aplicada se a função increment_xp existir
-- Execute este script no Supabase SQL Editor

-- ============================================================================
-- OPÇÃO A: Se a função increment_xp já existe, substitua com esta versão segura
-- ============================================================================

-- Primeiro, vamos verificar se a função existe e obter sua assinatura
-- Execute no Supabase SQL Editor para ver a definição atual:
-- SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname = 'increment_xp';

-- ============================================================================
-- EXEMPLO DE CORREÇÃO (ajuste conforme a assinatura real da sua função)
-- ============================================================================

-- ============================================================================
-- CORREÇÃO: Função increment_xp encontrada em supabase_schema.sql (linha 132)
-- Versão original não tinha SET search_path
-- ============================================================================

CREATE OR REPLACE FUNCTION public.increment_xp(
  amount INTEGER,
  user_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog  -- ✅ CORREÇÃO: search_path fixo e seguro
AS $$
BEGIN
  UPDATE public.profiles
  SET xp = xp + amount,
      level = CASE 
        WHEN (xp + amount) >= next_level_xp THEN level + 1
        ELSE level
      END,
      next_level_xp = CASE 
        WHEN (xp + amount) >= next_level_xp THEN next_level_xp + 100
        ELSE next_level_xp
      END
  WHERE id = user_id;
END;
$$;

-- ============================================================================
-- OPÇÃO B: Se você preferir SECURITY DEFINER (mais restritivo)
-- ============================================================================

-- CREATE OR REPLACE FUNCTION public.increment_xp(
--   p_user_id UUID,
--   p_amount INTEGER DEFAULT 10
-- )
-- RETURNS INTEGER
-- LANGUAGE plpgsql
-- SECURITY DEFINER  -- Executa com privilégios do criador da função
-- SET search_path = public, pg_catalog  -- ✅ OBRIGATÓRIO para SECURITY DEFINER
-- AS $$
-- DECLARE
--   v_new_xp INTEGER;
-- BEGIN
--   -- Atualizar XP do usuário
--   UPDATE public.profiles
--   SET xp = COALESCE(xp, 0) + p_amount,
--       updated_at = NOW()
--   WHERE id = p_user_id
--   RETURNING xp INTO v_new_xp;
--   
--   -- Registrar atividade
--   INSERT INTO public.activities (
--     user_id,
--     company_id,
--     type,
--     description,
--     xp_change
--   )
--   SELECT 
--     p_user_id,
--     company_id,
--     'xp_gained',
--     'Ganhou ' || p_amount || ' XP',
--     p_amount
--   FROM public.profiles
--   WHERE id = p_user_id;
--   
--   RETURN COALESCE(v_new_xp, 0);
-- END;
-- $$;

-- ============================================================================
-- OPÇÃO C: Se a função não existe ainda, crie com esta versão segura
-- ============================================================================

-- Use a Opção A acima

-- ============================================================================
-- VERIFICAÇÃO E TESTE
-- ============================================================================

-- 1. Verificar se a função foi criada corretamente:
-- SELECT 
--   proname as function_name,
--   prosecdef as security_definer,
--   proconfig as search_path_config
-- FROM pg_proc 
-- WHERE proname = 'increment_xp';

-- 2. Testar a função (substitua o UUID por um ID real):
-- SELECT public.increment_xp('00000000-0000-0000-0000-000000000000'::UUID, 10);

-- 3. Verificar se o XP foi atualizado:
-- SELECT id, name, xp FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000000'::UUID;

-- ============================================================================
-- PERMISSÕES (Opcional - para maior segurança)
-- ============================================================================

-- Revogar permissão pública (se aplicável)
-- REVOKE EXECUTE ON FUNCTION public.increment_xp(UUID, INTEGER) FROM PUBLIC;

-- Conceder apenas para usuários autenticados
-- GRANT EXECUTE ON FUNCTION public.increment_xp(UUID, INTEGER) TO authenticated;

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================

-- ✅ SET search_path = public, pg_catalog
--    - Garante que apenas schemas confiáveis sejam usados
--    - Previne ataques de shadowing de objetos
--    - Torna o comportamento da função previsível

-- ✅ SECURITY INVOKER vs SECURITY DEFINER
--    - SECURITY INVOKER: executa com privilégios do chamador (mais seguro)
--    - SECURITY DEFINER: executa com privilégios do criador (requer SET search_path obrigatório)

-- ✅ Schema-qualified names
--    - Sempre use public.tabela ao invés de apenas tabela
--    - Isso reduz dependência do search_path

-- ============================================================================
-- ✅ CORREÇÃO APLICADA!
-- ============================================================================

