# 🚀 PRÓXIMOS PASSOS DETALHADOS - ChefIApp™

**Status Atual:** ✅ Setup básico completo  
**Próximo Nível:** Configurações avançadas e produção

---

## 📋 ÍNDICE

1. [🔐 OAuth Providers (Google e Apple)](#1-oauth-providers-google-e-apple)
2. [🔒 Revisar e Ativar RLS Policies](#2-revisar-e-ativar-rls-policies)
3. [📧 Email Templates e Notificações](#3-email-templates-e-notificações)
4. [🔍 Verificar Variáveis de Ambiente](#4-verificar-variáveis-de-ambiente)
5. [⚙️ Configurações Adicionais](#5-configurações-adicionais)
6. [🧪 Testes Completos](#6-testes-completos)

---

## 1. 🔐 OAUTH PROVIDERS (GOOGLE E APPLE)

### Prioridade: 🔴 ALTA (para melhor UX)

### 1.1 Google OAuth

#### Pré-requisitos
- Conta Google (Gmail)
- Acesso ao Google Cloud Console

#### Passo a Passo Detalhado

**Passo 1: Criar Projeto no Google Cloud Console**
1. Acesse: https://console.cloud.google.com
2. Faça login com sua conta Google
3. Clique no seletor de projetos (topo da página)
4. Clique em **New Project**
5. Preencha:
   - **Project name:** `ChefIApp`
   - **Organization:** (deixe padrão)
   - **Location:** (deixe padrão)
6. Clique em **Create**
7. Aguarde alguns segundos
8. Selecione o projeto criado

**Passo 2: Habilitar Google+ API**
1. No Google Cloud Console, vá em **APIs & Services** → **Library**
2. Procure por **Google+ API** ou **Google Identity Services API**
3. Clique em **Enable**
4. Aguarde a ativação

**Passo 3: Configurar OAuth Consent Screen**
1. Vá em **APIs & Services** → **OAuth consent screen**
2. Selecione **External** (ou Internal se tiver Google Workspace)
3. Clique em **Create**
4. Preencha:
   - **App name:** `ChefIApp`
   - **User support email:** Seu email
   - **Developer contact:** Seu email
   - **App logo:** (opcional) Faça upload do logo
   - **App domain:** `chefiapp.com`
   - **Authorized domains:** `chefiapp.com`
5. Clique em **Save and Continue**
6. Em **Scopes**, clique em **Save and Continue**
7. Em **Test users**, adicione seu email (se necessário)
8. Clique em **Save and Continue**
9. Clique em **Back to Dashboard**

**Passo 4: Criar OAuth Client ID**
1. Vá em **APIs & Services** → **Credentials**
2. Clique em **Create Credentials** → **OAuth client ID**
3. Selecione **Application type:** `Web application`
4. Preencha:
   - **Name:** `ChefIApp Web Client`
   - **Authorized JavaScript origins:**
     - `https://mcmxniuokmvzuzqfnpnn.supabase.co`
     - `https://chefiapp.com`
   - **Authorized redirect URIs:**
     - `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`
     - `https://chefiapp.com/auth/callback`
5. Clique em **Create**
6. **IMPORTANTE:** Copie o **Client ID** e **Client Secret**
   - Você precisará deles no próximo passo

**Passo 5: Configurar no Supabase**
1. Volte ao Supabase Dashboard
2. Vá em **Authentication** → **Providers**
3. Role até encontrar **Google**
4. Clique no toggle para **Enable Google provider**
5. Preencha os campos:
   - **Client ID (for OAuth):** Cole o Client ID do Google
   - **Client Secret (for OAuth):** Cole o Client Secret do Google
6. Clique em **Save**
7. Verifique se o toggle está **ativado** (verde)

---

### 1.2 Apple OAuth

#### Pré-requisitos
- Conta Apple Developer (paga - $99/ano)
- App registrado no Apple Developer Portal

#### Passo a Passo Detalhado

**Passo 1: Acessar Apple Developer Portal**
1. Acesse: https://developer.apple.com/account
2. Faça login com sua conta Apple Developer
3. Vá em **Certificates, Identifiers & Profiles**

**Passo 2: Criar Service ID**
1. No menu lateral, clique em **Identifiers**
2. Clique no botão **+** (criar novo)
3. Selecione **Services IDs**
4. Clique em **Continue**
5. Preencha:
   - **Description:** `ChefIApp Authentication`
   - **Identifier:** `com.chefiapp.app.auth` (ou similar)
6. Clique em **Continue** → **Register**

**Passo 3: Configurar Service ID**
1. Clique no Service ID criado
2. Marque a opção **Sign in with Apple**
3. Clique em **Configure**
4. Configure:
   - **Primary App ID:** Selecione seu App ID
   - **Website URLs:**
     - **Domains and Subdomains:** `mcmxniuokmvzuzqfnpnn.supabase.co`
     - **Return URLs:** `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`
5. Clique em **Save** → **Continue** → **Register**

**Passo 4: Criar Key para Sign in with Apple**
1. Vá em **Keys**
2. Clique no botão **+** (criar novo)
3. Preencha:
   - **Key Name:** `ChefIApp Sign in with Apple Key`
   - Marque **Sign in with Apple**
4. Clique em **Continue** → **Register**
5. **IMPORTANTE:** Baixe o arquivo `.p8` (só pode baixar uma vez!)
6. Anote o **Key ID**

**Passo 5: Obter Team ID**
1. No canto superior direito, clique no seu nome
2. Anote o **Team ID** (formato: `ABC123DEF4`)

**Passo 6: Configurar no Supabase**
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
7. Verifique se o toggle está **ativado** (verde)

---

## 2. 🔒 REVISAR E ATIVAR RLS POLICIES

### Prioridade: 🔴 CRÍTICA (segurança)

### 2.1 Verificar RLS Ativo

1. No Supabase Dashboard, vá em **Table Editor**
2. Para cada tabela abaixo, verifique:

#### Tabelas que DEVEM ter RLS:

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

### 2.2 Verificar Políticas

Para cada tabela:

1. Clique na tabela
2. Vá na aba **Policies**
3. Verifique se há políticas criadas
4. Confirme que RLS está **Enabled**

### 2.3 Políticas Esperadas

#### `profiles`
- ✅ Users can view own profile
- ✅ Users can update own profile
- ✅ Users can insert own profile
- ✅ Users can view company profiles

#### `companies`
- ✅ Owners can view own companies
- ✅ Owners can insert own companies
- ✅ Owners can update own companies
- ✅ Employees can view their company

#### `tasks`
- ✅ Users can view company tasks
- ✅ Users can insert tasks
- ✅ Users can update tasks

#### Outras tabelas
- Verifique políticas similares para `sectors`, `positions`, `shifts`, etc.

### 2.4 Se RLS Não Estiver Ativo

1. Vá em **SQL Editor**
2. Execute para cada tabela:
```sql
ALTER TABLE public.[nome_tabela] ENABLE ROW LEVEL SECURITY;
```

---

## 3. 📧 EMAIL TEMPLATES E NOTIFICAÇÕES

### Prioridade: 🟡 MÉDIA (melhora UX)

### 3.1 Acessar Email Templates

1. No Supabase Dashboard, vá em **Authentication** → **Email Templates**

### 3.2 Templates Disponíveis

- **Confirm signup** - Email de confirmação de cadastro
- **Magic Link** - Link mágico para login
- **Change Email Address** - Mudança de email
- **Reset Password** - Recuperação de senha
- **Email Change** - Confirmação de mudança de email

### 3.3 Personalizar Templates

Para cada template:

1. Clique no template
2. Personalize:
   - **Subject:** Título do email
   - **Body:** Corpo do email (HTML)
3. Variáveis disponíveis:
   - `{{ .ConfirmationURL }}` - URL de confirmação
   - `{{ .Email }}` - Email do usuário
   - `{{ .Token }}` - Token (se necessário)
   - `{{ .SiteURL }}` - URL do site

### 3.4 Exemplo: Confirm Signup

```html
<h2>Bem-vindo ao ChefIApp!</h2>
<p>Olá!</p>
<p>Clique no link abaixo para confirmar seu cadastro:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar Email</a></p>
<p>Ou copie e cole este link no navegador:</p>
<p>{{ .ConfirmationURL }}</p>
<p>Se você não criou esta conta, ignore este email.</p>
<p>Equipe ChefIApp</p>
```

### 3.5 Verificar URLs nos Templates

1. Certifique-se de que as URLs apontam para:
   - Produção: `https://chefiapp.com`
   - Desenvolvimento: `http://localhost:5173` (se necessário)

---

## 4. 🔍 VERIFICAR VARIÁVEIS DE AMBIENTE

### Prioridade: 🔴 CRÍTICA

### 4.1 Verificar `.env.local`

```bash
cat .env.local
```

Deve conter:
```env
VITE_SUPABASE_URL=https://mcmxniuokmvzuzqfnpnn.supabase.co
VITE_SUPABASE_ANON_KEY=[sua_chave]
SUPABASE_SERVICE_KEY=[sua_chave]
```

### 4.2 Verificar `.env` (para scripts)

```bash
cat .env
```

Deve conter as mesmas variáveis.

### 4.3 Verificar no Código

Verifique se os arquivos estão usando as variáveis corretas:

- `src/services/supabase.ts` - Deve usar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- `src/hooks/useAuth.ts` - Deve usar as mesmas variáveis

### 4.4 Verificar Redirect URLs no Código

- `src/hooks/useAuth.ts` - Verifique se usa `chefiapp://auth/callback`
- `capacitor.config.ts` - Verifique `iosScheme: 'chefiapp'`

---

## 5. ⚙️ CONFIGURAÇÕES ADICIONAIS

### Prioridade: 🟢 BAIXA (opcional)

### 5.1 MFA (Multi-Factor Authentication)

1. No Supabase Dashboard, vá em **Authentication** → **Providers**
2. Role até **MFA**
3. Habilite se necessário

### 5.2 Rate Limits

1. Vá em **Authentication** → **Settings**
2. Configure rate limits para prevenir ataques
3. Valores recomendados:
   - **Sign in:** 5 tentativas por minuto
   - **Sign up:** 3 tentativas por minuto
   - **Password reset:** 3 tentativas por hora

### 5.3 Webhooks

1. Vá em **Database** → **Webhooks**
2. Configure webhooks se necessário para:
   - Notificações de novos usuários
   - Eventos de autenticação
   - Mudanças em dados críticos

### 5.4 Auth Hooks

1. Vá em **Database** → **Functions**
2. Configure Edge Functions se necessário para:
   - Validações customizadas
   - Transformações de dados
   - Integrações externas

---

## 6. 🧪 TESTES COMPLETOS

### Prioridade: 🔴 CRÍTICA

### 6.1 Teste de Autenticação

#### Email/Senha
1. Abra o app
2. Tente criar uma conta
3. Verifique se recebe email de confirmação
4. Confirme o email
5. Faça login
6. Verifique se o perfil é criado automaticamente

#### Google OAuth (se configurado)
1. Clique em "Login com Google"
2. Selecione conta Google
3. Autorize o app
4. Verifique se redireciona corretamente
5. Verifique se o usuário está autenticado

#### Apple OAuth (se configurado)
1. Clique em "Login com Apple"
2. Autorize com Face ID/Touch ID
3. Verifique se redireciona corretamente
4. Verifique se o usuário está autenticado

### 6.2 Teste de Upload no Storage

1. No app, vá para criação de empresa
2. Tente fazer upload de um logo
3. Verifique se o arquivo aparece no bucket `company-assets`
4. Verifique se o arquivo está privado (não acessível publicamente)

### 6.3 Teste de CRUD no Banco

#### Criar Empresa
1. Complete o onboarding da empresa
2. Verifique se a empresa é criada na tabela `companies`
3. Verifique se os setores são criados em `sectors`
4. Verifique se as posições são criadas em `positions`

#### Criar Tarefa
1. Crie uma tarefa no app
2. Verifique se aparece na tabela `tasks`
3. Verifique se o RLS está funcionando (só vê tarefas da sua empresa)

#### Check-in
1. Faça check-in
2. Verifique se aparece na tabela `check_ins`
3. Verifique se o `shift_status` é atualizado em `profiles`

### 6.4 Teste de RLS Policies

#### Teste 1: Usuário A não vê dados do Usuário B
1. Crie dois usuários diferentes
2. Cada um cria uma empresa
3. Verifique se um não vê dados do outro

#### Teste 2: Funcionário vê dados da empresa
1. Crie um owner e um employee na mesma empresa
2. Verifique se o employee pode ver tarefas da empresa
3. Verifique se o employee NÃO pode criar/modificar setores

### 6.5 Teste de Performance

1. Verifique tempo de resposta das queries
2. Verifique se os índices estão sendo usados
3. Monitore logs no Supabase Dashboard → Logs

---

## ✅ CHECKLIST FINAL

### OAuth
- [ ] Google OAuth configurado e testado
- [ ] Apple OAuth configurado e testado (se aplicável)

### Segurança
- [ ] RLS ativo em todas as tabelas
- [ ] Políticas verificadas e funcionando
- [ ] Rate limits configurados

### Email
- [ ] Templates personalizados
- [ ] URLs corretas nos templates
- [ ] Teste de envio de emails

### Variáveis
- [ ] `.env.local` verificado
- [ ] Código usando variáveis corretas
- [ ] Redirect URLs corretas no código

### Testes
- [ ] Autenticação funcionando
- [ ] Upload no Storage funcionando
- [ ] CRUD funcionando
- [ ] RLS funcionando
- [ ] Performance aceitável

---

## 🎯 PRIORIZAÇÃO

### 🔴 CRÍTICO (Fazer Agora)
1. Revisar RLS Policies
2. Verificar variáveis de ambiente
3. Testes básicos de autenticação

### 🟡 IMPORTANTE (Fazer em Breve)
1. Configurar OAuth Google
2. Personalizar Email Templates
3. Testes completos

### 🟢 OPCIONAL (Pode Esperar)
1. OAuth Apple (requer conta paga)
2. MFA
3. Webhooks/Auth Hooks

---

## 📚 DOCUMENTAÇÃO ADICIONAL

- **CONFIGURACAO_COMPLETA_SUPABASE.md** - Guia completo
- **SETUP_COMPLETO.md** - Resumo do que foi feito
- **CONFIGURAR_REDIRECT_URLS.md** - Guia de Redirect URLs

---

**Última atualização:** $(date)

