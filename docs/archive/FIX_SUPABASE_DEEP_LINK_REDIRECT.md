# 🔧 Corrigir Redirecionamento do Supabase para Deep Link

**Problema:** Safari não consegue abrir a página porque o Supabase não está redirecionando corretamente para o deep link após processar o callback.

---

## ✅ Solução: Configurar Supabase para Redirecionar Automaticamente

O Supabase precisa ser configurado para detectar quando está em um dispositivo móvel e redirecionar automaticamente para o deep link.

### Passo 1: Verificar Redirect URLs no Supabase

1. **Acesse:** https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn
2. Vá em **Authentication** → **URL Configuration**

### Passo 2: Configurar Redirect URLs

Na seção **Redirect URLs**, você deve ter **AMBAS** as URLs:

**✅ URL do Supabase (para processar o callback):**
```
https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
```

**✅ Deep Link (para redirecionar para o app):**
```
com-chefiapp-app://auth/callback
```

### Passo 3: Configurar Site URL

O **Site URL** deve ser:
```
https://chefiapp.com
```

ou

```
https://mcmxniuokmvzuzqfnpnn.supabase.co
```

---

## 🔍 Como o Fluxo Deve Funcionar

1. **App inicia OAuth** → Redireciona para `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`
2. **Google/Apple autentica** → Redireciona para URL do Supabase
3. **Supabase processa callback** → Detecta que está em dispositivo móvel
4. **Supabase redireciona** → Para `com-chefiapp-app://auth/callback`
5. **App recebe deep link** → Processa a sessão

---

## ⚠️ Problema Atual

O Supabase pode não estar detectando automaticamente que precisa redirecionar para o deep link. Isso pode acontecer porque:

1. **O Supabase não detecta que está em um dispositivo móvel**
2. **A configuração de Redirect URLs não está correta**
3. **O Site URL não está configurado**

---

## 🐛 Solução Alternativa: Usar Query Parameter

Se o problema persistir, podemos adicionar um query parameter para forçar o redirecionamento:

```typescript
const redirectUrl = isCapacitor 
  ? 'https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback?redirect_to=com-chefiapp-app://auth/callback'
  : `${window.location.origin}/auth/callback`;
```

Mas primeiro, vamos tentar com a configuração correta no Supabase.

---

## ✅ Checklist

- [ ] Redirect URLs inclui `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`
- [ ] Redirect URLs inclui `com-chefiapp-app://auth/callback`
- [ ] Site URL está configurado (`https://chefiapp.com` ou URL do Supabase)
- [ ] Mudanças foram salvas no Supabase
- [ ] App foi rebuild após mudanças no código

---

**Status**: 🔴 **AÇÃO NECESSÁRIA** - Verificar configuração no Supabase Dashboard

