# 🧪 Testar Google OAuth - ChefIApp™

**Status:** ✅ **Configuração Completa**  
**Data:** $(date)

---

## ✅ Checklist Pré-Teste

Antes de testar, confirme que:

- [x] Projeto criado no Google Cloud Console
- [x] Google+ API / Identity API habilitada
- [x] OAuth consent screen configurado
- [x] OAuth Client ID criado (Web application)
- [x] Redirect URIs configurados no Google Cloud
- [x] Google provider habilitado no Supabase
- [x] Client ID e Secret inseridos no Supabase
- [x] Redirect URLs verificadas no Supabase
- [x] Site URL configurado no Supabase

---

## 🧪 Teste 1: Login no Simulador iOS

### Passos:

1. **Abrir o app no simulador**
   ```bash
   npx expo start --ios
   # ou
   # Abrir Xcode → Product → Run (Cmd+R)
   ```

2. **Na tela de login:**
   - Você deve ver o botão **"Continuar com Google"**
   - Clique nele

3. **O que deve acontecer:**
   - ✅ Abre o navegador Safari com tela de login do Google
   - ✅ Você vê a tela de consentimento OAuth
   - ✅ Após fazer login, redireciona para `chefiapp://auth/callback`
   - ✅ O app volta ao foco automaticamente
   - ✅ Login é realizado automaticamente
   - ✅ Perfil é criado no Supabase (se for primeiro login)

4. **Verificar no app:**
   - ✅ Você está logado
   - ✅ Dashboard aparece (Owner/Manager/Employee)
   - ✅ Nome e foto do Google aparecem no perfil

### Problemas Comuns:

**❌ "redirect_uri_mismatch"**
- Verifique se `chefiapp://auth/callback` está nas Redirect URIs do Google Cloud
- Verifique se está nas Redirect URLs do Supabase

**❌ App não redireciona de volta**
- Verifique se o `Info.plist` tem `CFBundleURLSchemes` com `chefiapp`
- Verifique se o `capacitor.config.ts` tem `iosScheme: 'chefiapp'`

**❌ Erro "Provider not enabled"**
- Verifique se o Google provider está habilitado no Supabase Dashboard

---

## 🧪 Teste 2: Login no Navegador (Web)

### Passos:

1. **Iniciar servidor de desenvolvimento**
   ```bash
   npm run dev
   # ou
   # npx vite
   ```

2. **Abrir no navegador**
   - Acesse: `http://localhost:5173`

3. **Na tela de login:**
   - Clique em **"Continuar com Google"**

4. **O que deve acontecer:**
   - ✅ Abre popup ou redireciona para Google
   - ✅ Após login, redireciona para `http://localhost:5173/auth/callback`
   - ✅ URL contém `#access_token=...` e `#refresh_token=...`
   - ✅ App processa o callback automaticamente
   - ✅ Login é realizado
   - ✅ Dashboard aparece

### Problemas Comuns:

**❌ Popup bloqueado**
- Permita popups no navegador
- Ou teste em modo anônimo (sem bloqueadores)

**❌ Erro "redirect_uri_mismatch"**
- Verifique se `http://localhost:5173/auth/callback` está nas Redirect URIs do Google Cloud
- Verifique se está nas Redirect URLs do Supabase

---

## 🧪 Teste 3: Login no Android (se disponível)

### Passos:

1. **Build e instalar no dispositivo/emulador**
   ```bash
   npx cap sync android
   # Abrir Android Studio → Run
   ```

2. **Na tela de login:**
   - Clique em **"Continuar com Google"**

3. **O que deve acontecer:**
   - ✅ Abre Chrome com tela de login do Google
   - ✅ Após login, redireciona para `chefiapp://auth/callback` ou `com.chefiapp.app://auth/callback`
   - ✅ App volta ao foco
   - ✅ Login é realizado

### Verificações:

- ✅ `AndroidManifest.xml` tem intent-filters configurados
- ✅ Deep links funcionam (`adb shell am start -W -a android.intent.action.VIEW -d "chefiapp://auth/callback"`)

---

## 🔍 Verificações no Supabase

Após fazer login com sucesso, verifique:

### 1. Tabela `auth.users`
```sql
SELECT id, email, created_at, last_sign_in_at, raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;
```

**O que verificar:**
- ✅ Novo usuário criado
- ✅ Email do Google presente
- ✅ `raw_user_meta_data` contém dados do Google (nome, foto, etc.)

### 2. Tabela `public.profiles`
```sql
SELECT id, name, email, role, auth_method, created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 5;
```

**O que verificar:**
- ✅ Perfil criado automaticamente (via trigger `handle_new_user`)
- ✅ `auth_method` = `'google'`
- ✅ Nome e email preenchidos

### 3. Logs de Autenticação
- No Supabase Dashboard: **Authentication** → **Logs**
- Verifique se há erros ou avisos

---

## 🐛 Debugging

### Ver logs no console do navegador:

1. **Abrir DevTools** (F12 ou Cmd+Option+I)
2. **Console tab**
3. **Filtrar por:** `OAuth`, `Google`, `auth`, `Supabase`

### Ver logs no app iOS:

1. **Xcode** → **Window** → **Devices and Simulators**
2. Selecionar dispositivo/simulador
3. Clicar em **"Open Console"**
4. Filtrar por: `ChefIApp`, `OAuth`, `auth`

### Verificar deep links:

**iOS:**
```bash
xcrun simctl openurl booted "chefiapp://auth/callback?access_token=test&refresh_token=test"
```

**Android:**
```bash
adb shell am start -W -a android.intent.action.VIEW -d "chefiapp://auth/callback?access_token=test&refresh_token=test"
```

---

## ✅ Checklist de Sucesso

Após testar, confirme:

- [ ] Login funciona no simulador iOS
- [ ] Login funciona no navegador (web)
- [ ] Login funciona no Android (se disponível)
- [ ] Perfil é criado automaticamente no Supabase
- [ ] Dados do Google (nome, foto) são salvos
- [ ] Redirecionamento funciona corretamente
- [ ] Sessão persiste após fechar o app
- [ ] Logout funciona corretamente

---

## 🎯 Próximos Passos

Após confirmar que o Google OAuth funciona:

1. **Testar Apple OAuth** (se necessário)
2. **Testar Magic Link** (email)
3. **Testar fluxo completo:**
   - Login → Onboarding → Dashboard
   - Login → Criar Empresa → Dashboard Owner
   - Login → Entrar com QR Code → Dashboard Employee

---

## 📚 Referências

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Capacitor Deep Links](https://capacitorjs.com/docs/guides/deep-links)

---

**Status**: ✅ **Pronto para Testar**

