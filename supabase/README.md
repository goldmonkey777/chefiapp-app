# 🗄️ Scripts SQL do Supabase - ChefIApp™

Scripts SQL organizados para configuração completa do banco de dados Supabase.

---

## 📋 ORDEM DE EXECUÇÃO

Execute os scripts **NA ORDEM EXATA** abaixo:

### 1️⃣ Schema (Tabelas e Índices)
```bash
sql/01_schema.sql
```
**O que faz:**
- Cria ENUMs (user_role, sector, task_status, etc.)
- Cria tabelas (companies, profiles, tasks, notifications, activity_log)
- Cria índices para performance

**Tempo:** ~30 segundos

---

### 2️⃣ Functions & Triggers
```bash
sql/02_functions.sql
```
**O que faz:**
- Cria funções (generate_invite_code, calculate_level, update_updated_at)
- Cria triggers (auto-generate invite codes, auto-update levels, create profile on signup)

**Tempo:** ~20 segundos

---

### 3️⃣ Row Level Security (RLS)
```bash
sql/03_rls.sql
```
**O que faz:**
- Habilita RLS em todas as tabelas
- Cria policies de segurança (quem pode ver/criar/editar/deletar)
- Protege dados por empresa e usuário

**Tempo:** ~40 segundos

---

### 4️⃣ Realtime
```bash
sql/04_realtime.sql
```
**O que faz:**
- Habilita Realtime para tasks, profiles, notifications, activity_log
- Permite updates em tempo real no app

**Tempo:** ~10 segundos

---

### 5️⃣ Storage Policies
```bash
sql/05_storage.sql
```
**O que faz:**
- Cria policies para os buckets de storage
- task-photos: Fotos de tarefas completadas
- profile-photos: Fotos de perfil dos usuários
- company-logos: Logos das empresas

**Tempo:** ~20 segundos

**⚠️ IMPORTANTE:** Você deve criar os buckets MANUALMENTE no dashboard ANTES de executar este script!

---

### 6️⃣ Seed Data (OPCIONAL)
```bash
sql/06_seed_data.sql
```
**O que faz:**
- Cria dados de teste (empresas, tarefas)
- Queries úteis para desenvolvimento

**⚠️ APENAS PARA DESENVOLVIMENTO!** Não executar em produção.

**Tempo:** ~5 segundos

---

## 🚀 COMO EXECUTAR

### Via Supabase Dashboard (Recomendado)

1. Abra https://app.supabase.com
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Clique em **"New Query"**
5. Cole o conteúdo do arquivo `01_schema.sql`
6. Clique em **"RUN"** (ou pressione Ctrl/Cmd + Enter)
7. Aguarde completar
8. Repita para os próximos arquivos NA ORDEM

### Via CLI (Avançado)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref seu-project-ref

# Executar migrations
supabase db push
```

---

## ✅ CHECKLIST DE EXECUÇÃO

Marque conforme for executando:

- [ ] **01_schema.sql** - Tabelas criadas
- [ ] **02_functions.sql** - Functions e triggers criados
- [ ] **03_rls.sql** - RLS habilitado e policies criadas
- [ ] **04_realtime.sql** - Realtime habilitado
- [ ] Criar buckets de storage manualmente no dashboard:
  - [ ] `task-photos` (5MB, public, MIME: image/jpeg, image/png, image/webp)
  - [ ] `profile-photos` (2MB, public, MIME: image/jpeg, image/png, image/webp)
  - [ ] `company-logos` (1MB, public, MIME: image/png, image/svg+xml, image/webp)
- [ ] **05_storage.sql** - Storage policies criadas
- [ ] **06_seed_data.sql** (opcional) - Dados de teste criados

---

## 🔍 VERIFICAÇÃO

### Verificar Tabelas
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deve retornar:
- activity_log
- companies
- notifications
- profiles
- tasks

### Verificar RLS
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

Todas devem ter `rowsecurity = true`

### Verificar Realtime
```sql
SELECT schemaname, tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';
```

Deve retornar:
- tasks
- profiles
- notifications
- activity_log

### Verificar Storage Buckets
```sql
SELECT id, name, public
FROM storage.buckets
ORDER BY name;
```

Deve retornar:
- company-logos (public: true)
- profile-photos (public: true)
- task-photos (public: true)

---

## 🐛 PROBLEMAS COMUNS

### "ERROR: type already exists"
**Causa:** Scripts executados mais de uma vez
**Solução:** Normal, pode ignorar se foi re-executar

### "ERROR: relation already exists"
**Causa:** Tabela já existe
**Solução:** Drop a tabela primeiro ou skip o script

### "ERROR: policy already exists"
**Causa:** Policy já foi criada
**Solução:**
```sql
-- Dropar todas as policies de uma tabela
DROP POLICY IF EXISTS "policy_name" ON table_name;

-- Ou dropar todas de uma vez
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;
```

### "ERROR: permission denied"
**Causa:** Não tem permissão para criar policies
**Solução:** Execute como service_role ou postgres user

---

## 🔒 SEGURANÇA

### RLS Policies Implementadas

**Companies:**
- ✅ Users só veem sua própria empresa
- ✅ Apenas ADMIN pode criar empresas
- ✅ Apenas ADMIN pode editar empresa

**Profiles:**
- ✅ Users veem apenas perfis da sua empresa
- ✅ Users só podem editar seu próprio perfil

**Tasks:**
- ✅ Users veem apenas tarefas da sua empresa
- ✅ Apenas MANAGER/ADMIN podem criar tarefas
- ✅ Users podem editar tarefas atribuídas a eles
- ✅ Apenas MANAGER/ADMIN podem deletar tarefas

**Notifications:**
- ✅ Users veem apenas suas próprias notificações
- ✅ Users podem marcar como lido/não lido

**Activity Log:**
- ✅ Users veem apenas atividades da sua empresa

**Storage:**
- ✅ task-photos: Authenticated users podem upload
- ✅ profile-photos: Users só podem upload na sua própria pasta
- ✅ company-logos: Apenas ADMIN pode upload

---

## 📊 QUERIES ÚTEIS

### Ver Estrutura das Tabelas
```sql
-- Ver colunas de uma tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'tasks'
ORDER BY ordinal_position;
```

### Ver Policies Ativas
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Ver Triggers
```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;
```

### Ver Functions
```sql
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;
```

---

## 🔄 RESETAR DATABASE (CUIDADO!)

⚠️ **ISSO VAI DELETAR TUDO!** Use apenas em desenvolvimento.

```sql
-- Desabilitar RLS
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log DISABLE ROW LEVEL SECURITY;

-- Dropar policies
DROP POLICY IF EXISTS "Users can view their company" ON companies;
-- ... (dropar todas manualmente ou usar o script acima)

-- Dropar tabelas
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- Dropar types
DROP TYPE IF EXISTS auth_method CASCADE;
DROP TYPE IF EXISTS task_priority CASCADE;
DROP TYPE IF EXISTS task_status CASCADE;
DROP TYPE IF EXISTS shift_status CASCADE;
DROP TYPE IF EXISTS sector CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Dropar functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS auto_update_level() CASCADE;
DROP FUNCTION IF EXISTS auto_generate_invite_code() CASCADE;
DROP FUNCTION IF EXISTS calculate_level(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS generate_invite_code() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
```

Depois execute todos os scripts novamente do início.

---

## 📚 REFERÊNCIAS

- [Supabase SQL Editor](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)
- [Storage](https://supabase.com/docs/guides/storage)

---

**Criado por:** Claude (Sonnet 4.5)
**Data:** 2025-11-29
**Versão:** 1.0.0
