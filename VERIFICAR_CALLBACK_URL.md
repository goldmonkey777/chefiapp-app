# ✅ Verificar URL de Callback do Supabase

**URL:** `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`

---

## 📋 Onde Esta URL Deve Estar Configurada

### 1. Google Cloud Console (OBRIGATÓRIO)

**Localização:**
- Google Cloud Console → APIs & Services → Credentials
- Seu OAuth 2.0 Client ID → **Authorized redirect URIs**

**Adicionar:**
```
https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
```

**Por quê?**
- O Google precisa saber para onde redirecionar após o login
- Esta é a URL que o Supabase usa para receber o callback do Google

---

### 2. Supabase Dashboard (OPCIONAL mas recomendado)

**Localização:**
- Supabase Dashboard → Authentication → URL Configuration
- Seção **Redirect URLs**

**Adicionar (se ainda não estiver):**
```
https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
```

**Por quê?**
- Ajuda o Supabase a validar redirects
- Melhora a segurança e debugging

---

## 🔍 Como Verificar

### No Google Cloud Console:

1. Acesse: https://console.cloud.google.com
2. Vá em **APIs & Services** → **Credentials**
3. Clique no seu **OAuth 2.0 Client ID**
4. Role até **Authorized redirect URIs**
5. Verifique se esta URL está na lista:
   ```
   https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
   ```

### No Supabase Dashboard:

1. Acesse: https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn
2. Vá em **Authentication** → **URL Configuration**
3. Verifique se a URL está em **Redirect URLs**

---

## ✅ Checklist Completo

- [ ] URL está no Google Cloud Console (Authorized redirect URIs)
- [ ] URL está no Supabase Dashboard (Redirect URLs) - opcional
- [ ] URL está escrita exatamente como mostrado (sem espaços, tudo minúsculo)
- [ ] URL usa `https://` (não `http://`)
- [ ] URL termina com `/auth/v1/callback` (não `/auth/callback`)

---

## ⚠️ URLs Adicionais que Também Devem Estar

### No Google Cloud Console (Authorized redirect URIs):

```
https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
chefiapp://auth/callback
com.chefiapp.app://auth/callback
https://chefiapp.com/auth/callback
http://localhost:5173/auth/callback
```

### No Supabase Dashboard (Redirect URLs):

```
chefiapp://auth/callback
com.chefiapp.app://auth/callback
https://chefiapp.com/auth/callback
http://localhost:5173/auth/callback
```

**Nota:** A URL do Supabase (`https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`) é principalmente para o Google Cloud Console. No Supabase, você precisa das outras URLs (deep links).

---

## 🐛 Problemas Comuns

### Erro: "redirect_uri_mismatch"

**Causa:** URL não está no Google Cloud Console

**Solução:**
1. Verifique se a URL está exatamente como mostrado
2. Certifique-se de que não há espaços extras
3. Certifique-se de que usa `https://` (não `http://`)
4. Salve as mudanças no Google Cloud Console

### Erro: "Unsupported provider"

**Causa:** Google Provider não está habilitado no Supabase

**Solução:**
1. Supabase Dashboard → Authentication → Providers
2. Encontre "Google"
3. Ative o toggle
4. Preencha Client ID e Secret
5. Salve

---

## 📝 Notas Importantes

1. **A URL do Supabase (`/auth/v1/callback`) é diferente das URLs do app (`/auth/callback`)**
   - `/auth/v1/callback` → Usado pelo Google para redirecionar para o Supabase
   - `/auth/callback` → Usado pelo Supabase para redirecionar para o app

2. **Fluxo completo:**
   ```
   App → Google OAuth → Supabase (/auth/v1/callback) → App (/auth/callback)
   ```

3. **A URL do Supabase DEVE estar no Google Cloud Console**
   - Sem ela, o Google não sabe para onde redirecionar após login

---

**Status**: ✅ **URL Confirmada** - Verifique se está configurada no Google Cloud Console

