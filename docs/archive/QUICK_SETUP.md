# ⚡ SETUP RÁPIDO - ChefIApp™

**Tempo:** 15 minutos | **Dificuldade:** Fácil

---

## 🎯 3 PASSOS ESSENCIAIS

### 1️⃣ Variáveis de Ambiente (2 min)

```bash
# Editar .env.local (ou criar se não existir)
nano .env.local
# ou
code .env.local
```

**Adicionar:**
```env
VITE_SUPABASE_URL=https://[SEU_PROJECT].supabase.co
VITE_SUPABASE_ANON_KEY=[SUA_ANON_KEY]
```

**Onde encontrar:** Supabase Dashboard → Settings → API

---

### 2️⃣ Executar SQL (10 min)

1. Abra: `supabase/COMPLETE_SETUP.sql`
2. Copie **TODO** o conteúdo
3. Supabase Dashboard → **SQL Editor** → Cole → **Run**
4. Verifique tabelas criadas (Table Editor)

---

### 3️⃣ Criar Bucket (2 min)

1. Supabase Dashboard → **Storage**
2. **New bucket** → Nome: `company-assets`
3. **Privado** (não público)
4. **Save**

---

### 4️⃣ Redirect URLs (1 min)

1. Supabase Dashboard → **Authentication** → **URL Configuration**
2. Adicione: `chefiapp://auth/callback`
3. **Save**

---

## ✅ TESTAR

```bash
npm run build && npx cap sync ios && npx cap open ios
```

---

## 📖 Guia Completo

Para detalhes, veja: `CONFIGURAR_SUPABASE.md`

---

## 🔍 Verificar Setup

```bash
./scripts/check-supabase-setup.sh
```

