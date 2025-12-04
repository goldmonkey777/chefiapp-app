# 📚 ENTENDIMENTO COMPLETO DO PROJETO ChefIApp™

**Data:** 2025-01-27  
**Versão:** 1.0.0  
**Status:** 95% Completo - Pronto para Beta

---

## 🎯 VISÃO GERAL

**ChefIApp™** é uma plataforma completa de gestão de equipes para o setor de hotelaria (restaurantes, hotéis, bares, etc.) que combina:

- ✅ **Gestão de Tarefas** - Sistema completo de criação, atribuição e acompanhamento
- 🎮 **Gamificação** - XP, níveis, streaks e conquistas para aumentar engajamento
- 📱 **Multi-plataforma** - Web (PWA), iOS e Android nativos
- ⚡ **Tempo Real** - Atualizações instantâneas via Supabase Realtime
- 🌍 **Internacionalização** - Suporte a 6+ idiomas (PT, EN, ES, FR, DE, IT)
- 🔐 **Autenticação OAuth** - Google, Apple, Magic Link
- 🏢 **Onboarding Completo** - Fluxo de 8 telas para criação de empresas

---

## 🏗️ ARQUITETURA TÉCNICA

### Stack Principal

```
Frontend:
├── React 19.2.0          → UI Framework
├── TypeScript 5.8.2     → Type Safety
├── Vite 6.2.0           → Build Tool
├── TailwindCSS 4.1.17   → Styling
├── Zustand 5.0.8        → State Management
└── react-i18next 16.3.5 → Internacionalização

Backend:
├── Supabase 2.86.0      → BaaS completo
├── PostgreSQL 15+      → Database
├── Supabase Realtime    → Updates em tempo real
├── Supabase Storage     → Upload de arquivos
└── Supabase Auth        → Autenticação

Mobile:
├── Capacitor 7.4.4      → Framework mobile
├── iOS 7.4.4            → App nativo iOS
└── Android 7.4.4       → App nativo Android
```

### Estrutura de Pastas

```
chefiapp-hospitality-intelligence/
├── src/
│   ├── components/          # Componentes React modulares
│   │   ├── Onboarding/      # Fluxo de onboarding usuário
│   │   ├── CompanyOnboarding/ # Onboarding empresa (8 telas)
│   │   ├── TaskManagement/  # Componentes de tarefas
│   │   ├── ShiftManagement/ # Gestão de turnos
│   │   └── ui/              # Componentes UI reutilizáveis
│   │
│   ├── pages/               # Dashboards principais
│   │   ├── EmployeeDashboard.tsx  # Dashboard funcionário
│   │   ├── ManagerDashboard.tsx   # Dashboard gerente
│   │   ├── OwnerDashboard.tsx     # Dashboard dono
│   │   └── SettingsPage.tsx        # Configurações
│   │
│   ├── hooks/               # Custom React Hooks
│   │   ├── useAuth.ts       # Autenticação (OAuth, Magic Link)
│   │   ├── useTasks.ts      # Gestão de tarefas
│   │   ├── useCheckin.ts    # Check-in/check-out
│   │   ├── useXP.ts         # Sistema de XP
│   │   ├── useStreak.ts     # Sistema de streaks
│   │   ├── useNotifications.ts # Notificações
│   │   └── useCompany.ts    # Gestão de empresa
│   │
│   ├── stores/              # Zustand State Management
│   │   ├── useAppStore.ts   # Store principal
│   │   └── actions/         # Actions modulares
│   │       ├── taskActions.ts
│   │       ├── userActions.ts
│   │       ├── notificationActions.ts
│   │       ├── activityActions.ts
│   │       └── shiftActions.ts
│   │
│   ├── services/            # Serviços externos
│   │   ├── geminiService.ts # Integração AI (Google Gemini)
│   │   ├── fraud-detection.service.ts
│   │   └── preset-installer.service.ts
│   │
│   ├── lib/                 # Utilitários e configurações
│   │   ├── supabase.ts      # Cliente Supabase
│   │   ├── types.ts         # TypeScript types (300+ linhas)
│   │   └── utils.ts         # Funções auxiliares
│   │
│   ├── locales/             # Traduções i18n
│   │   ├── pt/              # Português
│   │   ├── en/              # Inglês
│   │   ├── es/              # Espanhol
│   │   ├── fr/              # Francês
│   │   ├── de/              # Alemão
│   │   └── it/              # Italiano
│   │
│   └── mcp/                 # Model Context Protocol (AI)
│       ├── mcp_alerts.ts
│       ├── mcp_automator.ts
│       ├── mcp_haccp.ts
│       └── ...
│
├── supabase/                # Database migrations
│   ├── COMPLETE_SETUP.sql  # Setup completo do banco
│   ├── FIX_RLS_RECURSION.sql
│   └── migrations/
│
├── ios/                     # Projeto iOS nativo
├── android/                 # Projeto Android nativo
└── docs/                    # Documentação completa
```

