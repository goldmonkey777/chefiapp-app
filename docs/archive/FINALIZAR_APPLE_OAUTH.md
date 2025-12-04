# ✅ Finalizar Configuração Apple OAuth

**Status:** ✅ Key criada  
**Key ID:** `W6CV84RZKR`  
**Próximo:** Baixar .p8 e colar no Supabase

---

## ✅ O Que Já Foi Feito

- ✅ Service ID criado: `com.chefiapp.app.oauth`
- ✅ Key criada: `ChefIApp OAuth Key`
- ✅ Key ID: `W6CV84RZKR`
- ✅ Sign in with Apple habilitado

---

## 📋 Próximos Passos (3 Passos Finais)

### Passo 1: Baixar Arquivo .p8

**⚠️ ATENÇÃO:** Você só pode baixar UMA VEZ!

1. Na mesma tela onde você vê o Key ID `W6CV84RZKR`
2. Procure pelo botão **"Download"**
3. Clique em **Download**
4. O arquivo será baixado (nome: `AuthKey_W6CV84RZKR.p8` ou similar)
5. **GUARDE ESTE ARQUIVO EM SEGURANÇA!** Você não pode baixar novamente

---

### Passo 2: Copiar Team ID

1. **Olhe no topo da página** do Apple Developer Portal
2. Ou **na mesma tela** onde está o Key ID
3. Você verá **"Team ID"** (código alfanumérico, exemplo: `ABC123DEF4`)
4. **COPIE** este código

**Onde encontrar:**
- Geralmente no topo direito da página
- Ou na mesma tela de confirmação da Key
- Formato: Código alfanumérico (exemplo: `XYZ987ABC6`)

---

### Passo 3: Abrir e Copiar Conteúdo do Arquivo .p8

1. **Abra o arquivo `.p8`** que você baixou
   - Pode usar: TextEdit, VS Code, Cursor, ou qualquer editor de texto

2. **Selecione TODO o conteúdo:**
   - Cmd+A (Mac) ou Ctrl+A (Windows/Linux)

3. **Copie:**
   - Cmd+C (Mac) ou Ctrl+C (Windows/Linux)

4. **O conteúdo deve parecer com:**
   ```
   -----BEGIN PRIVATE KEY-----
   MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
   ... (várias linhas de código) ...
   -----END PRIVATE KEY-----
   ```

**⚠️ IMPORTANTE:** 
- ✅ Cole o arquivo **COMPLETO** (incluindo `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`)
- ❌ NÃO remova os headers
- ❌ NÃO cole apenas parte do conteúdo

---

## ✅ Passo 4: Colar no Supabase Dashboard

### 4.1 Acessar Supabase

1. **Acesse:** https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn
2. **Faça login** se necessário

### 4.2 Abrir Configurações do Apple Provider

1. No menu lateral, vá em **Authentication**
2. Clique em **Providers**
3. Procure por **Apple** na lista
4. Clique no toggle para **ATIVAR** (deve ficar verde/azul)

### 4.3 Preencher Campos

Preencha os campos na seguinte ordem:

#### Campo 1: Service ID
```
com.chefiapp.app.oauth
```

#### Campo 2: Secret Key
Cole TODO o conteúdo do arquivo `.p8` que você copiou:
```
-----BEGIN PRIVATE KEY-----
... (várias linhas) ...
-----END PRIVATE KEY-----
```

#### Campo 3: Key ID
```
W6CV84RZKR
```

#### Campo 4: Team ID
Cole o Team ID que você copiou (exemplo: `ABC123DEF4`)

### 4.4 Salvar

1. Revise todos os campos:
   - ✅ Service ID: `com.chefiapp.app.oauth`
   - ✅ Secret Key: Arquivo `.p8` completo (com headers)
   - ✅ Key ID: `W6CV84RZKR`
   - ✅ Team ID: Código copiado
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

## 📋 Resumo dos Dados

Você precisa ter:

- ✅ **Service ID:** `com.chefiapp.app.oauth`
- ✅ **Key ID:** `W6CV84RZKR`
- ⚠️ **Team ID:** [você precisa copiar do Apple Developer Portal]
- ⚠️ **Secret Key:** [conteúdo completo do arquivo .p8 que você vai baixar]

---

## 🐛 Problemas Comuns

### Problema: "Não encontro o botão Download"

**Solução:**
- Verifique se você está na tela de confirmação após criar a Key
- Se fechou a janela, você não pode mais baixar - precisará criar uma nova Key

### Problema: "Não encontro o Team ID"

**Solução:**
- Olhe no topo da página do Apple Developer Portal
- Ou na mesma tela onde você vê o Key ID
- É um código alfanumérico (exemplo: `XYZ987ABC6`)

### Problema: "Invalid Key" no Supabase

**Solução:**
- Verifique se você colou TODO o conteúdo do arquivo `.p8`
- Verifique se incluiu `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`
- Tente copiar e colar novamente

---

**Status**: ⚠️ **AÇÃO NECESSÁRIA** - Baixar .p8, copiar Team ID e colar no Supabase

