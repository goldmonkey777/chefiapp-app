# 🚀 CONFIGURAÇÃO COMPLETA DO SUPABASE - ChefIApp™

**Data:** 2025-11-29
**Tempo Estimado:** 30-45 minutos

---

## 📋 ÍNDICE

1. [Pré-requisitos](#pré-requisitos)
2. [Criar Projeto Supabase](#1-criar-projeto-supabase)
3. [Configurar Database](#2-configurar-database)
4. [Configurar Storage](#3-configurar-storage)
5. [Configurar Realtime](#4-configurar-realtime)
6. [Configurar Autenticação](#5-configurar-autenticação)
7. [Configurar OAuth - Google](#6-configurar-oauth---google)
8. [Configurar OAuth - Apple](#7-configurar-oauth---apple)
9. [Configurar Variáveis de Ambiente](#8-configurar-variáveis-de-ambiente)
10. [Testar Configuração](#9-testar-configuração)

---

## PRÉ-REQUISITOS

Antes de começar, você precisa ter:

- ✅ Conta no [Supabase](https://supabase.com)
- ✅ Conta no [Google Cloud Console](https://console.cloud.google.com)
- ✅ Conta no [Apple Developer](https://developer.apple.com) (para iOS)
- ✅ Editor de código (VS Code recomendado)
- ✅ Terminal/Command Line

---

## 1. CRIAR PROJETO SUPABASE

### 1.1. Acessar Dashboard

1. Entre em https://app.supabase.com
2. Clique em **"New Project"**
3. Selecione sua Organization (ou crie uma)

### 1.2. Configurar Projeto

**Preencha os dados:**
```
Name: ChefIApp
Database Password: [SENHA FORTE - GUARDE EM LUGAR SEGURO]
Region: South America (São Paulo) - sa-east-1
Pricing Plan: Free (ou Pro se preferir)
```

4. Clique em **"Create new project"**
5. Aguarde ~2 minutos para o projeto ser criado

### 1.3. Copiar Credenciais

Quando o projeto estiver pronto:

1. Vá em **Settings** → **API**
2. Copie as seguintes informações:

```bash
Project URL: https://xxxxxxxx.supabase.co
anon/public key: eyJhbGc...
service_role key: eyJhbGc... (⚠️ NUNCA COMPARTILHE)
```

**IMPORTANTE:** Salve essas credenciais em um local seguro!

---

## 2. CONFIGURAR DATABASE

### 2.1. Criar Tabelas

Vá em **SQL Editor** → **New Query** e cole o SQL abaixo:

```sql
-- ============================================
-- CHEFIAPP™ - DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('ADMIN', 'MANAGER', 'STAFF');
CREATE TYPE sector AS ENUM ('KITCHEN', 'BAR', 'RECEPTION', 'HOUSEKEEPING', 'MAINTENANCE', 'MANAGEMENT');
CREATE TYPE shift_status AS ENUM ('CHECKED_IN', 'CHECKED_OUT', 'OFFLINE');
CREATE TYPE task_status AS ENUM ('PENDING', 'IN_PROGRESS', 'DONE');
CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE auth_method AS ENUM ('GOOGLE', 'APPLE', 'EMAIL', 'MAGIC_LINK', 'QR_CODE');

-- ============================================
-- TABLE: companies
-- ============================================

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo TEXT,
  invite_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unique index on invite_code
CREATE UNIQUE INDEX companies_invite_code_idx ON companies(invite_code);

-- ============================================
-- TABLE: profiles
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  role user_role NOT NULL DEFAULT 'STAFF',
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  sector sector,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  shift_status shift_status DEFAULT 'OFFLINE',
  last_check_in TIMESTAMP WITH TIME ZONE,
  last_check_out TIMESTAMP WITH TIME ZONE,
  profile_photo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  auth_method auth_method DEFAULT 'EMAIL'
);

-- Indexes
CREATE INDEX profiles_company_id_idx ON profiles(company_id);
CREATE INDEX profiles_email_idx ON profiles(email);
CREATE INDEX profiles_xp_idx ON profiles(xp DESC);

-- ============================================
-- TABLE: tasks
-- ============================================

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status task_status DEFAULT 'PENDING',
  priority task_priority DEFAULT 'MEDIUM',
  xp_reward INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  photo_proof TEXT,
  duration INTEGER -- em segundos
);

-- Indexes
CREATE INDEX tasks_company_id_idx ON tasks(company_id);
CREATE INDEX tasks_assigned_to_idx ON tasks(assigned_to);
CREATE INDEX tasks_status_idx ON tasks(status);
CREATE INDEX tasks_created_at_idx ON tasks(created_at DESC);

-- ============================================
-- TABLE: notifications
-- ============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX notifications_company_id_idx ON notifications(company_id);
CREATE INDEX notifications_read_idx ON notifications(read);
CREATE INDEX notifications_created_at_idx ON notifications(created_at DESC);

-- ============================================
-- TABLE: activity_log
-- ============================================

CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX activity_log_user_id_idx ON activity_log(user_id);
CREATE INDEX activity_log_company_id_idx ON activity_log(company_id);
CREATE INDEX activity_log_created_at_idx ON activity_log(created_at DESC);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Generate unique invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate user level from XP
CREATE OR REPLACE FUNCTION calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN FLOOR(SQRT(xp / 100)) + 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger: Update companies.updated_at
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update profiles.updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-generate invite_code for companies
CREATE OR REPLACE FUNCTION auto_generate_invite_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invite_code IS NULL OR NEW.invite_code = '' THEN
    NEW.invite_code := generate_invite_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER companies_auto_invite_code
  BEFORE INSERT ON companies
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_invite_code();

-- Trigger: Auto-calculate level when XP changes
CREATE OR REPLACE FUNCTION auto_update_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level := calculate_level(NEW.xp);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_auto_update_level
  BEFORE INSERT OR UPDATE OF xp ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_update_level();

-- Trigger: Create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, auth_method)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    CASE
      WHEN NEW.app_metadata->>'provider' = 'google' THEN 'GOOGLE'
      WHEN NEW.app_metadata->>'provider' = 'apple' THEN 'APPLE'
      ELSE 'EMAIL'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

**Clique em "RUN" para executar o SQL.**

### 2.2. Verificar Tabelas

Vá em **Table Editor** e verifique se as tabelas foram criadas:

- ✅ companies
- ✅ profiles
- ✅ tasks
- ✅ notifications
- ✅ activity_log

---

## 3. CONFIGURAR STORAGE

### 3.1. Criar Bucket para Fotos de Tarefas

1. Vá em **Storage** → **Create a new bucket**
2. Preencha:
   ```
   Name: task-photos
   Public bucket: ✅ YES (checked)
   File size limit: 5 MB
   Allowed MIME types: image/jpeg, image/png, image/webp
   ```
3. Clique em **"Create bucket"**

### 3.2. Configurar RLS para Storage

Vá em **SQL Editor** → **New Query**:

```sql
-- ============================================
-- STORAGE POLICIES - task-photos
-- ============================================

-- Allow authenticated users to upload photos
CREATE POLICY "Users can upload task photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'task-photos');

-- Allow authenticated users to read photos from their company
CREATE POLICY "Users can view task photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'task-photos');

-- Allow users to update their own photos
CREATE POLICY "Users can update their task photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'task-photos');

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their task photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'task-photos');
```

**Clique em "RUN".**

### 3.3. Criar Bucket para Fotos de Perfil

1. Vá em **Storage** → **Create a new bucket**
2. Preencha:
   ```
   Name: profile-photos
   Public bucket: ✅ YES
   File size limit: 2 MB
   Allowed MIME types: image/jpeg, image/png, image/webp
   ```
3. Clique em **"Create bucket"**

### 3.4. RLS para Profile Photos

```sql
-- ============================================
-- STORAGE POLICIES - profile-photos
-- ============================================

-- Allow authenticated users to upload profile photos
CREATE POLICY "Users can upload profile photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow anyone to view profile photos
CREATE POLICY "Anyone can view profile photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- Allow users to update their own profile photo
CREATE POLICY "Users can update their profile photo"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own profile photo
CREATE POLICY "Users can delete their profile photo"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**Clique em "RUN".**

### 3.5. Criar Bucket para Logos de Empresas

1. Vá em **Storage** → **Create a new bucket**
2. Preencha:
   ```
   Name: company-logos
   Public bucket: ✅ YES
   File size limit: 1 MB
   Allowed MIME types: image/png, image/svg+xml, image/webp
   ```
3. Clique em **"Create bucket"**

### 3.6. RLS para Company Logos

```sql
-- ============================================
-- STORAGE POLICIES - company-logos
-- ============================================

-- Only ADMIN can upload company logos
CREATE POLICY "Only admins can upload company logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'company-logos' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- Anyone can view company logos
CREATE POLICY "Anyone can view company logos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'company-logos');

-- Only ADMIN can update company logos
CREATE POLICY "Only admins can update company logos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'company-logos' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- Only ADMIN can delete company logos
CREATE POLICY "Only admins can delete company logos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'company-logos' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);
```

**Clique em "RUN".**

---

## 4. CONFIGURAR REALTIME

### 4.1. Habilitar Realtime nas Tabelas

Vá em **SQL Editor** → **New Query**:

```sql
-- ============================================
-- ENABLE REALTIME
-- ============================================

-- Enable Realtime for tasks table
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;

-- Enable Realtime for profiles table
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

-- Enable Realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Enable Realtime for activity_log table
ALTER PUBLICATION supabase_realtime ADD TABLE activity_log;

-- Verify Realtime is enabled
SELECT schemaname, tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';
```

**Clique em "RUN".**

Você deve ver as 4 tabelas listadas no resultado.

### 4.2. Configurar RLS (Row Level Security)

**MUITO IMPORTANTE:** RLS protege seus dados!

```sql
-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES: companies
-- ============================================

-- Users can view their own company
CREATE POLICY "Users can view their company"
ON companies FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  )
);

-- Only ADMIN can insert companies
CREATE POLICY "Only admins can create companies"
ON companies FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- Only ADMIN can update their company
CREATE POLICY "Only admins can update companies"
ON companies FOR UPDATE
TO authenticated
USING (
  id IN (
    SELECT company_id FROM profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- ============================================
-- POLICIES: profiles
-- ============================================

-- Users can view profiles from their company
CREATE POLICY "Users can view profiles from their company"
ON profiles FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ) OR id = auth.uid()
);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (id = auth.uid());

-- ============================================
-- POLICIES: tasks
-- ============================================

-- Users can view tasks from their company
CREATE POLICY "Users can view tasks from their company"
ON tasks FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  )
);

-- MANAGER and ADMIN can create tasks
CREATE POLICY "Managers and admins can create tasks"
ON tasks FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('MANAGER', 'ADMIN')
    AND company_id = tasks.company_id
  )
);

-- Users can update tasks assigned to them
CREATE POLICY "Users can update their assigned tasks"
ON tasks FOR UPDATE
TO authenticated
USING (
  assigned_to = auth.uid() OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('MANAGER', 'ADMIN')
  )
);

-- Only MANAGER and ADMIN can delete tasks
CREATE POLICY "Only managers and admins can delete tasks"
ON tasks FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('MANAGER', 'ADMIN')
  )
);

-- ============================================
-- POLICIES: notifications
-- ============================================

-- Users can view their own notifications
CREATE POLICY "Users can view their notifications"
ON notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- System can create notifications
CREATE POLICY "System can create notifications"
ON notifications FOR INSERT
TO authenticated
WITH CHECK (true);

-- Users can update their own notifications
CREATE POLICY "Users can update their notifications"
ON notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY "Users can delete their notifications"
ON notifications FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- ============================================
-- POLICIES: activity_log
-- ============================================

-- Users can view activity from their company
CREATE POLICY "Users can view company activity"
ON activity_log FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  )
);

-- System can create activity logs
CREATE POLICY "System can create activity logs"
ON activity_log FOR INSERT
TO authenticated
WITH CHECK (true);
```

**Clique em "RUN".**

---

## 5. CONFIGURAR AUTENTICAÇÃO

### 5.1. Configurações Básicas

1. Vá em **Authentication** → **Settings**
2. Configure:

**Site URL:**
```
https://chefiapp.app
```

**Redirect URLs (adicionar TODAS):**
```
http://localhost:5173/auth/callback
https://chefiapp.app/auth/callback
com-chefiapp-app://auth/callback
com.chefiapp.app://auth/callback
```

**Email Templates:**
- Customize conforme necessário (opcional)

### 5.2. Habilitar Providers

1. Vá em **Authentication** → **Providers**
2. Habilite:
   - ✅ Email
   - ✅ Google (configurar a seguir)
   - ✅ Apple (configurar a seguir)

---

## 6. CONFIGURAR OAUTH - GOOGLE

### 6.1. Google Cloud Console

1. Acesse https://console.cloud.google.com
2. Crie um novo projeto ou selecione existente
3. Vá em **APIs & Services** → **Credentials**

### 6.2. Criar OAuth 2.0 Client ID

1. Clique em **"Create Credentials"** → **"OAuth client ID"**
2. Configure a tela de consentimento primeiro (se necessário):
   - User Type: **External**
   - App name: **ChefIApp**
   - User support email: seu email
   - Developer contact: seu email
   - Salve

3. Volte para criar Client ID:
   - Application type: **Web application**
   - Name: **ChefIApp Production**

4. **Authorized redirect URIs** - adicione:
   ```
   https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
   ```
   ⚠️ **IMPORTANTE:** Substitua `mcmxniuokmvzuzqfnpnn` pela sua URL do Supabase!

5. Clique em **"Create"**

### 6.3. Copiar Credenciais

Você receberá:
- **Client ID**: 123456789-abc.apps.googleusercontent.com
- **Client Secret**: GOCSPX-xxxxxxxx

**GUARDE ESSAS CREDENCIAIS!**

### 6.4. Configurar no Supabase

1. Vá no Supabase: **Authentication** → **Providers** → **Google**
2. **Enable:** ✅ ON
3. Cole:
   - **Client ID**: (do Google Cloud Console)
   - **Client Secret**: (do Google Cloud Console)
4. **Clique em "Save"**

---

## 7. CONFIGURAR OAUTH - APPLE

### 7.1. Apple Developer Portal

1. Acesse https://developer.apple.com
2. Vá em **Certificates, Identifiers & Profiles**

### 7.2. Criar App ID

1. Vá em **Identifiers** → **+**
2. Selecione **App IDs** → Continue
3. Configure:
   - Description: **ChefIApp**
   - Bundle ID: **com.chefiapp.app** (Explicit)
   - Capabilities: ✅ **Sign In with Apple**
4. Clique em **Continue** → **Register**

### 7.3. Criar Services ID

1. Vá em **Identifiers** → **+**
2. Selecione **Services IDs** → Continue
3. Configure:
   - Description: **ChefIApp Web Auth**
   - Identifier: **com.chefiapp.app.web**
   - ✅ **Sign In with Apple** (marcar)
4. Clique em **Configure** ao lado de Sign In with Apple:
   - Primary App ID: **com.chefiapp.app**
   - Web Domain: **chefiapp.app**
   - Return URLs:
     ```
     https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
     ```
     ⚠️ **Substitua pela sua URL do Supabase!**
5. **Save** → **Continue** → **Register**

### 7.4. Criar Private Key

1. Vá em **Keys** → **+**
2. Configure:
   - Key Name: **ChefIApp Sign In Key**
   - ✅ **Sign In with Apple**
   - Clique em **Configure**:
     - Primary App ID: **com.chefiapp.app**
3. **Continue** → **Register**
4. **Download** o arquivo .p8 (você só pode baixar UMA VEZ!)
5. Anote o **Key ID** (ex: ABC123DEF4)

### 7.5. Encontrar Team ID

1. No Apple Developer Portal
2. Canto superior direito → Seu nome
3. Copie o **Team ID** (ex: XYZ9876543)

### 7.6. Configurar no Supabase

1. Vá no Supabase: **Authentication** → **Providers** → **Apple**
2. **Enable:** ✅ ON
3. Preencha:
   - **Services ID**: com.chefiapp.app.web
   - **Team ID**: XYZ9876543 (seu Team ID)
   - **Key ID**: ABC123DEF4 (da private key)
   - **Private Key**: Cole o conteúdo completo do arquivo .p8
     ```
     -----BEGIN PRIVATE KEY-----
     MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkw...
     -----END PRIVATE KEY-----
     ```
4. **Clique em "Save"**

---

## 8. CONFIGURAR VARIÁVEIS DE AMBIENTE

### 8.1. Criar arquivo .env.local

No diretório raiz do projeto, crie `.env.local`:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://mcmxniuokmvzuzqfnpnn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Environment
VITE_APP_ENV=development
```

⚠️ **Substitua com suas credenciais reais do Supabase!**

### 8.2. Atualizar .env.production (para produção)

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://mcmxniuokmvzuzqfnpnn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Environment
VITE_APP_ENV=production
```

### 8.3. Verificar .gitignore

Certifique-se que `.env.local` está no `.gitignore`:

```
.env.local
.env.*.local
```

---

## 9. TESTAR CONFIGURAÇÃO

### 9.1. Testar Database

```sql
-- No SQL Editor do Supabase, execute:

-- Criar empresa de teste
INSERT INTO companies (name, invite_code)
VALUES ('Hotel Teste', 'TEST01')
RETURNING *;

-- Verificar se foi criada
SELECT * FROM companies;
```

### 9.2. Testar Storage

1. Vá em **Storage** → **task-photos**
2. Clique em **Upload file**
3. Faça upload de uma imagem de teste
4. Verifique se aparece na lista

### 9.3. Testar Realtime

```sql
-- Verificar se Realtime está habilitado
SELECT schemaname, tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';
```

Deve retornar:
```
tasks
profiles
notifications
activity_log
```

### 9.4. Testar Autenticação Local

1. Abra o projeto:
   ```bash
   npm run dev
   ```

2. Abra http://localhost:5173

3. Tente fazer login com Google

4. Verifique os logs no console

### 9.5. Testar OAuth Flow

**Google:**
1. Clique em "Continuar com Google"
2. Deve abrir popup do Google
3. Faça login
4. Deve redirecionar de volta
5. Verifique se criou perfil em `profiles`

**Apple:**
1. Clique em "Continuar com Apple"
2. Deve abrir popup da Apple
3. Faça login
4. Deve redirecionar de volta
5. Verifique se criou perfil em `profiles`

---

## 📊 CHECKLIST FINAL

### Database
- [ ] Projeto Supabase criado
- [ ] Tabelas criadas (companies, profiles, tasks, notifications, activity_log)
- [ ] Enums criados (user_role, sector, etc.)
- [ ] Functions criadas (generate_invite_code, calculate_level)
- [ ] Triggers criados (auto_generate_invite_code, auto_update_level)
- [ ] RLS habilitado em todas as tabelas
- [ ] Policies criadas para todas as tabelas

### Storage
- [ ] Bucket `task-photos` criado (5MB, public)
- [ ] Bucket `profile-photos` criado (2MB, public)
- [ ] Bucket `company-logos` criado (1MB, public)
- [ ] Storage policies configuradas

### Realtime
- [ ] Realtime habilitado para `tasks`
- [ ] Realtime habilitado para `profiles`
- [ ] Realtime habilitado para `notifications`
- [ ] Realtime habilitado para `activity_log`

### Authentication
- [ ] Site URL configurada
- [ ] Redirect URLs configuradas (localhost + production + deep links)
- [ ] Email provider habilitado

### OAuth - Google
- [ ] Google Cloud Console configurado
- [ ] OAuth Client ID criado
- [ ] Redirect URIs adicionadas
- [ ] Client ID e Secret copiados para Supabase
- [ ] Provider habilitado no Supabase

### OAuth - Apple
- [ ] Apple Developer configurado
- [ ] App ID criado
- [ ] Services ID criado
- [ ] Private Key (.p8) gerada
- [ ] Team ID e Key ID anotados
- [ ] Provider habilitado no Supabase

### Environment
- [ ] .env.local criado
- [ ] VITE_SUPABASE_URL configurada
- [ ] VITE_SUPABASE_ANON_KEY configurada
- [ ] .gitignore atualizado

### Testes
- [ ] Database testado (insert manual)
- [ ] Storage testado (upload manual)
- [ ] Realtime verificado (query SQL)
- [ ] OAuth Google testado
- [ ] OAuth Apple testado

---

## 🎯 PRÓXIMOS PASSOS

Após completar toda a configuração:

1. **Testar App Localmente:**
   ```bash
   npm run dev
   ```

2. **Testar OAuth:**
   - Google login
   - Apple login
   - Criar perfil
   - Criar empresa

3. **Testar Mobile:**
   ```bash
   npm run mobile:build
   npm run mobile:open:ios
   ```

4. **Popular Dados de Teste:**
   - Criar empresa
   - Criar usuários
   - Criar tarefas
   - Testar gamificação

5. **Deploy em Produção:**
   - Vercel/Netlify para web
   - App Store para iOS
   - Play Store para Android

---

## 🆘 PROBLEMAS COMUNS

### "relation does not exist"
- **Causa:** Tabelas não foram criadas
- **Solução:** Rode novamente o SQL de criação de tabelas

### "row-level security policy violation"
- **Causa:** RLS policies não configuradas
- **Solução:** Execute o SQL de policies novamente

### OAuth "redirect_uri_mismatch"
- **Causa:** URL não está na whitelist
- **Solução:** Adicione TODAS as redirect URLs (local + production + deep links)

### "Storage bucket not found"
- **Causa:** Bucket não foi criado
- **Solução:** Crie manualmente no dashboard

### Realtime não funciona
- **Causa:** Publication não habilitada
- **Solução:** Execute `ALTER PUBLICATION supabase_realtime ADD TABLE tasks;`

---

## 📚 DOCUMENTAÇÃO OFICIAL

- Supabase: https://supabase.com/docs
- Google OAuth: https://developers.google.com/identity/protocols/oauth2
- Apple Sign In: https://developer.apple.com/sign-in-with-apple/
- Capacitor: https://capacitorjs.com/docs

---

**Configurado por:** Claude (Sonnet 4.5)
**Data:** 2025-11-29
**Versão:** 1.0.0
