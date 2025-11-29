# 🛠️ ChefIApp - Development Guide

## 📋 Table of Contents

- [Development Environment](#development-environment)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Debugging](#debugging)
- [Common Tasks](#common-tasks)

---

## 🔧 Development Environment

### Prerequisites

```bash
# Node.js 18+
node --version  # Should be 18.x or higher

# npm 9+
npm --version

# Git
git --version
```

### IDE Setup

**Recommended:** VSCode with extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- i18n Ally

**VSCode Settings:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## 🚀 Running the App

### Web Development

```bash
# Start dev server
npm run dev

# Opens at http://localhost:5173
# Hot reload enabled
```

### iOS Development

```bash
# Build web assets
npm run build

# Sync to iOS
npx cap sync ios

# Open Xcode
npx cap open ios

# Or run directly
npm run ios
```

### Android Development

```bash
# Build web assets
npm run build

# Sync to Android
npx cap sync android

# Open Android Studio
npx cap open android

# Or run directly
npm run android
```

---

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Onboarding/      # Modular onboarding flow
│   ├── TaskManagement/  # Task CRUD components
│   └── ...
│
├── pages/               # Main dashboard pages
│   ├── EmployeeDashboard.tsx
│   ├── ManagerDashboard.tsx
│   └── OwnerDashboard.tsx
│
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication
│   ├── useTasks.ts      # Task management
│   ├── useCheckin.ts    # Check-in/out
│   └── ...
│
├── stores/              # Zustand state management
│   ├── useAppStore.ts   # Main store
│   └── actions/         # Modular actions
│       ├── taskActions.ts
│       ├── userActions.ts
│       ├── notificationActions.ts
│       └── activityActions.ts
│
├── lib/                 # Core utilities
│   ├── supabase.ts      # Supabase client
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Helper functions
│
└── locales/             # i18n translations
    ├── pt/translation.json
    ├── en/translation.json
    └── ...
```

---

## 🔄 Development Workflow

### 1. Starting a New Feature

```bash
# Create feature branch
git checkout -b feature/task-comments

# Install any new dependencies
npm install

# Start dev server
npm run dev
```

### 2. Making Changes

**Component Development:**
```tsx
// 1. Create component
// src/components/TaskComments/TaskComments.tsx

import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';

interface TaskCommentsProps {
  taskId: string;
}

export const TaskComments = ({ taskId }: TaskCommentsProps) => {
  const { addComment } = useAppStore();
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    await addComment(taskId, comment);
    setComment('');
  };

  return (
    <div className="space-y-4">
      {/* Component UI */}
    </div>
  );
};
```

**Store Action:**
```typescript
// 2. Add store action
// src/stores/actions/taskActions.ts

addComment: async (taskId: string, content: string) => {
  const { currentUser } = get();

  const { data, error } = await supabase
    .from('task_comments')
    .insert({
      task_id: taskId,
      user_id: currentUser?.id,
      content,
    })
    .select()
    .single();

  if (error) throw error;

  // Update local state
  const { tasks } = get();
  set({
    tasks: tasks.map(t =>
      t.id === taskId
        ? { ...t, comments: [...(t.comments || []), data] }
        : t
    )
  });
},
```

**Database Migration:**
```sql
-- 3. Create migration
-- supabase/migrations/006_task_comments.sql

CREATE TABLE task_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
CREATE POLICY "Users can view comments on their tasks"
ON task_comments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM tasks
    WHERE tasks.id = task_comments.task_id
    AND (tasks.assigned_to = auth.uid() OR tasks.created_by = auth.uid())
  )
);
```

### 3. Testing Changes

```bash
# Run linter
npm run lint

# Type check
npm run type-check

# Build test
npm run build

# Mobile sync test
npx cap sync ios
npx cap sync android
```

### 4. Committing

```bash
# Stage changes
git add .

# Commit with conventional commits
git commit -m "feat: add task comments functionality"

# Push to remote
git push origin feature/task-comments
```

---

## 📏 Code Standards

### TypeScript

```typescript
// ✅ Good: Explicit types
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = (id: string): Promise<User> => {
  // ...
};