---

## 🎮 SISTEMA DE GAMIFICAÇÃO

### XP (Experience Points)

**Como ganhar XP:**
- ✅ Completar tarefa: **20-50 XP** (baseado na prioridade)
- ⚡ Bônus velocidade: **+20 XP** se completar em < 5 minutos
- 📸 Bônus foto: **+10 XP** se enviar foto de prova
- 🏆 Conquistas: **+50 a +200 XP** por conquista desbloqueada

**Fórmula de Nível:**
```typescript
level = Math.floor(Math.sqrt(xp / 100)) + 1

Exemplos:
0 XP    → Nível 1
100 XP  → Nível 2
400 XP  → Nível 3
900 XP  → Nível 4
1600 XP → Nível 5
```

### Streaks (Sequências)

**Sistema de Streaks:**
- 🔥 **On Fire:** 3+ dias consecutivos de check-in
- 🔥🔥 **Blazing:** 7+ dias consecutivos
- ⭐ **Legendary:** 30+ dias consecutivos

**Como funciona:**
- Streak aumenta se fizer check-in no dia seguinte
- Streak reseta para 1 se perder um dia
- Streaks maiores desbloqueiam conquistas especiais

### Conquistas (Achievements)

**Tipos de Conquistas:**
- 🎯 **Tarefas:** First Task, Task Master (10/50/100 tarefas)
- 🔥 **Streaks:** Fire Starter (3 dias), Perfect Week (7 dias), Legendary (30 dias)
- 📈 **Níveis:** Level 5 Club, Level 10 Elite, Level 20 Master
- ⚡ **Velocidade:** Speed Demon (completar tarefa em < 3 minutos)

**Sistema:**
- Conquistas são verificadas automaticamente após ações
- Cada conquista dá XP adicional
- Badges visuais no perfil do usuário

### Leaderboard (Ranking)

- Top 10 usuários por XP na empresa
- Filtro por setor (cozinha, bar, recepção, etc.)
- Destaque do usuário atual
- Atualização em tempo real

---

## 👥 ROLES E PERMISSÕES

### 1. EMPLOYEE (Funcionário)

**Capacidades:**
- ✅ Ver tarefas atribuídas
- ✅ Aceitar/rejeitar tarefas
- ✅ Completar tarefas com foto
- ✅ Check-in/check-out com geolocalização
- ✅ Ver próprio progresso (XP, nível, streak)
- ✅ Ver ranking da empresa
- ✅ Ver conquistas desbloqueadas

**Dashboard:**
- Card de turno (iniciar turno)
- Lista de tarefas pendentes
- Progresso de XP e nível
- Streak atual
- Notificações

### 2. MANAGER (Gerente)

**Capacidades:**
- ✅ Tudo que EMPLOYEE pode fazer
- ✅ Criar tarefas para funcionários
- ✅ Atribuir tarefas a setores/funcionários
- ✅ Aprovar conclusões de tarefas
- ✅ Ver performance da equipe
- ✅ Ver analytics por setor
- ✅ Gerenciar turnos da equipe

**Dashboard:**
- Visão geral da equipe
- Criar nova tarefa
- Lista de tarefas da equipe
- Analytics por setor
- Performance dos funcionários

### 3. OWNER (Dono)

**Capacidades:**
- ✅ Tudo que MANAGER pode fazer
- ✅ Criar e configurar empresa
- ✅ Gerenciar setores e posições
- ✅ Ver analytics completos
- ✅ Gerar QR codes para convites
- ✅ Configurar presets (HACCP, ServSafe, etc.)
- ✅ Gerenciar configurações da empresa

**Dashboard:**
- Visão geral completa da empresa
- Analytics avançados
- Gestão de funcionários
- Configurações da empresa
- QR Code generator

---

## 🏢 FLUXO DE ONBOARDING DA EMPRESA (8 TELAS)

### Tela 1: Seleção de Perfil
- Escolher: Dono/Gerente ou Funcionário
- Se funcionário → vai para QR Code scanner

### Tela 2: Dados da Empresa
- Nome da empresa *
- CNPJ/EIN (opcional)
- E-mail do responsável *
- Telefone
- País * (dropdown)
- Idioma (auto-preenchido)
- Moeda (auto-preenchida)
- Upload de logo

### Tela 3: Localização
- Botão "Usar minha localização atual" (GPS)
- Endereço completo *
- Coordenadas GPS salvas automaticamente
- Usado para geofencing e auditoria

