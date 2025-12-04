# 🔍 Debug OAuth - Interpretação dos Logs

**Guia para entender os logs do Xcode durante autenticação OAuth**

---

## ✅ Logs Normais (Não são Erros)

### 1. Warnings do iOS Simulator

Estes são **normais** e podem ser ignorados:

```
`UIScene` lifecycle will soon be required
```
- ⚠️ Aviso futuro do iOS
- Não afeta funcionamento atual
- Pode ser ignorado

```
Failed to resolve host network app id to config
```
- ⚠️ Normal no simulador
- Relacionado ao WebKit Networking
- Não afeta funcionamento

```
-[RTIInputSystemClient remoteTextInputSessionWithID:...]
```
- ⚠️ Warnings do sistema de input do iOS
- Relacionado ao teclado virtual
- Não afeta funcionamento

```
unable to make sandbox extension
```
- ⚠️ Normal no simulador
- Relacionado a permissões de sandbox
- Não afeta funcionamento

---

## ✅ Logs de Sucesso

### Deep Link Recebido

```
🔗 [AppDelegate] Deep link recebido: com-chefiapp-app://auth/callback#access_token=...
🔗 [AppDelegate] URL scheme: com-chefiapp-app
🔗 [AppDelegate] URL host: auth
🔗 [AppDelegate] URL path: /callback
🔗 [AppDelegate] Deep link processado: true
```

**Significado:**
- ✅ Deep link foi recebido corretamente
- ✅ URL scheme está correto
- ✅ Tokens estão presentes no callback
- ✅ AppDelegate processou com sucesso

### WebView Carregado

```
⚡️ Loading app at chefiapp://localhost...
⚡️ WebView loaded
```

**Significado:**
- ✅ App carregou no WebView
- ✅ Capacitor está funcionando

---

## 🔍 Logs de Processamento

### Processamento do Deep Link

**Logs esperados:**

```
🔗 [App] Processando deep link: com-chefiapp-app://auth/callback#...
🔗 [App] Parâmetros extraídos: { hasAccessToken: true, hasRefreshToken: true }
🔗 [App] Tokens recebidos via deep link, estabelecendo sessão...
✅ [App] Sessão OAuth estabelecida com sucesso!
✅ [App] User email: seu@email.com
✅ [App] User ID: 67aa5b16-33f7-4751-9756-40403ac8f2a2
```

**Se aparecer:**
- ✅ Todos esses logs = OAuth funcionando corretamente

### Processamento pelo useAuth

**Logs esperados:**

```
🔗 [useAuth] Auth state change: { event: 'SIGNED_IN', hasSession: true }
🔗 [useAuth] Session encontrada, buscando perfil...
🔗 [ensureProfileExists] Garantindo perfil para: { userId: '...', email: '...' }
✅ [ensureProfileExists] Perfil criado com sucesso!
🔗 [fetchProfile] Buscando perfil para userId: ...
✅ [fetchProfile] Perfil carregado com sucesso!
```

**Se aparecer:**
- ✅ Todos esses logs = Perfil criado/carregado com sucesso

---

## ❌ Logs de Erro (Precisam Atenção)

### Erro ao Estabelecer Sessão

```
❌ [App] Erro ao estabelecer sessão: [mensagem de erro]
```

**Possíveis causas:**
- Token inválido ou expirado
- Configuração incorreta do Supabase
- Problema de rede

**Solução:**
- Verificar configuração do Supabase
- Tentar fazer login novamente

### Erro ao Criar Perfil

```
❌ [ensureProfileExists] Erro ao criar/atualizar perfil: [erro]
```

**Possíveis causas:**
- RLS policy bloqueando inserção
- Campos obrigatórios faltando
- Problema no banco de dados

**Solução:**
- Verificar RLS policies no Supabase
- Verificar se `handle_new_user()` trigger está configurado

### Erro ao Buscar Perfil

```
❌ [fetchProfile] Erro ao buscar perfil: [erro]
```

**Possíveis causas:**
- Perfil não existe
- RLS policy bloqueando leitura
- Problema de conexão

**Solução:**
- Verificar se perfil foi criado na tabela `profiles`
- Verificar RLS policies

---

## 📊 Fluxo Completo Esperado

### 1. Usuário Clica em "Continuar com Google"

```
🔗 [useAuth] Google OAuth iniciado
```

### 2. Safari Abre para Autenticação

```
(Safari abre - usuário faz login)
```

### 3. Deep Link Recebido

```
🔗 [AppDelegate] Deep link recebido: com-chefiapp-app://auth/callback#...
🔗 [App] Processando deep link: ...
✅ [App] Sessão OAuth estabelecida com sucesso!
```

### 4. useAuth Processa Sessão

```
🔗 [useAuth] Auth state change: SIGNED_IN
🔗 [ensureProfileExists] Garantindo perfil...
✅ [ensureProfileExists] Perfil criado com sucesso!
🔗 [fetchProfile] Buscando perfil...
✅ [fetchProfile] Perfil carregado com sucesso!
```

### 5. Dashboard Aparece

```
📊 [App] Rendering dashboard for user: seu@email.com, role: employee
```

---

## 🐛 Troubleshooting

### Problema: Deep link recebido mas sessão não estabelecida

**Verificar:**
1. Logs mostram `🔗 [App] Processando deep link`?
2. Logs mostram `✅ [App] Sessão OAuth estabelecida`?
3. Se não, verificar se tokens estão presentes no URL

**Solução:**
- Verificar se `handleDeepLink` está sendo chamado
- Verificar logs de erro no console

### Problema: Sessão estabelecida mas perfil não carrega

**Verificar:**
1. Logs mostram `🔗 [useAuth] Session encontrada`?
2. Logs mostram `🔗 [ensureProfileExists]`?
3. Há erros ao criar/buscar perfil?

**Solução:**
- Verificar RLS policies
- Verificar se trigger `handle_new_user()` está configurado
- Verificar logs de erro específicos

### Problema: App fica em loading infinito

**Verificar:**
1. Logs mostram `⏳ [App] Still loading auth state...`?
2. `isLoading` nunca vira `false`?

**Solução:**
- Verificar se `useAuth` está processando a sessão
- Verificar se há erros silenciosos
- Verificar timeout no `useAuth`

---

## ✅ Checklist de Verificação

Após fazer login OAuth, verificar no console:

- [ ] `🔗 [AppDelegate] Deep link recebido` aparece
- [ ] `🔗 [App] Processando deep link` aparece
- [ ] `✅ [App] Sessão OAuth estabelecida` aparece
- [ ] `🔗 [useAuth] Auth state change: SIGNED_IN` aparece
- [ ] `✅ [ensureProfileExists] Perfil criado` OU `✅ [ensureProfileExists] Perfil já existe` aparece
- [ ] `✅ [fetchProfile] Perfil carregado com sucesso!` aparece
- [ ] `📊 [App] Rendering dashboard` aparece
- [ ] Dashboard aparece na tela

Se todos aparecerem, o fluxo está funcionando! ✅

---

## 📝 Notas Importantes

1. **Warnings do iOS são normais** - Não são erros
2. **Stack traces do WebKit são normais** - Parte do funcionamento interno
3. **Foco nos logs com emojis** - Eles indicam o fluxo real
4. **Se dashboard aparecer** - Tudo está funcionando, mesmo com warnings

---

**Made with ❤️ by [goldmonkey.studio](https://goldmonkey.studio)**

