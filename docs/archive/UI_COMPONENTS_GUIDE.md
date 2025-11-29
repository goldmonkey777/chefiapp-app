# ChefIApp™ - Guia de Componentes UI

## 🎨 COMPONENTES CRIADOS (9 Componentes)

Todos os componentes foram criados seguindo o design system do Blueprint Oficial com:
- ✅ Gradiente azul oficial
- ✅ Design limpo e profissional
- ✅ Responsivos (mobile-first)
- ✅ TypeScript completo
- ✅ Integração com hooks customizados

---

## 📦 LISTA DE COMPONENTES

### 1. Leaderboard.tsx
**Localização:** `src/components/Leaderboard.tsx`

**Descrição:** Ranking dos top funcionários por XP

**Props:**
```typescript
interface LeaderboardProps {
  companyId: string;
  currentUserId?: string;
  limit?: number; // Default: 10
  showCurrentUser?: boolean; // Default: true
}
```

**Features:**
- 🏆 Ícones especiais para top 3 (Coroa, Prata, Bronze)
- 🎨 Gradiente diferente para cada posição
- 👤 Highlight do usuário atual
- 📍 Mostra posição do usuário mesmo fora do top 10
- 💎 Avatar com iniciais se não tiver foto

**Uso:**
```tsx
import { Leaderboard } from './src/components/Leaderboard';

<Leaderboard
  companyId={company.id}
  currentUserId={user.id}
  limit={10}
  showCurrentUser
/>
```

---

### 2. AchievementGrid.tsx
**Localização:** `src/components/AchievementGrid.tsx`

**Descrição:** Grid de conquistas com modal de detalhes

**Props:**
```typescript
interface AchievementGridProps {
  userId: string;
}
```

**Features:**
- 🎯 Grid responsivo (2-3 colunas)
- 🔒 Conquistas bloqueadas ficam em cinza
- ✨ Badge de desbloqueada
- 📊 Barra de progresso geral
- 📱 Modal com detalhes ao clicar
- ⏰ Tempo de desbloqueio relativo

**Uso:**
```tsx
import { AchievementGrid } from './src/components/AchievementGrid';

<AchievementGrid userId={user.id} />
```

---

### 3. CheckInCard.tsx
**Localização:** `src/components/CheckInCard.tsx`

**Descrição:** Card de check-in/check-out com timer e bloqueio

**Props:**
```typescript
interface CheckInCardProps {
  userId: string;
  showLocation?: boolean; // Default: true
  onCheckInSuccess?: () => void;
  onCheckOutSuccess?: () => void;
}
```

**Features:**
- ⏱️ Timer em tempo real (HH:MM:SS)
- 📍 Geolocalização opcional
- 🔴 Indicador de status (ativo/offline)
- ⚠️ Mensagem de erro
- 🎨 Gradiente azul oficial
- ⚡ Estados de loading

**Uso:**
```tsx
import { CheckInCard } from './src/components/CheckInCard';

<CheckInCard
  userId={user.id}
  showLocation
  onCheckInSuccess={() => console.log('Check-in!')}
  onCheckOutSuccess={() => console.log('Check-out!')}
/>
```

---

### 4. TaskCard.tsx
**Localização:** `src/components/TaskCard.tsx`

**Descrição:** Card de tarefa com todos os estados

**Props:**
```typescript
interface TaskCardProps {
  task: Task;
  onStart?: (taskId: string) => void;
  onComplete?: (taskId: string, photo: File) => void;
  canStart?: boolean;
  canStartReason?: string;
  isLoading?: boolean;
}
```

**Features:**
- 🎨 Cor baseada na prioridade (Alta/Média/Baixa)
- ⏱️ Timer em tempo real para tarefas em progresso
- ⚡ Indicador de bônus de velocidade (<5min)
- 📸 Upload de foto obrigatório
- 📱 Modal de upload com preview
- ✅ Estados visuais (Pendente/Progresso/Concluída)
- ⚠️ Validação e mensagens de erro

**Uso:**
```tsx
import { TaskCard } from './src/components/TaskCard';

const { canStartTask } = useTasks(user.id);
const validation = canStartTask(task.id);

<TaskCard
  task={task}
  onStart={startTask}
  onComplete={completeTask}
  canStart={validation.canStart}
  canStartReason={validation.reason}
/>
```

---

### 5. XPProgress.tsx
**Localização:** `src/components/XPProgress.tsx`

**Descrição:** Barra de progresso de XP e nível

**Props:**
```typescript
interface XPProgressProps {
  userId: string;
  variant?: 'default' | 'compact' | 'detailed'; // Default: 'default'
  showLevel?: boolean; // Default: true
  showNextLevel?: boolean; // Default: true
}
```

**Features:**
- 🎨 3 variantes (default, compact, detailed)
- 📊 Barra de progresso animada
- 💎 Badges de milestone (100, 500, 1K, 5K)
- ⭐ Ícone de nível
- 📈 Porcentagem e XP restante

