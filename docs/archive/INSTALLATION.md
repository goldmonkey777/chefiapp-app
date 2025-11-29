# ChefIApp™ - Guia de Instalação e Configuração

## 📦 INSTALAÇÃO DAS DEPENDÊNCIAS

### 1. Instalar Zustand e Utilitários

```bash
npm install zustand
npm install clsx tailwind-merge
```

### 2. Verificar package.json

Certifique-se de que seu `package.json` contém:

```json
{
  "dependencies": {
    "@capacitor/android": "^7.4.4",
    "@capacitor/cli": "^7.4.4",
    "@capacitor/core": "^7.4.4",
    "@capacitor/ios": "^7.4.4",
    "@google/genai": "^1.30.0",
    "@supabase/supabase-js": "^2.86.0",
    "clsx": "^2.1.0",
    "dotenv": "^17.2.3",
    "lucide-react": "^0.555.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "recharts": "^3.5.0",
    "tailwind-merge": "^2.2.0",
    "zustand": "^5.0.0"
  }
}
```

### 3. Instalar Todas as Dependências

```bash
npm install
```

---

## 🗄️ CONFIGURAÇÃO DO SUPABASE

### Passo 1: Criar Tabelas Faltando

Acesse o Supabase SQL Editor:
https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn/sql/new

**Execute este SQL:**

```sql
-- 1. Criar tabela companies
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('hotel', 'restaurant', 'bar', 'beach_club', 'other')),
  qr_code text UNIQUE NOT NULL,
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  total_employees integer DEFAULT 0,
  active_employees integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT companies_pkey PRIMARY KEY (id)
);

-- 2. Criar tabela check_ins
CREATE TABLE IF NOT EXISTS public.check_ins (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  check_in_time timestamp with time zone NOT NULL,
  check_out_time timestamp with time zone,
  location_lat decimal(10, 8),
  location_lng decimal(11, 8),
  duration integer,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT check_ins_pkey PRIMARY KEY (id)
);

-- 3. Criar tabela notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('task_assigned', 'task_completed', 'achievement', 'system')),
  title text NOT NULL,
  message text,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id)
);

-- 4. Criar tabela activities
CREATE TABLE IF NOT EXISTS public.activities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('check_in', 'check_out', 'task_completed', 'xp_gained', 'level_up', 'achievement_unlocked')),
  description text NOT NULL,
  xp_change integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT activities_pkey PRIMARY KEY (id)
);

-- 5. Criar tabela achievements
CREATE TABLE IF NOT EXISTS public.achievements (
  id text NOT NULL,
  name text NOT NULL,
  description text,
  icon text NOT NULL,
  xp integer NOT NULL,
  trigger_type text NOT NULL,
  trigger_value integer,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT achievements_pkey PRIMARY KEY (id)
);

-- 6. Criar tabela user_achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id text REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_achievements_pkey PRIMARY KEY (id),
  CONSTRAINT user_achievements_unique UNIQUE (user_id, achievement_id)
);

-- 7. Atualizar tabela profiles (adicionar campos faltando)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id),
  ADD COLUMN IF NOT EXISTS sector text,
  ADD COLUMN IF NOT EXISTS shift_status text DEFAULT 'offline',
  ADD COLUMN IF NOT EXISTS last_check_in timestamp with time zone,
  ADD COLUMN IF NOT EXISTS last_check_out timestamp with time zone,
  ADD COLUMN IF NOT EXISTS profile_photo text,
  ADD COLUMN IF NOT EXISTS auth_method text;

-- 8. Atualizar tabela tasks (adicionar campos faltando)
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id),
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS completed_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS photo_proof text,
  ADD COLUMN IF NOT EXISTS duration integer;
```

### Passo 2: Habilitar RLS

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
```

### Passo 3: Criar Políticas RLS

```sql
-- Policies para companies
CREATE POLICY "Users can view own company" ON public.companies
  FOR SELECT USING (
    owner_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND company_id = companies.id)
  );

CREATE POLICY "Owners can update own company" ON public.companies
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Owners can create companies" ON public.companies
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Policies para check_ins
CREATE POLICY "Users can view own check-ins" ON public.check_ins
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own check-ins" ON public.check_ins
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own check-ins" ON public.check_ins
  FOR UPDATE USING (user_id = auth.uid());

-- Policies para notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Policies para activities
CREATE POLICY "Users can view company activities" ON public.activities
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND company_id = activities.company_id)
  );

-- Policies para achievements
CREATE POLICY "Everyone can view achievements" ON public.achievements
  FOR SELECT USING (true);

-- Policies para user_achievements
CREATE POLICY "Users can view own achievements" ON public.user_achievements
  FOR SELECT USING (user_id = auth.uid());
