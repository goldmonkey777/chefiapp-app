# 🏗️ ChefIApp - Arquitetura

## 📊 Visão Geral

ChefIApp é um aplicativo híbrido (React + Capacitor) para gestão de equipes em hotelaria, com sistema de gamificação.

**Stack:**
- **Frontend:** React 19 + TypeScript
- **Mobile:** Capacitor 7 (iOS/Android)
- **Backend:** Supabase (PostgreSQL + Realtime + Storage + Auth)
- **State:** Zustand com persist
- **Styling:** TailwindCSS 4
- **i18n:** react-i18next

---

## 📁 Estrutura de Diretórios

```
chefiapp/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Onboarding/      # Flow de onboarding modular
│   │   ├── CompanyOnboarding/
│   │   ├── TaskManagement/
│   │   └── ...
│   │
│   ├── pages/               # Dashboards principais
│   │   ├── EmployeeDashboard.tsx
│   │   ├── ManagerDashboard.tsx
│   │   └── OwnerDashboard.tsx
│   │
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.ts       # Autenticação
│   │   ├── useTasks.ts      # Tarefas (com Supabase)
│   │   ├── useCheckin.ts    # Check-in/out
│   │   └── ...
│   │
│   ├── stores/              # Zustand state
│   │   ├── useAppStore.ts   # Store principal
│   │   └── actions/         # Actions modulares
│   │       ├── taskActions.ts
│   │       ├── userActions.ts
│   │       ├── notificationActions.ts
│   │       └── activityActions.ts
│   │
│   ├── services/            # Serviços externos
│   │   ├── geminiService.ts
│   │   └── ...
│   │
│   ├── lib/                 # Utilitários
│   │   ├── supabase.ts      # Cliente Supabase
│   │   ├── types.ts         # TypeScript types
│   │   └── utils.ts         # Funções auxiliares
│   │
│   └── locales/             # Traduções i18n
│       ├── pt/
│       ├── en/
│       └── ...
│
├── supabase/                # Configuração Supabase
│   ├── migrations/          # SQL migrations
│   └── COMPLETE_SETUP.sql   # Setup completo
│
├── docs/                    # Documentação
│   ├── README.md
│   ├── QUICKSTART.md
│   └── ...
│
├── ios/                     # Build iOS (Capacitor)
├── android/                 # Build Android (Capacitor)
└── public/                  # Assets estáticos
```

---

## 🎭 Roles e Permissões

### UserRole Enum
```typescript
enum UserRole {
  EMPLOYEE = 'employee',  // Funcionário
  MANAGER = 'manager',    // Gerente
  OWNER = 'owner'         // Dono
}
```

### Dashboards por Role
- **Employee:** EmployeeDashboard
  - Check-in/out
  - Tarefas atribuídas
  - XP e ranking
  - Conquistas

- **Manager:** ManagerDashboard
  - Criar/atribuir tarefas
  - Ver equipe do setor
  - Estatísticas do setor

- **Owner:** OwnerDashboard
  - Visão completa da empresa
  - Todos os funcionários
  - Todas as tarefas
  - Analytics completo
  - QR Code da empresa

---

## 🔄 Fluxo de Dados

### Arquitetura de Estado

```
┌─────────────┐
│   Supabase  │ (Source of truth)
└──────┬──────┘
       │
       │ Realtime
       │ Subscriptions
       ▼
┌─────────────┐
│   Zustand   │ (Local cache)
│    Store    │
└──────┬──────┘
       │
       │ Selectors
       ▼
┌─────────────┐
│   Hooks     │ (Business logic)
│  useTasks   │
│  useAuth    │
└──────┬──────┘
       │
       │ Props
       ▼
┌─────────────┐
│ Components  │ (UI)
└─────────────┘
```

### Sincronização Bidirecional

1. **Supabase → Zustand:**
   - Hooks chamam `sync*()` functions
   - Realtime subscriptions atualizam store
   - Store persiste localmente

2. **Zustand → Supabase:**
   - Actions chamam APIs do Supabase
   - `insert()`, `update()`, `delete()`
   - Realtime propaga para outros clientes

---

## 🎮 Sistema de Gamificação

### XP (Experience Points)
```typescript
// Cálculo de XP
baseXP = task.xpReward (20-50 XP)
speedBonus = duration < 300s ? 20 XP : 0
photoBonus = hasPhoto ? 10 XP : 0
totalXP = baseXP + speedBonus + photoBonus
```

### Níveis
```typescript
// Fórmula de nível
function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

// Exemplos:
// 0 XP    → Nível 1
// 100 XP  → Nível 2
// 400 XP  → Nível 3
// 900 XP  → Nível 4
```

