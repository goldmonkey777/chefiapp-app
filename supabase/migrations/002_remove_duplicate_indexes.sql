-- ============================================================================
-- MIGRATION: Remove Duplicate Indexes
-- Date: 2025-12-03
-- Description: Remove duplicate indexes from kv_store tables to improve
--              storage efficiency and write performance
-- ============================================================================

-- ============================================================================
-- 1. KV_STORE_0D9071E5 - Remove 3 duplicate indexes
-- ============================================================================

-- Keep: kv_store_0d9071e5_key_idx (the first one)
-- Remove: kv_store_0d9071e5_key_idx1, kv_store_0d9071e5_key_idx2, kv_store_0d9071e5_key_idx3

DROP INDEX IF EXISTS public.kv_store_0d9071e5_key_idx1;
DROP INDEX IF EXISTS public.kv_store_0d9071e5_key_idx2;
DROP INDEX IF EXISTS public.kv_store_0d9071e5_key_idx3;

-- ============================================================================
-- 2. KV_STORE_60C1DD3A - Remove 7 duplicate indexes
-- ============================================================================

-- Keep: kv_store_60c1dd3a_key_idx (the first one)
-- Remove: kv_store_60c1dd3a_key_idx1 through kv_store_60c1dd3a_key_idx7

DROP INDEX IF EXISTS public.kv_store_60c1dd3a_key_idx1;
DROP INDEX IF EXISTS public.kv_store_60c1dd3a_key_idx2;
DROP INDEX IF EXISTS public.kv_store_60c1dd3a_key_idx3;
DROP INDEX IF EXISTS public.kv_store_60c1dd3a_key_idx4;
DROP INDEX IF EXISTS public.kv_store_60c1dd3a_key_idx5;
DROP INDEX IF EXISTS public.kv_store_60c1dd3a_key_idx6;
DROP INDEX IF EXISTS public.kv_store_60c1dd3a_key_idx7;

-- ============================================================================
-- ✅ MIGRATION COMPLETA
-- ============================================================================
-- Total de índices removidos: 10
-- Impacto esperado: Redução de espaço em disco e melhoria em operações de escrita
-- ============================================================================