### Tela 4: Setores
- Selecionar setores da empresa:
  - Cozinha Quente 🔥
  - Cozinha Fria ❄️
  - Bar 🍸
  - Recepção 🏨
  - Limpeza 🧹
  - Manutenção 🔧
  - etc.

### Tela 5: Posições
- Definir cargos/funções:
  - Chef, Sous Chef, Cozinheiro
  - Garçom, Bartender
  - Recepcionista
  - etc.

### Tela 6: Organização
- Faixa de funcionários (1-10, 11-50, 51-200, 200+)
- Horários de funcionamento
- Tipos de turnos

### Tela 7: Preset
- Selecionar preset de compliance:
  - HACCP (Brasil/Europa)
  - ServSafe (EUA)
  - Customizado
- Instala configurações automáticas

### Tela 8: Resumo
- Revisar todas as informações
- Confirmar criação da empresa
- Redireciona para dashboard

---

## 🔐 AUTENTICAÇÃO

### Métodos Suportados

1. **Google OAuth** ✅
   - Deep link: `com-chefiapp-app://auth/callback`
   - Redirect URL configurado no Supabase

2. **Apple Sign In** ✅
   - Deep link configurado
   - Requer Apple Developer account

3. **Magic Link** (planejado)
   - Email sem senha

4. **QR Code** ✅
   - Para funcionários entrarem na empresa
   - Gerado pelo Owner

### Fluxo de Autenticação

```
1. User abre app
   ↓
2. App.tsx verifica sessão Supabase
   ↓
3. Se não autenticado:
   - Mostra OnboardingContainer
   - User escolhe método OAuth
   ↓
4. OAuth redireciona para Supabase callback
   ↓
5. Supabase processa e redireciona para deep link
   ↓
6. App recebe callback e estabelece sessão
   ↓
7. useAuth busca perfil do usuário
   ↓
8. Se perfil não existe → cria automaticamente
   ↓
9. Verifica se tem companyId:
   - SIM → Dashboard
   - NÃO → Onboarding empresa ou QR Code
```

### Perfil Automático

Quando usuário faz OAuth pela primeira vez:
- Perfil é criado automaticamente na tabela `profiles`
- Dados do OAuth são migrados (nome, email, foto)
- `auth_method` é salvo (google/apple)
- `role` padrão: EMPLOYEE

---

## 📊 BANCO DE DADOS (Supabase)

### Tabelas Principais

1. **profiles**
   - Dados do usuário (nome, email, foto, role, sector)
   - XP, nível, streak
   - Status do turno (offline/active/break)
   - Último check-in/check-out

2. **companies**
   - Dados da empresa (nome, CNPJ, endereço)
   - Configurações (país, idioma, moeda)
   - Coordenadas GPS
   - Preset de compliance

3. **tasks**
   - Tarefas criadas pelos managers
   - Status (pending/in-progress/done)
   - Prioridade (low/medium/high)
   - XP reward
   - Foto de prova (opcional)

4. **check_ins**
   - Histórico de check-ins/check-outs
   - Geolocalização
   - Duração do turno

5. **notifications**
   - Notificações in-app
   - Tipos: task_assigned, task_completed, achievement, system

6. **achievements**
   - Conquistas disponíveis
   - XP reward de cada conquista

7. **user_achievements**
   - Conquistas desbloqueadas por usuário
   - Data de desbloqueio

8. **activities**
   - Histórico de atividades do usuário
   - Tipos: check_in, check_out, task_completed, xp_gained, level_up

### Row Level Security (RLS)

Todas as tabelas têm políticas RLS:
- Usuários só veem dados da própria empresa
- Managers podem ver dados da equipe
- Owners têm acesso total à empresa
- Função `SECURITY DEFINER` para evitar recursão

---

## 📱 MOBILE (Capacitor)

### Configuração iOS

