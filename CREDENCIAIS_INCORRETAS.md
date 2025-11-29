# ❌ Credenciais Incorretas - Como Corrigir

**Status:** ⚠️ **CREDENCIAIS INCORRETAS**

---

## ❌ O Que Está Errado

### Client IDs
**Você colocou:** `ChefIApp`  
**Está ERRADO!**

**Deveria ser:** Um código longo gerado pelo Google, como:
```
123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
```

### Client Secret
**Você colocou:** `Miranda87529192`  
**Está ERRADO!**

**Deveria ser:** Um código secreto gerado pelo Google, como:
```
GOCSPX-abcdefghijklmnopqrstuvwxyz123456
```

---

## ⚠️ IMPORTANTE: Você NÃO Cria Essas Credenciais Manualmente!

Essas credenciais são **GERADAS AUTOMATICAMENTE** pelo Google Cloud Console quando você cria um OAuth Client ID. Você não pode inventar ou criar essas credenciais manualmente.

---

## ✅ Como Obter as Credenciais Corretas

### Passo 1: Acessar Google Cloud Console

1. **Acesse:** https://console.cloud.google.com/
2. **Faça login** com sua conta Google
3. **Selecione ou crie um projeto**

### Passo 2: Criar OAuth Client ID

1. Vá em **APIs & Services** → **Credentials**
2. Clique em **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Se for a primeira vez, você precisará configurar o **OAuth consent screen** primeiro:
   - Vá em **APIs & Services** → **OAuth consent screen**
   - Escolha **External**
   - Preencha: App name: `ChefIApp`, Email: seu email
   - Clique em **Save and Continue** (vá até o final)
4. Volte para **Credentials**
5. Clique em **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
6. Selecione **Application type**: **Web application**
7. Preencha:
   - **Name**: `ChefIApp Web Client`
   - **Authorized redirect URIs**:
     ```
     https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
     chefiapp://auth/callback
     com.chefiapp.app://auth/callback
     ```
8. Clique em **"Create"**

### Passo 3: Copiar as Credenciais

**Uma janela popup aparecerá** com:

```
Your Client ID
123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com

Your Client Secret
GOCSPX-abcdefghijklmnopqrstuvwxyz123456
```

**⚠️ COPIE IMEDIATAMENTE!** Se fechar a janela, você pode ver novamente:
- Vá em **APIs & Services** → **Credentials**
- Clique no nome do seu OAuth Client ID
- O Client ID estará visível
- O Client Secret estará oculto (clique no ícone 👁️ para revelar)

---

## ✅ Como Colar Corretamente no Supabase

1. **Acesse:** https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn
2. Vá em **Authentication** → **Providers** → **Google**
3. **Remova** as credenciais incorretas:
   - Delete `ChefIApp` do campo "Client IDs"
   - Delete `Miranda87529192` do campo "Client Secret"
4. **Cole as credenciais corretas:**
   - **Client IDs**: Cole o código que termina com `.apps.googleusercontent.com`
   - **Client Secret**: Cole o código que começa com `GOCSPX-`
5. **Ative o toggle** "Enable Sign in with Google"
6. **Clique em "Save"**

---

## 🔍 Como Identificar Credenciais Válidas

### Client ID Válido:
- ✅ Começa com números (ex: `123456789012-`)
- ✅ Termina com `.apps.googleusercontent.com`
- ✅ Tem cerca de 60-80 caracteres
- ✅ Exemplo: `123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com`

### Client Secret Válido:
- ✅ Começa com `GOCSPX-`
- ✅ Tem cerca de 30-40 caracteres
- ✅ Exemplo: `GOCSPX-abcdefghijklmnopqrstuvwxyz123456`

### Credenciais Inválidas:
- ❌ Nomes simples como `ChefIApp`
- ❌ Senhas como `Miranda87529192`
- ❌ Qualquer coisa que você inventou
- ❌ Qualquer coisa que não veio do Google Cloud Console

---

## 📋 Checklist Antes de Salvar

Antes de clicar em "Save" no Supabase, verifique:

- [ ] Client ID termina com `.apps.googleusercontent.com`
- [ ] Client ID tem mais de 50 caracteres
- [ ] Client Secret começa com `GOCSPX-`
- [ ] Client Secret tem mais de 20 caracteres
- [ ] Credenciais foram copiadas do Google Cloud Console (não inventadas)
- [ ] Redirect URIs estão configuradas no Google Cloud Console

---

## 🐛 Se Você Não Consegue Criar OAuth Client ID

### Problema: "OAuth consent screen not configured"

**Solução:**
1. Vá em **APIs & Services** → **OAuth consent screen**
2. Escolha **External**
3. Preencha todos os campos obrigatórios
4. Clique em **Save and Continue** até o final
5. Volte para **Credentials** e tente criar novamente

### Problema: "Google+ API not enabled"

**Solução:**
1. Vá em **APIs & Services** → **Library**
2. Procure por **"Google+ API"** ou **"Google Identity"**
3. Clique e depois em **"Enable"**

---

## ✅ Próximos Passos

1. **Obtenha as credenciais corretas** do Google Cloud Console
2. **Remova as credenciais incorretas** do Supabase
3. **Cole as credenciais corretas** no Supabase
4. **Salve** e aguarde 10-30 segundos
5. **Teste o login** no app

---

**Status**: ⚠️ **AÇÃO NECESSÁRIA** - Obter credenciais corretas do Google Cloud Console

