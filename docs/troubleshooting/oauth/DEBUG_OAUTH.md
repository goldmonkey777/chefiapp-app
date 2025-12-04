# 🔍 DEBUG: Por que OAuth não carrega Dashboard?

## ❓ Perguntas para entender o problema:

### 1. O que você vê na tela após fazer login com Google/Apple?

- [ ] Tela de loading infinita (girando)
- [ ] Volta para tela de login/onboarding
- [ ] Tela branca
- [ ] Erro visível
- [ ] Outro: ___________

### 2. O console mostra algum log?

Para ver os logs:
- **iOS:** Xcode → View → Debug Area → Show Debug Area
- **Web:** DevTools (F12) → Console

### 3. Você consegue ver seu usuário no Supabase?

Vá em: https://supabase.com/dashboard/project/[SEU_PROJECT_ID]/auth/users

- [ ] Sim, vejo meu email
- [ ] Não, não aparece nada
- [ ] Aparece mas diz "No records found"

---

## 🧪 TESTE RÁPIDO: Criar perfil manualmente

Se o problema é que o perfil não está sendo criado automaticamente, vamos criar manualmente:

### Passo 1: Fazer login com Google/Apple
1. Tente fazer login normalmente
2. Mesmo que não carregue, continue

### Passo 2: Pegar seu User ID
Vá no Supabase: Authentication → Users

Copie o **UUID** do seu usuário (ex: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### Passo 3: Criar perfil manualmente no SQL Editor

No Supabase: SQL Editor → New Query

Cole este SQL (substitua `SEU_USER_ID` e `SEU_EMAIL`):

```sql
-- Ver se perfil já existe
SELECT * FROM profiles WHERE id = 'SEU_USER_ID';

-- Se não existir, criar:
INSERT INTO profiles (
  id,
  name,
  email,
  role,
  xp,
  level,
  streak,
  shift_status,
  auth_method,
  created_at
) VALUES (
  'SEU_USER_ID',                    -- ← Cole seu User ID aqui
  'Seu Nome',                        -- ← Seu nome
  'SEU_EMAIL@gmail.com',             -- ← Seu email
  'EMPLOYEE',                        -- ou 'OWNER' / 'MANAGER'
  0,
  1,
  0,
  'offline',
  'google',                          -- ou 'apple'
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name;

-- Confirmar que foi criado:
SELECT * FROM profiles WHERE id = 'SEU_USER_ID';
```

### Passo 4: Testar novamente
1. Recarregue o app (Cmd+R no navegador ou reabra no iOS)
2. Faça login com Google/Apple
3. Deve carregar o Dashboard agora

---

## 🔍 SE AINDA NÃO FUNCIONAR: Envie estas informações

### 1. Logs do Console
Copie **TODOS** os logs que aparecem após fazer login. Procure por:
```
🔗 [App] ...
🔑 [useAuth] ...
🎯 [App] State: ...
```

### 2. Estado do Supabase

**Tabela profiles:**
```sql
SELECT id, name, email, role, company_id FROM profiles LIMIT 5;
```

**RLS da tabela profiles:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

**Trigger handle_new_user:**
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### 3. Configuração OAuth no Supabase

Vá em: Authentication → Providers

**Google:**
- [ ] Habilitado?
- [ ] Client ID configurado?
- [ ] Redirect URLs incluem: `com-chefiapp-app://auth/callback`?

**Apple:**
- [ ] Habilitado?
- [ ] Services ID configurado?
- [ ] Redirect URLs incluem: `com-chefiapp-app://auth/callback`?

---

## 🎯 POSSÍVEIS CAUSAS (mais prováveis primeiro):

### Causa 1: Trigger não está criando perfil automaticamente
**Sintoma:** Você faz login mas não vai para dashboard

**Solução:**
1. Execute o SQL do Passo 3 acima
2. Crie o perfil manualmente
3. Teste novamente

### Causa 2: RLS bloqueando leitura de perfis
**Sintoma:** Logs mostram erro "permission denied"

**Solução:**
```sql
-- Desabilitar RLS temporariamente para testar:
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Testar login novamente
-- Se funcionar, o problema é RLS

-- Reabilitar com políticas corretas:
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

### Causa 3: Timeout de 10s ainda é curto
**Sintoma:** Logs mostram "Auth initialization timeout"

**Solução temporária:**
```typescript
// Em src/hooks/useAuth.ts linha 210
// Aumente para 30 segundos:
}, 30000);  // era 10000
```

### Causa 4: Perfil existe mas `company_id` é NULL
**Sintoma:** Dashboard não carrega porque falta empresa

**Solução:**
```sql
-- Ver perfis sem empresa:
SELECT id, name, email, company_id FROM profiles WHERE company_id IS NULL;

-- Se você for OWNER e não tem empresa, crie uma:
INSERT INTO companies (name, email, country, owner_id)
VALUES ('Minha Empresa', 'seu@email.com', 'BR', 'SEU_USER_ID');

-- Atualizar perfil com company_id:
UPDATE profiles
SET company_id = (SELECT id FROM companies WHERE owner_id = 'SEU_USER_ID')
WHERE id = 'SEU_USER_ID';
```

---

## 📋 CHECKLIST DE DEBUG

Marque conforme testar:

- [ ] Fiz login com Google/Apple
- [ ] Verifiquei se usuário aparece em Authentication → Users
- [ ] Copiei meu User ID
- [ ] Executei SELECT para ver se perfil existe
- [ ] Se não existe, criei manualmente com INSERT
- [ ] Executei SELECT novamente para confirmar
- [ ] Testei login novamente após criar perfil
- [ ] Copiei logs do console
- [ ] Verifiquei RLS da tabela profiles
- [ ] Verifiquei Redirect URLs no Supabase

---

## 💡 ATALHO: Desabilitar RLS temporariamente

Se você quer testar **rapidamente** sem depurar, desabilite RLS:

```sql
-- ⚠️ ATENÇÃO: Só use em desenvolvimento!
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins DISABLE ROW LEVEL SECURITY;
ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements DISABLE ROW LEVEL SECURITY;
```

Teste login novamente. Se funcionar, o problema é RLS.

Depois, reabilite com as políticas corretas:
```sql
-- Ver o arquivo: supabase/sql/03_rls.sql
```

---

## 🚨 RESPONDA ESTAS PERGUNTAS:

Para eu poder te ajudar melhor, responda:

1. **Onde você está testando?**
   - [ ] iOS Simulador
   - [ ] iOS Device real
   - [ ] Navegador web (localhost)
   - [ ] Navegador web (produção)

2. **O que você vê após fazer login?**
   - Descreva exatamente: ___________

3. **Logs do console:**
   - Cole aqui os logs que aparecem

4. **Perfil existe no Supabase?**
   - [ ] Sim, encontrei na tabela profiles
   - [ ] Não, tabela está vazia
   - [ ] Não sei como verificar

5. **RLS está habilitado?**
   - Execute: `SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'profiles';`
   - Resultado: ___________

---

**Me envie essas respostas e os logs do console que vou identificar o problema exato!**