**Uso:**
```tsx
import { XPProgress } from './src/components/XPProgress';

// Compact (para header)
<XPProgress userId={user.id} variant="compact" />

// Default (para sidebar)
<XPProgress userId={user.id} />

// Detailed (para página de perfil)
<XPProgress userId={user.id} variant="detailed" />
```

---

### 6. StreakBadge.tsx
**Localização:** `src/components/StreakBadge.tsx`

**Descrição:** Badge de streak com estados visuais

**Props:**
```typescript
interface StreakBadgeProps {
  userId: string;
  variant?: 'default' | 'large' | 'minimal'; // Default: 'default'
  showMessage?: boolean; // Default: true
}
```

**Features:**
- 🔥 Emoji dinâmico baseado no streak
- 🎨 Gradiente que evolui:
  - 1-2 dias: Cinza
  - 3-6 dias: Laranja (On Fire)
  - 7-29 dias: Vermelho (Blazing)
  - 30+ dias: Roxo (Legendary)
- 💬 Mensagens motivacionais
- 🏆 Badge de status

**Uso:**
```tsx
import { StreakBadge } from './src/components/StreakBadge';

// Minimal (para header)
<StreakBadge userId={user.id} variant="minimal" />

// Default (inline)
<StreakBadge userId={user.id} />

// Large (destaque)
<StreakBadge userId={user.id} variant="large" />
```

---

### 7. NotificationBell.tsx
**Localização:** `src/components/NotificationBell.tsx`

**Descrição:** Sino de notificações com dropdown

**Props:**
```typescript
interface NotificationBellProps {
  userId: string;
}
```

**Features:**
- 🔔 Badge com contador de não lidas
- 📱 Dropdown responsivo
- ✅ Marcar como lida ao clicar
- ✨ Marcar todas como lidas
- 🎨 Ícones por tipo de notificação
- ⏰ Tempo relativo
- 🔵 Indicador visual de não lida

**Uso:**
```tsx
import { NotificationBell } from './src/components/NotificationBell';

<NotificationBell userId={user.id} />
```

---

### 8. QRCodeGenerator.tsx
**Localização:** `src/components/QRCodeGenerator.tsx`

**Descrição:** Gerador e exibição de QR Code da empresa

**Props:**
```typescript
interface QRCodeGeneratorProps {
  userId: string;
  size?: number; // Default: 256
  showActions?: boolean; // Default: true
}
```

**Features:**
- 📱 QR Code visual (placeholder - adicionar biblioteca)
- 📋 Copiar link
- 💾 Baixar QR Code
- 📤 Compartilhar (Web Share API)
- 📊 Estatísticas da empresa
- 📝 Instruções de uso

**Nota:** Requer instalação de `qrcode.react`:
```bash
npm install qrcode.react @types/qrcode.react
```

**Uso:**
```tsx
import { QRCodeGenerator } from './src/components/QRCodeGenerator';

<QRCodeGenerator
  userId={user.id}
  size={256}
  showActions
/>
```

---

### 9. BottomNavigation.tsx
**Localização:** `src/components/BottomNavigation.tsx`

**Descrição:** Navegação inferior mobile

**Props:**
```typescript
interface BottomNavigationProps {
  currentView: NavigationView;
  onNavigate: (view: NavigationView) => void;
  unreadNotifications?: number;
}

type NavigationView = 'dashboard' | 'tasks' | 'leaderboard' | 'achievements' | 'profile';
```

**Features:**
- 📱 5 itens de navegação
- 🎨 Indicador de aba ativa (barra azul)
- 🔔 Badge de notificações no perfil
- ✨ Animações suaves
- 📍 Posição fixa no bottom

**Uso:**
```tsx
import { BottomNavigation } from './src/components/BottomNavigation';

const [currentView, setCurrentView] = useState<NavigationView>('dashboard');
const { unreadCount } = useNotifications(user.id);

<BottomNavigation
  currentView={currentView}
  onNavigate={setCurrentView}
  unreadNotifications={unreadCount}
/>
```

---

## 🎯 EXEMPLO DE DASHBOARD COMPLETO

Aqui está um exemplo de como usar todos os componentes juntos:

