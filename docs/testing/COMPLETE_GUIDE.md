# 🧪 GUIA DE TESTES COMPLETOS - ChefIApp™

**Objetivo:** Verificar se todas as funcionalidades estão funcionando corretamente após a configuração do Supabase.

---

## 📋 CHECKLIST DE TESTES

### ✅ Pré-requisitos
- [ ] App buildado (`npm run build`)
- [ ] Capacitor sincronizado (`npx cap sync ios`)
- [ ] Xcode aberto com projeto
- [ ] Simulador/dispositivo pronto

---

## 1. 🔐 TESTE DE AUTENTICAÇÃO

### 1.1 Criar Conta com Email/Senha

**Passos:**
1. Abra o app no simulador
2. Clique em "Criar conta" ou "Sign up"
3. Preencha:
   - Email: `teste@chefiapp.com`
   - Senha: `Teste123!`
   - Nome: `Usuário Teste`
4. Clique em "Criar conta"

**Resultado Esperado:**
- ✅ Conta criada com sucesso
- ✅ Email de confirmação enviado (verificar inbox)
- ✅ Redirecionamento para tela de login ou dashboard

**Verificar no Supabase:**
- Vá em **Authentication → Users**
- Deve ver o novo usuário listado
- Status: "Unconfirmed" (até confirmar email)

---

### 1.2 Confirmar Email

**Passos:**
1. Abra o email de confirmação
2. Clique no link de confirmação
3. Deve redirecionar para o app ou site

**Resultado Esperado:**
- ✅ Email confirmado
- ✅ Status muda para "Confirmed" no Supabase

---

### 1.3 Login com Email/Senha

**Passos:**
1. No app, clique em "Login"
2. Digite:
   - Email: `teste@chefiapp.com`
   - Senha: `Teste123!`
3. Clique em "Entrar"

**Resultado Esperado:**
- ✅ Login bem-sucedido
- ✅ Redirecionamento para dashboard
- ✅ Perfil criado automaticamente em `profiles`

**Verificar no Supabase:**
- Vá em **Table Editor → profiles**
- Deve ver o perfil do usuário criado
- Campos: `id`, `name`, `email`, `xp`, `level`, etc.

---

### 1.4 Login com Google (Se Configurado)

**Passos:**
1. No app, clique em "Login com Google"
2. Selecione conta Google
3. Autorize o app

**Resultado Esperado:**
- ✅ Redirecionamento correto (`chefiapp://auth/callback`)
- ✅ Login bem-sucedido
- ✅ Perfil criado automaticamente

---

### 1.5 Login com Apple (Se Configurado)

**Passos:**
1. No app, clique em "Login com Apple"
2. Autorize com Face ID/Touch ID
3. Confirme

**Resultado Esperado:**
- ✅ Redirecionamento correto
- ✅ Login bem-sucedido
- ✅ Perfil criado automaticamente

---

## 2. 📦 TESTE DE STORAGE

### 2.1 Upload de Logo da Empresa

**Passos:**
1. Faça login no app
2. Vá para criação de empresa (onboarding)
3. Na tela de dados da empresa, clique em "Upload Logo"
4. Selecione uma imagem (ex: logo.png)
5. Aguarde upload

**Resultado Esperado:**
- ✅ Upload bem-sucedido
- ✅ Imagem aparece no preview
- ✅ URL da imagem salva no campo `logo_url`

**Verificar no Supabase:**
- Vá em **Storage → company-assets**
- Deve ver o arquivo uploadado
- Verifique se está privado (não acessível publicamente)

---

### 2.2 Verificar Permissões do Bucket

**Passos:**
1. No Supabase Dashboard, vá em **Storage → company-assets**
2. Tente acessar o arquivo diretamente pela URL

**Resultado Esperado:**
- ✅ Arquivo não deve ser acessível sem autenticação
- ✅ Erro 403 ou redirecionamento para login

---

## 3. 💾 TESTE DE CRUD NO BANCO

### 3.1 Criar Empresa (Onboarding Completo)

