# 🔄 Atualizar Redirect URLs no Supabase

**Mudança:** URL Scheme alterado de `chefiapp://` para `com-chefiapp-app://`

---

## ✅ Ação Necessária no Supabase Dashboard

### Passo 1: Acessar Supabase Dashboard

1. **Acesse:** https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn
2. Vá em **Authentication** → **URL Configuration**

### Passo 2: Atualizar Redirect URLs

Na seção **Redirect URLs**, você deve ter:

**✅ ADICIONAR:**
```
com-chefiapp-app://auth/callback
```

**❌ REMOVER (se existir):**
```
chefiapp://auth/callback
```

**✅ MANTER:**
```
https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
https://chefiapp.com/auth/callback
http://localhost:5173/auth/callback
```

### Passo 3: Salvar

1. **Clique em "Save"** ou "Salvar"
2. **Aguarde alguns segundos** para as mudanças propagarem

---

## 📋 Lista Completa de Redirect URLs

Após a atualização, você deve ter estas URLs:

```
https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
https://chefiapp.com/auth/callback
http://localhost:5173/auth/callback
com-chefiapp-app://auth/callback
```

**⚠️ IMPORTANTE:**
- A URL `com-chefiapp-app://auth/callback` é para iOS/Android
- As URLs `https://` são para web e para o Supabase processar o callback
- Remova `chefiapp://auth/callback` se ainda estiver lá

---

## ✅ Verificação

Após atualizar:

1. **Teste o OAuth no app iOS:**
   - Deve abrir o app correto após confirmar no Google/Apple
   - Não deve mais abrir outro app ChefIApp

2. **Teste o OAuth no navegador:**
   - Deve funcionar normalmente
   - Deve redirecionar para o app se estiver instalado

---

**Status**: 🔴 **AÇÃO NECESSÁRIA** - Atualizar Redirect URLs no Supabase

