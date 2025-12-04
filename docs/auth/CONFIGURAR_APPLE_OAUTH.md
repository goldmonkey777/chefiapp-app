# 🍎 Configurar Apple OAuth - ChefIApp™

**Status:** ⚠️ **AÇÃO NECESSÁRIA**  
**Requisito:** Conta Apple Developer (paga - $99/ano)

---

## 📋 Pré-requisitos

- ✅ Conta Apple Developer ativa (https://developer.apple.com)
- ✅ App ID criado no Apple Developer Portal
- ✅ Certificado de desenvolvimento (opcional, mas recomendado)

---

## ✅ Passo 1: Criar Service ID no Apple Developer Portal

### 1.1 Acessar Apple Developer Portal

1. **Acesse:** https://developer.apple.com/account/
2. **Faça login** com sua conta Apple Developer
3. Vá em **Certificates, Identifiers & Profiles**

### 1.2 Criar Service ID

1. No menu lateral, clique em **Identifiers**
2. Clique no botão **"+"** (canto superior esquerdo)
3. Selecione **Services IDs** → **Continue**
4. Preencha:
   - **Description**: `ChefIApp OAuth`
   - **Identifier**: `com.chefiapp.app.oauth` (ou similar, único)
5. Clique em **Continue** → **Register**

### 1.3 Configurar Service ID

1. Clique no Service ID que você acabou de criar
2. Marque a checkbox **"Sign in with Apple"**
3. Clique em **Configure**
4. Preencha:
   - **Primary App ID**: Selecione seu App ID (ex: `com.chefiapp.app`)
   - **Website URLs**:
     - **Domains and Subdomains**: `mcmxniuokmvzuzqfnpnn.supabase.co`
     - **Return URLs**: 
       ```
       https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
       ```
5. Clique em **Save** → **Continue** → **Save**

---

## ✅ Passo 2: Criar Key (.p8) no Apple Developer Portal

### 2.1 Criar Key

1. No Apple Developer Portal, vá em **Keys**
2. Clique no botão **"+"** (canto superior esquerdo)
3. Preencha:
   - **Key Name**: `ChefIApp OAuth Key`
   - Marque a checkbox **"Sign in with Apple"**
4. Clique em **Continue** → **Register**

### 2.2 Baixar Key

**⚠️ IMPORTANTE:** Você só pode baixar a key UMA VEZ!

1. Após criar, você verá uma tela de confirmação
2. Clique em **Download** para baixar o arquivo `.p8`
3. **COPIE** o **Key ID** que aparece (você precisará dele)
4. **COPIE** o **Team ID** que aparece (você precisará dele)

**⚠️ GUARDE O ARQUIVO .p8 EM SEGURANÇA!** Você não poderá baixá-lo novamente.

---

## ✅ Passo 3: Configurar no Supabase Dashboard

### 3.1 Acessar Configurações de Auth

1. **Acesse:** https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn
2. No menu lateral, vá em **Authentication** → **Providers**
3. Procure por **Apple** na lista de providers

### 3.2 Habilitar Apple Provider

1. Clique no toggle para **habilitar** o Apple provider
2. Preencha os campos:
   - **Service ID**: Cole o Service ID que você criou (ex: `com.chefiapp.app.oauth`)
   - **Secret Key**: Abra o arquivo `.p8` que você baixou e **cole todo o conteúdo** (incluindo `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`)
   - **Key ID**: Cole o Key ID que você copiou
   - **Team ID**: Cole o Team ID que você copiou
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

---

## ✅ Passo 5: Verificar Código do App

O código já está implementado corretamente! Verificações:

### ✅ useAuth.ts
- ✅ `signInWithApple()` implementado
- ✅ Detecta Capacitor e usa deep link correto
- ✅ Redirect URL configurado dinamicamente

### ✅ Onboarding.tsx
- ✅ Botão "Continuar com Apple" implementado
- ✅ Tratamento de erros implementado

---

## 🧪 Como Testar

### Teste 1: No Simulador iOS

1. **Abrir o app no simulador**
   ```bash
   npx expo start --ios
   ```

2. **Na tela de login:**
   - Você deve ver o botão **"Continuar com Apple"**
   - Clique nele

3. **O que deve acontecer:**
   - ✅ Abre a tela de login do Apple (nativo do iOS)
   - ✅ Você pode usar Face ID, Touch ID ou senha
   - ✅ Após fazer login, redireciona para `chefiapp://auth/callback`
   - ✅ O app volta ao foco automaticamente
   - ✅ Login é realizado automaticamente
   - ✅ Perfil é criado no Supabase

### Teste 2: No Navegador (Web)

**Nota:** Apple OAuth funciona melhor em dispositivos Apple. No navegador web, pode ter limitações.

1. **Iniciar servidor:**
   ```bash
   npm run dev
   ```

2. **Acesse:** `http://localhost:5173`

3. **Na tela de login:**
   - Clique em **"Continuar com Apple"**

---

## 🔍 Verificações no Supabase

Após fazer login com sucesso:

### 1. Tabela `auth.users`
```sql
SELECT id, email, created_at, last_sign_in_at, raw_user_meta_data
FROM auth.users
WHERE raw_user_meta_data->>'provider' = 'apple'
ORDER BY created_at DESC
LIMIT 5;
```

### 2. Tabela `public.profiles`
```sql
SELECT id, name, email, role, auth_method, created_at
FROM public.profiles
WHERE auth_method = 'apple'
ORDER BY created_at DESC
LIMIT 5;
```

---

## 🐛 Troubleshooting

### Problema: "Service ID not found"

**Solução:**
- Verifique se o Service ID está correto no Supabase
- Verifique se o Service ID foi criado no Apple Developer Portal
- Verifique se "Sign in with Apple" está habilitado no Service ID

### Problema: "Invalid Key"

**Solução:**
- Verifique se o arquivo `.p8` foi colado completamente (incluindo headers)
- Verifique se o Key ID está correto
- Verifique se o Team ID está correto
- Verifique se a key tem permissão "Sign in with Apple"

### Problema: "redirect_uri_mismatch"

**Solução:**
- Verifique se o Return URL está configurado no Service ID:
  ```
  https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
  ```
- Verifique se o domínio está correto no Service ID

### Problema: Apple OAuth não aparece no app

**Solução:**
- Verifique se está testando em um dispositivo/simulador Apple
- Verifique se o Apple Provider está habilitado no Supabase
- Verifique se as credenciais estão corretas

---

## 📋 Checklist Completo

### Apple Developer Portal
- [ ] Service ID criado
- [ ] "Sign in with Apple" habilitado no Service ID
- [ ] Return URL configurado: `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`
- [ ] Key criada com permissão "Sign in with Apple"
- [ ] Arquivo `.p8` baixado
- [ ] Key ID copiado
- [ ] Team ID copiado

### Supabase Dashboard
- [ ] Apple Provider habilitado
- [ ] Service ID preenchido
- [ ] Secret Key (.p8) preenchido (arquivo completo)
- [ ] Key ID preenchido
- [ ] Team ID preenchido
- [ ] Configurações salvas
- [ ] Redirect URLs verificadas

### Código (Já implementado ✅)
- [ ] `signInWithApple()` implementado
- [ ] Botão Apple no Onboarding
- [ ] Deep linking configurado

---

## 📚 Referências

- [Supabase Apple OAuth Docs](https://supabase.com/docs/guides/auth/social-login/auth-apple)
- [Apple Sign in with Apple Docs](https://developer.apple.com/sign-in-with-apple/)
- [Apple Developer Portal](https://developer.apple.com/account/)

---

## ⚠️ Notas Importantes

1. **Apple Developer Account é paga** ($99/ano)
2. **Arquivo .p8 só pode ser baixado UMA VEZ** - guarde em segurança
3. **Apple OAuth funciona melhor em dispositivos Apple** (iOS, macOS)
4. **Email pode ser privado** - Apple pode usar "Hide My Email" (Private Relay)

---

**Status**: ⚠️ **AÇÃO NECESSÁRIA** - Configurar Apple OAuth no Apple Developer Portal e Supabase Dashboard

