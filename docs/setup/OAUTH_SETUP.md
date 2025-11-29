# 🔐 Guia Completo: Configurar OAuth no Supabase

Este guia vai te ajudar a configurar OAuth (Google e Apple) no Supabase para o ChefIApp funcionar completamente.

---

## 📋 PRÉ-REQUISITOS

- Conta no Supabase (https://supabase.com)
- Projeto Supabase criado
- Acesso ao Dashboard do Supabase

---

## 🚀 PASSO 1: Obter Credenciais do Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto (ou crie um novo)
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon/public key** (chave longa começando com `eyJ...`)

---

## 🚀 PASSO 2: Criar Arquivo .env.local

Na raiz do projeto, crie o arquivo `.env.local`:

```bash
# Na raiz do projeto
touch .env.local
```

Adicione o seguinte conteúdo (substitua pelos seus valores):

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://[SEU_PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[SUA_ANON_KEY_AQUI]

# Opcional: Gemini AI (se usar)
GEMINI_API_KEY=[SUA_CHAVE_GEMINI]
```

**Exemplo:**
```env
VITE_SUPABASE_URL=https://mcmxniuokmvzuzqfnpnn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🚀 PASSO 3: Configurar Redirect URLs no Supabase

1. No Dashboard do Supabase, vá em **Authentication** → **URL Configuration**
2. Na seção **Redirect URLs**, adicione as seguintes URLs (uma por linha):

```
chefiapp://auth/callback
com.chefiapp.app://auth/callback
http://localhost:3000/auth/callback
https://[SEU_DOMINIO]/auth/callback
```

3. Clique em **Save**

**Por que isso é importante?**
- O Supabase precisa saber para onde redirecionar após o login OAuth
- `chefiapp://` é o esquema customizado do app iOS
- `com.chefiapp.app://` é o esquema do Android
- `localhost:3000` é para desenvolvimento web

---

## 🚀 PASSO 4: Configurar Google OAuth

### 4.1. Criar Projeto no Google Cloud Console

1. Acesse: https://console.cloud.google.com
2. Crie um novo projeto (ou selecione existente)
3. Nome do projeto: `ChefIApp` (ou qualquer nome)

### 4.2. Configurar OAuth Consent Screen

1. No menu lateral, vá em **APIs & Services** → **OAuth consent screen**
2. Escolha **External** (para desenvolvimento) ou **Internal** (se tiver Google Workspace)
3. Preencha:
   - **App name:** ChefIApp
   - **User support email:** seu email
   - **Developer contact:** seu email
4. Clique em **Save and Continue**
5. Em **Scopes**, clique em **Save and Continue**
6. Em **Test users**, adicione seu email (se necessário)
7. Clique em **Save and Continue**

### 4.3. Criar OAuth 2.0 Client ID

1. Vá em **APIs & Services** → **Credentials**
2. Clique em **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Escolha **Web application**
4. Preencha:
   - **Name:** ChefIApp Web Client
   - **Authorized JavaScript origins:**
     - `https://[SEU_PROJECT_ID].supabase.co`
     - `http://localhost:3000` (para desenvolvimento)
   - **Authorized redirect URIs:**
     - `https://[SEU_PROJECT_ID].supabase.co/auth/v1/callback`
5. Clique em **Create**
6. **Copie o Client ID e Client Secret** (você vai precisar!)

### 4.4. Adicionar no Supabase

1. No Dashboard do Supabase, vá em **Authentication** → **Providers**
2. Encontre **Google** e clique para expandir
3. Ative o toggle **Enable Google provider**
4. Cole:
   - **Client ID (for OAuth):** o Client ID do Google
   - **Client Secret (for OAuth):** o Client Secret do Google
5. Clique em **Save**

✅ **Google OAuth configurado!**

---

## 🚀 PASSO 5: Configurar Apple Sign-In (Opcional)

### 5.1. Requisitos

- Conta Apple Developer (paga - $99/ano)
- App ID criado no Apple Developer Portal

### 5.2. Criar App ID no Apple Developer

1. Acesse: https://developer.apple.com/account
2. Vá em **Certificates, Identifiers & Profiles**
3. Clique em **Identifiers** → **+**
4. Selecione **App IDs** → **Continue**
5. Preencha:
   - **Description:** ChefIApp
   - **Bundle ID:** `com.chefiapp.app` (deve corresponder ao `appId` no `capacitor.config.ts`)
6. Marque **Sign In with Apple**
7. Clique em **Continue** → **Register**

### 5.3. Criar Service ID

1. No mesmo portal, vá em **Identifiers** → **+**
2. Selecione **Services IDs** → **Continue**
3. Preencha:
   - **Description:** ChefIApp Web Service
   - **Identifier:** `com.chefiapp.app.service` (ou similar)
4. Marque **Sign In with Apple**
5. Clique em **Configure**
6. Em **Primary App ID**, selecione o App ID criado anteriormente
7. Em **Website URLs**, adicione:
   - **Domains:** `[SEU_PROJECT_ID].supabase.co`
   - **Return URLs:** `https://[SEU_PROJECT_ID].supabase.co/auth/v1/callback`
8. Clique em **Save** → **Continue** → **Register**

### 5.4. Criar Key para Sign In with Apple

1. Vá em **Keys** → **+**
2. Preencha:
   - **Key Name:** ChefIApp Sign In Key
   - Marque **Sign In with Apple**
3. Clique em **Configure**
4. Selecione o **Primary App ID** criado
5. Clique em **Save** → **Continue** → **Register**
6. **Baixe a Key** (arquivo .p8) - você só pode baixar uma vez!
7. **Anote o Key ID**

### 5.5. Adicionar no Supabase

1. No Dashboard do Supabase, vá em **Authentication** → **Providers**
2. Encontre **Apple** e clique para expandir
3. Ative o toggle **Enable Apple provider**
4. Preencha:
   - **Services ID:** o Service ID criado (ex: `com.chefiapp.app.service`)
   - **Secret Key:** conteúdo do arquivo .p8 baixado
   - **Key ID:** o Key ID anotado
   - **Team ID:** encontre em https://developer.apple.com/account → Membership
5. Clique em **Save**

✅ **Apple Sign-In configurado!**

---

## 🚀 PASSO 6: Testar OAuth

### 6.1. Rebuild do App

```bash
npm run build
npx cap sync ios
```

### 6.2. Testar no Simulador

1. Abra o Xcode: `npx cap open ios`
2. Execute no simulador (Cmd+R)
3. No app, clique em "Continuar com Google"
4. Deve abrir o browser com login Google
5. Após login, deve redirecionar de volta para o app

### 6.3. Verificar Logs

Se algo der errado, verifique:
- Console do Xcode (erros de JavaScript)
- Network tab (chamadas para Supabase)
- Supabase Dashboard → Authentication → Logs

---

## 🐛 TROUBLESHOOTING

### Problema: "Redirect URI mismatch"

**Solução:** Verifique se adicionou todas as URLs corretas:
- No Google Cloud Console (Authorized redirect URIs)
- No Supabase Dashboard (Redirect URLs)

### Problema: "OAuth não abre browser"

**Solução:** 
- Verifique se está rodando no simulador/dispositivo (não funciona no web dev)
- Verifique se deep linking está configurado (Info.plist e AndroidManifest.xml)

### Problema: "Callback não funciona"

**Solução:**
- Verifique se o esquema `chefiapp://` está configurado no Info.plist
- Verifique se o redirect URL no Supabase está correto

### Problema: "Sessão não persiste"

**Solução:**
- Verifique se `.env.local` está na raiz do projeto
- Verifique se as variáveis estão corretas
- Faça rebuild: `npm run build && npx cap sync ios`

---

## ✅ CHECKLIST FINAL

- [ ] Arquivo `.env.local` criado com credenciais corretas
- [ ] Redirect URLs adicionadas no Supabase
- [ ] Google OAuth configurado no Google Cloud Console
- [ ] Google OAuth ativado no Supabase Dashboard
- [ ] Apple Sign-In configurado (opcional)
- [ ] App rebuildado (`npm run build && npx cap sync ios`)
- [ ] Testado login Google no simulador
- [ ] Verificado que callback funciona

---

## 📚 RECURSOS ÚTEIS

- [Documentação Supabase Auth](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Apple Sign-In Setup](https://supabase.com/docs/guides/auth/social-login/auth-apple)
- [Capacitor Deep Linking](https://capacitorjs.com/docs/guides/deep-links)

---

**Próximo passo:** Após configurar tudo, teste o login e verifique se o fluxo completo funciona!

