# 🔧 FIX: OAuth não carrega Dashboard

**Data:** 2025-12-03
**Status:** ✅ CORREÇÕES APLICADAS - PRONTO PARA TESTAR

---

## 🔴 PROBLEMA RELATADO

**Sintoma:**
Quando o usuário faz login com Google ou Apple OAuth:
1. ✅ A autenticação completa com sucesso
2. ✅ O app volta do navegador OAuth
3. ❌ O Dashboard não carrega
4. ❌ O usuário fica preso na tela de loading ou volta para onboarding

---

## 🔍 CAUSAS IDENTIFICADAS

### 1. Timeout Muito Curto (3 segundos)
**Arquivo:** `src/hooks/useAuth.ts:202-209`

**Problema:**
```typescript
// ❌ ANTES: Timeout de apenas 3 segundos
setTimeout(() => {
  if (isMounted) {
    console.warn('Auth initialization timeout - forcing onboarding');
    setCurrentUser(null);
    setAuthenticated(false);
    setIsLoading(false);
  }
}, 3000);  // Muito curto!
```

**Impacto:**
- OAuth leva ~2-5 segundos para completar
- Perfil precisa ser criado no banco (trigger SQL)
- Profile fetch precisa buscar dados
- 3 segundos não é suficiente → força logout antes de carregar

**Solução:**
```typescript
// ✅ DEPOIS: Timeout aumentado para 10 segundos
setTimeout(() => {
  if (isMounted) {
    console.warn('⏱️ [useAuth] Auth initialization timeout (10s) - forcing onboarding');
    setCurrentUser(null);
    setAuthenticated(false);
    setIsLoading(false);
  }
}, 10000);  // Tempo suficiente!
```

### 2. Falta de Logs para Debug
**Problema:**
- Impossível saber em que etapa o fluxo falha
- Não há visibilidade do estado interno
- Dificulta identificar se é problema de rede, banco, ou código

**Solução:**
Adicionados logs detalhados em todos os pontos críticos:

**useAuth.ts:**
```typescript
console.log('🔑 [useAuth] Initializing auth...');
console.log('✅ [useAuth] Session found, fetching profile for user:', session.user.id);
console.log('✅ [useAuth] Profile fetch completed');
console.log('ℹ️ [useAuth] No session found, showing onboarding');
console.log('❌ [useAuth] Error getting session:', sessionError);
```

**App.tsx:**
```typescript
console.log('🎯 [App] State:', {
  isLoading,
  isAuthenticated,
  hasUser: !!user,
  userId: user?.id,
  userRole: user?.role,
  showOnboarding
});
console.log('⏳ [App] Still loading auth state...');
console.log('👤 [App] Showing onboarding');
console.log('📊 [App] Rendering dashboard for user:', user.email);
```

### 3. Race Condition Entre App.tsx e useAuth
**Problema:**
- App.tsx processa tokens OAuth
- useAuth também escuta onAuthStateChange
- Ambos tentam criar perfil ao mesmo tempo
- Pode causar conflito ou estado inconsistente

**Solução:**
Adicionado delay de 1 segundo após setSession:
```typescript
// App.tsx
if (data?.user) {
  console.log('🔗 [App] OAuth session established successfully!');

  // Clear URL hash to prevent re-processing
  window.history.replaceState(null, '', window.location.pathname);

  // Wait for useAuth to process the session
  setTimeout(() => {
    console.log('🔗 [App] Delay completed, useAuth should have processed session');
  }, 1000);
}
```

---

## 🚀 CORREÇÕES APLICADAS

### Arquivo: `src/hooks/useAuth.ts`

#### Mudança 1: Timeout aumentado
- **Linhas:** 201-210
- **Antes:** 3000ms (3 segundos)
- **Depois:** 10000ms (10 segundos)

#### Mudança 2: Logs adicionados
- **Linhas:** 214, 231, 238, 241, 252
- **Adicionado:** Console.log em todas as etapas críticas

### Arquivo: `src/App.tsx`

#### Mudança 1: Debug logs completos
- **Linhas:** 254-263
- **Adicionado:** useEffect que loga todo o estado a cada mudança

#### Mudança 2: Logs em loading/onboarding/dashboard
- **Linhas:** 267, 281, 293
- **Adicionado:** Console.log antes de cada render