- **App ID:** `com.chefiapp.app`
- **Deep Link:** `com-chefiapp-app://`
- **Splash Screen:** Customizado (azul #2A3A8A)
- **Safe Area:** Configurado para iPhone X+

### Configuração Android

- **Package:** `com.chefiapp.app`
- **Deep Link:** Configurado
- **Splash Screen:** Customizado

### Build Commands

```bash
# Build e sync
npm run mobile:build

# Abrir no Xcode
npm run mobile:open:ios

# Abrir no Android Studio
npm run mobile:open:android
```

---

## 🌍 INTERNACIONALIZAÇÃO (i18n)

### Idiomas Suportados

- 🇧🇷 Português (pt) - Padrão
- 🇺🇸 Inglês (en)
- 🇪🇸 Espanhol (es)
- 🇫🇷 Francês (fr)
- 🇩🇪 Alemão (de)
- 🇮🇹 Italiano (it)

### Como Funciona

- Detecção automática do idioma do navegador
- Seletor manual no app
- Traduções em `src/locales/{lang}/translation.json`
- React-i18next para gerenciamento

---

## ⚡ REALTIME (Supabase)

### Subscriptions Ativas

1. **Tasks** - Atualizações em tempo real de tarefas
2. **Notifications** - Novas notificações instantâneas
3. **Profiles** - Mudanças de status de turno

### Como Funciona

```typescript
// Exemplo: Tasks realtime
supabase
  .channel('tasks')
  .on('postgres_changes', {
    event: '*',  // INSERT, UPDATE, DELETE
    schema: 'public',
    table: 'tasks'
  }, (payload) => {
    syncTasks(); // Re-fetch tasks
  })
  .subscribe();
```

---

## 🎨 UI/UX

### Design System

- **Cores Principais:**
  - Azul: `#2A3A8A` (primário)
  - Verde: `#10B981` (sucesso)
  - Vermelho: `#EF4444` (erro/alta prioridade)
  - Amarelo: `#F59E0B` (média prioridade)

- **Componentes:**
  - TailwindCSS utility classes
  - Lucide React icons
  - Recharts para gráficos

### Responsividade

- Mobile-first design
- Breakpoints TailwindCSS
- Safe area insets para iOS
- PWA installable

---

## 🧪 TESTES

### Framework

- **Vitest** - Test runner
- **@testing-library/react** - Component testing
- **@testing-library/user-event** - User interactions

### Cobertura Atual

- ✅ `useAuth.test.ts` - Testes de autenticação
- ✅ `useTasks.test.ts` - Testes de tarefas
- ✅ `TaskCard.test.tsx` - Testes de componente
- ✅ `QRCodeScanner.test.tsx` - Testes de scanner

**Status:** 60% cobertura (em progresso)

---

## 📈 STATUS DO PROJETO

### ✅ Completo (100%)

- Core Features
- Autenticação OAuth
- Company Onboarding (8 telas)
- Dashboards (Employee/Manager/Owner)
- Sistema de Gamificação
- Mobile Apps (iOS/Android)
- Internacionalização
- Documentação

### 🟡 Em Progresso (60%)

- Testes automatizados
- Push notifications nativas
- Modo offline avançado

### 🔄 Planejado

- Multi-empresa (usuário em várias empresas)
- Analytics avançados
- Integração AI melhorada
- Modo escuro

---

## 🚀 COMANDOS ÚTEIS

### Desenvolvimento

```bash
# Iniciar dev server
npm run dev

# Build produção
npm run build

# Preview build
npm run preview

# Testes
npm run test
npm run test:ui
npm run test:coverage
```

### Mobile

```bash
# Build e sync Capacitor
npm run mobile:build

# Abrir iOS
npm run mobile:open:ios

# Abrir Android
npm run mobile:open:android
```

### Supabase

```bash
# Executar SQL no Supabase
# Copiar conteúdo de supabase/COMPLETE_SETUP.sql
# Colar no Supabase SQL Editor
```

---

## 🔧 CONFIGURAÇÕES IMPORTANTES

### Variáveis de Ambiente (.env)

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

### Capacitor Config

```typescript
// capacitor.config.ts
{
  appId: 'com.chefiapp.app',
  appName: 'ChefIApp',
  webDir: 'dist',
  iosScheme: 'com-chefiapp-app'
}
```

### Supabase Redirect URLs

Configurar no Supabase Dashboard:
- `com-chefiapp-app://auth/callback`
- `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`
- `http://localhost:5173/auth/callback`

---

## 📚 DOCUMENTAÇÃO ADICIONAL

- **[README.md](README.md)** - Visão geral do projeto
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Arquitetura detalhada
- **[docs/QUICKSTART.md](docs/QUICKSTART.md)** - Guia rápido de setup
- **[docs/PROJETO_ESTADO_ATUAL.md](docs/PROJETO_ESTADO_ATUAL.md)** - Status atual
- **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Solução de problemas

---

## 🎯 PRÓXIMOS PASSOS SUGERIDOS

1. ✅ **Completar testes** - Aumentar cobertura para 80%+
2. 🔄 **Push notifications** - Implementar notificações nativas
3. 🔄 **Modo offline** - Melhorar sincronização offline
4. 🔄 **Analytics avançados** - Mais gráficos e insights
5. 🔄 **Performance** - Otimizações de bundle size

---

**Made with ❤️ by [goldmonkey.studio](https://goldmonkey.studio)**

