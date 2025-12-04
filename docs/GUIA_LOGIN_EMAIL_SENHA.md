# 🔐 Guia Completo: Login com Email e Senha até Dashboard do Funcionário

**Passo a passo detalhado para fazer login e chegar ao dashboard**

---

## 📋 Pré-requisitos

1. ✅ App rodando no Xcode (simulador ou dispositivo)
2. ✅ Supabase configurado e funcionando
3. ✅ Conta de usuário criada no Supabase (ou criar durante o processo)

---

## 🚀 Passo a Passo Completo

### **PASSO 1: Abrir o App**

1. No Xcode, pressione `Cmd+R` para executar o app
2. Aguarde o app carregar no simulador
3. Você verá a tela de **Onboarding/Login**

---

### **PASSO 2: Tela de Login/Signup**

O app mostrará uma tela com duas opções:

#### **Opção A: Criar Nova Conta (Signup)**

1. **Preencher o formulário:**
   - **Nome:** Digite seu nome completo (ex: "João Silva")
   - **Email:** Digite um email válido (ex: "joao@exemplo.com")
   - **Senha:** Digite uma senha (mínimo 6 caracteres)
   - **Role:** Selecione "Funcionário" (EMPLOYEE)

2. **Clicar em "Criar Conta"** ou botão equivalente

3. **Aguardar criação:**
   - O app criará a conta no Supabase
   - Um perfil será criado automaticamente na tabela `profiles`
   - Você será redirecionado automaticamente

#### **Opção B: Fazer Login (se já tem conta)**

1. **Alternar para modo "Login":**
   - Clique em "Já tenho conta" ou similar
   - O formulário mudará para modo login

2. **Preencher credenciais:**
   - **Email:** Digite o email cadastrado
   - **Senha:** Digite a senha

3. **Clicar em "Entrar"** ou botão equivalente

---

### **PASSO 3: Verificação de Perfil**

Após autenticação bem-sucedida:

1. **O app verificará se você tem perfil:**
   - Se não tiver, criará automaticamente
   - Se tiver, carregará os dados

2. **Verificação de empresa:**
   - O app verifica se você tem `company_id` associado
   - Se **NÃO tiver empresa**, você verá opções:
     - **"Criar Minha Empresa"** → Vai para onboarding de empresa
     - **"Entrar em uma Empresa"** → Vai para QR Code scanner

---

### **PASSO 4: Associar-se a uma Empresa**

Se você não tem empresa associada, precisa entrar em uma:

#### **Opção 1: Via QR Code (Recomendado)**

1. **Escolher "Entrar em uma Empresa"**
2. **Escolher "Escanear QR Code"**
3. **Permitir acesso à câmera** (quando solicitado)
4. **Escanear o QR Code** fornecido pelo dono/gerente da empresa
5. **Aguardar associação:**
   - O app atualizará seu perfil com `company_id`
   - Você será redirecionado para o dashboard

#### **Opção 2: Via Código de Convite**

1. **Escolher "Entrar em uma Empresa"**
2. **Escolher "Inserir Código"**
3. **Digitar o código** fornecido pelo dono/gerente
4. **Confirmar**
5. **Aguardar associação**

---

### **PASSO 5: Dashboard do Funcionário**

Após associar-se a uma empresa, você será redirecionado para o **Employee Dashboard**:

#### **O que você verá:**

1. **Header:**
   - Saudação personalizada: "Bom dia, [Seu Nome]! 👋"
   - Botão de notificações (sino)
   - Botão de configurações (engrenagem)

2. **Card de Turno (Azul):**
   - Status: "Turno Offline"
   - Botão: "INICIAR TURNO"
   - Informação sobre geolocalização

3. **Card de Progresso (Branco):**
   - Nível atual (ex: "Nível 1")
   - XP Total (ex: "0 XP")
   - Barra de progresso para próximo nível
   - XP restante para subir de nível

4. **Lista de Tarefas:**
   - Tarefas pendentes atribuídas a você
   - Tarefas em progresso
   - Tarefas completadas

5. **Navegação Inferior:**
   - **Início** (Dashboard) - selecionado
   - **Tarefas** - Lista completa de tarefas
   - **Escala** - Calendário de turnos
   - **Ranking** - Leaderboard da empresa
   - **Conquistas** - Badges e achievements
   - **Perfil** - Seu perfil e estatísticas

---

## 🔍 Verificando se Funcionou

### **Sinais de Sucesso:**

✅ Você vê a saudação com seu nome  
✅ O card de turno aparece  
✅ Você vê seu nível e XP  
✅ A navegação inferior está visível  
✅ Não há mensagens de erro

### **Se Algo Der Errado:**

❌ **Tela branca:**
- Verifique console do Xcode para erros
- Verifique se o build web está atualizado: `npm run build`