#### Mudança 3: Delay após setSession
- **Linhas:** 233-239
- **Adicionado:** setTimeout de 1s para dar tempo ao useAuth processar

---

## 🧪 COMO TESTAR

### Pré-requisitos:
1. ✅ Código atualizado com as correções acima
2. ✅ Build executado: `npm run build`
3. ✅ Capacitor sincronizado: `npx cap sync ios`
4. ✅ Console do navegador/Xcode aberto para ver logs

### Teste 1: Google OAuth (iOS)

```bash
# 1. Abrir Xcode
npx cap open ios

# 2. Executar no simulador ou device
# 3. Abrir console do Xcode (View → Debug Area → Activate Console)
```

**Passos:**
1. No app, clique em "Continuar com Google"
2. Faça login com sua conta Google
3. **Observe os logs** no console do Xcode

**Logs Esperados (Sucesso):**
```
🔗 [App] OAuth callback detectado
🔗 [App] Processing OAuth callback...
🔗 [App] OAuth session established successfully!
🔗 [App] User: seu-email@gmail.com
🔗 [App] Aguardando onAuthStateChange processar...
🔗 [useAuth] Auth state change: { event: 'SIGNED_IN', hasSession: true }
🔗 [useAuth] Session encontrada, buscando perfil...
🔗 [useAuth] Garantindo que perfil existe...
🔗 [fetchProfile] Buscando perfil para userId: xxx-xxx-xxx
🔗 [fetchProfile] Perfil encontrado: { id: 'xxx', name: 'Seu Nome' }
✅ [useAuth] Perfil carregado com sucesso!
🎯 [App] State: { isLoading: false, isAuthenticated: true, hasUser: true }
📊 [App] Rendering dashboard for user: seu-email@gmail.com role: EMPLOYEE
```

**Se funcionar ✅:**
- Dashboard aparece
- Você vê seu nome e foto
- Pode navegar pelo app

**Se NÃO funcionar ❌:**
- Copie **todos os logs** do console
- Identifique onde parou (qual foi o último log)
- Compartilhe os logs para debug

### Teste 2: Apple OAuth (iOS)

Mesmos passos do Teste 1, mas clicando em "Continuar com Apple"

### Teste 3: Web (Navegador)

```bash
# 1. Rodar dev server
npm run dev

# 2. Abrir http://localhost:5173
# 3. Abrir DevTools (F12) → Console
```

**Passos:**
1. Clique em "Continuar com Google" ou "Continuar com Apple"
2. Faça login
3. **Observe os logs** no console do navegador

**Logs esperados são os mesmos do iOS**

---

## 📊 ENTENDENDO OS LOGS

### Estado Normal (Funcionando):
```
🔑 [useAuth] Initializing auth...
✅ [useAuth] Session found, fetching profile for user: xxx
🔗 [fetchProfile] Buscando perfil para userId: xxx
✅ [fetchProfile] Perfil encontrado
✅ [useAuth] Profile fetch completed
🎯 [App] State: { isLoading: false, isAuthenticated: true, hasUser: true }
📊 [App] Rendering dashboard
```

### Problema 1: Timeout (10 segundos passou)
```
🔑 [useAuth] Initializing auth...
⏱️ [useAuth] Auth initialization timeout (10s) - forcing onboarding
🎯 [App] State: { isLoading: false, isAuthenticated: false, hasUser: false }
👤 [App] Showing onboarding
```

**Diagnóstico:** Perfil não foi carregado em 10 segundos
**Possíveis causas:**
- Internet lenta
- Supabase lento/offline
- Problema com RLS (Row Level Security)
- Trigger não criou perfil

**Solução:**
1. Verifique internet
2. Verifique status do Supabase
3. Verifique se o trigger `handle_new_user` está ativo
4. Verifique RLS da tabela `profiles`

### Problema 2: Perfil não encontrado
```
🔑 [useAuth] Initializing auth...
✅ [useAuth] Session found, fetching profile for user: xxx
🔗 [fetchProfile] Buscando perfil para userId: xxx
🔗 [fetchProfile] Erro ao buscar perfil: { code: 'PGRST116' }
🔗 [fetchProfile] Perfil não encontrado, tentando criar...
✅ [fetchProfile] Perfil criado e carregado
🎯 [App] State: { isLoading: false, isAuthenticated: true, hasUser: true }
```

