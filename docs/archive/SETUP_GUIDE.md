# 🚀 GUIA DE SETUP COMPLETO - ChefIApp™

**Versão:** 1.0.0  
**Última Atualização:** $(date)

---

## 📋 CHECKLIST DE SETUP

Siga estes passos na ordem para configurar o projeto completamente:

---

## ✅ PASSO 1: Variáveis de Ambiente (5 min)

### 1.1 Criar arquivo `.env.local`

Na raiz do projeto, crie o arquivo `.env.local`:

```bash
cd /Users/goldmonkey/Downloads/chefiapp---hospitality-intelligence
touch .env.local
```

### 1.2 Adicionar conteúdo

Abra `.env.local` e adicione:

```env
VITE_SUPABASE_URL=https://[SEU_PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[SUA_ANON_KEY]
```

### 1.3 Onde encontrar as variáveis:

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto (ou crie um novo)
3. Vá em: **Settings** → **API**
4. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### 1.4 Verificar

```bash
cat .env.local
# Deve mostrar as duas variáveis
```

---

## ✅ PASSO 2: Executar Migrations SQL (10 min)

### 2.1 Acessar SQL Editor

1. Supabase Dashboard → Seu Projeto
2. Clique em **SQL Editor** (menu lateral)

### 2.2 Executar Migration Completa

1. Abra o arquivo: `supabase/COMPLETE_SETUP.sql`
2. Copie **TODO** o conteúdo
3. Cole no SQL Editor do Supabase
4. Clique em **Run** (ou `Cmd+Enter`)

### 2.3 Verificar Execução

Você deve ver mensagens de sucesso:
- ✅ Tables created
- ✅ Policies created
- ✅ Triggers created

### 2.4 Verificar Tabelas Criadas

No Supabase Dashboard → **Table Editor**, você deve ver:
- ✅ `profiles`
- ✅ `companies`
- ✅ `sectors`
- ✅ `positions`
- ✅ `shifts`
- ✅ `tasks`
- ✅ `activities`
- ✅ `notifications`
- ✅ `achievements`
- ✅ `user_achievements`
- ✅ `employee_profile`

---

## ✅ PASSO 3: Criar Storage Bucket (2 min)

### 3.1 Criar Bucket

1. Supabase Dashboard → **Storage**
2. Clique em **New bucket**
3. Configure:
   - **Name:** `company-assets`
   - **Public:** ❌ **Desmarcado** (privado)
   - **File size limit:** `5242880` (5MB)
   - **Allowed MIME types:** `image/png,image/jpeg,image/jpg,image/webp`

### 3.2 Configurar Policies

1. Clique no bucket `company-assets`
2. Vá em **Policies**
3. Adicione policy:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload company logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'company-assets');

-- Allow authenticated users to read
CREATE POLICY "Users can read company logos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'company-assets');
```

---

## ✅ PASSO 4: Configurar Redirect URLs (2 min)

### 4.1 Adicionar URLs

1. Supabase Dashboard → **Authentication** → **URL Configuration**
2. Em **Redirect URLs**, adicione:
   ```
   chefiapp://auth/callback
   com.chefiapp.app://auth/callback
   http://localhost:3000/auth/callback
   ```
3. Clique em **Save**

---

## ✅ PASSO 5: Configurar OAuth (Opcional - 20 min)

### 5.1 Google OAuth

#### Criar Credenciais no Google:
1. Acesse: https://console.cloud.google.com
2. Crie um novo projeto (ou use existente)
3. Vá em **APIs & Services** → **Credentials**
4. Clique em **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure:
   - **Application type:** Web application
   - **Name:** ChefIApp
   - **Authorized redirect URIs:**
     - `https://[SEU_PROJECT_ID].supabase.co/auth/v1/callback`
     - `chefiapp://auth/callback`
6. Copie **Client ID** e **Client Secret**

#### Configurar no Supabase:
1. Supabase Dashboard → **Authentication** → **Providers**
2. Clique em **Google**
3. Ative o provider
4. Cole **Client ID** e **Client Secret**
5. Clique em **Save**

---

### 5.2 Apple OAuth (Mais Complexo)

#### Requisitos:
- Conta Apple Developer (paga)
- App ID criado
- Service ID criado

#### Passos:
1. Apple Developer Portal → **Certificates, Identifiers & Profiles**
2. Criar **App ID** (se não existir)
3. Criar **Service ID** para Sign in with Apple
4. Configurar **Return URLs**:
   - `https://[SEU_PROJECT_ID].supabase.co/auth/v1/callback`
5. Criar **Key** para Sign in with Apple
6. No Supabase Dashboard → **Authentication** → **Providers** → **Apple**
7. Adicionar credenciais

**Nota:** Apple OAuth é mais complexo e requer conta paga. Pode ser feito depois.

---

## ✅ PASSO 6: Testar Setup (10 min)

### 6.1 Build e Sync

```bash
cd /Users/goldmonkey/Downloads/chefiapp---hospitality-intelligence
npm run build
npx cap sync ios
```

### 6.2 Abrir no Xcode

```bash
npx cap open ios
```

### 6.3 Testar no Simulador

1. No Xcode, selecione um simulador iOS
2. Clique em **Run** (▶️)
3. Teste o fluxo:
   - App deve abrir
   - Onboarding deve aparecer
   - Login/Signup deve funcionar
   - Criar empresa deve funcionar (se autenticado)

---

## 🐛 TROUBLESHOOTING

### Problema: "Missing Supabase environment variables"
**Solução:** Verifique se `.env.local` existe e tem as variáveis corretas

### Problema: "relation 'companies' does not exist"
**Solução:** Execute `supabase/COMPLETE_SETUP.sql` no Supabase

### Problema: "bucket 'company-assets' not found"
**Solução:** Crie o bucket no Storage do Supabase

### Problema: OAuth não funciona
**Solução:** Verifique Redirect URLs e credenciais OAuth

### Problema: App não conecta ao Supabase
**Solução:** 
1. Verifique `.env.local`
2. Verifique se URL e Key estão corretos
3. Verifique se projeto Supabase está ativo

---

## ✅ VERIFICAÇÃO FINAL

Após completar todos os passos, verifique:

- [ ] `.env.local` existe e tem variáveis corretas
- [ ] Migrations SQL foram executadas
- [ ] Tabelas existem no Supabase
- [ ] Bucket `company-assets` foi criado
- [ ] Redirect URLs foram configuradas
- [ ] OAuth providers configurados (opcional)
- [ ] App builda sem erros
- [ ] App abre no simulador
- [ ] Login funciona
- [ ] Criação de empresa funciona

---

## 🎉 PRONTO!

Se todos os itens acima estão ✅, seu app está **100% configurado** e pronto para uso!

---

**Precisa de ajuda?** Consulte os arquivos de documentação:
- `ANALISE_PROJETO.md` - Análise completa
- `ANALISE_TELAS_COMPLETA.md` - Análise de telas
- `PROXIMOS_PASSOS.md` - Próximos passos

