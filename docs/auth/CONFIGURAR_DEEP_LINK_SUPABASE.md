# 🔧 Configurar Deep Link no Supabase

**Problema:** O Supabase não está redirecionando para o deep link do app após o OAuth.

**Solução:** Configurar o deep link nas Redirect URLs do Supabase.

---

## ✅ Passo a Passo

### Passo 1: Acessar Supabase Dashboard

1. **Acesse:** https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn
2. **Faça login** se necessário

### Passo 2: Ir para URL Configuration

1. No menu lateral, clique em **Authentication**
2. Clique em **URL Configuration** (ou vá em Settings → URL Configuration)

### Passo 3: Adicionar Deep Link nas Redirect URLs

Na seção **Redirect URLs**, você deve ter estas URLs:

**✅ URLs Web:**
```
https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
https://chefiapp.com/auth/callback
http://localhost:5173/auth/callback
```

**✅ Deep Link (CRÍTICO - ADICIONE ESTA):**
```
com-chefiapp-app://auth/callback
```

**⚠️ IMPORTANTE:**
- Adicione **EXATAMENTE** como mostrado: `com-chefiapp-app://auth/callback`
- **Sem espaços** antes ou depois
- **Tudo minúsculo** (exceto `://`)
- Esta é a URL que o Supabase usará para redirecionar para o app após o OAuth

### Passo 4: Configurar Site URL

Na mesma página, verifique o **Site URL**:

- Deve ser: `https://chefiapp.com`
- Ou: `https://mcmxniuokmvzuzqfnpnn.supabase.co`

### Passo 5: Salvar

1. **Clique em "Save"** ou "Salvar"
2. **Aguarde alguns segundos** para propagação

---

## 🔍 Como Funciona

1. **Usuário clica em "Continuar com Google/Apple"**
2. **OAuth abre no Safari** com a URL do Google/Apple
3. **Usuário autentica** no Google/Apple
4. **Google/Apple redireciona** para o Supabase (`https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`)
5. **Supabase processa o callback** e cria a sessão
6. **Supabase redireciona** para `com-chefiapp-app://auth/callback` (deep link)
7. **iOS detecta o deep link** e abre o app
8. **App processa o callback** e estabelece a sessão

---

## ✅ Checklist

Antes de testar, confirme:

- [ ] Deep link `com-chefiapp-app://auth/callback` está nas Redirect URLs
- [ ] URL do Supabase `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback` está nas Redirect URLs
- [ ] Site URL está configurado (`https://chefiapp.com`)
- [ ] Mudanças foram salvas
- [ ] Aguardou alguns segundos após salvar

---

## 🐛 Se Ainda Não Funcionar

### Verificar no Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Vá em **APIs & Services** → **Credentials**
3. Clique no seu OAuth Client ID
4. Verifique se `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback` está nas **Authorized redirect URIs**

### Verificar no Apple Developer Portal

1. Acesse: https://developer.apple.com/account/
2. Vá em **Certificates, Identifiers & Profiles** → **Identifiers**
3. Clique no seu Service ID (`com.chefiapp.app.oauth`)
4. Verifique se `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback` está nas **Return URLs**

---

## 📋 Lista Completa de Redirect URLs

Após configurar tudo, você deve ter estas URLs no Supabase:

```
https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
https://chefiapp.com/auth/callback
http://localhost:5173/auth/callback
com-chefiapp-app://auth/callback
```

---

**Status**: 🔴 **AÇÃO NECESSÁRIA** - Adicionar deep link nas Redirect URLs do Supabase