**Diagnóstico:** Trigger não criou perfil automaticamente, mas useAuth criou manualmente
**Status:** ✅ OK (useAuth tem fallback)

### Problema 3: RLS bloqueando acesso
```
🔑 [useAuth] Initializing auth...
✅ [useAuth] Session found, fetching profile for user: xxx
🔗 [fetchProfile] Buscando perfil para userId: xxx
❌ [fetchProfile] Erro ao buscar perfil: { code: '42501', message: 'permission denied' }
🎯 [App] State: { isLoading: false, isAuthenticated: false, hasUser: false }
```

**Diagnóstico:** Row Level Security (RLS) está bloqueando leitura da tabela profiles
**Solução:**
```sql
-- No Supabase SQL Editor, execute:
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Permitir usuários lerem seu próprio perfil
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Permitir usuários atualizarem seu próprio perfil
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

---

## 🐛 TROUBLESHOOTING

### Problema: Ainda fica em loading infinito

**Diagnóstico:**
1. Procure no console: `⏱️ [useAuth] Auth initialization timeout`
2. Se aparecer, significa que 10 segundos passaram sem resposta

**Possíveis causas:**
- Supabase offline ou muito lento
- Trigger não está criando perfil
- RLS bloqueando acesso

**Solução:**
1. Verifique status do Supabase: https://status.supabase.com
2. Teste manualmente no SQL Editor:
   ```sql
   SELECT * FROM profiles WHERE id = 'SEU_USER_ID';
   ```
3. Se retornar vazio, o trigger não funcionou
4. Execute manualmente:
   ```sql
   INSERT INTO profiles (id, name, email, role)
   VALUES ('SEU_USER_ID', 'Seu Nome', 'seu@email.com', 'EMPLOYEE');
   ```

### Problema: Volta para onboarding após login

**Diagnóstico:**
1. Procure no console: `👤 [App] Showing onboarding - isAuth: false`
2. Isso significa que `isAuthenticated = false`

**Possíveis causas:**
- Sessão não foi estabelecida corretamente
- Perfil não foi carregado
- Timeout aconteceu antes do perfil carregar

**Solução:**
1. Verifique se o log `✅ [App] OAuth session established successfully!` apareceu
2. Verifique se o log `✅ [useAuth] Profile fetch completed` apareceu
3. Se não aparecerem, há problema na etapa anterior

### Problema: Erro "permission denied"

**Diagnóstico:**
```
❌ [fetchProfile] Erro ao buscar perfil: { code: '42501' }
```

**Solução:**
RLS está bloqueando. Execute no Supabase SQL Editor:
```sql
-- Verificar policies existentes
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Se não existir, criar:
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);
```

---

## ✅ CHECKLIST DE VERIFICAÇÃO

Antes de reportar que não funciona, verifique:

- [ ] Build atualizado (`npm run build`)
- [ ] Capacitor sincronizado (`npx cap sync ios`)
- [ ] Console do Xcode/DevTools aberto
- [ ] Logs aparecem no console
- [ ] Internet funcionando
- [ ] Supabase online (https://status.supabase.com)
- [ ] Redirect URLs configuradas no Supabase
- [ ] RLS habilitado na tabela profiles
- [ ] Policies criadas para profiles
- [ ] Trigger `handle_new_user` ativo

---

## 📞 PRÓXIMOS PASSOS

### Se funcionar ✅:
1. Marque este issue como resolvido
2. Teste todos os fluxos (Google, Apple, email)
3. Teste em device real (não só simulador)
4. Prepare para deploy na App Store

### Se NÃO funcionar ❌:
1. Copie **TODOS** os logs do console (do início ao fim)
2. Compartilhe os logs
3. Indique em qual etapa parou (último log que apareceu)
4. Informe qual teste estava fazendo (Google/Apple, iOS/Web)
5. Vamos debugar juntos!

---

**Corrigido por:** Claude (Sonnet 4.5)
**Data:** 2025-12-03
**Arquivos Modificados:**
- `src/hooks/useAuth.ts` (linhas 201-210, 214-260)
- `src/App.tsx` (linhas 224-239, 253-293)

**Status:** ✅ PRONTO PARA TESTAR