```

### Passo 4: Inserir Conquistas Oficiais

```sql
INSERT INTO public.achievements (id, name, description, icon, xp, trigger_type, trigger_value) VALUES
('primeiro-dia', 'Primeiro Dia', 'Complete o onboarding', '🎉', 50, 'onboarding', 1),
('5-tarefas', '5 em 1', 'Complete 5 tarefas em 1 dia', '⚡', 75, 'daily_tasks', 5),
('foto-prova', 'Foto-Prova', 'Envie sua primeira foto', '📸', 50, 'first_photo', 1),
('primeira-semana', 'Primeira Semana', '7 dias consecutivos', '🔥', 100, 'streak', 7),
('velocidade', 'Velocidade', '10 tarefas rápidas (<5min)', '🚀', 150, 'fast_tasks', 10),
('nivel-5', 'Nível 5', 'Alcance o nível 5', '⭐', 200, 'level', 5),
('perfeccionista', 'Perfeccionista', '30 dias sem erros', '💎', 300, 'streak', 30),
('nivel-10', 'Nível 10', 'Alcance o nível 10', '👑', 400, 'level', 10),
('lider', 'Líder', '1º lugar por 7 dias', '🏆', 500, 'top_rank', 7)
ON CONFLICT (id) DO NOTHING;
```

### Passo 5: Criar Índices para Performance

```sql
-- Índices para companies
CREATE INDEX IF NOT EXISTS idx_companies_owner_id ON public.companies(owner_id);
CREATE INDEX IF NOT EXISTS idx_companies_qr_code ON public.companies(qr_code);

-- Índices para check_ins
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON public.check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_company_id ON public.check_ins(company_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_date ON public.check_ins(check_in_time DESC);

-- Índices para notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Índices para activities
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON public.activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_company_id ON public.activities(company_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON public.activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON public.activities(created_at DESC);

-- Índices para user_achievements
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON public.user_achievements(achievement_id);
```

---

## 🗂️ CONFIGURAR SUPABASE STORAGE

### 1. Criar Bucket para Fotos de Perfil

No Supabase Dashboard → Storage:

1. Criar novo bucket: `profile-photos`
2. Configurações:
   - Público: ✅ Sim
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`
   - Max file size: 2MB

**Policy:**

```sql
CREATE POLICY "Users can upload own profile photo" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view profile photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-photos');
```

### 2. Criar Bucket para Fotos de Tarefas

1. Criar novo bucket: `task-proofs`
2. Configurações:
   - Público: ❌ Não
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`
   - Max file size: 5MB

**Policy:**

```sql
CREATE POLICY "Users can upload task proofs" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'task-proofs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view company task proofs" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'task-proofs' AND
    EXISTS (
      SELECT 1 FROM public.profiles u1, public.profiles u2
      WHERE u1.id = auth.uid()
        AND u2.id::text = (storage.foldername(name))[1]
        AND u1.company_id = u2.company_id
    )
  );
```

---

## 🔧 ATUALIZAR CÓDIGO EXISTENTE

### 1. Atualizar Imports nos Componentes

**Antes:**
```typescript
import { User, Task } from './types';
```

**Depois:**
```typescript
import { User, Task } from './src/lib/types';
import { useAuth } from './src/hooks/useAuth';
import { useTasks } from './src/hooks/useTasks';
```

### 2. Substituir Estado Local por Hooks

**Antes (App.tsx):**
```typescript
const [user, setUser] = useState<User | null>(null);
const [session, setSession] = useState<any>(null);
```

**Depois:**
```typescript
const { user, isAuthenticated, isLoading } = useAuth();
```

### 3. Exemplo de Migração Completa

**Dashboard.tsx (Antes):**
```typescript
const [tasks, setTasks] = useState<Task[]>([]);

useEffect(() => {
  fetchTasks();
}, []);

const fetchTasks = async () => {
  const { data } = await supabase.from('tasks').select('*');
  setTasks(data || []);
};
```

**Dashboard.tsx (Depois):**
```typescript
const { user } = useAuth();
const {
  pendingTasks,
  inProgressTasks,
  startTask,
  completeTask
} = useTasks(user!.id);

const { isActive, checkIn, checkOut } = useCheckin(user!.id);
const { xp, level, progress } = useXP(user!.id);
const { streak, getStreakMessage } = useStreak(user!.id);
```

---

## ✅ VERIFICAÇÃO PÓS-INSTALAÇÃO

### 1. Verificar Dependências

```bash
npm list zustand
npm list clsx
npm list tailwind-merge
```

### 2. Verificar Tabelas no Supabase

Execute no SQL Editor:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deve retornar:
- ✅ activities
- ✅ achievements
- ✅ check_ins
- ✅ companies
- ✅ notifications
- ✅ profiles
- ✅ tasks
- ✅ user_achievements

### 3. Verificar Conquistas

```sql
SELECT id, name, xp FROM public.achievements;
```

Deve retornar 9 conquistas.

### 4. Testar Compilação

```bash
npm run build
```

Não deve ter erros de TypeScript.

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Migrar componentes para usar hooks
2. ✅ Implementar check-in/check-out com bloqueio no Dashboard
3. ✅ Implementar upload de fotos nas tarefas
4. ✅ Criar componente de Ranking
5. ✅ Criar componente de Conquistas
6. ✅ Implementar QR Code (geração e leitura)
7. ✅ Testar fluxo completo end-to-end

---

## 📞 SUPORTE

Em caso de problemas:

1. Verifique o console do navegador
2. Verifique o Supabase Dashboard (Database → Tables)
3. Verifique as policies RLS
4. Verifique os logs do Supabase (Logs → Postgres)

---

**ChefIApp™ - Hospitality Workforce Intelligence**
**Goldmonkey Studio LLC**
