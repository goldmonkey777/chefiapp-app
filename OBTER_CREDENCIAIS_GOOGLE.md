# 🔑 Como Obter Client ID e Client Secret do Google OAuth

**Importante:** Essas credenciais são específicas da sua conta Google e só você pode obtê-las.

---

## 📋 Passo a Passo Completo

### Passo 1: Acessar Google Cloud Console

1. **Acesse:** https://console.cloud.google.com/
2. **Faça login** com sua conta Google
3. **Selecione o projeto** correto (ou crie um novo se necessário)

---

### Passo 2: Criar OAuth Client ID (se ainda não criou)

#### 2.1. Habilitar Google+ API

1. No menu lateral, vá em **APIs & Services** → **Library**
2. Procure por **"Google+ API"** ou **"Google Identity"**
3. Clique e depois em **"Enable"**

#### 2.2. Configurar OAuth Consent Screen

1. Vá em **APIs & Services** → **OAuth consent screen**
2. Escolha **External** (para desenvolvimento) ou **Internal** (se tiver Google Workspace)
3. Preencha:
   - **App name**: `ChefIApp`
   - **User support email**: Seu email
   - **Developer contact information**: Seu email
4. Clique em **"Save and Continue"**
5. Na tela **Scopes**, clique em **"Save and Continue"** (sem adicionar scopes extras)
6. Na tela **Test users** (se External), adicione seu email de teste
7. Clique em **"Save and Continue"** → **"Back to Dashboard"**

#### 2.3. Criar OAuth 2.0 Client ID

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
6. **Uma janela popup aparecerá** com suas credenciais!

---

### Passo 3: Copiar Client ID e Client Secret

Após criar o OAuth Client ID, uma janela popup aparecerá com:

```
Your Client ID
[um código longo começando com números e terminando com .apps.googleusercontent.com]

Your Client Secret
[um código secreto]
```

**⚠️ IMPORTANTE:**
- **Copie o Client ID** (começa com números e termina com `.apps.googleusercontent.com`)
- **Copie o Client Secret** (código secreto)
- **Se fechar a janela sem copiar**, você pode ver novamente:
  - Vá em **APIs & Services** → **Credentials**
  - Clique no nome do seu OAuth Client ID
  - O Client ID estará visível
  - O Client Secret estará oculto (clique no ícone de olho para revelar)

---

### Passo 4: Colar no Supabase Dashboard

1. **Acesse:** https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn
2. Vá em **Authentication** → **Providers**
3. Encontre **"Google"** na lista
4. **Ative o toggle** "Enable Sign in with Google"
5. **Cole o Client ID** no campo "Client IDs"
6. **Cole o Client Secret** no campo "Client Secret (for OAuth)"
7. **Clique em "Save"**

---

## 🔍 Exemplo de Como as Credenciais Se Parecem

### Client ID:
```
123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
```
- Começa com números
- Termina com `.apps.googleusercontent.com`
- Tem cerca de 60-80 caracteres

### Client Secret:
```
GOCSPX-abcdefghijklmnopqrstuvwxyz123456
```
- Começa com `GOCSPX-`
- Tem cerca de 30-40 caracteres
- É um código secreto único

---

## ⚠️ Segurança

**NUNCA:**
- ❌ Compartilhe essas credenciais publicamente
- ❌ Coloque no código fonte (git)
- ❌ Envie por email não criptografado
- ❌ Compartilhe em chats públicos

**SEMPRE:**
- ✅ Mantenha essas credenciais privadas
- ✅ Use apenas no Supabase Dashboard
- ✅ Se comprometidas, revogue e crie novas no Google Cloud Console

---

## 🐛 Problemas Comuns

### Problema: "Não vejo o Client Secret"

**Solução:**
1. Vá em **APIs & Services** → **Credentials**
2. Clique no nome do seu OAuth Client ID
3. O Client Secret estará oculto (mostrado como `••••••••`)
4. Clique no ícone de **olho** 👁️ para revelar
5. Copie o Client Secret

### Problema: "Popup fechou antes de copiar"

**Solução:**
1. Vá em **APIs & Services** → **Credentials**
2. Clique no nome do seu OAuth Client ID
3. Você verá o Client ID e poderá revelar o Client Secret

### Problema: "Não consigo criar OAuth Client ID"

**Possíveis causas:**
- OAuth consent screen não foi configurado
- Google+ API não foi habilitada
- Não tem permissões no projeto

**Solução:**
1. Configure o OAuth consent screen primeiro
2. Habilite a Google+ API
3. Verifique suas permissões no projeto

---

## ✅ Checklist Final

Antes de colar no Supabase, confirme:

- [ ] Client ID copiado corretamente (começa com números, termina com `.apps.googleusercontent.com`)
- [ ] Client Secret copiado corretamente (começa com `GOCSPX-`)
- [ ] Não há espaços extras ao copiar/colar
- [ ] Redirect URIs estão configuradas no Google Cloud Console
- [ ] OAuth consent screen está configurado

---

## 📝 Próximos Passos Após Colar

1. **Cole no Supabase Dashboard**
2. **Clique em "Save"**
3. **Aguarde 10-30 segundos** para propagação
4. **Teste o login** no app

---

**Status**: ⚠️ **AÇÃO NECESSÁRIA** - Obter credenciais do Google Cloud Console

