# 🔍 Verificar Redirect URI Exata - Solução Definitiva

**Erro:** `Error 400: redirect_uri_mismatch`  
**Causa:** A URL exata que o código usa não está no Google Cloud Console

---

## 🔍 Passo 1: Descobrir Qual URL Está Sendo Usada

O código do app usa esta lógica:

### No Capacitor (iOS/Android):
```
chefiapp://auth/callback
```

### No Navegador Web:
```
http://localhost:5173/auth/callback
ou
https://chefiapp.com/auth/callback
```

**MAS:** O Supabase sempre usa sua própria URL primeiro:
```
https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
```

---

## ⚠️ PROBLEMA IDENTIFICADO

O erro `redirect_uri_mismatch` significa que o Google está recebendo uma URL que **NÃO está** na lista de Redirect URIs autorizadas.

**Possíveis causas:**
1. A URL do Supabase não está no Google Cloud Console
2. A URL tem um caractere diferente (espaço, maiúscula/minúscula)
3. A URL está faltando o `https://` ou tem `http://` quando deveria ser `https://`

---

## ✅ Solução: Verificar URL Exata no Google Cloud Console

### Passo 1: Acessar Google Cloud Console

1. **Acesse:** https://console.cloud.google.com/
2. Vá em **APIs & Services** → **Credentials**
3. **Clique no seu OAuth Client ID** (tipo "Web application")

### Passo 2: Verificar Authorized redirect URIs

Na seção **Authorized redirect URIs**, você deve ter **EXATAMENTE** esta URL:

```
https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
```

**⚠️ VERIFIQUE:**
- ✅ Começa com `https://` (não `http://`)
- ✅ É `mcmxniuokmvzuzqfnpnn.supabase.co` (não outro domínio)
- ✅ Termina com `/auth/v1/callback` (não `/auth/callback`)
- ✅ **Sem espaços** antes ou depois
- ✅ **Tudo minúsculo** (exceto `https://`)

### Passo 3: Se Não Estiver, Adicionar

1. **Clique em "ADD URI"** ou edite o campo
2. **Cole exatamente:**
   ```
   https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
   ```
3. **Verifique** se não há espaços
4. **Clique em "Save"**

### Passo 4: Remover URLs Incorretas

**REMOVA** estas URLs se estiverem lá (não são aceitas em "Web application"):
- ❌ `chefiapp://auth/callback`
- ❌ `com.chefiapp.app://auth/callback`

**MANTENHA** apenas URLs web (`https://` ou `http://`):
- ✅ `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`
- ✅ `https://chefiapp.com/auth/callback` (se tiver domínio)
- ✅ `http://localhost:5173/auth/callback` (para desenvolvimento)

---

## 🔍 Debug: Ver Qual URL Está Sendo Enviada

Para descobrir exatamente qual URL o Google está recebendo:

1. **Abra o console do navegador** (se testando no web)
2. **Ou veja os logs do Xcode** (se testando no simulador)
3. **Procure por:** `redirectTo` ou `redirect_uri` nos logs

A URL que aparece nos logs é a que precisa estar no Google Cloud Console.

---

## 📋 Checklist de Verificação

Antes de testar novamente, confirme:

- [ ] `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback` está no Google Cloud Console
- [ ] URL está escrita **exatamente** como mostrado (sem espaços)
- [ ] URL usa `https://` (não `http://`)
- [ ] URL termina com `/auth/v1/callback` (não `/auth/callback`)
- [ ] Nenhum deep link (`chefiapp://`) está na lista
- [ ] Mudanças foram salvas
- [ ] Aguardou 1-2 minutos após salvar

---

## 🐛 Se Ainda Não Funcionar

### Opção 1: Verificar Logs do Supabase

1. Acesse: https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn
2. Vá em **Authentication** → **Logs**
3. Procure por erros relacionados ao Google OAuth
4. Veja qual URL está sendo usada

### Opção 2: Testar no Navegador Primeiro

1. Execute: `npm run dev`
2. Acesse: `http://localhost:5173`
3. Tente fazer login com Google
4. Veja qual URL aparece no erro (se ainda houver)

### Opção 3: Verificar Configuração do Supabase

1. Supabase Dashboard → **Authentication** → **URL Configuration**
2. Verifique o **Site URL**
3. Verifique as **Redirect URLs**
4. Certifique-se de que tudo está configurado corretamente

---

## ✅ URL Correta para Google Cloud Console

**A ÚNICA URL que você precisa no Google Cloud Console:**

```
https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
```

**Esta é a URL que o Supabase usa para receber o callback do Google.**

**Os deep links (`chefiapp://`) ficam apenas no Supabase Dashboard, não no Google Cloud Console.**

---

**Status**: ⚠️ **AÇÃO NECESSÁRIA** - Verificar se a URL exata está no Google Cloud Console

