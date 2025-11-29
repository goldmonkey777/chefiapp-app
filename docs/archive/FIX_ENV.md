# 🔧 CORREÇÃO URGENTE: Configurar Variáveis de Ambiente

## ❌ Problema Identificado

O erro que você está vendo:
```
Ae.from("employee_profile").select("*").eq("user_
is not a function
```

**Causa:** O arquivo `.env.local` não tem as variáveis do Supabase configuradas!

---

## ✅ SOLUÇÃO RÁPIDA (2 minutos)

### Opção 1: Editar manualmente `.env.local`

Abra o arquivo `.env.local` na raiz do projeto e adicione:

```env
# Supabase Configuration (OBRIGATÓRIO)
VITE_SUPABASE_URL=https://mcmxniuokmvzuzqfnpnn.supabase.co
VITE_SUPABASE_ANON_KEY=[SUA_ANON_KEY_AQUI]

# Gemini AI (opcional)
GEMINI_API_KEY=PLACEHOLDER_API_KEY
```

**Onde encontrar a ANON_KEY:**
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie a **anon/public key** (chave longa começando com `eyJ...`)

### Opção 2: Usar script interativo

```bash
./scripts/create-env.sh
```

---

## 🔍 Verificar se está correto

Execute:
```bash
./scripts/setup-oauth.sh
```

Deve mostrar:
```
✅ Arquivo .env.local encontrado
✅ VITE_SUPABASE_URL definido
✅ VITE_SUPABASE_ANON_KEY definido
```

---

## 🚀 Depois de configurar

```bash
npm run build
npx cap sync ios
npx cap open ios
```

O erro deve desaparecer! 🎉

---

## 📝 Exemplo completo de `.env.local`

```env
VITE_SUPABASE_URL=https://mcmxniuokmvzuzqfnpnn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbXhuaXVva212enV6cWZucG5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2OTMxOTMsImV4cCI6MjA2OTI2OTE5M30.90Wa-U678ULksVd43xu_SVDuq65Ew2FtARoA_2pAwZY
GEMINI_API_KEY=PLACEHOLDER_API_KEY
```

**⚠️ IMPORTANTE:** Substitua `[SUA_ANON_KEY_AQUI]` pela sua chave real do Supabase!

