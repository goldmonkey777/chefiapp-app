# ⚡ ChefIApp - Quickstart Guide

**Objetivo:** Setup completo em 5 minutos

---

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- Git instalado

---

## 🚀 Setup em 5 Passos

### 1. Clone e Instale (1 min)

```bash
cd /Users/goldmonkey/Downloads/chefiapp---hospitality-intelligence
npm install
```

### 2. Configure Environment (2 min)

```bash
# Copiar template
cp .env.example .env

# Editar .env com suas credenciais
nano .env
```

Adicionar:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

**Onde conseguir as chaves:**
1. Acessar [Supabase Dashboard](https://app.supabase.com)
2. Selecionar projeto (ou criar novo)
3. Settings → API → Copiar URL e anon key

### 3. Setup Banco de Dados (1 min)

No Supabase Dashboard → SQL Editor, executar:

```sql
-- Copiar conteúdo de supabase/COMPLETE_SETUP.sql
-- Colar no SQL Editor
-- Clicar em RUN
```

Isso cria todas as tabelas, policies e functions.

### 4. Criar Storage Bucket (30s)

No Supabase Dashboard → Storage → New Bucket:
- Nome: `task-photos`
- Public: ✅ Yes
- Create

### 5. Rodar o App (30s)

```bash
npm run dev
```

Abrir: http://localhost:5173

---

## ✅ Checklist de Validação

Após setup, verificar:

```
□ App abre sem erros no console
□ Tela de login aparece
□ Botões OAuth (Google/Apple) aparecem
□ Console do Supabase mostra conexão ativa
```

---

## 🔧 Problemas Comuns

### "Missing Supabase environment variables"
**Solução:** Verificar se `.env` existe e tem as variáveis corretas

### "relation 'profiles' does not exist"
**Solução:** Executar o SQL do passo 3

### "bucket 'task-photos' not found"
**Solução:** Criar o bucket no passo 4

---

## 📱 Build Mobile (Opcional)

### iOS
```bash
npm run build
npx cap sync ios
npx cap open ios
```

### Android
```bash
npm run build
npx cap sync android
npx cap open android
```

---

## 🎯 Próximos Passos

1. **Testar fluxo completo:**
   - Login → Criar empresa → Dashboard

2. **Configurar OAuth (opcional):**
   - Ver `docs/setup/OAUTH_SETUP.md`

3. **Entender arquitetura:**
   - Ver `docs/ARCHITECTURE.md`

4. **Começar desenvolvimento:**
   - Ver `docs/DEVELOPMENT.md`

---

## 📚 Documentação Completa

Ver `docs/README.md` para índice completo da documentação.

---

**Tempo total:** ~5 minutos ⚡

Se tudo funcionou, você está pronto para desenvolver! 🎉
