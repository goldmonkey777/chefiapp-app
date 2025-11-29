# 🔧 Corrigir Erro: "Unsupported provider: provider is not enabled"

**Erro:** `"Unsupported provider: provider is not enabled"`  
**Código:** `400 - validation_failed`  
**Causa:** Google OAuth provider não está habilitado no Supabase Dashboard

---

## ✅ Solução Rápida

### Passo 1: Verificar se Google Provider está Habilitado

1. **Acesse o Supabase Dashboard:**
   - URL: https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn
   - Faça login se necessário

2. **Navegue até Authentication → Providers:**
   - Menu lateral → **Authentication**
   - Submenu → **Providers**

3. **Encontre o Google Provider:**
   - Procure por **"Google"** na lista de providers
   - Verifique se o **toggle está ATIVADO** (verde/azul)

4. **Se o toggle estiver DESATIVADO:**
   - Clique no toggle para **ATIVAR**
   - Preencha os campos obrigatórios:
     - **Client ID (for OAuth)**: Cole o Client ID do Google Cloud
     - **Client Secret (for OAuth)**: Cole o Client Secret do Google Cloud
   - Clique em **"Save"**

---

## 🔍 Verificação Detalhada

### Checklist Completo:

- [ ] **Google Provider está na lista de providers**
- [ ] **Toggle está ATIVADO (verde/azul)**
- [ ] **Client ID está preenchido** (não vazio)
- [ ] **Client Secret está preenchido** (não vazio)
- [ ] **Botão "Save" foi clicado** após preencher
- [ ] **Mensagem de sucesso apareceu** após salvar

---

## ⚠️ Problemas Comuns

### Problema 1: Toggle está desativado

**Sintoma:** Toggle está cinza/desativado

**Solução:**
1. Clique no toggle para ativar
2. Preencha Client ID e Secret
3. Clique em "Save"
4. Aguarde alguns segundos para propagação

### Problema 2: Campos vazios

**Sintoma:** Toggle está ativado mas campos estão vazios

**Solução:**
1. Desative o toggle temporariamente
2. Preencha Client ID e Secret do Google Cloud Console
3. Ative o toggle novamente
4. Clique em "Save"

### Problema 3: Credenciais incorretas

**Sintoma:** Provider está ativado mas ainda dá erro

**Solução:**
1. Verifique se o Client ID está correto (copie do Google Cloud Console)
2. Verifique se o Client Secret está correto (copie do Google Cloud Console)
3. Certifique-se de que não há espaços extras ao copiar/colar
4. Salve novamente

### Problema 4: Propagação de mudanças

**Sintoma:** Salvou mas ainda não funciona

**Solução:**
1. Aguarde 10-30 segundos após salvar
2. Feche e reabra o app
3. Tente fazer login novamente
4. Se ainda não funcionar, verifique os logs no Supabase Dashboard

---

## 🧪 Como Testar Após Corrigir

1. **Feche completamente o app** (force quit)
2. **Abra o app novamente**
3. **Clique em "Continuar com Google"**
4. **Deve abrir a tela de login do Google** (não o erro)

---

## 📋 Verificar Credenciais do Google Cloud

Se ainda não funcionar, verifique se as credenciais estão corretas:

### 1. Acesse Google Cloud Console:
- URL: https://console.cloud.google.com/
- Vá em **APIs & Services** → **Credentials**

### 2. Encontre seu OAuth Client ID:
- Procure por **"OAuth 2.0 Client IDs"**
- Clique no Client ID que você criou

### 3. Verifique:
- **Type:** Web application
- **Authorized redirect URIs** contém:
  - `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`
  - `chefiapp://auth/callback`
  - `com.chefiapp.app://auth/callback`

### 4. Copie novamente:
- **Client ID** → Cole no Supabase Dashboard
- **Client Secret** → Cole no Supabase Dashboard

---

## 🔄 Passo a Passo Completo

### No Supabase Dashboard:

1. **Authentication** → **Providers**
2. Encontre **"Google"**
3. **Clique no toggle** para ativar (se estiver desativado)
4. **Preencha:**
   - Client ID: `[seu-client-id-do-google-cloud]`
   - Client Secret: `[seu-client-secret-do-google-cloud]`
5. **Clique em "Save"**
6. **Aguarde 10-30 segundos**
7. **Teste novamente no app**

---

## 🐛 Debugging Avançado

### Verificar Logs no Supabase:

1. **Supabase Dashboard** → **Authentication** → **Logs**
2. Procure por erros relacionados a "Google" ou "OAuth"
3. Verifique a mensagem de erro específica

### Verificar no Console do App:

1. Abra o app no simulador
2. Abra o console do Xcode (Window → Devices and Simulators → Console)
3. Filtre por: `Supabase`, `OAuth`, `Google`
4. Procure por mensagens de erro

---

## ✅ Checklist Final

Após seguir os passos acima:

- [ ] Google Provider está ATIVADO no Supabase
- [ ] Client ID está preenchido e correto
- [ ] Client Secret está preenchido e correto
- [ ] Mudanças foram salvas
- [ ] Aguardou 10-30 segundos para propagação
- [ ] App foi fechado e reaberto
- [ ] Testou login novamente

---

## 📞 Se Ainda Não Funcionar

1. **Verifique se o projeto do Supabase está correto:**
   - URL deve ser: `mcmxniuokmvzuzqfnpnn.supabase.co`

2. **Verifique se está usando a conta correta:**
   - Certifique-se de estar logado na conta correta do Supabase

3. **Tente desabilitar e reabilitar:**
   - Desative o Google Provider
   - Salve
   - Ative novamente
   - Preencha credenciais
   - Salve

4. **Verifique se há outros providers ativos:**
   - Às vezes conflitos podem ocorrer
   - Tente desabilitar outros providers temporariamente

---

**Status**: ⚠️ **AÇÃO NECESSÁRIA** - Habilitar Google Provider no Supabase Dashboard

