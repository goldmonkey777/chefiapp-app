# 🔍 Debug: Deep Link Não Está Funcionando

**Problema:** Após fazer login com Google/Apple, não redireciona para o aplicativo. O iOS não encontra o caminho do deep link.

---

## 🔍 Verificações Necessárias

### 1. Verificar se o Deep Link Está Configurado Corretamente

**Info.plist:**
```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>com.chefiapp.app</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>com-chefiapp-app</string>
        </array>
    </dict>
</array>
```

**Status:** ✅ Configurado corretamente

### 2. Verificar AppDelegate

O `AppDelegate.swift` deve ter o método `application(_:open:options:)` que delega para `ApplicationDelegateProxy`.

**Status:** ✅ Configurado corretamente (com logs de debug adicionados)

### 3. Verificar Capacitor Config

**capacitor.config.ts:**
```typescript
iosScheme: 'com-chefiapp-app'
```

**Status:** ✅ Configurado corretamente

---

## 🐛 Possíveis Causas

### Causa 1: Capacitor Não Sincronizado

O Capacitor pode não ter sincronizado as configurações do `Info.plist`.

**Solução:** Execute `npx cap sync ios`

### Causa 2: App Não Está Registrado no iOS

O iOS pode não ter registrado o URL scheme do app.

**Solução:** 
- Feche completamente o app
- Delete o app do simulador/dispositivo
- Reinstale o app
- Teste novamente

### Causa 3: Deep Link Não Está Sendo Recebido

O AppDelegate pode não estar recebendo o deep link.

**Solução:** Verifique os logs do Xcode quando tentar abrir o deep link

---

## 🧪 Teste Manual do Deep Link

### Passo 1: Verificar se o Deep Link Está Registrado

1. **No simulador/dispositivo, abra o Safari**
2. **Na barra de endereço, digite:**
   ```
   com-chefiapp-app://auth/callback
   ```
3. **Pressione Enter**

**O que deve acontecer:**
- ✅ O app deve abrir automaticamente
- ✅ Se não abrir, o deep link não está registrado corretamente

### Passo 2: Verificar Logs do Xcode

1. **Abra o Xcode**
2. **Conecte o simulador/dispositivo**
3. **Vá em: View → Debug Area → Activate Console**
4. **Tente fazer login com Google/Apple**
5. **Procure por logs que começam com:** `🔗 [AppDelegate]`

**Se você ver os logs:**
- ✅ O deep link está sendo recebido
- ✅ O problema pode estar no processamento do callback

**Se você NÃO ver os logs:**
- ❌ O deep link não está sendo recebido
- ❌ O problema está na configuração do iOS

---

## 🔧 Soluções

### Solução 1: Reinstalar o App

1. **Delete o app do simulador/dispositivo**
2. **No Xcode:**
   - Product → Clean Build Folder (Cmd+Shift+K)
   - Product → Build (Cmd+B)
   - Product → Run (Cmd+R)
3. **Teste o deep link manualmente no Safari**

### Solução 2: Verificar Build Settings

No Xcode:
1. Selecione o projeto **App**
2. Vá em **Build Settings**
3. Procure por **"Info.plist File"**
4. Verifique se está apontando para `App/Info.plist`

### Solução 3: Verificar URL Scheme no Xcode

No Xcode:
1. Selecione o target **App**
2. Vá na aba **Info**
3. Expanda **"URL Types"**
4. Verifique se tem `com-chefiapp-app` configurado

---

## 📋 Checklist de Debug

- [ ] Info.plist tem `com-chefiapp-app` no CFBundleURLSchemes
- [ ] capacitor.config.ts tem `iosScheme: 'com-chefiapp-app'`
- [ ] AppDelegate tem método `application(_:open:options:)`
- [ ] `npx cap sync ios` foi executado após mudanças
- [ ] App foi rebuild após mudanças
- [ ] App foi reinstalado no simulador/dispositivo
- [ ] Deep link manual funciona no Safari (`com-chefiapp-app://auth/callback`)
- [ ] Logs do AppDelegate aparecem quando deep link é aberto

---

## 🎯 Próximos Passos

1. **Execute:** `npx cap sync ios`
2. **Delete e reinstale o app** no simulador/dispositivo
3. **Teste o deep link manualmente** no Safari
4. **Verifique os logs** do Xcode durante o OAuth
5. **Me avise o que aparece nos logs**

---

**Status**: 🔴 **DEBUG NECESSÁRIO** - Verificar logs e configuração

