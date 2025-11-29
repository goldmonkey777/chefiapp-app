# 🚀 CONFIGURAÇÃO COMPLETA DO SUPABASE - Guia Detalhado

**Tempo total:** ~20 minutos  
**Status:** ✅ SQL Migrations já executadas

---

## 📋 ÍNDICE

1. [✅ SQL Migrations (JÁ FEITO)](#1-sql-migrations-já-feito)
2. [📦 Storage Bucket](#2-storage-bucket)
3. [🔗 Redirect URLs](#3-redirect-urls)
4. [🔐 OAuth Providers (Google)](#4-oauth-providers-google)
5. [🍎 OAuth Providers (Apple)](#5-oauth-providers-apple)
6. [🔒 Verificar RLS Policies](#6-verificar-rls-policies)
7. [✅ Verificação Final](#7-verificação-final)

---

## 1. ✅ SQL MIGRATIONS (JÁ FEITO)

### Status Atual
✅ **COMPLETO** - Migrations já foram executadas com sucesso!

### O que foi criado:
- ✅ Tabela `companies`
- ✅ Tabela `profiles` (atualizada)
- ✅ Tabelas: `sectors`, `positions`, `shifts`
- ✅ Tabelas: `tasks`, `check_ins`, `notifications`, `activities`
- ✅ Tabelas: `achievements`, `user_achievements`
- ✅ RLS Policies de segurança
- ✅ Triggers automáticos
- ✅ Índices de performance

### Verificar:
1. Acesse: https://supabase.com/dashboard
2. Vá em: **Table Editor**
3. Deve ver todas as tabelas listadas acima

---

## 2. 📦 STORAGE BUCKET

### Objetivo
Criar bucket para armazenar logos e assets das empresas.

### Passo a Passo Detalhado

#### 2.1 Acessar Storage
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. No menu lateral esquerdo, clique em **Storage**

#### 2.2 Criar Novo Bucket
1. Clique no botão **New bucket** (canto superior direito)
2. Uma modal será aberta

#### 2.3 Configurar Bucket
Preencha os campos:

- **Name:** `company-assets`
  - ⚠️ **IMPORTANTE:** Use exatamente este nome (sem espaços, tudo minúsculo)
  
- **Public bucket:** ❌ **DESMARCADO**
  - Deixe desmarcado para manter o bucket privado
  - Isso garante que apenas usuários autenticados possam acessar os arquivos

- **File size limit:** (opcional)
  - Deixe o padrão ou configure um limite (ex: 5MB para logos)

- **Allowed MIME types:** (opcional)
  - Deixe vazio para aceitar todos os tipos
  - Ou adicione: `image/jpeg,image/png,image/webp` para apenas imagens

#### 2.4 Criar Bucket
1. Clique no botão **Create bucket**
2. Aguarde alguns segundos
3. O bucket deve aparecer na lista

#### 2.5 Verificar Criação
1. Na lista de buckets, procure por `company-assets`
2. Deve mostrar:
   - ✅ Nome: `company-assets`
   - ✅ Tipo: Private
   - ✅ Status: Active

#### 2.6 Configurar Políticas de Acesso (Opcional)

Se quiser configurar políticas específicas:

1. Clique no bucket `company-assets`
2. Vá na aba **Policies**
3. Clique em **New Policy**
4. Configure conforme necessário

**Por enquanto, deixe como está (privado).**

---

## 3. 🔗 REDIRECT URLs

### Objetivo
Configurar URLs de redirecionamento para OAuth funcionar no app mobile.

### Passo a Passo Detalhado

#### 3.1 Acessar Configurações de Autenticação
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. No menu lateral, clique em **Authentication**
4. Clique na aba **URL Configuration**

#### 3.2 Configurar Site URL
1. Em **Site URL**, configure:
   - **Produção:** `https://chefiapp.com`
   - Ou deixe o padrão para desenvolvimento: `http://localhost:3000`

#### 3.3 Adicionar Redirect URLs
1. Role até a seção **Redirect URLs**
2. Você verá uma lista de URLs permitidas
3. Clique em **Add URL** ou no campo de texto
4. Adicione as seguintes URLs (uma por vez):

**URL 1 - Deep Link iOS/Android (Obrigatória):**
```
chefiapp://auth/callback
```

**URL 2 - URL Scheme Alternativa (Recomendada):**
```
com.chefiapp.app://auth/callback
```

**URL 3 - Web Produção (Obrigatória):**
```
https://chefiapp.com/auth/callback
```

**URL 4 - Para desenvolvimento web (Opcional):**
```
http://localhost:5173/auth/callback
```

#### 3.4 Salvar Configurações
1. Após adicionar todas as URLs, clique em **Save**
2. Aguarde a confirmação de salvamento
3. As URLs devem aparecer na lista

#### 3.5 Verificar
1. Confirme que todas as URLs estão na lista
2. Verifique se não há erros de formatação

---

## 4. 🔐 OAUTH PROVIDERS (GOOGLE)

### Objetivo
Configurar login com Google para o app.

### Pré-requisitos
- Conta Google (Gmail)
- Acesso ao Google Cloud Console

### Passo a Passo Detalhado

#### 4.1 Criar Projeto no Google Cloud Console
1. Acesse: https://console.cloud.google.com
2. Faça login com sua conta Google
3. Clique no seletor de projetos (topo da página)
4. Clique em **New Project**
5. Preencha:
   - **Project name:** `ChefIApp` (ou outro nome)
   - **Organization:** (deixe padrão)
   - **Location:** (deixe padrão)
6. Clique em **Create**
7. Aguarde alguns segundos

#### 4.2 Habilitar Google+ API
1. No Google Cloud Console, vá em **APIs & Services** → **Library**
2. Procure por **Google+ API**
3. Clique em **Enable**
4. Aguarde a ativação

#### 4.3 Criar Credenciais OAuth
1. Vá em **APIs & Services** → **Credentials**
2. Clique em **Create Credentials** → **OAuth client ID**
3. Se solicitado, configure a **OAuth consent screen**:
   - **User Type:** External (ou Internal se tiver Google Workspace)
   - Clique em **Create**
   - **App name:** `ChefIApp`
   - **User support email:** Seu email
   - **Developer contact:** Seu email
   - Clique em **Save and Continue**
   - Em **Scopes**, clique em **Save and Continue**
   - Em **Test users**, adicione seu email (se necessário)
   - Clique em **Save and Continue**
   - Clique em **Back to Dashboard**

#### 4.4 Criar OAuth Client ID
1. Volte em **Credentials**
2. Clique em **Create Credentials** → **OAuth client ID**
3. Selecione **Application type:** `Web application`
4. Preencha:
   - **Name:** `ChefIApp Web Client`
   - **Authorized JavaScript origins:**
     - Adicione: `https://[SEU_PROJECT_ID].supabase.co`
     - Exemplo: `https://mcmxniuokmvzuzqfnpnn.supabase.co`
   - **Authorized redirect URIs:**
     - Adicione: `https://[SEU_PROJECT_ID].supabase.co/auth/v1/callback`
     - Exemplo: `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`
5. Clique em **Create**
6. **IMPORTANTE:** Copie o **Client ID** e **Client Secret**
   - Você precisará deles no próximo passo

#### 4.5 Configurar no Supabase
1. Volte ao Supabase Dashboard
2. Vá em **Authentication** → **Providers**
3. Role até encontrar **Google**
4. Clique no toggle para **Enable Google provider**
5. Preencha os campos:
   - **Client ID (for OAuth):** Cole o Client ID do Google
   - **Client Secret (for OAuth):** Cole o Client Secret do Google
6. Clique em **Save**

#### 4.6 Verificar Configuração
1. Confirme que o toggle está **ativado** (verde)
2. Verifique se não há mensagens de erro
3. Teste (opcional): Tente fazer login com Google no app

---

## 5. 🍎 OAUTH PROVIDERS (APPLE)

### Objetivo
Configurar login com Apple para o app iOS.

### Pré-requisitos
- Conta Apple Developer (paga)
- App registrado no Apple Developer Portal

### Passo a Passo Detalhado

#### 5.1 Acessar Apple Developer Portal
1. Acesse: https://developer.apple.com/account
2. Faça login com sua conta Apple Developer
3. Vá em **Certificates, Identifiers & Profiles**

#### 5.2 Criar Service ID
1. No menu lateral, clique em **Identifiers**
2. Clique no botão **+** (criar novo)
3. Selecione **Services IDs**
4. Clique em **Continue**
5. Preencha:
   - **Description:** `ChefIApp Authentication`
   - **Identifier:** `com.chefiapp.app.auth` (ou similar)
6. Clique em **Continue** → **Register**

#### 5.3 Configurar Service ID
1. Clique no Service ID criado
2. Marque a opção **Sign in with Apple**
3. Clique em **Configure**
4. Configure:
   - **Primary App ID:** Selecione seu App ID
   - **Website URLs:**
     - **Domains and Subdomains:** `[SEU_PROJECT_ID].supabase.co`
     - **Return URLs:** `https://[SEU_PROJECT_ID].supabase.co/auth/v1/callback`
5. Clique em **Save** → **Continue** → **Register**

#### 5.4 Criar Key para Sign in with Apple
1. Vá em **Keys**
2. Clique no botão **+** (criar novo)
3. Preencha:
   - **Key Name:** `ChefIApp Sign in with Apple Key`
   - Marque **Sign in with Apple**
4. Clique em **Continue** → **Register**
5. **IMPORTANTE:** Baixe o arquivo `.p8` (só pode baixar uma vez!)
6. Anote o **Key ID**

#### 5.5 Obter Team ID
1. No canto superior direito, clique no seu nome
2. Anote o **Team ID** (formato: `ABC123DEF4`)

#### 5.6 Configurar no Supabase
1. Volte ao Supabase Dashboard
2. Vá em **Authentication** → **Providers**
3. Role até encontrar **Apple**
4. Clique no toggle para **Enable Apple provider**
5. Preencha os campos:
   - **Services ID:** O Identifier criado (ex: `com.chefiapp.app.auth`)
   - **Secret Key:** Abra o arquivo `.p8` baixado e cole o conteúdo
   - **Key ID:** O Key ID anotado
   - **Team ID:** O Team ID anotado
6. Clique em **Save**

#### 5.7 Verificar Configuração
1. Confirme que o toggle está **ativado** (verde)
2. Verifique se não há mensagens de erro

---

## 6. 🔒 VERIFICAR RLS POLICIES

### Objetivo
Verificar se as políticas de segurança (RLS) estão ativas.

### Passo a Passo

#### 6.1 Verificar RLS Ativo
1. No Supabase Dashboard, vá em **Table Editor**
2. Para cada tabela (`profiles`, `companies`, `tasks`, etc.):
   - Clique na tabela
   - Vá na aba **Policies**
   - Verifique se há políticas criadas
   - Confirme que RLS está **Enabled**

#### 6.2 Tabelas que Devem Ter RLS:
- ✅ `profiles`
- ✅ `companies`
- ✅ `sectors`
- ✅ `positions`
- ✅ `shifts`
- ✅ `tasks`
- ✅ `check_ins`
- ✅ `notifications`
- ✅ `activities`
- ✅ `achievements`
- ✅ `user_achievements`

---

## 7. ✅ VERIFICAÇÃO FINAL

### Checklist Completo

#### ✅ Banco de Dados
- [ ] Todas as tabelas criadas (Table Editor)
- [ ] RLS Policies ativas em todas as tabelas
- [ ] Triggers funcionando

#### ✅ Storage
- [ ] Bucket `company-assets` criado
- [ ] Bucket configurado como privado

#### ✅ Authentication
- [ ] Redirect URLs configuradas:
  - [ ] `chefiapp://auth/callback`
  - [ ] Outras URLs necessárias
- [ ] Google OAuth configurado (se necessário)
- [ ] Apple OAuth configurado (se necessário)

#### ✅ Variáveis de Ambiente
- [ ] `.env.local` configurado com:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_KEY`

#### ✅ Build do App
- [ ] App buildado (`npm run build`)
- [ ] Capacitor sincronizado (`npx cap sync ios`)

---

## 🎯 TESTAR CONFIGURAÇÃO

### Teste 1: Conexão com Supabase
1. Abra o app no simulador/dispositivo
2. Verifique se não há erros de conexão no console
3. O app deve carregar normalmente

### Teste 2: Autenticação
1. Tente fazer login com email/senha
2. Se configurou OAuth, teste login com Google/Apple
3. Verifique se o redirecionamento funciona

### Teste 3: Storage
1. Tente fazer upload de uma imagem (logo da empresa)
2. Verifique se o arquivo aparece no bucket `company-assets`

---

## 🆘 TROUBLESHOOTING

### Erro: "relation does not exist"
- **Solução:** Execute o SQL novamente no SQL Editor

### Erro: "Bucket not found"
- **Solução:** Verifique se o bucket `company-assets` foi criado

### Erro: "Redirect URL mismatch"
- **Solução:** Verifique se a URL está exatamente como configurada

### Erro: "OAuth provider not configured"
- **Solução:** Verifique se o provider está habilitado e as credenciais estão corretas

---

## 📞 SUPORTE

Se encontrar problemas:
1. Verifique os logs no Supabase Dashboard → Logs
2. Verifique o console do app (Xcode/Chrome DevTools)
3. Consulte a documentação: https://supabase.com/docs

---

## ✅ CONCLUSÃO

Após completar todos os passos acima, seu Supabase estará 100% configurado e pronto para uso!

**Última atualização:** $(date)

