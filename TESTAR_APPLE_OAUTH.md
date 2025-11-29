# 🧪 Testar Apple OAuth - ChefIApp™

**Status:** ✅ **CONFIGURADO E PRONTO PARA TESTAR**

---

## ✅ Configuração Completa

- ✅ Apple Provider habilitado no Supabase
- ✅ Service ID configurado: `com.chefiapp.app.oauth`
- ✅ Key ID configurado: `W6CV84RZKR`
- ✅ Secret Key configurado
- ✅ Team ID configurado
- ✅ Configurações salvas com sucesso
- ✅ Toggle ativado (verde)

---

## 🧪 Como Testar

### Teste 1: No Simulador iOS

1. **Feche completamente o app:**
   - No simulador, arraste para cima para ver apps abertos
   - Arraste o ChefIApp para cima para fechar completamente
   - Ou: Cmd+Shift+H duas vezes → arraste ChefIApp para cima

2. **Abra o app novamente:**
   - Toque no ícone do ChefIApp no simulador
   - Ou: `npx expo start --ios`

3. **Na tela de login:**
   - Você deve ver o botão **"Continuar com Apple"**
   - Clique nele

4. **O que deve acontecer:**
   - ✅ Abre a tela de login do Apple (nativo do iOS)
   - ✅ Você pode usar Face ID, Touch ID ou senha da Apple
   - ✅ Após fazer login, redireciona para `chefiapp://auth/callback`
   - ✅ O app volta ao foco automaticamente
   - ✅ Login é realizado automaticamente
   - ✅ Perfil é criado no Supabase (se for primeiro login)
   - ✅ Dashboard aparece (Owner/Manager/Employee)

### Teste 2: No Navegador (Web)

**Nota:** Apple OAuth funciona melhor em dispositivos Apple. No navegador web, pode ter limitações.

1. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

2. **Acesse:** `http://localhost:5173`

3. **Na tela de login:**
   - Clique em **"Continuar com Apple"**

4. **O que deve acontecer:**
   - ✅ Abre popup ou redireciona para Apple
   - ✅ Após login, redireciona de volta
   - ✅ Login é realizado

---

## ✅ Checklist de Sucesso

Após testar, confirme:

- [ ] Botão "Continuar com Apple" aparece na tela de login
- [ ] Clicar no botão abre a tela de login do Apple (nativo iOS)
- [ ] Após fazer login no Apple, redireciona de volta para o app
- [ ] Login é realizado automaticamente
- [ ] Perfil é criado no Supabase (verificar em Table Editor → profiles)
- [ ] Dashboard aparece corretamente
- [ ] Dados do Apple aparecem no perfil (se disponíveis)

---

## 🔍 Verificar no Supabase

Após fazer login com sucesso:

### 1. Verificar Usuário Criado

No Supabase Dashboard:
- **Authentication** → **Users**
- Você deve ver um novo usuário com email do Apple
- Verifique se `Provider` está como `apple`

**Nota:** O email pode ser um "Hide My Email" (Private Relay) da Apple, como `xxxxx@privaterelay.appleid.com`

### 2. Verificar Perfil Criado

No Supabase Dashboard:
- **Table Editor** → **profiles**
- Você deve ver um novo perfil criado automaticamente
- Verifique se `auth_method` está como `apple`
- Verifique se `email` está preenchido (pode ser Private Relay)
- Verifique se `name` está preenchido (se disponível)

### 3. Verificar Logs

No Supabase Dashboard:
- **Authentication** → **Logs**
- Procure por entradas relacionadas ao seu login
- Não deve haver erros

---

## 🐛 Problemas Comuns e Soluções

### Problema: "Service ID not found"

**Causa:** Service ID não está configurado corretamente

**Solução:**
- Verifique se o Service ID está correto: `com.chefiapp.app.oauth`
- Verifique se "Sign in with Apple" está habilitado no Service ID
- Verifique se o Return URL está configurado no Service ID

### Problema: "Invalid Key"

**Causa:** Arquivo `.p8` não foi colado completamente

**Solução:**
- Verifique se você colou TODO o conteúdo do arquivo `.p8`
- Verifique se incluiu `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`
- Verifique se todas as linhas foram coladas
- Tente copiar e colar novamente

### Problema: App não redireciona de volta

**Causa:** Deep linking não está configurado corretamente

**Solução:**
- Verifique se `Info.plist` tem `CFBundleURLSchemes` com `chefiapp`
- Verifique se `capacitor.config.ts` tem `iosScheme: 'chefiapp'`
- Feche e reabra o app completamente

### Problema: Erro "Provider not enabled"

**Causa:** Apple Provider não está habilitado no Supabase

**Solução:**
- Supabase Dashboard → Authentication → Providers → Apple
- Verifique se o toggle está ativado (verde)
- Verifique se todos os campos estão preenchidos
- Salve novamente

### Problema: Email é Private Relay

**Causa:** Apple usa "Hide My Email" por padrão

**Solução:**
- Isso é normal e esperado
- O email será algo como `xxxxx@privaterelay.appleid.com`
- O usuário pode escolher usar o email real ou o Private Relay
- O app já está preparado para isso (verifica `@privaterelay.appleid.com`)

---

## 📝 Próximos Passos Após Testar

Se o login funcionar:

1. **Testar logout** - Verificar se funciona corretamente
2. **Testar persistência** - Fechar app e reabrir (deve manter logado)
3. **Testar em diferentes plataformas** - iOS, Android, Web
4. **Verificar perfil criado** - Confirmar dados no Supabase

---

## 🎯 Comandos Rápidos

### Testar no Simulador iOS:
```bash
npx expo start --ios
```

### Testar no Navegador:
```bash
npm run dev
```

### Ver logs no Xcode:
- Window → Devices and Simulators → Console
- Filtre por: `ChefIApp`, `OAuth`, `Apple`, `Supabase`

---

## ✅ Resumo

**Configuração:** ✅ Completa  
**Status:** ✅ Pronto para testar  
**Próximo:** Testar login no app

---

**Status**: ✅ **PRONTO PARA TESTAR** - Siga os passos acima e me avise o resultado!

