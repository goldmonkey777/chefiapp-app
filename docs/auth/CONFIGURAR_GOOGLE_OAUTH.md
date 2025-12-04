# 🔐 Configurar Google OAuth - ChefIApp™

**Data:** $(date)  
**Status:** ⚠️ **AÇÃO NECESSÁRIA**

---

## 📋 Resumo

O código já está implementado para usar Google OAuth. Agora precisamos configurar as credenciais no Google Cloud Console e no Supabase Dashboard.

---

## ✅ Passo 1: Criar Projeto no Google Cloud Console

### 1.1 Acessar Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Faça login com sua conta Google
3. Selecione um projeto existente ou crie um novo:
   - Clique em **"Select a project"** (canto superior direito)
   - Clique em **"New Project"**
   - Nome: `ChefIApp` ou `ChefIApp OAuth`
   - Clique em **"Create"**

### 1.2 Habilitar Google+ API

1. No menu lateral, vá em **APIs & Services** → **Library**
2. Procure por **"Google+ API"** ou **"Google Identity"**
3. Clique e depois em **"Enable"**

**Nota:** Na verdade, o Google OAuth agora usa **Google Identity Services**, mas o processo é similar.

---

## ✅ Passo 2: Criar Credenciais OAuth

### 2.1 Configurar Tela de Consentimento OAuth

1. Vá em **APIs & Services** → **OAuth consent screen**
2. Escolha **External** (para desenvolvimento) ou **Internal** (se tiver Google Workspace)
3. Preencha os campos:
   - **App name**: `ChefIApp`
   - **User support email**: Seu email
   - **Developer contact information**: Seu email
4. Clique em **"Save and Continue"**
5. Na tela **Scopes**, clique em **"Save and Continue"** (sem adicionar scopes extras)
6. Na tela **Test users** (se External), adicione seu email de teste
7. Clique em **"Save and Continue"** → **"Back to Dashboard"**

### 2.2 Criar OAuth 2.0 Client ID

1. Vá em **APIs & Services** → **Credentials**
2. Clique em **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Selecione **Application type**: **Web application**
4. Preencha:
   - **Name**: `ChefIApp Web Client`
   - **Authorized JavaScript origins**:
     ```
     https://mcmxniuokmvzuzqfnpnn.supabase.co
     https://chefiapp.com
     http://localhost:5173
     ```
   - **Authorized redirect URIs**:
     ```
     https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
     https://chefiapp.com/auth/callback
     http://localhost:5173/auth/callback
     chefiapp://auth/callback
     com.chefiapp.app://auth/callback
     ```
5. Clique em **"Create"**
6. **COPIE** o **Client ID** e **Client Secret** que aparecerão

---

## ✅ Passo 3: Configurar no Supabase Dashboard

### 3.1 Acessar Configurações de Auth

1. Acesse: https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn
2. No menu lateral, vá em **Authentication** → **Providers**
3. Procure por **Google** na lista de providers

### 3.2 Habilitar Google Provider

1. Clique no toggle para **habilitar** o Google provider
2. Preencha os campos:
   - **Client ID (for OAuth)**: Cole o Client ID do Google Cloud
   - **Client Secret (for OAuth)**: Cole o Client Secret do Google Cloud
3. Clique em **"Save"**

---

## ✅ Passo 4: Verificar Redirect URLs no Supabase

### 4.1 Verificar URLs Configuradas

1. No Supabase Dashboard, vá em **Authentication** → **URL Configuration**
2. Verifique se estas URLs estão em **Redirect URLs**:
   ```
   chefiapp://auth/callback
   com.chefiapp.app://auth/callback
   https://chefiapp.com/auth/callback
   http://localhost:5173/auth/callback
   ```
3. Se alguma estiver faltando, adicione

### 4.2 Verificar Site URL

1. Na mesma página, verifique o **Site URL**:
   - Deve estar: `https://chefiapp.com` ou `https://mcmxniuokmvzuzqfnpnn.supabase.co`

---

## ✅ Passo 5: Verificar Código do App

O código já está implementado corretamente! Verificações:

### ✅ useAuth.ts
- ✅ `signInWithGoogle()` implementado
- ✅ Detecta Capacitor e usa deep link correto
- ✅ Redirect URL configurado dinamicamente

### ✅ Onboarding.tsx
- ✅ Botão "Continuar com Google" implementado
- ✅ Tratamento de erros implementado

### ✅ capacitor.config.ts
- ✅ `iosScheme: 'chefiapp'` configurado
- ✅ Deep linking configurado

---

## 🧪 Como Testar

### Teste 1: No Simulador iOS

1. Abra o app no simulador
2. Na tela de login, clique em **"Continuar com Google"**
3. Deve abrir o navegador com tela de login do Google
4. Faça login com sua conta Google
5. Deve redirecionar de volta para o app
6. Deve fazer login automaticamente

### Teste 2: No Navegador (Web)

1. Abra o app em `http://localhost:5173`
2. Clique em **"Continuar com Google"**
3. Deve abrir popup/tela de login do Google
4. Faça login
5. Deve redirecionar e fazer login

---

## 🔍 Troubleshooting

### Problema: "redirect_uri_mismatch"

**Solução:**
- Verifique se todas as Redirect URLs estão configuradas no Google Cloud Console
- Verifique se estão configuradas no Supabase Dashboard
- URLs devem ser **exatamente** iguais (incluindo http/https, trailing slash, etc.)

### Problema: "OAuth client not found"

**Solução:**
- Verifique se o Client ID está correto no Supabase
- Verifique se o projeto do Google Cloud está correto
- Verifique se a Google+ API está habilitada

### Problema: App não redireciona de volta

**Solução:**
- Verifique se o deep link está configurado no `Info.plist` (iOS)
- Verifique se o `AndroidManifest.xml` tem os intent-filters (Android)
- Verifique se o `capacitor.config.ts` tem `iosScheme: 'chefiapp'`

### Problema: Erro "Provider not enabled"

**Solução:**
- Verifique se o Google provider está **habilitado** no Supabase Dashboard
- Verifique se as credenciais estão preenchidas corretamente

---

## 📝 Checklist Completo

### Google Cloud Console
- [ ] Projeto criado
- [ ] Google+ API habilitada
- [ ] OAuth consent screen configurado
- [ ] OAuth Client ID criado (Web application)
- [ ] Authorized JavaScript origins configurados
- [ ] Authorized redirect URIs configurados
- [ ] Client ID e Client Secret copiados

### Supabase Dashboard
- [ ] Google provider habilitado
- [ ] Client ID preenchido
- [ ] Client Secret preenchido
- [ ] Redirect URLs verificadas
- [ ] Site URL configurado

### Código (Já implementado ✅)
- [ ] `signInWithGoogle()` implementado
- [ ] Botão Google no Onboarding
- [ ] Deep linking configurado
- [ ] Tratamento de erros

---

## 🎯 Próximos Passos Após Configurar

1. **Testar login com Google** no simulador
2. **Verificar se perfil é criado** automaticamente
3. **Testar em diferentes plataformas** (iOS, Web)
4. **Configurar Apple OAuth** (se necessário)

---

## 📚 Referências

- [Supabase Google OAuth Docs](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google Cloud OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Capacitor OAuth Plugin](https://capacitorjs.com/docs/guides/deep-links)

---

**Status**: ⚠️ **AÇÃO NECESSÁRIA** - Configurar credenciais no Google Cloud e Supabase

**Prioridade**: 🔴 **ALTA** - Funcionalidade crítica de autenticação

