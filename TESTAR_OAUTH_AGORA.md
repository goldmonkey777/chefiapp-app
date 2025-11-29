# 🧪 Testar OAuth Agora - ChefIApp™

**Status:** ✅ **Configuração Completa**  
**Data:** Agora

---

## ✅ Checklist Pré-Teste

Antes de testar, confirme que:

- [x] Deep link `com-chefiapp-app://auth/callback` está nas Redirect URLs do Supabase
- [x] URL do Supabase `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback` está nas Redirect URLs
- [x] Site URL configurado (`https://chefiapp.com`)
- [x] Código atualizado para usar `com-chefiapp-app://auth/callback`
- [x] Info.plist tem `com-chefiapp-app` no CFBundleURLSchemes
- [x] Capacitor config tem `iosScheme: 'com-chefiapp-app'`

---

## 🧪 Teste 1: Login com Google

### Passos:

1. **Rebuild o app no Xcode:**
   ```bash
   npx cap open ios
   ```
   - Product → Clean Build Folder (Cmd+Shift+K)
   - Product → Build (Cmd+B)

2. **Abrir o app no simulador:**
   - Product → Run (Cmd+R)

3. **Na tela de login:**
   - Você deve ver o botão **"Continuar com Google"**
   - Clique nele

4. **O que deve acontecer:**
   - ✅ Abre o Safari com tela de login do Google
   - ✅ Você vê a tela de consentimento OAuth
   - ✅ Após fazer login, redireciona para `com-chefiapp-app://auth/callback`
   - ✅ O app volta ao foco automaticamente
   - ✅ Login é realizado automaticamente
   - ✅ Perfil é criado no Supabase (se for primeiro login)

5. **Verificar no app:**
   - ✅ Você está logado
   - ✅ Dashboard aparece (Owner/Manager/Employee)
   - ✅ Nome e foto do Google aparecem no perfil

---

## 🧪 Teste 2: Login com Apple

### Passos:

1. **Na tela de login:**
   - Clique em **"Continuar com Apple"**

2. **O que deve acontecer:**
   - ✅ Abre o Safari com tela de login da Apple
   - ✅ Você vê a tela de Sign in with Apple
   - ✅ Após fazer login, redireciona para `com-chefiapp-app://auth/callback`
   - ✅ O app volta ao foco automaticamente
   - ✅ Login é realizado automaticamente
   - ✅ Perfil é criado no Supabase (se for primeiro login)

3. **Verificar no app:**
   - ✅ Você está logado
   - ✅ Dashboard aparece
   - ✅ Dados do Apple aparecem no perfil

---

## 🔍 Verificar no Supabase

Após fazer login, verifique:

1. **Acesse:** https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn
2. **Vá em:** Authentication → Users
3. **Verifique:**
   - ✅ Novo usuário foi criado
   - ✅ Email está correto
   - ✅ Provider está correto (google ou apple)
   - ✅ Metadata tem nome e foto (se disponível)

---

## 🐛 Problemas Comuns

### ❌ "Safari cannot open the page"

**Solução:** 
- Verifique se `com-chefiapp-app://auth/callback` está nas Redirect URLs do Supabase
- Aguarde alguns segundos após salvar no Supabase

### ❌ App não redireciona de volta

**Solução:**
- Verifique se o `Info.plist` tem `CFBundleURLSchemes` com `com-chefiapp-app`
- Verifique se o `capacitor.config.ts` tem `iosScheme: 'com-chefiapp-app'`
- Rebuild o app após mudanças

### ❌ Erro "Provider not enabled"

**Solução:**
- Verifique se o Google/Apple provider está habilitado no Supabase Dashboard
- Verifique se as credenciais estão corretas

---

## ✅ Fluxo Esperado

```
1. Usuário clica em "Continuar com Google/Apple"
   ↓
2. OAuth abre no Safari
   ↓
3. Usuário autentica no Google/Apple
   ↓
4. Google/Apple redireciona para Supabase
   ↓
5. Supabase processa callback
   ↓
6. Supabase redireciona para com-chefiapp-app://auth/callback
   ↓
7. iOS detecta deep link e abre o app
   ↓
8. App processa callback
   ↓
9. Usuário logado! ✅
```

---

## 🎉 Sucesso!

Se tudo funcionar:
- ✅ Login com Google funciona
- ✅ Login com Apple funciona
- ✅ Usuário fica logado automaticamente
- ✅ Perfil é criado no Supabase
- ✅ App redireciona corretamente

**Parabéns! O OAuth está funcionando! 🎉**

---

**Status**: ✅ **PRONTO PARA TESTAR**