**Passos:**
1. Faça login
2. Clique em "Sou Dono/Gerente"
3. Complete todas as 8 telas do onboarding:
   - Tela 1: Seleção de perfil
   - Tela 2: Dados da empresa
   - Tela 3: Localização
   - Tela 4: Setores
   - Tela 5: Posições
   - Tela 6: Organização
   - Tela 7: Preset
   - Tela 8: Resumo e criar

**Resultado Esperado:**
- ✅ Empresa criada com sucesso
- ✅ Redirecionamento para dashboard do owner
- ✅ Dados salvos no banco

**Verificar no Supabase:**
- **Table Editor → companies:**
  - Deve ver a empresa criada
  - Campos preenchidos corretamente
- **Table Editor → sectors:**
  - Deve ver os setores criados
  - Relacionados com `company_id`
- **Table Editor → positions:**
  - Deve ver as posições criadas
  - Relacionadas com `company_id`
- **Table Editor → shifts:**
  - Deve ver os turnos criados
  - Relacionados com `company_id`

---

### 3.2 Criar Tarefa

**Passos:**
1. No dashboard, clique em "Criar Tarefa"
2. Preencha:
   - Título: `Teste de Tarefa`
   - Descrição: `Esta é uma tarefa de teste`
   - Prioridade: `Alta`
   - Data: Hoje
3. Salve

**Resultado Esperado:**
- ✅ Tarefa criada
- ✅ Aparece na lista de tarefas
- ✅ XP atribuído (se configurado)

**Verificar no Supabase:**
- **Table Editor → tasks:**
  - Deve ver a tarefa criada
  - `company_id` preenchido
  - `assigned_to` preenchido (se atribuída)

---

### 3.3 Check-in

**Passos:**
1. No app, clique em "Check-in"
2. Autorize localização (se solicitado)
3. Confirme check-in

**Resultado Esperado:**
- ✅ Check-in registrado
- ✅ Status muda para "online" ou "checked in"
- ✅ Timestamp salvo

**Verificar no Supabase:**
- **Table Editor → check_ins:**
  - Deve ver o registro de check-in
  - `user_id` preenchido
  - `company_id` preenchido
  - `check_in_time` preenchido
- **Table Editor → profiles:**
  - `shift_status` deve estar como "online" ou similar
  - `last_check_in` deve estar atualizado

---

### 3.4 Check-out

**Passos:**
1. Após check-in, clique em "Check-out"
2. Confirme

**Resultado Esperado:**
- ✅ Check-out registrado
- ✅ Status muda para "offline"
- ✅ Duração calculada

**Verificar no Supabase:**
- **Table Editor → check_ins:**
  - `check_out_time` preenchido
  - `duration` calculado
- **Table Editor → profiles:**
  - `shift_status` volta para "offline"

---

## 4. 🔒 TESTE DE RLS POLICIES

### 4.1 Teste: Usuário A não vê dados do Usuário B

**Passos:**
1. Crie dois usuários diferentes:
   - Usuário A: `usuarioA@teste.com`
   - Usuário B: `usuarioB@teste.com`
2. Cada um cria uma empresa diferente
3. Usuário A tenta ver dados da empresa do Usuário B

**Resultado Esperado:**
- ✅ Usuário A NÃO deve ver empresas do Usuário B
- ✅ Usuário A NÃO deve ver tarefas do Usuário B
- ✅ Usuário A NÃO deve ver setores do Usuário B

**Como Testar:**
- No app, tente acessar dados de outra empresa
- Deve retornar erro ou lista vazia
- No Supabase Dashboard, faça query como Usuário A:
  ```sql
  -- Como Usuário A, não deve ver empresas do Usuário B
  SELECT * FROM companies;
  -- Deve retornar apenas empresas do Usuário A
  ```

---

### 4.2 Teste: Funcionário vê dados da empresa

**Passos:**
1. Crie um owner (`owner@teste.com`)
2. Crie uma empresa como owner
3. Adicione um funcionário (`employee@teste.com`) à empresa
4. Faça login como funcionário

