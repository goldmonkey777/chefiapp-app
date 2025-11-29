# ⚡ SETUP RÁPIDO - ChefIApp™

**Comece do zero em 45 minutos!**

---

## 📋 CHECKLIST COMPLETO

### ✅ Fase 1: Criar Projeto Supabase (5 min)

1. Acesse https://app.supabase.com
2. Clique em **"New Project"**
3. Preencha:
   - Name: `ChefIApp`
   - Database Password: `[SENHA FORTE]` ← **GUARDE ISSO!**
   - Region: `South America (São Paulo)`
4. Clique em **"Create new project"**
5. Aguarde ~2 minutos

**Quando pronto:**
- Vá em Settings → API
- Copie: `Project URL` e `anon/public key`

---

### ✅ Fase 2: Configurar Database (10 min)

1. No Supabase, vá em **SQL Editor**
2. Execute os scripts NA ORDEM:

**Script 1: Schema**
```bash
# Abra: supabase/sql/01_schema.sql
# Cole no SQL Editor
# Clique em RUN
```

**Script 2: Functions**
```bash
# Abra: supabase/sql/02_functions.sql
# Cole no SQL Editor
# Clique em RUN
```

**Script 3: RLS**
```bash
# Abra: supabase/sql/03_rls.sql
# Cole no SQL Editor
# Clique em RUN
```

**Script 4: Realtime**
```bash
# Abra: supabase/sql/04_realtime.sql
# Cole no SQL Editor
# Clique em RUN
```

---

### ✅ Fase 3: Configurar Storage (5 min)

1. No Supabase, vá em **Storage**
2. Crie 3 buckets:

**Bucket 1: task-photos**
```
Name: task-photos
Public: ✅ YES
Size limit: 5 MB
MIME types: image/jpeg, image/png, image/webp
```

**Bucket 2: profile-photos**
```
Name: profile-photos
Public: ✅ YES
Size limit: 2 MB
MIME types: image/jpeg, image/png, image/webp
```

**Bucket 3: company-logos**
```
Name: company-logos
Public: ✅ YES
Size limit: 1 MB
MIME types: image/png, image/svg+xml, image/webp
```

3. Depois execute:
```bash
# Abra: supabase/sql/05_storage.sql
# Cole no SQL Editor
# Clique em RUN
```

---

### ✅ Fase 4: Configurar OAuth - Google (10 min)

**No Google Cloud Console:**

1. Acesse https://console.cloud.google.com
2. Crie/selecione projeto
3. Vá em **APIs & Services** → **Credentials**
4. Clique em **"Create Credentials"** → **"OAuth client ID"**
5. Configure:
   - Application type: `Web application`
   - Name: `ChefIApp Production`
   - Authorized redirect URIs:
     ```
     https://SEU-PROJECT-REF.supabase.co/auth/v1/callback
     ```
     ⚠️ Substitua `SEU-PROJECT-REF` pela sua URL!
6. Copie `Client ID` e `Client Secret`

**No Supabase:**

1. Vá em **Authentication** → **Providers**
2. Clique em **Google**
3. Enable: ✅ ON
4. Cole Client ID e Secret
5. Clique em **"Save"**

---

### ✅ Fase 5: Configurar OAuth - Apple (15 min)

**⚠️ Requer Apple Developer Account ($99/ano)**

**No Apple Developer Portal:**

1. Acesse https://developer.apple.com
2. Vá em **Certificates, Identifiers & Profiles**

**Criar App ID:**
3. Identifiers → **+** → App IDs
4. Configure:
   - Bundle ID: `com.chefiapp.app`
   - Capabilities: ✅ Sign In with Apple

**Criar Services ID:**
5. Identifiers → **+** → Services IDs
6. Configure:
   - Identifier: `com.chefiapp.app.web`
   - ✅ Sign In with Apple → Configure:
     - Primary App ID: `com.chefiapp.app`
     - Web Domain: `chefiapp.app`
     - Return URLs:
       ```
       https://SEU-PROJECT-REF.supabase.co/auth/v1/callback
       ```

**Criar Private Key:**
7. Keys → **+**
8. Configure:
   - Name: `ChefIApp Sign In Key`
   - ✅ Sign In with Apple
9. Download `.p8` file ← **GUARDE!**
10. Copie `Key ID` e `Team ID`

**No Supabase:**

11. Vá em **Authentication** → **Providers**
12. Clique em **Apple**
13. Enable: ✅ ON
14. Cole:
    - Services ID: `com.chefiapp.app.web`
    - Team ID: `[SEU TEAM ID]`
    - Key ID: `[SEU KEY ID]`
    - Private Key: `[CONTEÚDO DO .p8]`
15. Clique em **"Save"**

---

### ✅ Fase 6: Configurar App Local (5 min)

1. Clone o repositório (se ainda não fez)
2. Crie arquivo `.env.local`:

```bash
# .env.local
VITE_SUPABASE_URL=https://SEU-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_ENV=development
```

3. Instale dependências:
```bash
npm install
```

4. Rode o app:
```bash
npm run dev
```

5. Abra http://localhost:5173

---

## 🎯 TESTE RÁPIDO

### Testar OAuth Google

1. Abra http://localhost:5173
2. Clique em **"Continuar com Google"**
3. Faça login com sua conta Google
4. Deve redirecionar de volta
5. Verifique se aparece a tela de criar perfil

### Testar OAuth Apple

1. Clique em **"Continuar com Apple"**
2. Faça login com sua conta Apple
3. Deve redirecionar de volta
4. Verifique se criou perfil

### Verificar Database

No Supabase SQL Editor:
```sql
SELECT * FROM profiles;
```

Deve mostrar seu perfil criado!

---

## 🐛 PROBLEMAS?

### OAuth não funciona
**Verifique:**
- ✅ Redirect URLs corretas no Google/Apple
- ✅ Client ID/Secret corretos no Supabase
- ✅ Providers habilitados no Supabase

### Erro "redirect_uri_mismatch"
**Solução:**
- Adicione TODAS as redirect URLs:
  - http://localhost:5173/auth/callback
  - https://chefiapp.app/auth/callback
  - com-chefiapp-app://auth/callback

### Database error
**Solução:**
- Rode os scripts SQL novamente
- Verifique se RLS está habilitado
- Verifique policies criadas

---

## 📚 DOCUMENTAÇÃO COMPLETA

Para configuração detalhada, veja:

- **[Guia Completo](docs/SUPABASE_SETUP_COMPLETO.md)** - Setup passo a passo
- **[Scripts SQL](supabase/README.md)** - Documentação dos scripts
- **[OAuth Analysis](docs/OAUTH_ANALYSIS.md)** - Análise do sistema OAuth
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Soluções de problemas

---

## ✅ PRÓXIMOS PASSOS

Depois que tudo estiver funcionando:

1. **Popular dados de teste:**
   ```sql
   -- Execute supabase/sql/06_seed_data.sql
   ```

2. **Testar mobile:**
   ```bash
   npm run build
   npx cap sync ios
   npx cap open ios
   ```

3. **Deploy em produção:**
   - Vercel/Netlify para web
   - App Store para iOS
   - Play Store para Android

---

**🎉 Parabéns! Seu ChefIApp está rodando!**

**Tempo total:** ~45 minutos
**Documentação:** [docs/README.md](docs/README.md)
**Suporte:** [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
