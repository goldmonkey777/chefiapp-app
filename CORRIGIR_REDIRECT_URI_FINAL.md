# ✅ Corrigir Redirect URI - Solução Final

**Erro:** `redirect_uri_mismatch`  
**Causa:** Deep links não são aceitos em OAuth Client "Web application"

---

## 🎯 Solução Simplificada

**Boa notícia:** Com Supabase, você NÃO precisa criar clientes separados para iOS/Android!

O fluxo funciona assim:
1. App → Supabase OAuth → Google
2. Google → Supabase callback (`https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`)
3. Supabase → App via deep link (`chefiapp://auth/callback`)

**Então, você só precisa da URL do Supabase no Google Cloud Console!**

---

## ✅ Passo a Passo Corrigido

### Passo 1: Limpar Redirect URIs no Google Cloud Console

1. **Acesse:** https://console.cloud.google.com/
2. Vá em **APIs & Services** → **Credentials**
3. **Clique no seu OAuth Client ID** (tipo "Web application")
4. Na seção **Authorized redirect URIs**, **REMOVA**:
   - ❌ `chefiapp://auth/callback` (não é aceito em Web application)
   - ❌ `com.chefiapp.app://auth/callback` (não é aceito em Web application)

### Passo 2: Adicionar Apenas URLs Web Válidas

**Mantenha APENAS estas URLs** (que começam com `https://` ou `http://`):

```
https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
https://chefiapp.com/auth/callback
http://localhost:5173/auth/callback
```

**⚠️ IMPORTANTE:**
- ✅ Todas começam com `https://` ou `http://`
- ✅ Nenhuma usa esquema customizado (`chefiapp://`)
- ✅ A primeira (`https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`) é **OBRIGATÓRIA**

### Passo 3: Salvar

1. **Clique em "Save"**
2. **Aguarde 1-2 minutos** para propagação

---

## 🔍 Como Funciona o Fluxo

### Fluxo Completo:

```
1. Usuário clica "Continuar com Google"
   ↓
2. App chama Supabase OAuth
   ↓
3. Supabase redireciona para Google
   ↓
4. Usuário faz login no Google
   ↓
5. Google redireciona para Supabase:
   https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback
   ↓
6. Supabase processa o callback
   ↓
7. Supabase redireciona para o app via deep link:
   chefiapp://auth/callback
   ↓
8. App detecta o deep link e processa o login
```

**Por isso você só precisa da URL do Supabase no Google Cloud Console!**

---

## ✅ Verificar Configuração do Supabase

O Supabase já deve estar configurado para redirecionar para o deep link. Verifique:

1. **Acesse:** https://supabase.com/dashboard/project/mcmxniuokmvzuzqfnpnn
2. Vá em **Authentication** → **URL Configuration**
3. Verifique se estas URLs estão em **Redirect URLs**:
   ```
   chefiapp://auth/callback
   com.chefiapp.app://auth/callback
   https://chefiapp.com/auth/callback
   http://localhost:5173/auth/callback
   ```

**Essas URLs no Supabase são diferentes das URLs no Google Cloud Console!**
- **Google Cloud Console:** Apenas URLs web (`https://`)
- **Supabase:** URLs web + deep links (`chefiapp://`)

---

## ✅ Verificar Deep Links no App

Certifique-se de que os deep links estão configurados:

### iOS (Info.plist):
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

### Android (AndroidManifest.xml):
```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="chefiapp" android:host="auth" android:pathPrefix="/callback" />
</intent-filter>
```

---

## 📋 Checklist Final

### Google Cloud Console (Web Application):
- [ ] Apenas URLs web (`https://` ou `http://`)
- [ ] `https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback` está presente
- [ ] Nenhum deep link (`chefiapp://`) na lista
- [ ] Salvo com sucesso

### Supabase Dashboard:
- [ ] `chefiapp://auth/callback` está em Redirect URLs
- [ ] `com.chefiapp.app://auth/callback` está em Redirect URLs
- [ ] URLs web também estão presentes

### App (Código):
- [ ] Deep links configurados no `Info.plist` (iOS)
- [ ] Deep links configurados no `AndroidManifest.xml` (Android)
- [ ] `capacitor.config.ts` tem `iosScheme: 'chefiapp'`

---

## 🧪 Testar

Após fazer as alterações:

1. **Salve no Google Cloud Console**
2. **Aguarde 1-2 minutos**
3. **Feche completamente o app**
4. **Abra o app novamente**
5. **Tente fazer login com Google**

O erro `redirect_uri_mismatch` deve desaparecer!

---

## 🎯 Resumo

**Google Cloud Console:**
- ✅ Apenas URLs web (`https://mcmxniuokmvzuzqfnpnn.supabase.co/auth/v1/callback`)
- ❌ Sem deep links (`chefiapp://`)

**Supabase Dashboard:**
- ✅ URLs web + deep links (`chefiapp://auth/callback`)

**Por quê?**
- Google → Supabase (usa URL web)
- Supabase → App (usa deep link)

---

**Status**: ⚠️ **AÇÃO NECESSÁRIA** - Remover deep links do Google Cloud Console e manter apenas URLs web

