# ⚡ AÇÃO IMEDIATA - Execute Agora!

**Tempo:** 15 minutos | **Status:** Pronto para executar

---

## 🎯 EXECUTE ESTES 3 PASSOS AGORA:

### 1️⃣ EXECUTAR SQL (10 min)

**Opção A - Usando script:**
```bash
./scripts/open-sql-for-supabase.sh
```
Isso abre o arquivo SQL automaticamente.

**Opção B - Manual:**
1. Abra: `supabase/COMPLETE_SETUP.sql`
2. Selecione tudo (`Cmd+A`)
3. Copie (`Cmd+C`)
4. Acesse: https://supabase.com/dashboard → Seu Projeto → **SQL Editor**
5. Cole (`Cmd+V`)
6. Clique em **Run**

**Verificar:** Table Editor deve mostrar tabelas criadas

---

### 2️⃣ CRIAR BUCKET (2 min)

1. Supabase Dashboard → **Storage**
2. **New bucket**
3. Nome: `company-assets`
4. **Public:** ❌ Desmarcado
5. **Create bucket**

---

### 3️⃣ CONFIGURAR REDIRECT URLs (1 min)

1. Supabase Dashboard → **Authentication** → **URL Configuration**
2. Em **Redirect URLs**, adicione:
   ```
   chefiapp://auth/callback
   ```
3. **Save**

---

## ✅ TESTAR

```bash
npm run build && npx cap sync ios && npx cap open ios
```

---

## 🔍 VERIFICAR

```bash
./scripts/check-supabase-setup.sh
```

---

**Depois disso:** App estará 100% funcional! 🎉

