# 🔧 CORRIGIR redirect_uri_mismatch - Passo a Passo

**Erro confirmado:** `Error 400: redirect_uri_mismatch`  
**URL sendo rejeitada:** `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`

---

## ✅ SOLUÇÃO: Adicionar URL no Google Cloud Console

### Passo 1: Acessar Google Cloud Console

1. **Abra:** https://console.cloud.google.com/
2. **Selecione o projeto** (ou crie um se necessário)
3. **Vá em:** `APIs & Services` → `Credentials` (no menu lateral)

### Passo 2: Encontrar o OAuth Client ID

1. Na lista de **OAuth 2.0 Client IDs**, procure pelo cliente que você criou para o ChefIApp
2. **Clique no nome** do cliente (ou no ícone de edição ✏️)

### Passo 3: Adicionar a URL Exata

1. Role até a seção **"Authorized redirect URIs"**
2. **Clique em "ADD URI"** (ou edite o campo se já houver URLs)
3. **Cole EXATAMENTE esta URL:**
   ```
   https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
   ```
4. **VERIFIQUE:**
   - ✅ Começa com `https://` (não `http://`)
   - ✅ É `mcmxniuokmvzuzqfnpnn.supabase.co` (não outro domínio)
   - ✅ Termina com `/auth/v1/callback` (não `/auth/callback`)
   - ✅ **Sem espaços** antes ou depois
   - ✅ **Tudo minúsculo** (exceto `https://`)

### Passo 4: Salvar

1. **Clique em "SAVE"** (ou "Salvar")
2. **Aguarde 1-2 minutos** para as mudanças propagarem

### Passo 5: Remover URLs Incorretas (se houver)

**REMOVA** estas URLs se estiverem na lista:
- ❌ `chefiapp://auth/callback`
- ❌ `com.chefiapp.app://auth/callback`
- ❌ Qualquer URL que não seja `https://` ou `http://`

**MANTENHA** apenas URLs web:
- ✅ `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`
- ✅ `https://chefiapp.com/auth/callback` (se tiver domínio próprio)
- ✅ `http://localhost:5173/auth/callback` (para desenvolvimento local)

---

## 📋 Checklist Antes de Testar

- [ ] Acessei o Google Cloud Console
- [ ] Encontrei o OAuth Client ID correto
- [ ] Adicionei `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`
- [ ] Verifiquei que não há espaços antes ou depois
- [ ] Verifiquei que começa com `https://` (não `http://`)
- [ ] Verifiquei que termina com `/auth/v1/callback` (não `/auth/callback`)
- [ ] Removi deep links (`chefiapp://`) se estavam lá
- [ ] Salvei as mudanças
- [ ] Aguardei 1-2 minutos

---

## 🔍 Verificar se Está Correto

### Como saber se a URL está correta:

1. **No Google Cloud Console**, a URL deve aparecer assim:
   ```
   https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
   ```

2. **NÃO deve ter:**
   - Espaços extras
   - `http://` em vez de `https://`
   - `/auth/callback` em vez de `/auth/v1/callback`
   - Deep links (`chefiapp://`)

---

## 🐛 Se Ainda Não Funcionar

### Opção 1: Verificar se há múltiplos OAuth Clients

1. No Google Cloud Console, veja se há **mais de um** OAuth Client ID
2. **Verifique TODOS** e adicione a URL em cada um que seja usado pelo ChefIApp

### Opção 2: Verificar o Client ID no Supabase

1. Acesse: https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn
2. Vá em **Authentication** → **Providers** → **Google**
3. **Verifique o Client ID** que está configurado
4. **Confirme** que é o mesmo Client ID que você está editando no Google Cloud Console

### Opção 3: Criar um Novo OAuth Client (se necessário)

Se você não conseguir encontrar o cliente correto:

1. No Google Cloud Console, **crie um novo OAuth Client ID**
2. **Tipo:** Web application
3. **Nome:** ChefIApp OAuth
4. **Authorized redirect URIs:** Adicione `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`
5. **Copie o Client ID e Client Secret**
6. **Atualize no Supabase:**
   - Authentication → Providers → Google
   - Cole o novo Client ID e Client Secret
   - Salve

---

## ✅ URL Correta (Copiar e Colar)

```
https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
```

**Esta é a URL que você DEVE adicionar no Google Cloud Console.**

---

## 📞 Próximos Passos

1. **Adicione a URL** no Google Cloud Console
2. **Salve** e aguarde 1-2 minutos
3. **Teste novamente** o login com Google no app
4. **Se funcionar:** ✅ Problema resolvido!
5. **Se ainda não funcionar:** Me avise e vamos investigar mais

---

**Status**: 🔴 **AÇÃO NECESSÁRIA** - Adicionar URL no Google Cloud Console

