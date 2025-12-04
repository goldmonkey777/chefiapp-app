# ✅ Solução: OAuth com Query Parameter

**Problema:** Safari não consegue abrir a página porque o Supabase não está redirecionando corretamente para o deep link.

**Solução:** Usar query parameter `redirect_to` para forçar o Supabase a redirecionar para o deep link.

---

## ✅ Mudança Aplicada

### Código Atualizado

**Antes:**
```typescript
const redirectUrl = isCapacitor 
  ? 'com-chefiapp-app://auth/callback'
  : `${window.location.origin}/auth/callback`;
```

**Agora:**
```typescript
const redirectUrl = isCapacitor 
  ? 'https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback?redirect_to=com-chefiapp-app://auth/callback'
  : `${window.location.origin}/auth/callback`;
```

---

## 🔄 Como Funciona Agora

1. **Usuário clica em "Continuar com Google/Apple"**
2. **OAuth abre no Safari** → Tela de login do Google/Apple
3. **Usuário autentica** → Google/Apple processa
4. **Google/Apple redireciona** → Para `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback?redirect_to=com-chefiapp-app://auth/callback`
5. **Supabase processa callback** → Cria sessão, gera tokens
6. **Supabase lê query parameter** → `redirect_to=com-chefiapp-app://auth/callback`
7. **Supabase redireciona** → Para `com-chefiapp-app://auth/callback` ✅
8. **iOS detecta deep link** → Abre o app automaticamente ✅
9. **App processa callback** → Estabelece sessão, usuário logado ✅

---

## 🎯 Por Que Isso Funciona?

O query parameter `redirect_to` **força** o Supabase a redirecionar para o deep link especificado após processar o callback, mesmo que o Supabase não detecte automaticamente que está em um dispositivo móvel.

---

## ✅ Configuração Necessária no Supabase

No Supabase Dashboard, certifique-se de que:

1. **Redirect URLs inclui:**
   ```
   com-chefiapp-app://auth/callback
   ```

2. **Redirect URLs também inclui:**
   ```
   https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
   ```

3. **Site URL está configurado:**
   ```
   https://chefiapp.com
   ```

---

## 🧪 Teste Agora

1. **Rebuild o app no Xcode:**
   - Product → Clean Build Folder (Cmd+Shift+K)
   - Product → Build (Cmd+B)

2. **Teste o login:**
   - Abra o app no simulador
   - Clique em "Continuar com Google"
   - Faça login no Google
   - Deve redirecionar para o app automaticamente
   - Você deve ficar logado! ✅

---

## ✅ Vantagens Desta Solução

- ✅ **Força o redirecionamento** → Query parameter garante que Supabase redirecione
- ✅ **Funciona mesmo se detecção automática falhar** → Não depende de detecção de dispositivo móvel
- ✅ **Compatível com Supabase** → Usa funcionalidade nativa do Supabase
- ✅ **Mantém segurança** → Deep link ainda precisa estar nas Redirect URLs

---

**Status**: ✅ **SOLUÇÃO APLICADA** - Teste o OAuth agora!

