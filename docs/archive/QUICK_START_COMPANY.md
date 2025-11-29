# ⚡ Quick Start: Testar Onboarding da Empresa

## 🎯 Em 3 Passos (5 minutos)

### 1. Executar Migration SQL (2 min)

1. Acesse: https://supabase.com/dashboard → Seu Projeto → **SQL Editor**
2. Abra: `supabase/migrations/005_company_onboarding_tables.sql`
3. Copie TODO o conteúdo
4. Cole no SQL Editor
5. Clique em **Run**

✅ **Verificar:** Vá em **Table Editor** → Deve aparecer `companies`, `sectors`, `positions`, `shifts`

---

### 2. Criar Storage Bucket (1 min)

1. Supabase Dashboard → **Storage**
2. **New bucket**
3. Name: `company-assets`
4. Public: ❌ Desmarcado
5. MIME types: `image/*`
6. **Create**

---

### 3. Testar no App (2 min)

```bash
npm run build
npx cap sync ios
npx cap open ios
```

**No simulador:**
1. Faça login ou crie conta
2. Na tela de signup, clique em **"Sou Dono/Gerente - Criar Empresa"**
3. Complete as 8 telas
4. ✅ Empresa criada!

---

## ✅ Pronto!

O onboarding da empresa está funcionando!

**Próximo:** Testar todas as funcionalidades do OwnerDashboard

