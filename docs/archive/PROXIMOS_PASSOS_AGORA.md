# 🚀 PRÓXIMOS PASSOS - ChefIApp (Atualizado)

## ✅ O QUE JÁ FOI FEITO AGORA

1. ✅ Cliente Supabase consolidado
2. ✅ Segurança corrigida (.env limpo)
3. ✅ Store modular com Supabase criado (`useAppStore.v2.ts`)
4. ✅ Hook useTasks com queries reais melhorado
5. ✅ **Onboarding refatorado** em 3 componentes modulares:
   - `OnboardingContainer.tsx` - Container principal com state machine
   - `OnboardingAuth.tsx` - Tela de login/signup
   - `OnboardingJoin.tsx` - Entrar em empresa via QR/código

---

## 🎯 PRÓXIMO PASSO IMEDIATO (AGORA - 30min)

### 1. Migrar para Store v2 e Novo Onboarding

```bash
cd /Users/goldmonkey/Downloads/chefiapp---hospitality-intelligence

# 1. Backup do store atual
cp src/stores/useAppStore.ts src/stores/useAppStore.backup.ts

# 2. Usar novo store
mv src/stores/useAppStore.v2.ts src/stores/useAppStore.ts

# 3. Testar
npm run dev
```

### 2. Atualizar App.tsx

Abra `src/App.tsx` e substitua a importação do Onboarding:

```tsx
// ANTES (linha 6)
import Onboarding from './components/Onboarding';

// DEPOIS
import { OnboardingContainer } from './components/Onboarding';
```

E na linha ~60-68, substitua:

```tsx
// ANTES
if (!isAuthenticated || !user || showOnboarding) {
  return (
    <Onboarding
      onComplete={(data) => {
        setShowOnboarding(false);
      }}
    />
  );
}

// DEPOIS
if (!isAuthenticated || !user || showOnboarding) {
  return (
    <OnboardingContainer
      onComplete={(data) => {
        setShowOnboarding(false);
      }}
    />
  );
}
```

---

## 📋 CHECKLIST DE VALIDAÇÃO (15min)

Após migração, teste o seguinte:

```
□ npm run dev - App inicia sem erros
□ Console sem erros de import
□ Tela de login aparece
□ Botão "Google" funciona
□ Botão "Apple" funciona
□ Formulário de email/senha aparece
□ Criar conta mostra campos corretos
□ Após login, aparecem opções:
  □ "Criar Minha Empresa"
  □ "Entrar em uma Empresa"
```

---

## 🔧 SE DER ERRO

### Erro: "Cannot find module './components/Onboarding'"

**Causa:** Import antigo ainda ativo

**Solução:**
```bash
# Verificar se novos arquivos existem
ls src/components/Onboarding/

# Deve mostrar:
# OnboardingContainer.tsx
# OnboardingAuth.tsx
# OnboardingJoin.tsx
# index.ts
```

Se não existirem, os arquivos foram criados. Verifique que está importando corretamente.

---

### Erro: "useAppStore.syncTasks is not a function"

**Causa:** Store v2 não foi migrado corretamente

**Solução:**
```bash
# Verificar qual store está ativo
cat src/stores/useAppStore.ts | head -5

# Deve mostrar:
# // ChefIApp™ - Zustand Global Store v2.0
# // Modular architecture with Supabase integration
```

Se mostrar versão antiga, fazer migração manual:
```bash
rm src/stores/useAppStore.ts
cp src/stores/useAppStore.v2.ts src/stores/useAppStore.ts
```

---

### Erro de compilação TypeScript

**Solução:** Rebuild:
```bash
rm -rf node_modules/.vite
npm run dev
```

---

## ⏭️ DEPOIS DA MIGRAÇÃO (Hoje - 2h)

### Configurar Supabase Realtime

1. **Abrir Supabase Dashboard:**
   https://app.supabase.com

2. **Ir em Database → Replication**

3. **Executar no SQL Editor:**
```sql
-- Habilitar realtime para todas as tabelas
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE activities;
ALTER PUBLICATION supabase_realtime ADD TABLE check_ins;
```

4. **Criar Storage Bucket:**

Ir em **Storage → Create Bucket:**
- Nome: `task-photos`
- Public: ✅ Yes
- File size limit: 5MB