❌ **Erro de autenticação:**
- Verifique se o email/senha estão corretos
- Verifique se signups estão habilitados no Supabase

❌ **Erro ao carregar perfil:**
- Verifique se o perfil foi criado na tabela `profiles`
- Verifique logs no console do Xcode

❌ **Não consigo entrar na empresa:**
- Verifique se o QR Code é válido
- Verifique se você tem permissão para entrar na empresa

---

## 🛠️ Criando Usuário de Teste Manualmente

Se precisar criar um usuário diretamente no Supabase:

### **Via Supabase Dashboard:**

1. Acesse: `https://supabase.com/dashboard/project/{seu-projeto}/auth/users`
2. Clique em **"Add user"** → **"Create new user"**
3. Preencha:
   - **Email:** ex: `funcionario@teste.com`
   - **Password:** ex: `senha123`
   - **Auto Confirm User:** ✅ (marcar)
4. Clique em **"Create user"**

### **Criar Perfil Manualmente:**

Execute no SQL Editor do Supabase:

```sql
-- Substitua {USER_ID} pelo ID do usuário criado acima
INSERT INTO public.profiles (
  id,
  name,
  email,
  role,
  xp,
  level,
  streak,
  shift_status
) VALUES (
  '{USER_ID}',  -- ID do usuário do auth.users
  'Funcionário Teste',
  'funcionario@teste.com',
  'employee',
  0,
  1,
  0,
  'offline'
);
```

### **Associar a uma Empresa:**

```sql
-- Substitua {USER_ID} e {COMPANY_ID}
UPDATE public.profiles
SET company_id = '{COMPANY_ID}'
WHERE id = '{USER_ID}';
```

---

## 📱 Testando no Simulador

### **Passos no Xcode:**

1. **Executar app:** `Cmd+R`
2. **Aguardar carregamento**
3. **Preencher formulário de login**
4. **Fazer login**
5. **Verificar dashboard**

### **Logs Úteis:**

No console do Xcode, procure por:

```
🔗 [useAuth] Authenticating user...
✅ [useAuth] User authenticated successfully
🔗 [fetchProfile] Buscando perfil para userId: ...
✅ [fetchProfile] Profile loaded successfully
🎯 [OnboardingAuth] User autenticado detectado
```

---

## 🎯 Fluxo Completo Visual

```
1. Abrir App
   ↓
2. Tela de Login/Signup
   ├─ Signup → Criar conta → Perfil criado automaticamente
   └─ Login → Autenticar → Carregar perfil existente
   ↓
3. Verificar company_id
   ├─ TEM empresa → Dashboard ✅
   └─ NÃO TEM empresa → Escolher caminho
       ├─ Criar Empresa → Onboarding (8 telas)
       └─ Entrar em Empresa → QR Code/Código → Dashboard ✅
   ↓
4. Employee Dashboard 🎉
   ├─ Card de Turno
   ├─ Progresso (XP/Level)
   ├─ Lista de Tarefas
   └─ Navegação Inferior
```

---

## 💡 Dicas Importantes

1. **Primeira vez:**
   - Se for criar conta nova, escolha "Signup"
   - Preencha todos os campos obrigatórios
   - Role deve ser "Funcionário" (EMPLOYEE)

2. **Login subsequente:**
   - O app salva email no localStorage
   - Você só precisa digitar a senha

3. **Empresa:**
   - Se você é funcionário, precisa de um QR Code ou código
   - Peça ao dono/gerente da empresa
   - Ou crie uma empresa de teste primeiro

4. **Dashboard:**
   - Você precisa iniciar um turno para ver tarefas
   - Clique em "INICIAR TURNO" no card azul

---

## 🐛 Troubleshooting

### **Problema: "Signups not allowed"**

**Solução:**
1. Acesse Supabase Dashboard
2. Vá em: **Authentication → Settings → User Signups**
3. Habilite: **"Allow new users to sign up"**

### **Problema: "Profile not found"**

**Solução:**
- O perfil deve ser criado automaticamente
- Se não criar, verifique se a função `handle_new_user()` está configurada no Supabase
- Execute: `supabase/COMPLETE_SETUP.sql` se necessário

### **Problema: "Cannot read property 'name' of null"**

**Solução:**
- Verifique se o perfil foi criado corretamente
- Verifique logs no console do Xcode
- Tente fazer logout e login novamente

---

## ✅ Checklist Final

Antes de testar, verifique:

- [ ] App está rodando no Xcode
- [ ] Supabase está configurado
- [ ] Signups estão habilitados no Supabase
- [ ] Build web está atualizado (`npm run build`)
- [ ] Capacitor está sincronizado (`npx cap sync ios`)

---

**Made with ❤️ by [goldmonkey.studio](https://goldmonkey.studio)**

