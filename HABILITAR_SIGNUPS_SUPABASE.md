# ✅ Habilitar Signups no Supabase

**Problema:** O Supabase está bloqueando novos cadastros com o erro:
```
error=access_denied
error_code=signup_disabled
error_description=Signups+not+allowed+for+this+instance
```

**Solução:** Habilitar signups no Supabase Dashboard.

---

## 🔧 Passo a Passo

### 1. Acessar o Supabase Dashboard

1. **Acesse:** https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn
2. **Vá em:** Authentication → Settings

### 2. Habilitar Signups

Na seção **"User Signups"**, você verá um toggle:

**✅ Habilitar Signups:**
- **Toggle:** "Enable email signups" → **ATIVAR** (verde)
- **Toggle:** "Enable phone signups" → **ATIVAR** (verde) - se desejar

### 3. Configurar Provedores OAuth

Na mesma página, vá para a seção **"Auth Providers"**:

**✅ Verificar Google:**
- **Toggle:** "Enable Sign in with Google" → **ATIVAR** (verde)
- Verifique se Client ID e Client Secret estão preenchidos

**✅ Verificar Apple:**
- **Toggle:** "Enable Sign in with Apple" → **ATIVAR** (verde)
- Verifique se Service ID, Secret Key, Key ID e Team ID estão preenchidos

### 4. Salvar Configurações

Clique em **"Save"** no final da página.

---

## 🔍 Verificação Adicional

### Verificar Site URL

Na mesma página, verifique o **Site URL**:
- Deve ser: `https://chefiapp.com` ou `https://mcmxniuokmvzuzqfnpnn.supabase.co`

### Verificar Redirect URLs

Vá em **Authentication → URL Configuration** e verifique se tem:
- `com-chefiapp-app://auth/callback`
- `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`
- `https://chefiapp.com/auth/callback`
- `http://localhost:5173/auth/callback`

---

## ✅ Após Habilitar

1. **Aguarde alguns segundos** para as configurações serem aplicadas
2. **Teste novamente o login:**
   - Clique em "Continuar com Google"
   - Faça login no Google
   - Deve funcionar agora! ✅

---

## 🎯 Status Atual

**✅ Deep Link:** Funcionando perfeitamente!
- iOS está recebendo o deep link
- AppDelegate está processando corretamente
- O problema era apenas o Supabase bloqueando signups

**🔴 Signups:** Desabilitado no Supabase
- Precisa habilitar no Dashboard

---

**Status**: 🔴 **AÇÃO NECESSÁRIA** - Habilitar signups no Supabase Dashboard