5. **Configurar Policies:**
```sql
-- No SQL Editor, executar:

-- Permitir upload autenticado
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'task-photos');

-- Permitir leitura pública
CREATE POLICY "Anyone can view task photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'task-photos');

-- Permitir usuários deletarem suas próprias fotos
CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'task-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 🧪 TESTAR INTEGRAÇÃO COMPLETA (30min)

### Fluxo de teste:

1. **Login:**
   ```
   ✓ Fazer login com Google ou criar conta com email
   ✓ Escolher "Criar Minha Empresa"
   ✓ Preencher dados da empresa
   ✓ Ver dashboard do owner aparecer
   ```

2. **Criar Tarefa:**
   ```
   ✓ Ir em "Tarefas" (aba de navegação)
   ✓ Clicar em "Nova Tarefa"
   ✓ Preencher: título, descrição, atribuir para si mesmo
   ✓ Ver tarefa aparecer na lista
   ```

3. **Check-in:**
   ```
   ✓ Fazer logout e login novamente
   ✓ Escolher "Entrar em Empresa" (se aplicável)
   ✓ Ver botão de check-in
   ✓ Clicar em "Iniciar Turno"
   ✓ Ver timer começar
   ```

4. **Completar Tarefa:**
   ```
   ✓ Ir em "Dashboard"
   ✓ Ver tarefa pendente
   ✓ Clicar em "Iniciar Tarefa"
   ✓ Ver timer da tarefa
   ✓ Clicar em "Completar Tarefa"
   ✓ Tirar foto
   ✓ Enviar
   ✓ Ver XP aumentar
   ```

5. **Verificar no Supabase:**
   ```
   ✓ Abrir Supabase Dashboard
   ✓ Ir em Table Editor → tasks
   ✓ Ver tarefa com status "done"
   ✓ Ver photo_proof preenchido
   ✓ Ir em Storage → task-photos
   ✓ Ver foto enviada
   ```

---

## 📊 ARQUIVOS MODIFICADOS/CRIADOS

### Criados:
```
src/stores/actions/
├── taskActions.ts
├── userActions.ts
├── notificationActions.ts
└── activityActions.ts

src/stores/
└── useAppStore.v2.ts

src/components/Onboarding/
├── OnboardingContainer.tsx
├── OnboardingAuth.tsx
├── OnboardingJoin.tsx
└── index.ts

docs/
├── CORRECTIONS_IMPLEMENTED.md
├── PROXIMOS_PASSOS_AGORA.md
└── .env.example
```

### Modificados:
```
src/lib/supabase.ts (consolidado)
src/hooks/useTasks.ts (syncTasks implementado)
.gitignore (regras de segurança)
.env (service key removida)
```

---

## 🎯 META PARA HOJE

**Objetivo:** App funcional com dados reais do Supabase

**Critérios de sucesso:**
- [ ] Login funciona
- [ ] Dashboard aparece
- [ ] Tarefas vêm do banco (não mockadas)
- [ ] Criar tarefa salva no Supabase
- [ ] Completar tarefa com foto funciona
- [ ] Storage recebe a foto
- [ ] XP atualiza no perfil

**Tempo estimado:** 2-3 horas

**Nível de dificuldade:** Médio

---

## 💡 DICAS

### Se o app não carregar dados:

1. **Verificar session:**
```tsx
// Adicionar em qualquer componente
useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    console.log('Session:', data.session);
  });
}, []);
```

2. **Verificar se tabelas existem:**
- Ir no Supabase → Table Editor
- Procurar: `profiles`, `tasks`, `companies`, `check_ins`
- Se não existirem, executar `supabase_schema.sql`

3. **Verificar RLS (Row Level Security):**
```sql
-- Desabilitar temporariamente para teste (NÃO usar em produção!)
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Após testar, reabilitar:
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

---

## 🎉 RESUMO

**Agora mesmo (30min):**
1. Migrar para Store v2
2. Atualizar App.tsx com novo Onboarding
3. Testar login

**Depois (2h):**
1. Configurar Realtime no Supabase
2. Criar bucket de fotos
3. Testar fluxo completo

**Resultado esperado:**
✅ App 100% funcional com dados reais do Supabase!

---

**Qualquer erro, verificar:**
- Console do navegador (F12)
- Terminal onde `npm run dev` está rodando
- Supabase Dashboard → Logs

Boa sorte! 🚀