### Streaks
```typescript
interface StreakState {
  streak: number;
  isOnFire: boolean;    // 3+ dias
  isBlazing: boolean;   // 7+ dias
  isLegendary: boolean; // 30+ dias
}
```

---

## 🔐 Autenticação

### Providers Suportados
- **OAuth:** Google, Apple
- **Email/Password:** Supabase Auth
- **Magic Link:** (planejado)
- **QR Code:** Para funcionários (via empresa)

### Fluxo de Auth

```
1. User abre app
   ↓
2. App.tsx chama useAuth()
   ↓
3. useAuth verifica session no Supabase
   ↓
4. Se session válida:
   - Busca profile do banco
   - Seta currentUser no store
   - Redireciona para dashboard
   ↓
5. Se não autenticado:
   - Mostra OnboardingContainer
   - User faz login
   - Repete passo 3
```

---

## 📡 Realtime

### Subscriptions Ativas

```typescript
// Tasks realtime
supabase
  .channel('tasks')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'tasks'
  }, (payload) => {
    syncTasks(); // Re-fetch
  })
  .subscribe();
```

**Habilitadas para:**
- ✅ Tasks
- ✅ Notifications
- ✅ Profiles (partial)
- 🔄 Activities (planejado)
- 🔄 Check-ins (planejado)

---

## 💾 Persistência

### Zustand Persist
```typescript
persist(
  (set, get) => ({ ... }),
  {
    name: 'chefiapp-storage',
    partialize: (state) => ({
      currentUser: state.currentUser,
      company: state.company,
      // Apenas dados essenciais
    })
  }
)
```

**O que persiste:**
- ✅ currentUser
- ✅ company
- ✅ isAuthenticated
- ❌ tasks (vêm sempre do Supabase)
- ❌ notifications (vêm sempre do Supabase)

---

## 🎨 Styling

### TailwindCSS + Utility Classes

```tsx
// Padrão de cores
bg-blue-600      // Primary
bg-green-600     // Success
bg-red-600       // Error
bg-yellow-500    // Warning
bg-gray-50       // Background

// Safe areas (iOS notch)
safe-area-insets
pt-safe
pb-safe
```

---

## 📱 Mobile (Capacitor)

### Capacitor Config
```typescript
// capacitor.config.ts
{
  appId: 'com.chefiapp.app',
  appName: 'ChefIApp',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: { ... },
    PushNotifications: { ... }
  }
}
```

### Deep Linking
```
chefiapp://auth/callback     # OAuth redirect
chefiapp://join/{companyId}  # QR Code invite
```

---

## 🧪 Testing Strategy

### Pirâmide de Testes (Planejado)

```
     /\
    /UI\ (E2E - Playwright)
   /────\
  / Unit \ (Vitest + Testing Library)
 /────────\
/Integration\ (Hooks + Store)
```

**Prioridades:**
1. Hooks críticos (useAuth, useTasks)
2. Store actions (taskActions, userActions)
3. Componentes de formulário
4. Fluxos E2E principais

---

## 🔒 Security

### Row Level Security (RLS)

Todas as tabelas usam RLS:

```sql
-- Exemplo: Tasks
CREATE POLICY "Users can view their tasks"
ON tasks FOR SELECT
USING (
  auth.uid() = assigned_to
  OR auth.uid() = created_by
);
```

### Environment Variables

```bash
# ✅ Seguro (frontend)
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY

# ❌ NUNCA no frontend
SUPABASE_SERVICE_KEY
```

---

## 📊 Performance

### Otimizações Implementadas
- ✅ Realtime subscriptions (evita polling)
- ✅ Zustand persist (cache local)
- ✅ React.lazy para code splitting
- 🔄 useMemo em listas grandes (planejado)
- 🔄 React.memo em componentes pesados (planejado)

### Bundle Size Target
- Initial: < 200KB (gzip)
- Total: < 500KB (gzip)

---

## 🌍 Internacionalização

### Idiomas Suportados
- 🇧🇷 Português (pt)
- 🇺🇸 Inglês (en)
- 🇪🇸 Espanhol (es)
- 🇫🇷 Francês (fr)
- 🇩🇪 Alemão (de)
- 🇮🇹 Italiano (it)

### Uso
```tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<h1>{t('dashboard.welcome')}</h1>
```

---

## 🚀 Deploy

### Build de Produção
```bash
npm run build       # Web
npm run mobile:build # iOS + Android
```

### Ambientes
- **Dev:** localhost:5173
- **Staging:** (configurar)
- **Production:** (configurar)

---

## 📚 Referências

- [Supabase Docs](https://supabase.com/docs)
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Docs](https://react.dev)

---

Última atualização: 2024-11-29
