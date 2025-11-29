# 🔐 Configuração OAuth - ChefIApp™

## ⚡ Início Rápido (5 minutos)

### 1. Configurar Variáveis de Ambiente

**Opção A - Manual:**
```bash
# Edite .env.local e adicione:
VITE_SUPABASE_URL=https://mcmxniuokmvzuzqfnpnn.supabase.co
VITE_SUPABASE_ANON_KEY=[SUA_CHAVE_AQUI]
```

**Opção B - Script Interativo:**
```bash
./scripts/create-env.sh
```

**Opção C - Baseado no exemplo:**
```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

### 2. Configurar Redirect URLs no Supabase

1. Acesse: https://supabase.com/dashboard → Seu Projeto → **Authentication** → **URL Configuration**
2. Adicione nas **Redirect URLs**:
   ```
   chefiapp://auth/callback
   com.chefiapp.app://auth/callback
   http://localhost:3000/auth/callback
   ```
3. Clique em **Save**

### 3. Configurar Google OAuth

**No Google Cloud Console:**
1. Crie OAuth 2.0 Client ID
2. Adicione redirect URI: `https://[SEU_PROJECT_ID].supabase.co/auth/v1/callback`
3. Copie Client ID e Client Secret

**No Supabase Dashboard:**
1. **Authentication** → **Providers** → **Google**
2. Ative e cole Client ID + Client Secret
3. **Save**

### 4. Testar

```bash
npm run build
npx cap sync ios
npx cap open ios
```

---

## 📚 Documentação Completa

- **Quick Start:** `QUICK_START_OAUTH.md` (5 minutos)
- **Guia Completo:** `SETUP_OAUTH.md` (passo a passo detalhado)
- **Status:** `IMPLEMENTATION_STATUS.md` (o que foi feito e o que falta)

---

## ✅ Verificação Rápida

Execute para verificar se tudo está configurado:

```bash
./scripts/setup-oauth.sh
```

---

## 🆘 Problemas Comuns

### "Redirect URI mismatch"
→ Verifique se adicionou todas as URLs corretas no Supabase e Google Cloud

### "OAuth não abre browser"
→ Verifique se está rodando no simulador/dispositivo (não funciona no web dev)

### "Callback não funciona"
→ Verifique se deep linking está configurado (Info.plist e AndroidManifest.xml)

---

**Precisa de ajuda?** Veja `SETUP_OAUTH.md` para guia completo com screenshots e troubleshooting.

