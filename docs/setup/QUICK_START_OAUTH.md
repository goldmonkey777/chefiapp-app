# ⚡ Quick Start: Configurar OAuth em 5 Minutos

## 🎯 Passo 1: Criar .env.local (2 min)

Na raiz do projeto, crie `.env.local`:

```bash
# Copie o exemplo
cp .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://mcmxniuokmvzuzqfnpnn.supabase.co
VITE_SUPABASE_ANON_KEY=[COLE_SUA_ANON_KEY_AQUI]
```

**Onde encontrar:**
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie **Project URL** e **anon/public key**

---

## 🎯 Passo 2: Configurar Redirect URLs (1 min)

1. No Supabase Dashboard, vá em **Authentication** → **URL Configuration**
2. Em **Redirect URLs**, adicione:

```
chefiapp://auth/callback
com.chefiapp.app://auth/callback
http://localhost:3000/auth/callback
```

3. Clique em **Save**

---

## 🎯 Passo 3: Configurar Google OAuth (2 min)

### 3.1. Google Cloud Console

1. Acesse: https://console.cloud.google.com
2. Crie projeto → **APIs & Services** → **Credentials**
3. **+ CREATE CREDENTIALS** → **OAuth client ID**
4. Tipo: **Web application**
5. **Authorized redirect URIs:**
   ```
   https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
   ```
6. Copie **Client ID** e **Client Secret**

### 3.2. Supabase Dashboard

1. **Authentication** → **Providers** → **Google**
2. Ative o toggle
3. Cole **Client ID** e **Client Secret**
4. **Save**

---

## ✅ Pronto!

Agora você pode testar:

```bash
npm run build
npx cap sync ios
npx cap open ios
```

No simulador, clique em "Continuar com Google" e teste o login!

---

## 📖 Guia Completo

Para configuração detalhada (incluindo Apple Sign-In), veja: **SETUP_OAUTH.md**

