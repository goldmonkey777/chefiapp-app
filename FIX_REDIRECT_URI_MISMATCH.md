# 🔧 Corrigir Erro: redirect_uri_mismatch

**Erro:** `Error 400: redirect_uri_mismatch`  
**Causa:** Redirect URI não está autorizada no Google Cloud Console

---

## ❌ Problema

O Google está bloqueando o login porque a Redirect URI que o app está usando não está na lista de URIs autorizadas no Google Cloud Console.

---

## ✅ Solução: Adicionar Redirect URIs no Google Cloud Console

### Passo 1: Acessar Google Cloud Console

1. **Acesse:** https://console.cloud.google.com/
2. **Faça login** com sua conta Google
3. **Selecione o projeto** correto

### Passo 2: Encontrar OAuth Client ID

1. Vá em **APIs & Services** → **Credentials**
2. **Clique no seu OAuth Client ID** (o que você criou para ChefIApp)

### Passo 3: Adicionar Redirect URIs

Na tela de edição do OAuth Client ID, você verá:

**Authorized redirect URIs** (seção)

**Adicione TODAS estas URLs** (uma por linha):

```
https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
chefiapp://auth/callback
com.chefiapp.app://auth/callback
https://chefiapp.com/auth/callback
http://localhost:5173/auth/callback
```

**⚠️ IMPORTANTE:**
- ✅ Adicione **EXATAMENTE** como mostrado acima
- ✅ **Sem espaços** antes ou depois
- ✅ **Case-sensitive** (minúsculas/maiúsculas importam)
- ✅ **Inclua `https://` ou `http://`** conforme mostrado
- ✅ **Inclua o caminho completo** (`/auth/v1/callback` ou `/auth/callback`)

### Passo 4: Salvar

1. **Clique em "Save"** (canto inferior direito)
2. **Aguarde alguns segundos** para propagação

---

## 🔍 Verificar URLs Usadas no Código

O código usa estas URLs dependendo da plataforma:

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

### Supabase (sempre usado):
```
https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
```

**⚠️ TODAS essas URLs devem estar no Google Cloud Console!**

---

## 📋 Checklist de URLs

Verifique se estas URLs estão no Google Cloud Console:

- [ ] `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback` ✅ **OBRIGATÓRIA**
- [ ] `chefiapp://auth/callback` ✅ **OBRIGATÓRIA** (para iOS)
- [ ] `com.chefiapp.app://auth/callback` ✅ **Recomendada** (alternativa iOS)
- [ ] `https://chefiapp.com/auth/callback` ✅ **Para produção web**
- [ ] `http://localhost:5173/auth/callback` ✅ **Para desenvolvimento web**

---

## 🐛 Problemas Comuns

### Problema: "Ainda dá erro após adicionar"

**Soluções:**
1. **Aguarde 1-2 minutos** após salvar (propagação)
2. **Feche completamente o app** e reabra
3. **Verifique se não há espaços** nas URLs
4. **Verifique se está usando `https://` ou `http://`** corretamente
5. **Verifique se o caminho está completo** (`/auth/v1/callback` não `/auth/callback`)

### Problema: "Não sei qual URL está sendo usada"

**Solução:**
- No simulador iOS: usa `chefiapp://auth/callback`
- No navegador: usa `http://localhost:5173/auth/callback`
- O Supabase sempre usa: `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`

**Adicione TODAS para garantir!**

### Problema: "URL muito longa"

**Solução:**
- O Google Cloud Console aceita URLs longas
- Certifique-se de copiar a URL completa
- Não remova nenhuma parte da URL

---

## ✅ Verificação Final

Após adicionar todas as URLs:

1. **Salve no Google Cloud Console**
2. **Aguarde 1-2 minutos**
3. **Feche completamente o app**
4. **Abra o app novamente**
5. **Tente fazer login com Google**

O erro `redirect_uri_mismatch` deve desaparecer!

---

## 📝 Notas Importantes

1. **A URL do Supabase (`/auth/v1/callback`) é diferente da URL do app (`/auth/callback`)**
   - Supabase usa `/auth/v1/callback`
   - App usa `/auth/callback`

2. **Deep links (`chefiapp://`) são diferentes de URLs web (`https://`)**
   - Ambos precisam estar autorizados

3. **Propagação pode levar alguns minutos**
   - Se ainda não funcionar, aguarde e tente novamente

---

**Status**: ⚠️ **AÇÃO NECESSÁRIA** - Adicionar Redirect URIs no Google Cloud Console

