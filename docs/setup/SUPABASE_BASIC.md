# 🚀 CONFIGURAR SUPABASE - Passo a Passo Rápido

**Tempo total:** ~15 minutos

---

## ✅ PASSO 1: Verificar/Criar `.env.local` (2 min)

### 1.1 Verificar se existe:
```bash
cat .env.local
```

### 1.2 Se não existir ou estiver incompleto, criar:

```bash
# Criar arquivo
cat > .env.local << 'EOF'
VITE_SUPABASE_URL=https://[SEU_PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[SUA_ANON_KEY]
EOF
```

### 1.3 Onde encontrar as credenciais:

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto (ou crie um novo)
3. Vá em: **Settings** → **API**
4. Copie:
   - **Project URL** → substitua `[SEU_PROJECT_ID]` em `VITE_SUPABASE_URL`
   - **anon public** key → substitua `[SUA_ANON_KEY]` em `VITE_SUPABASE_ANON_KEY`

**Exemplo:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2ODAwMCwiZXhwIjoxOTU0NTQ0MDAwfQ.abcdefghijklmnopqrstuvwxyz1234567890
```

---

## ✅ PASSO 2: Executar Migrations SQL (10 min)

### 2.1 Abrir SQL Editor no Supabase:

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Clique em **SQL Editor** (menu lateral esquerdo)
4. Clique em **New query**

### 2.2 Copiar e Executar SQL:

1. Abra o arquivo: `supabase/COMPLETE_SETUP.sql`
2. **Selecione TODO** o conteúdo (`Cmd+A` / `Ctrl+A`)
3. **Copie** (`Cmd+C` / `Ctrl+C`)
4. **Cole** no SQL Editor do Supabase (`Cmd+V` / `Ctrl+V`)
5. Clique em **Run** (ou pressione `Cmd+Enter` / `Ctrl+Enter`)

### 2.3 Verificar Execução:

Você deve ver mensagens de sucesso no final:
```
Success. No rows returned
```

### 2.4 Verificar Tabelas Criadas:

1. No Supabase Dashboard, vá em **Table Editor**
2. Você deve ver estas tabelas:
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

**Se alguma tabela não aparecer:** Execute o SQL novamente ou verifique erros no console.

---

## ✅ PASSO 3: Criar Storage Bucket (2 min)

### 3.1 Criar Bucket:

1. Supabase Dashboard → **Storage** (menu lateral)
2. Clique em **New bucket**
3. Configure:
   - **Name:** `company-assets`
   - **Public bucket:** ❌ **Desmarcado** (deixe privado)
   - **File size limit:** `5242880` (5MB) - opcional
   - **Allowed MIME types:** `image/png,image/jpeg,image/jpg,image/webp` - opcional
4. Clique em **Create bucket**

### 3.2 Configurar Policies (Importante):

1. Clique no bucket `company-assets` que você acabou de criar
2. Vá na aba **Policies**
3. Clique em **New Policy**
4. Selecione **For full customization**, cole este SQL:

```sql
-- Policy: Allow authenticated users to upload logos
CREATE POLICY "Users can upload company logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'company-assets');

-- Policy: Allow authenticated users to read logos
CREATE POLICY "Users can read company logos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'company-assets');

-- Policy: Allow users to update their own company logos
CREATE POLICY "Users can update company logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'company-assets');

-- Policy: Allow users to delete their own company logos
CREATE POLICY "Users can delete company logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'company-assets');
```

5. Clique em **Review** e depois **Save policy**

---

## ✅ PASSO 4: Configurar Redirect URLs (2 min)

### 4.1 Adicionar URLs:

1. Supabase Dashboard → **Authentication** → **URL Configuration**
2. Em **Redirect URLs**, adicione uma por uma:
   ```
   chefiapp://auth/callback
   ```
   Clique em **Add**
   
   ```
   com.chefiapp.app://auth/callback
   ```
   Clique em **Add**
   
   ```
   http://localhost:3000/auth/callback
   ```
   Clique em **Add**

3. Clique em **Save**

### 4.2 Verificar Site URL:

Na mesma página, verifique se **Site URL** está configurado:
- Se estiver vazio, adicione: `http://localhost:3000` (para desenvolvimento)

---

## ✅ PASSO 5: Testar Configuração (5 min)

### 5.1 Build e Sync:

```bash
cd /Users/goldmonkey/Downloads/chefiapp---hospitality-intelligence
npm run build
npx cap sync ios
```

### 5.2 Abrir no Xcode:

```bash
npx cap open ios
```

### 5.3 Testar no Simulador:

1. No Xcode, selecione um simulador iOS
2. Clique em **Run** (▶️)
3. O app deve:
   - ✅ Abrir sem erros
   - ✅ Mostrar onboarding
   - ✅ Permitir login/signup
   - ✅ Permitir criar empresa (se autenticado)

---

## 🐛 TROUBLESHOOTING

### Erro: "Missing Supabase environment variables"
**Solução:** 
- Verifique se `.env.local` existe
- Verifique se tem `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- Reinicie o servidor de desenvolvimento se estiver rodando

### Erro: "relation 'companies' does not exist"
**Solução:**
- Execute `supabase/COMPLETE_SETUP.sql` no Supabase SQL Editor
- Verifique se não houve erros na execução
- Verifique se as tabelas foram criadas (Table Editor)

### Erro: "bucket 'company-assets' not found"
**Solução:**
- Crie o bucket no Storage do Supabase
- Verifique se o nome está exatamente: `company-assets`

### Erro: OAuth não funciona
**Solução:**
- Verifique se Redirect URLs foram adicionadas
- Verifique se OAuth providers estão configurados (se aplicável)
- Verifique logs do console para erros específicos

### App não conecta ao Supabase
**Solução:**
1. Verifique `.env.local` tem valores corretos (não placeholders)
2. Verifique se projeto Supabase está ativo
3. Verifique se URL e Key estão corretos
4. Faça rebuild: `npm run build && npx cap sync ios`

---

## ✅ CHECKLIST FINAL

Após completar todos os passos, verifique:

- [ ] `.env.local` existe e tem valores reais (não placeholders)
- [ ] Migrations SQL foram executadas sem erros
- [ ] Todas as tabelas existem no Table Editor
- [ ] Bucket `company-assets` foi criado
- [ ] Policies do bucket foram configuradas
- [ ] Redirect URLs foram adicionadas
- [ ] App builda sem erros
- [ ] App abre no simulador
- [ ] Login funciona
- [ ] Criação de empresa funciona

---

## 🎉 PRONTO!

Se todos os itens acima estão ✅, seu app está **100% configurado** e pronto para uso!

---

**Precisa de ajuda?** Execute:
```bash
./scripts/check-supabase-setup.sh
```

Este script verifica automaticamente o que está configurado e o que falta.

