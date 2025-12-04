# 🚀 TESTE AGORA - Passo a Passo

## ✅ Build completado com LOGS SUPER DETALHADOS

Acabei de adicionar **logs em TODOS os pontos** do fluxo OAuth. Agora você vai conseguir ver **exatamente** onde está falhando.

---

## 📱 TESTE 1: iOS (Recomendado)

### Passo 1: Sincronizar e Abrir Xcode

```bash
npx cap sync ios
npx cap open ios
```

### Passo 2: Abrir Console do Xcode

No Xcode:
1. Clique em **View** → **Debug Area** → **Show Debug Area**
2. Ou pressione: **Cmd + Shift + Y**

### Passo 3: Executar o App

1. Selecione um simulador (iPhone 15 Pro recomendado)
2. Clique no botão **Play** (▶) ou pressione **Cmd + R**

### Passo 4: Fazer Login

1. No app, clique em **"Continuar com Google"** ou **"Continuar com Apple"**
2. Faça login normalmente

### Passo 5: OBSERVAR OS LOGS

**NO CONSOLE DO XCODE**, você verá logs como:

#### ✅ Se Funcionar (Sucesso):
```
🔗 [App] OAuth callback detectado
🔗 [App] OAuth session established successfully!
🔗 [App] User: seu@email.com
🔑 [useAuth] Initializing auth...
✅ [useAuth] Session found, fetching profile for user: abc-123
🔧 [ensureProfileExists] Garantindo perfil para: { userId: 'abc-123' }
✅ [ensureProfileExists] Perfil já existe: Seu Nome
🔗 [fetchProfile] Buscando perfil para userId: abc-123
✅ [fetchProfile] Perfil encontrado
✅ [useAuth] Profile fetch completed
🎯 [App] State: { isLoading: false, isAuthenticated: true, hasUser: true }
📊 [App] Rendering dashboard for user: seu@email.com role: EMPLOYEE
```

→ **Dashboard aparece! ✅**

#### ❌ Se NÃO Funcionar (Erro de Criação de Perfil):
```
🔗 [App] OAuth session established successfully!
🔑 [useAuth] Initializing auth...
✅ [useAuth] Session found, fetching profile for user: abc-123
🔧 [ensureProfileExists] Garantindo perfil para: { userId: 'abc-123' }
📝 [ensureProfileExists] Perfil não existe, criando...
💾 [ensureProfileExists] Criando perfil com dados: { name: 'Seu Nome' }
❌ [ensureProfileExists] Erro ao criar/atualizar perfil: { code: '42501' }
❌ [ensureProfileExists] Código do erro: 42501
❌ [ensureProfileExists] Mensagem: permission denied for table profiles
```

→ **Problema: RLS bloqueando!**

#### ❌ Se NÃO Funcionar (Timeout):
```
🔗 [App] OAuth session established successfully!
🔑 [useAuth] Initializing auth...
... (10 segundos de silêncio) ...
⏱️ [useAuth] Auth initialization timeout (10s) - forcing onboarding
👤 [App] Showing onboarding
```

→ **Problema: Muito lento ou rede ruim**

---

## 🌐 TESTE 2: Web (Alternativo)

### Passo 1: Rodar Dev Server

```bash
npm run dev
```

### Passo 2: Abrir Navegador

1. Abra: http://localhost:5173
2. Abra DevTools: **F12** ou **Cmd + Option + I**
3. Vá na aba **Console**

### Passo 3: Fazer Login

1. Clique em **"Continuar com Google"**
2. Faça login

### Passo 4: Ver Logs

Os mesmos logs do iOS aparecerão aqui!

---

## 🔍 INTERPRETAR OS LOGS

### ✅ LOG BOM: "Perfil já existe"
```
✅ [ensureProfileExists] Perfil já existe: Seu Nome
```
→ **Trigger funcionou! Perfil foi criado automaticamente**

### ✅ LOG BOM: "Perfil criado com sucesso"
```
✅ [ensureProfileExists] Perfil criado com sucesso: {...}
```
→ **useAuth criou o perfil manualmente (fallback)**

### ❌ LOG RUIM: "permission denied"
```
❌ [ensureProfileExists] Código do erro: 42501
❌ [ensureProfileExists] Mensagem: permission denied
```
→ **SOLUÇÃO: Desabilitar RLS (veja abaixo)**

### ❌ LOG RUIM: "timeout"
```
⏱️ [useAuth] Auth initialization timeout (10s)
```
→ **SOLUÇÃO: Internet lenta ou Supabase offline**

---

## 🔧 SOLUÇÕES PARA ERROS COMUNS

### Erro: "permission denied" (código 42501)

**O que é:** RLS (Row Level Security) está bloqueando

**Solução Rápida:**
No Supabase SQL Editor, execute:

```sql
-- Desabilitar RLS TEMPORARIAMENTE (só dev!)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

Teste novamente. Se funcionar, o problema era RLS.

**Solução Permanente:**
```sql
-- Reabilitar com políticas corretas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Permitir usuários criarem/lerem seu próprio perfil
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

### Erro: Timeout de 10 segundos

**Possíveis causas:**
1. Internet muito lenta
2. Supabase offline ou lento
3. Trigger travado

**Soluções:**
1. Teste internet: https://fast.com
2. Status Supabase: https://status.supabase.com
3. Criar perfil manualmente (veja DEBUG_OAUTH.md)

### Erro: "Perfil não existe" mas não tenta criar

**Causa:** Bug raro de race condition

**Solução:** Force criação manual:
```sql
-- No Supabase SQL Editor
INSERT INTO profiles (id, name, email, role, xp, level, streak, shift_status, auth_method)
SELECT
  id,
  COALESCE(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name', email),
  email,
  'EMPLOYEE',
  0, 1, 0, 'offline',
  raw_app_meta_data->>'provider'
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles);
```

---

## 📋 CHECKLIST

Marque conforme fizer:

- [ ] Build executado: `npm run build`
- [ ] Capacitor sincronizado: `npx cap sync ios`
- [ ] Xcode aberto: `npx cap open ios`
- [ ] Console do Xcode visível (Cmd+Shift+Y)
- [ ] App executado no simulador
- [ ] Login com Google/Apple realizado
- [ ] Logs copiados do console
- [ ] Se erro "permission denied": RLS desabilitado
- [ ] Teste realizado novamente após fix

---

## 🆘 SE AINDA NÃO FUNCIONAR

**Me envie:**

1. **TODOS os logs do console** (copie desde o início até o fim)
2. **Screenshot da tela** que aparece após login
3. **Resultado deste SQL** no Supabase:
   ```sql
   SELECT id, name, email, role, company_id FROM profiles;
   SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'profiles';
   ```

Com essas 3 informações eu consigo identificar o problema exato!

---

## 🎯 RESUMO DO QUE FOI FEITO

1. ✅ Timeout aumentado: 3s → 10s
2. ✅ Logs super detalhados em TUDO
3. ✅ `ensureProfileExists` melhorado com:
   - Verificação antes de criar
   - Logs de cada etapa
   - Erro detalhado com código
4. ✅ `fetchProfile` com fallback automático
5. ✅ Build e sync completados

**AGORA TESTE E ME DIGA O QUE APARECE NO CONSOLE!** 🚀
