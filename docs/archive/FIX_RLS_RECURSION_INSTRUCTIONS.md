# 🔧 CORREÇÃO: Recursão Infinita na Política RLS

## ❌ Problema

A política RLS "Users can view company profiles" está causando recursão infinita porque ela faz SELECT na tabela `profiles` dentro da própria política RLS.

**Erro exibido:**
```
Erro ao carregar perfil: infinite recursion detected in policy for relation "profiles"
```

## ✅ Solução

Execute o script SQL `supabase/FIX_RLS_RECURSION.sql` no Supabase Dashboard.

### Passos:

1. **Abra o Supabase Dashboard:**
   - Acesse: https://supabase.com/dashboard
   - Selecione seu projeto

2. **Abra o SQL Editor:**
   - Clique em **SQL Editor** no menu lateral
   - Clique em **New query**

3. **Execute o script:**
   - Abra o arquivo `supabase/FIX_RLS_RECURSION.sql`
   - Copie TODO o conteúdo (Cmd+A, Cmd+C)
   - Cole no SQL Editor (Cmd+V)
   - Clique em **Run** ou pressione **Cmd+Enter**

4. **Verifique se funcionou:**
   - O script deve executar sem erros
   - Você deve ver uma tabela com as políticas criadas
   - Teste o login novamente no app

## 🔍 O que o script faz?

1. **Remove a política problemática** que causa recursão
2. **Cria uma função auxiliar** `get_user_company_id()` que bypassa RLS usando `SECURITY DEFINER`
3. **Recria a política** usando a função auxiliar, evitando recursão

## 📝 Nota Técnica

A função `get_user_company_id()` usa `SECURITY DEFINER`, o que significa que ela executa com as permissões do criador da função (não do usuário que a chama), permitindo que ela faça SELECT na tabela `profiles` sem passar pela política RLS, evitando assim a recursão infinita.

---

**Após executar o script, teste o login novamente no app!**
