# 🧪 Testar Google OAuth Agora - ChefIApp™

**Status:** ✅ **CONFIGURADO E PRONTO PARA TESTAR**

---

## ✅ Configuração Completa

- ✅ Google Provider habilitado no Supabase
- ✅ Client ID configurado corretamente
- ✅ Client Secret configurado corretamente
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
   - Você deve ver o botão **"Continuar com Google"**
   - Clique nele

4. **O que deve acontecer:**
   - ✅ Abre o navegador Safari com tela de login do Google
   - ✅ Você vê a tela de consentimento OAuth do Google
   - ✅ Após fazer login, redireciona para `chefiapp://auth/callback`
   - ✅ O app volta ao foco automaticamente
   - ✅ Login é realizado automaticamente
   - ✅ Perfil é criado no Supabase (se for primeiro login)
   - ✅ Dashboard aparece (Owner/Manager/Employee)

### Teste 2: No Navegador (Web)

1. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

2. **Acesse:**
   - Abra: `http://localhost:5173`

3. **Na tela de login:**
   - Clique em **"Continuar com Google"**

4. **O que deve acontecer:**
   - ✅ Abre popup ou redireciona para Google
   - ✅ Após login, redireciona para `http://localhost:5173/auth/callback`
   - ✅ URL contém `#access_token=...` e `#refresh_token=...`
   - ✅ App processa o callback automaticamente
   - ✅ Login é realizado
   - ✅ Dashboard aparece

---

## ✅ Checklist de Sucesso

Após testar, confirme:

- [ ] Botão "Continuar com Google" aparece na tela de login
- [ ] Clicar no botão abre a tela de login do Google
- [ ] Após fazer login no Google, redireciona de volta para o app
- [ ] Login é realizado automaticamente
- [ ] Perfil é criado no Supabase (verificar em Table Editor → profiles)
- [ ] Dashboard aparece corretamente
- [ ] Nome e foto do Google aparecem no perfil

---

## 🔍 Verificar no Supabase

Após fazer login com sucesso:

### 1. Verificar Usuário Criado

No Supabase Dashboard:
- **Authentication** → **Users**
- Você deve ver um novo usuário com email do Google
- Verifique se `Provider` está como `google`

### 2. Verificar Perfil Criado

No Supabase Dashboard:
- **Table Editor** → **profiles**
- Você deve ver um novo perfil criado automaticamente
- Verifique se `auth_method` está como `google`
- Verifique se `email` está preenchido
- Verifique se `name` está preenchido (do Google)

### 3. Verificar Logs

No Supabase Dashboard:
- **Authentication** → **Logs**
- Procure por entradas relacionadas ao seu login
- Não deve haver erros

---

## 🐛 Problemas Comuns e Soluções

### Problema: "redirect_uri_mismatch"

**Causa:** Redirect URI não está configurada no Google Cloud Console

**Solução:**
1. Acesse Google Cloud Console → APIs & Services → Credentials
2. Clique no seu OAuth Client ID
3. Verifique se estas URLs estão em **Authorized redirect URIs**:
   ```
   https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
   chefiapp://auth/callback
   com.chefiapp.app://auth/callback
   ```
4. Se não estiverem, adicione e salve

### Problema: App não redireciona de volta

**Causa:** Deep linking não está configurado corretamente

**Solução:**
1. Verifique se `Info.plist` tem `CFBundleURLSchemes` com `chefiapp`
2. Verifique se `capacitor.config.ts` tem `iosScheme: 'chefiapp'`
3. Feche e reabra o app completamente

### Problema: Erro "Provider not enabled"

**Causa:** Google Provider não está habilitado no Supabase

**Solução:**
1. Supabase Dashboard → Authentication → Providers → Google
2. Verifique se o toggle está ativado (verde)
3. Verifique se Client ID e Secret estão preenchidos
4. Salve novamente

### Problema: Tela branca após login

**Causa:** Erro no processamento do callback

**Solução:**
1. Verifique os logs no console do Xcode
2. Verifique os logs no Supabase Dashboard → Authentication → Logs
3. Verifique se o perfil foi criado (Table Editor → profiles)

---

## 📝 Próximos Passos Após Testar

Se o login funcionar:

1. **Testar logout** - Verificar se funciona corretamente
2. **Testar persistência** - Fechar app e reabrir (deve manter logado)
3. **Testar em diferentes plataformas** - iOS, Android, Web
4. **Configurar Apple OAuth** (se necessário)

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
- Filtre por: `ChefIApp`, `OAuth`, `Supabase`

---

**Status**: ✅ **PRONTO PARA TESTAR** - Siga os passos acima e me avise o resultado!