**Resultado Esperado:**
- ✅ Funcionário deve ver tarefas da empresa
- ✅ Funcionário deve ver setores da empresa
- ✅ Funcionário deve ver posições da empresa
- ✅ Funcionário NÃO deve criar/modificar setores

---

### 4.3 Teste: Owner tem acesso total

**Passos:**
1. Faça login como owner
2. Tente criar setores
3. Tente criar posições
4. Tente criar turnos

**Resultado Esperado:**
- ✅ Owner pode criar setores
- ✅ Owner pode criar posições
- ✅ Owner pode criar turnos
- ✅ Owner pode ver todos os dados da empresa

---

## 5. 📊 TESTE DE PERFORMANCE

### 5.1 Verificar Tempo de Resposta

**Passos:**
1. Abra o console do navegador (Chrome DevTools)
2. Vá para aba Network
3. Faça ações no app (login, carregar tarefas, etc.)
4. Verifique tempo de resposta

**Resultado Esperado:**
- ✅ Queries devem responder em < 500ms
- ✅ Uploads devem completar em tempo razoável

---

### 5.2 Verificar Uso de Índices

**Passos:**
1. No Supabase Dashboard, vá em **Database → Query Performance**
2. Execute queries comuns
3. Verifique se índices estão sendo usados

**Resultado Esperado:**
- ✅ Índices devem estar sendo usados
- ✅ Queries devem ser otimizadas

---

## 6. 🐛 TESTE DE ERROS

### 6.1 Teste: Login com credenciais inválidas

**Passos:**
1. Tente fazer login com email/senha incorretos

**Resultado Esperado:**
- ✅ Deve mostrar mensagem de erro clara
- ✅ Não deve crashar o app

---

### 6.2 Teste: Upload de arquivo muito grande

**Passos:**
1. Tente fazer upload de arquivo > 5MB

**Resultado Esperado:**
- ✅ Deve mostrar erro de tamanho máximo
- ✅ Não deve crashar o app

---

### 6.3 Teste: Criar empresa sem campos obrigatórios

**Passos:**
1. Tente criar empresa sem preencher campos obrigatórios

**Resultado Esperado:**
- ✅ Deve mostrar mensagens de erro
- ✅ Não deve permitir criar empresa
- ✅ Validação client-side funcionando

---

## ✅ CHECKLIST FINAL

### Autenticação
- [ ] Criar conta funciona
- [ ] Login funciona
- [ ] Email de confirmação enviado
- [ ] Perfil criado automaticamente
- [ ] OAuth Google funciona (se configurado)
- [ ] OAuth Apple funciona (se configurado)

### Storage
- [ ] Upload de logo funciona
- [ ] Arquivo aparece no bucket
- [ ] Bucket está privado
- [ ] URL do arquivo salva corretamente

### CRUD
- [ ] Criar empresa funciona
- [ ] Criar tarefa funciona
- [ ] Check-in funciona
- [ ] Check-out funciona
- [ ] Dados salvos corretamente no banco

### RLS
- [ ] Usuários não veem dados de outros
- [ ] Funcionários veem dados da empresa
- [ ] Owners têm acesso total
- [ ] Políticas funcionando corretamente

### Performance
- [ ] Queries rápidas (< 500ms)
- [ ] Uploads funcionando
- [ ] Índices sendo usados

### Erros
- [ ] Mensagens de erro claras
- [ ] App não crasha
- [ ] Validações funcionando

---

## 🎯 PRÓXIMOS PASSOS APÓS TESTES

Se todos os testes passarem:
1. ✅ App está pronto para uso básico
2. ⏭️ Configurar OAuth (opcional)
3. ⏭️ Personalizar Email Templates
4. ⏭️ Otimizar performance se necessário

Se algum teste falhar:
1. Verifique logs no Supabase Dashboard → Logs
2. Verifique console do app (Xcode/Chrome DevTools)
3. Consulte troubleshooting nos guias

---

**Última atualização:** $(date)