// ❌ Bad: Implicit any
const getUser = (id) => {
  // ...
};
```

### React Components

```tsx
// ✅ Good: Functional component with types
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button = ({
  label,
  onClick,
  variant = 'primary'
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
};

// ❌ Bad: No types, unclear props
export const Button = (props) => {
  return <button onClick={props.onClick}>{props.label}</button>;
};
```

### Naming Conventions

```typescript
// Components: PascalCase
export const TaskCard = () => {};

// Files: PascalCase for components
TaskCard.tsx

// Hooks: camelCase with 'use' prefix
export const useTaskFilters = () => {};

// Constants: UPPER_SNAKE_CASE
export const MAX_TASK_TITLE_LENGTH = 100;

// Functions: camelCase
export const calculateXP = (task: Task) => {};

// Interfaces/Types: PascalCase
interface TaskFilter {}
type UserRole = 'employee' | 'manager' | 'owner';
```

### Imports

```typescript
// Order: React → Libraries → Local
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/stores/useAppStore';
import { TaskCard } from '@/components/TaskCard';
import type { Task } from '@/lib/types';
```

---

## 🧪 Testing

### Unit Tests (Vitest)

```typescript
// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { calculateLevel } from './utils';

describe('calculateLevel', () => {
  it('should return level 1 for 0 XP', () => {
    expect(calculateLevel(0)).toBe(1);
  });

  it('should return level 2 for 100 XP', () => {
    expect(calculateLevel(100)).toBe(2);
  });

  it('should return level 3 for 400 XP', () => {
    expect(calculateLevel(400)).toBe(3);
  });
});
```

### Component Tests

```typescript
// src/components/TaskCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from './TaskCard';

describe('TaskCard', () => {
  it('should render task title', () => {
    const task = { id: '1', title: 'Test Task' };
    render(<TaskCard task={task} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should call onStart when start button clicked', () => {
    const onStart = vi.fn();
    const task = { id: '1', title: 'Test Task' };
    render(<TaskCard task={task} onStart={onStart} />);

    fireEvent.click(screen.getByText('Start'));
    expect(onStart).toHaveBeenCalledWith('1');
  });
});
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## 🐛 Debugging

### Browser DevTools

```typescript
// Console debugging
console.log('User:', user);
console.table(tasks);
console.dir(supabase);

// React DevTools
// Install React DevTools extension
// Inspect component props/state
```

### Supabase Debugging

```typescript
// Enable query logging
const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .eq('id', taskId);

console.log('Query result:', { data, error });

// Check auth state
const { data: { session } } = await supabase.auth.getSession();
console.log('Current session:', session);
```

### Mobile Debugging

**iOS:**
```bash
# Open Safari → Develop → Simulator → localhost
# Or use Xcode console
```

**Android:**
```bash
# Chrome DevTools
chrome://inspect

# Or Android Studio Logcat
```

### Network Debugging

```typescript
// Monitor Supabase calls
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event, session);
});

// Check realtime subscriptions
const channel = supabase
  .channel('tasks')
  .on('postgres_changes', { ... }, (payload) => {
    console.log('Realtime update:', payload);
  })
  .subscribe((status) => {
    console.log('Subscription status:', status);
  });
```

---

## 🎯 Common Tasks

### Adding a New Screen

```bash
# 1. Create page component
touch src/pages/ReportsPage.tsx

# 2. Add route in App.tsx
# 3. Add navigation link
# 4. Add i18n translations
```

### Adding a New Database Table

```bash
# 1. Create migration
touch supabase/migrations/007_new_table.sql

# 2. Write SQL
# 3. Execute in Supabase SQL Editor
# 4. Update types.ts
# 5. Add store actions
# 6. Create hook
```

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update specific package
npm update @supabase/supabase-js

# Update all packages
npm update

# Rebuild after updates
npm run build
npx cap sync
```

### Building for Production

```bash
# Web
npm run build
# Output: dist/

# iOS
npm run build
npx cap sync ios
npx cap open ios
# Archive in Xcode

# Android
npm run build
npx cap sync android
npx cap open android
# Build → Generate Signed Bundle
```

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Documentation](https://react.dev)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

---

## 🆘 Getting Help

- **Architecture:** See `docs/ARCHITECTURE.md`
- **Troubleshooting:** See `docs/TROUBLESHOOTING.md`
- **Quick Start:** See `docs/QUICKSTART.md`

---

Last updated: 2025-11-29
