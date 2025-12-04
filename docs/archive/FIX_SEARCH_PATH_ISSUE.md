# 🔒 Correção de Segurança: search_path Mutável

## 📋 Resumo do Problema

A função `public.increment_xp` tem um **search_path mutável**, o que representa uma vulnerabilidade de segurança.

### O que isso significa?

- A função não define explicitamente um `search_path` fixo
- Ela usa o `search_path` do usuário que a chama
- Isso permite ataques de **object shadowing** (sombreamento de objetos)
- Comportamento imprevisível dependendo do contexto

### Por que é perigoso?

1. **Segurança**: Um atacante pode criar objetos maliciosos em schemas que aparecem antes no `search_path`
2. **Confiabilidade**: Diferentes usuários/ambientes podem ter comportamentos diferentes
3. **Princípio do menor privilégio**: Funções importantes devem ter comportamento previsível

---

## ✅ Solução Recomendada

### Opção 1: Adicionar `SET search_path` (Recomendado)

```sql
CREATE OR REPLACE FUNCTION public.increment_xp(...)
RETURNS ...
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_catalog  -- ✅ CORREÇÃO
AS $$
  -- corpo da função
$$;
```

### Opção 2: Se usar `SECURITY DEFINER` (Obrigatório)

```sql
CREATE OR REPLACE FUNCTION public.increment_xp(...)
RETURNS ...
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog  -- ✅ OBRIGATÓRIO
AS $$
  -- corpo da função
$$;
```

### Opção 3: Qualificar nomes de objetos

Além do `SET search_path`, sempre use nomes qualificados:

```sql
-- ❌ Ruim
SELECT * FROM profiles WHERE id = p_user_id;

-- ✅ Bom
SELECT * FROM public.profiles WHERE id = p_user_id;
```

---

## 🔧 Como Aplicar a Correção

### Passo 1: Verificar a função atual

Execute no Supabase SQL Editor:

```sql
SELECT pg_get_functiondef(oid) 
FROM pg_proc 
WHERE proname = 'increment_xp';
```

### Passo 2: Aplicar a correção

1. Abra o arquivo: `supabase/FIX_INCREMENT_XP.sql`
2. Ajuste a assinatura da função conforme necessário
3. Execute no Supabase SQL Editor

### Passo 3: Verificar

```sql
SELECT 
  proname as function_name,
  prosecdef as security_definer,
  proconfig as search_path_config
FROM pg_proc 
WHERE proname = 'increment_xp';
```

O campo `proconfig` deve mostrar: `{search_path=public,pg_catalog}`

---

## 📝 Checklist de Validação

- [ ] Função tem `SET search_path = public, pg_catalog`
- [ ] Nomes de objetos estão qualificados (`public.tabela`)
- [ ] Função testada com diferentes usuários
- [ ] Permissões revisadas (REVOKE/GRANT se necessário)
- [ ] Documentação atualizada

---

## 🎯 Próximos Passos

1. **Aplicar correção**: Execute `supabase/FIX_INCREMENT_XP.sql`
2. **Testar**: Verifique se a função funciona corretamente
3. **Revisar outras funções**: Verifique se há outras funções com o mesmo problema

---

## 📚 Referências

- [PostgreSQL Security Best Practices](https://www.postgresql.org/docs/current/sql-createfunction.html)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [OWASP Database Security](https://owasp.org/www-community/vulnerabilities/Insecure_Database_Access)

---

**Status**: ⚠️ **AÇÃO NECESSÁRIA** - Aplicar correção de segurança