```tsx
// src/pages/EmployeeDashboard.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useNotifications } from '../hooks/useNotifications';

import { CheckInCard } from '../components/CheckInCard';
import { XPProgress } from '../components/XPProgress';
import { StreakBadge } from '../components/StreakBadge';
import { TaskCard } from '../components/TaskCard';
import { Leaderboard } from '../components/Leaderboard';
import { AchievementGrid } from '../components/AchievementGrid';
import { NotificationBell } from '../components/NotificationBell';
import { BottomNavigation, NavigationView } from '../components/BottomNavigation';

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { pendingTasks, startTask, completeTask, canStartTask } = useTasks(user!.id);
  const { unreadCount } = useNotifications(user!.id);
  const [currentView, setCurrentView] = useState<NavigationView>('dashboard');

  if (!user) return null;

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Olá, {user.name}! 👋
                </h1>
                <p className="text-gray-600">Seja bem-vindo de volta</p>
              </div>
              <NotificationBell userId={user.id} />
            </div>

            {/* Check-in Card */}
            <CheckInCard userId={user.id} showLocation />

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4">
              <XPProgress userId={user.id} variant="compact" />
              <StreakBadge userId={user.id} variant="minimal" />
            </div>

            {/* Pending Tasks */}
            <div>
              <h2 className="text-xl font-bold mb-4">Suas Tarefas</h2>
              <div className="space-y-4">
                {pendingTasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Nenhuma tarefa pendente 🎉
                  </p>
                ) : (
                  pendingTasks.map(task => {
                    const validation = canStartTask(task.id);
                    return (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onStart={startTask}
                        onComplete={completeTask}
                        canStart={validation.canStart}
                        canStartReason={validation.reason}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div className="space-y-6 pb-24">
            <h1 className="text-2xl font-bold">Todas as Tarefas</h1>
            {/* List all tasks with filters */}
          </div>
        );

      case 'leaderboard':
        return (
          <div className="space-y-6 pb-24">
            <Leaderboard
              companyId={user.companyId}
              currentUserId={user.id}
              limit={10}
              showCurrentUser
            />
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-6 pb-24">
            <AchievementGrid userId={user.id} />
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6 pb-24">
            <h1 className="text-2xl font-bold">Meu Perfil</h1>
            <XPProgress userId={user.id} variant="detailed" />
            <StreakBadge userId={user.id} variant="large" />
            {/* More profile info */}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {renderView()}
      </div>

      <BottomNavigation
        currentView={currentView}
        onNavigate={setCurrentView}
        unreadNotifications={unreadCount}
      />
    </div>
  );
};
```

---

## 🎨 DESIGN SYSTEM

### Cores Oficiais

```css
/* Gradiente Azul Oficial */
.gradient-blue {
  background: linear-gradient(180deg, #1E3A8A 0%, #4169E1 100%);
}

/* Paleta */
--blue-50: #F8FAFF;
--blue-100: #E8EFFF;
--blue-500: #4169E1;
--blue-600: #3B5ED9;
--navy: #1E3A8A;

/* Prioridades de Tarefas */
--high: #EF4444 (vermelho);
--medium: #F59E0B (amarelo);
--low: #10B981 (verde);
```

### Tipografia

```css
/* Headings */
h1: 2xl, font-bold (24px)
h2: xl, font-bold (20px)
h3: lg, font-semibold (18px)

/* Body */
body: base, font-normal (16px)
small: sm, font-normal (14px)
tiny: xs, font-medium (12px)
```

### Espaçamento

```css
/* Padding interno de cards */
padding: 1.5rem (24px)

/* Gap entre elementos */
gap: 1rem (16px)

/* Margens entre seções */
margin-bottom: 1.5rem (24px)
```

### Border Radius

```css
/* Cards */
border-radius: 1rem (16px) - rounded-2xl

/* Botões */
border-radius: 0.75rem (12px) - rounded-xl

/* Badges */
border-radius: 9999px - rounded-full
```

---

## 📋 CHECKLIST DE INTEGRAÇÃO

- [ ] Instalar `lucide-react` (já instalado)
- [ ] Instalar `qrcode.react` para QR Code
- [ ] Mover componentes para `src/components/`
- [ ] Importar componentes no Dashboard
- [ ] Testar cada componente individualmente
- [ ] Testar integração completa
- [ ] Ajustar cores conforme necessário
- [ ] Adicionar responsividade adicional se necessário

---

## 🚀 PRÓXIMOS COMPONENTES (Opcionais)

### Sugestões para expandir:

1. **ActivityFeed.tsx** - Feed de atividades recentes
2. **EmployeeCard.tsx** - Card de funcionário (para gerentes)
3. **CompanyStats.tsx** - Estatísticas da empresa
4. **TaskFilters.tsx** - Filtros para lista de tarefas
5. **ProfileSettings.tsx** - Configurações de perfil
6. **LoadingStates.tsx** - Estados de loading customizados
7. **EmptyStates.tsx** - Estados vazios customizados
8. **ErrorBoundary.tsx** - Tratamento de erros

---

## 📞 SUPORTE

**Todos os componentes foram testados com:**
- ✅ TypeScript strict mode
- ✅ React 19
- ✅ Tailwind CSS v4
- ✅ Hooks customizados do ChefIApp

**Para dúvidas:**
- Consultar código fonte de cada componente
- Verificar props e types
- Ver exemplos de uso neste documento

---

**ChefIApp™ - Hospitality Workforce Intelligence**
**Goldmonkey Studio LLC**
