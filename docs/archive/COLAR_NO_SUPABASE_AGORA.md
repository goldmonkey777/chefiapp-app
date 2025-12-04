# ✅ Colar Apple OAuth no Supabase - AGORA

**Status:** ✅ Arquivo .p8 recebido  
**Próximo:** Colar no Supabase Dashboard

---

## ✅ Dados Confirmados

- ✅ **Service ID:** `com.chefiapp.app.oauth`
- ✅ **Key ID:** `W6CV84RZKR`
- ✅ **Arquivo .p8:** Recebido e verificado
- ⚠️ **Team ID:** [Você precisa copiar do Apple Developer Portal]

---

## 📋 Passo 1: Copiar Team ID

1. **Acesse:** https://developer.apple.com/account/
2. **Olhe no topo da página** (canto superior direito)
3. Você verá **"Team ID"** (código alfanumérico)
4. **COPIE** este código

**Onde encontrar:**
- Geralmente no topo direito da página do Apple Developer Portal
- Formato: Código alfanumérico (exemplo: `ABC123DEF4` ou `XYZ987ABC6`)

---

## ✅ Passo 2: Colar no Supabase Dashboard

### 2.1 Acessar Supabase

1. **Acesse:** https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn
2. **Faça login** se necessário

### 2.2 Abrir Configurações do Apple Provider

1. No menu lateral, vá em **Authentication**
2. Clique em **Providers**
3. Procure por **Apple** na lista
4. Clique no toggle para **ATIVAR** (deve ficar verde/azul)

### 2.3 Preencher Campos

Preencha os campos na seguinte ordem:

#### Campo 1: Service ID
```
com.chefiapp.app.oauth
```

#### Campo 2: Secret Key
Cole TODO o conteúdo abaixo (incluindo os headers):

```
-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgHQvbArs8/aawghrS
U1JDxzjfhGIgvf+IKV10FmTfeyCgCgYIKoZIzj0DAQehRANCAASei+xpJCpOoODh
Despv/HPCrcv8TDkAgO+IluThMhVnWTe2bqZlHXt8a08Lkieon82hKSCktAYkQdM
nOVBReGt
-----END PRIVATE KEY-----
```

**⚠️ IMPORTANTE:** 
- ✅ Cole o arquivo **COMPLETO** (incluindo `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`)
- ✅ Cole todas as linhas (4 linhas de código entre os headers)

#### Campo 3: Key ID
```
W6CV84RZKR
```

#### Campo 4: Team ID
Cole o Team ID que você copiou do Apple Developer Portal
(Exemplo: `ABC123DEF4` - mas use o seu!)

### 2.4 Salvar

1. Revise todos os campos:
   - ✅ Service ID: `com.chefiapp.app.oauth`
   - ✅ Secret Key: Arquivo `.p8` completo (com headers e todas as linhas)
   - ✅ Key ID: `W6CV84RZKR`
   - ✅ Team ID: Código copiado do Apple Developer Portal
   - ✅ Toggle ativado (verde/azul)

2. Clique em **"Save"**

3. Você deve ver: **"Successfully updated settings"**

---

## ✅ Verificação Final

Após salvar, verifique:

- [ ] Mensagem de sucesso apareceu
- [ ] Toggle está ativado (verde/azul)
- [ ] Todos os campos estão preenchidos
- [ ] Nenhum erro apareceu

---

## 🧪 Testar

Após configurar:

1. **Feche completamente o app** (force quit)
2. **Abra o app novamente**
3. **Clique em "Continuar com Apple"**
4. **Deve abrir a tela de login do Apple** (nativo do iOS)
5. **Após fazer login, deve redirecionar e fazer login automaticamente**

---

## 📋 Resumo dos Dados para Colar

### Service ID:
```
com.chefiapp.app.oauth
```

### Secret Key (cole COMPLETO):
```
-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgHQvbArs8/aawghrS
U1JDxzjfhGIgvf+IKV10FmTfeyCgCgYIKoZIzj0DAQehRANCAASei+xpJCpOoODh
Despv/HPCrcv8TDkAgO+IluThMhVnWTe2bqZlHXt8a08Lkieon82hKSCktAYkQdM
nOVBReGt
-----END PRIVATE KEY-----
```

### Key ID:
```
W6CV84RZKR
```

### Team ID:
```
[COLE O TEAM ID QUE VOCÊ COPIAR DO APPLE DEVELOPER PORTAL]
```

---

## 🐛 Problemas Comuns

### Problema: "Invalid Key"

**Causa:** Arquivo `.p8` não foi colado completamente

**Solução:**
- Verifique se você colou TODAS as linhas
- Verifique se incluiu `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`
- Verifique se não há espaços extras
- Tente copiar e colar novamente

### Problema: "Key ID not found"

**Solução:**
- Verifique se o Key ID está correto: `W6CV84RZKR`
- Verifique se não há espaços extras
- Tente copiar novamente

### Problema: "Team ID not found"

**Solução:**
- Verifique se copiou o Team ID correto do Apple Developer Portal
- Verifique se não há espaços extras
- O Team ID geralmente está no topo da página

---

**Status**: ⚠️ **AÇÃO NECESSÁRIA** - Copiar Team ID e colar tudo no Supabase

