# 🔑 Criar Key (.p8) para Apple OAuth - Passo a Passo

**Status:** ✅ Service ID criado  
**Próximo:** Criar Key (.p8)

---

## ✅ O Que Já Foi Feito

- ✅ Service ID criado: `com.chefiapp.app.oauth`
- ✅ "Sign in with Apple" habilitado
- ✅ Return URL configurado: `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`

---

## 🔑 Passo a Passo: Criar Key (.p8)

### Passo 1: Acessar Keys

1. **Acesse:** https://developer.apple.com/account/
2. **Faça login** com sua conta Apple Developer
3. No menu lateral, vá em **Certificates, Identifiers & Profiles**
4. Clique em **Keys** (no menu lateral)

### Passo 2: Criar Nova Key

1. Clique no botão **"+"** (canto superior esquerdo)
2. Você verá uma tela de configuração da Key

### Passo 3: Configurar Key

1. **Key Name**: Digite `ChefIApp OAuth Key` (ou qualquer nome descritivo)
2. **Marque a checkbox** **"Sign in with Apple"**
   - ⚠️ **IMPORTANTE:** Esta é a única permissão necessária para OAuth
3. **NÃO marque outras permissões** (não precisa)
4. Clique em **Continue**

### Passo 4: Confirmar e Registrar

1. Revise as informações:
   - Key Name: `ChefIApp OAuth Key`
   - Enabled Services: `Sign in with Apple`
2. Clique em **Register**

### Passo 5: Baixar e Copiar Dados

**⚠️ ATENÇÃO:** Esta é a ÚNICA vez que você pode baixar a key!

Após registrar, você verá uma tela de confirmação com:

1. **Download da Key:**
   - Clique no botão **Download** para baixar o arquivo `.p8`
   - **GUARDE ESTE ARQUIVO EM SEGURANÇA!** Você não poderá baixá-lo novamente
   - O arquivo terá um nome como: `AuthKey_XXXXXXXXXX.p8`

2. **Copiar Key ID:**
   - Na mesma tela, você verá **"Key ID"**
   - **COPIE** este ID (exemplo: `ABC123DEF4`)
   - Você precisará dele para o Supabase

3. **Copiar Team ID:**
   - Na mesma tela ou no topo da página, você verá **"Team ID"**
   - **COPIE** este ID (exemplo: `XYZ987ABC6`)
   - Você precisará dele para o Supabase

### Passo 6: Abrir Arquivo .p8

1. **Abra o arquivo `.p8`** que você baixou (pode usar TextEdit, VS Code, etc.)
2. **Selecione TODO o conteúdo** (Cmd+A)
3. **Copie** (Cmd+C)
4. O conteúdo deve parecer com:
   ```
   -----BEGIN PRIVATE KEY-----
   MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
   ... (várias linhas) ...
   -----END PRIVATE KEY-----
   ```

---

## 📋 Dados Que Você Precisa Ter

Após criar a Key, você deve ter:

1. ✅ **Arquivo `.p8` baixado** (guarde em segurança!)
2. ✅ **Conteúdo completo do arquivo `.p8`** (copiado)
3. ✅ **Key ID** (copiado)
4. ✅ **Team ID** (copiado)

---

## ✅ Próximo Passo: Colar no Supabase

Quando tiver todos os dados acima:

1. **Acesse:** https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn
2. Vá em **Authentication** → **Providers** → **Apple**
3. **Ative o toggle** "Enable Sign in with Apple"
4. **Preencha os campos:**
   - **Service ID**: `com.chefiapp.app.oauth`
   - **Secret Key**: Cole TODO o conteúdo do arquivo `.p8` (incluindo `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`)
   - **Key ID**: Cole o Key ID que você copiou
   - **Team ID**: Cole o Team ID que você copiou
5. **Clique em "Save"**

---

## ⚠️ Importante

### Sobre o Arquivo .p8:

- ✅ **Cole o arquivo COMPLETO** no Supabase (incluindo headers)
- ✅ **Não remova** `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`
- ✅ **Guarde o arquivo em segurança** (você não pode baixar novamente)
- ✅ **Não compartilhe** o arquivo publicamente

### Formato Correto do Secret Key:

```
-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
... (várias linhas) ...
-----END PRIVATE KEY-----
```

**❌ ERRADO:** Remover os headers ou colar apenas parte do conteúdo

---

## 🐛 Problemas Comuns

### Problema: "Não vejo o botão Download"

**Solução:**
- Verifique se você está na tela de confirmação após criar a Key
- Se fechou a janela, você não pode mais baixar - precisará criar uma nova Key

### Problema: "Não encontro o Team ID"

**Solução:**
- O Team ID geralmente aparece no topo da página do Apple Developer Portal
- Ou na mesma tela onde você vê o Key ID
- É um código alfanumérico (exemplo: `XYZ987ABC6`)

### Problema: "Arquivo .p8 não abre"

**Solução:**
- Use um editor de texto simples (TextEdit no Mac)
- Ou VS Code / Cursor
- O arquivo é texto puro, não precisa de aplicativo especial

---

## ✅ Checklist

Antes de colar no Supabase, confirme:

- [ ] Arquivo `.p8` baixado e guardado em segurança
- [ ] Conteúdo completo do `.p8` copiado (incluindo headers)
- [ ] Key ID copiado
- [ ] Team ID copiado
- [ ] Service ID anotado: `com.chefiapp.app.oauth`

---

**Status**: ⚠️ **AÇÃO NECESSÁRIA** - Criar Key (.p8) no Apple Developer Portal

