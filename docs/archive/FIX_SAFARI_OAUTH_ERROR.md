# 🔧 Corrigir Erro "Safari cannot open the page"

**Erro:** Safari não consegue abrir a página porque o endereço é inválido durante o OAuth

**Causa:** O Supabase está tentando redirecionar diretamente para o deep link `com-chefiapp-app://auth/callback`, mas o Safari precisa primeiro passar pela URL do Supabase.

---

## ✅ Solução: Configurar Redirect URL Correta no Supabase

### Passo 1: Verificar Redirect URLs no Supabase

1. **Acesse:** https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn
2. Vá em **Authentication** → **URL Configuration**
3. Verifique a seção **Redirect URLs**

### Passo 2: Configurar URLs Corretas

Você deve ter estas URLs na lista:

**✅ URLs Web (para Supabase processar o callback):**
```
https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
https://chefiapp.com/auth/callback
http://localhost:5173/auth/callback
```

**✅ Deep Link (para iOS/Android):**
```
com-chefiapp-app://auth/callback
```

**⚠️ IMPORTANTE:**
- O Supabase primeiro redireciona para sua própria URL (`https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`)
- Essa página então redireciona para o deep link do app (`com-chefiapp-app://auth/callback`)
- O Safari precisa conseguir abrir a URL do Supabase primeiro

### Passo 3: Verificar Site URL

Na mesma página, verifique o **Site URL**:
- Deve ser: `https://chefiapp.com` ou `https://mcmxniuokmvzuzqfnpnn.supabase.co`

---

## 🔍 Verificar se o Problema Persiste

Se o erro continuar, pode ser que:

1. **O Supabase não está redirecionando corretamente para o deep link**
   - A página de callback do Supabase precisa detectar que está em um dispositivo móvel
   - E então redirecionar para o deep link

2. **O URL scheme não está registrado corretamente**
   - Verifique se `com-chefiapp-app://` está no `Info.plist`
   - Verifique se está no `capacitor.config.ts`

---

## 🐛 Solução Alternativa: Usar Universal Links

Se o problema persistir, podemos configurar Universal Links (mais robusto):

1. **Configurar Associated Domains** no Xcode
2. **Criar arquivo `.well-known/apple-app-site-association`** no servidor
3. **Usar URLs `https://` em vez de deep links**

Mas primeiro, vamos tentar corrigir com a configuração atual.

---

## ✅ Checklist

- [ ] Redirect URLs configuradas no Supabase
- [ ] Site URL configurado corretamente
- [ ] Deep link `com-chefiapp-app://auth/callback` está na lista
- [ ] URL do Supabase `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback` está na lista
- [ ] Testado novamente após atualizar

---

**Status**: 🔴 **AÇÃO NECESSÁRIA** - Verificar configuração no Supabase

