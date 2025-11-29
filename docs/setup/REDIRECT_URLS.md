# 🔗 CONFIGURAR REDIRECT URLs NO SUPABASE

**Tempo:** 2 minutos  
**Status:** ✅ Storage Bucket criado

---

## 🎯 OBJETIVO

Configurar URLs de redirecionamento para que o OAuth funcione corretamente no app mobile quando usuários fazem login com Google ou Apple.

---

## 📋 PASSO A PASSO DETALHADO

### 1. Acessar Configurações de Autenticação

1. Acesse o Supabase Dashboard:
   - URL: https://supabase.com/dashboard
   - Faça login se necessário

2. Selecione seu projeto:
   - Clique no projeto correto na lista (se tiver múltiplos)

3. No menu lateral esquerdo:
   - Procure por **Authentication**
   - Clique em **Authentication**

### 2. Abrir URL Configuration

1. Dentro de **Authentication**, você verá várias abas:
   - Users
   - Policies
   - Providers
   - **URL Configuration** ← Clique aqui

2. A aba **URL Configuration** será aberta

### 3. Verificar Site URL

1. Na parte superior, você verá **Site URL**
2. Verifique se está configurado:
   - Para desenvolvimento: `http://localhost:3000` ou similar
   - Para produção: sua URL real do app web (se tiver)
3. **Nota:** Esta URL é para web apps, não é crítica para mobile

### 4. Adicionar Redirect URLs

1. Role a página até encontrar a seção **Redirect URLs**
2. Você verá:
   - Um campo de texto para adicionar URLs
   - Uma lista de URLs já configuradas (se houver)

#### 4.1 Adicionar URL Principal (Obrigatória)

1. No campo de texto, digite ou cole:
   ```
   chefiapp://auth/callback
   ```
   - ⚠️ **IMPORTANTE:** Use exatamente este formato (sem espaços, tudo minúsculo)
   - Este é o deep link que o app iOS/Android usa

2. Clique em **Add URL** ou pressione Enter
3. A URL deve aparecer na lista abaixo

#### 4.2 Adicionar URL Alternativa (Recomendada)

1. Adicione também:
   ```
   com.chefiapp.app://auth/callback
   ```
   - Esta é uma alternativa usando o bundle ID completo
   - Garante compatibilidade com diferentes configurações

2. Clique em **Add URL**

#### 4.3 Adicionar URL para Web (Produção)

Para o app web em produção:

1. Adicione:
   ```
   https://chefiapp.com/auth/callback
   ```
   - Este é o domínio de produção do app

2. Clique em **Add URL**

#### 4.4 Adicionar URL para Desenvolvimento Web (Opcional)

Se você também testa o app em um navegador web durante desenvolvimento:

1. Adicione:
   ```
   http://localhost:5173/auth/callback
   ```
   - Substitua `5173` pela porta que você usa (Vite usa 5173 por padrão)

2. Clique em **Add URL**

### 5. Verificar URLs Adicionadas

1. Confirme que todas as URLs aparecem na lista:
   - ✅ `chefiapp://auth/callback`
   - ✅ `com.chefiapp.app://auth/callback` (se adicionou)
   - ✅ `http://localhost:5173/auth/callback` (se adicionou)

2. Verifique se não há:
   - Erros de formatação
   - URLs duplicadas
   - Espaços extras

### 6. Salvar Configurações

1. Role até o final da página
2. Procure pelo botão **Save** ou **Update**
3. Clique em **Save**
4. Aguarde alguns segundos
5. Você deve ver uma mensagem de confirmação (ex: "Settings updated successfully")

### 7. Verificação Final

1. Recarregue a página (F5 ou Cmd+R)
2. Vá novamente em **Authentication** → **URL Configuration**
3. Confirme que todas as URLs ainda estão lá
4. Se alguma URL sumiu, adicione novamente

---

## ✅ CONFIGURAÇÃO CORRETA

Após configurar, você deve ter:

```
Redirect URLs:
✅ chefiapp://auth/callback (mobile iOS/Android)
✅ com.chefiapp.app://auth/callback (mobile alternativo)
✅ https://chefiapp.com/auth/callback (web produção)
✅ http://localhost:5173/auth/callback (web desenvolvimento, opcional)
```

---

## 🔍 ONDE ESSAS URLs SÃO USADAS?

### No Código do App

Essas URLs são usadas em:
- `src/hooks/useAuth.ts` - Funções `signInWithGoogle()` e `signInWithApple()`
- O código já está configurado para usar `chefiapp://auth/callback`

### Fluxo de OAuth

1. Usuário clica em "Login com Google/Apple"
2. App abre navegador/Safari para autenticação
3. Após login, Supabase redireciona para uma das URLs configuradas
4. App captura o redirecionamento e processa o token
5. Usuário é autenticado no app

---

## 🆘 TROUBLESHOOTING

### Problema: "Redirect URL mismatch"

**Causa:** A URL usada no código não está na lista de Redirect URLs

**Solução:**
1. Verifique qual URL o código está usando
2. Adicione essa URL exata na lista
3. Certifique-se de que não há espaços ou diferenças de maiúsculas/minúsculas

### Problema: URLs não aparecem após salvar

**Causa:** Possível bug do Supabase ou cache do navegador

**Solução:**
1. Recarregue a página (F5)
2. Limpe o cache do navegador
3. Tente adicionar novamente

### Problema: Deep link não funciona no app

**Causa:** URL scheme não configurado no projeto iOS/Android

**Solução:**
1. Verifique `ios/App/App/Info.plist` - deve ter `CFBundleURLSchemes` com `chefiapp`
2. Verifique `android/app/src/main/AndroidManifest.xml` - deve ter intent-filter correto
3. Execute `npx cap sync ios` após mudanças

---

## 📱 VERIFICAR CONFIGURAÇÃO NO APP

### iOS (Info.plist)

O arquivo `ios/App/App/Info.plist` deve ter:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>chefiapp</string>
        </array>
    </dict>
</array>
```

### Android (AndroidManifest.xml)

O arquivo `android/app/src/main/AndroidManifest.xml` deve ter:

```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="chefiapp" android:host="auth" android:path="/callback" />
</intent-filter>
```

---

## ✅ PRÓXIMO PASSO

Após configurar as Redirect URLs:

1. ✅ **Storage Bucket** - JÁ FEITO ✅
2. ✅ **Redirect URLs** - VOCÊ ESTÁ AQUI
3. ⏭️ **OAuth Providers** (opcional) - Google e Apple

---

## 🎉 CONCLUSÃO

Após seguir este guia, suas Redirect URLs estarão configuradas e o OAuth funcionará corretamente no app!

**Última atualização:** $(date)

