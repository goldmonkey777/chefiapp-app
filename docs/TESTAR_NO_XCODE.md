# 📱 Como Testar o ChefIApp no Xcode

**Guia completo para testar o app iOS no Xcode**

---

## 🚀 Método Rápido (Recomendado)

### Passo 1: Preparar o Projeto

```bash
# 1. Fazer build do projeto web
npm run build

# 2. Sincronizar com Capacitor
npx cap sync ios

# 3. Abrir no Xcode
npx cap open ios
```

**Ou use o comando único:**
```bash
npm run mobile:build && npm run mobile:open:ios
```

---

## 📋 Passo a Passo Detalhado

### 1️⃣ Build do Projeto Web

O Capacitor precisa do build web atualizado:

```bash
npm run build
```

**O que isso faz:**
- Compila o projeto React/Vite
- Gera arquivos em `dist/`
- Esses arquivos serão copiados para o app iOS

---

### 2️⃣ Sincronizar com Capacitor

```bash
npx cap sync ios
```

**O que isso faz:**
- Copia arquivos de `dist/` para `ios/App/App/public/`
- Atualiza configurações do Capacitor
- Sincroniza plugins nativos

---

### 3️⃣ Abrir no Xcode

```bash
npx cap open ios
```

**Ou manualmente:**
- Abra `ios/App/App.xcworkspace` (⚠️ **NÃO** `.xcodeproj`)
- O workspace inclui os Pods do CocoaPods

---

## 🎯 No Xcode

### Selecionar Simulador

1. **No topo do Xcode**, clique no dropdown ao lado do botão "Run"
2. **Selecione um simulador iOS:**
   - iPhone 15 Pro (recomendado)
   - iPhone 14 Pro
   - iPhone SE (3rd generation)
   - Qualquer outro disponível

### Executar o App

1. **Pressione `Cmd+R`** (ou clique no botão ▶️ Play)
2. **Aguarde o build** (pode levar alguns minutos na primeira vez)
3. **O simulador abrirá automaticamente**

---

## ⚠️ Problemas Comuns e Soluções

### 1. Erro: "Could not build module 'Capacitor'"

**Solução:**
- Esses são warnings conhecidos do Capacitor
- O app ainda funciona normalmente
- Pode ignorar se o build completar

**Se persistir:**
```bash
cd ios/App
pod install
pod update
```

---

### 2. Pop-up "Revoke Certificate"

**Solução:**
- **Cancele** o pop-up
- Não é necessário certificado para simulador
- O app funciona sem certificado no simulador

---

### 3. Erro: "No such module 'Capacitor'"

**Solução:**
```bash
cd ios/App
pod install
```

Depois, no Xcode:
- `Product → Clean Build Folder` (Cmd+Shift+K)
- `Product → Build` (Cmd+B)

---

### 4. App não carrega / Tela branca

**Solução:**
1. Verifique se o build web foi feito: `npm run build`
2. Sincronize novamente: `npx cap sync ios`
3. No Xcode: `Product → Clean Build Folder` (Cmd+Shift+K)
4. Execute novamente: `Cmd+R`

---

### 5. Deep Links não funcionam

**Verificar:**
- `capacitor.config.ts` tem `iosScheme: 'com-chefiapp-app'`
- `Info.plist` tem `CFBundleURLSchemes` configurado
- Sincronize novamente: `npx cap sync ios`

---

## 🔧 Comandos Úteis

### Limpar Build

```bash
# No terminal
cd ios/App
rm -rf DerivedData

# No Xcode
Cmd+Shift+K (Clean Build Folder)
```

### Reinstalar Pods

```bash
cd ios/App
rm -rf Pods Podfile.lock
pod install
```

### Ver Logs do Simulador

No Xcode:
- `View → Debug Area → Show Debug Area` (Cmd+Shift+Y)
- Ou clique no botão de debug no topo

---

## 📱 Testando Funcionalidades

### 1. Autenticação OAuth

1. Abra o app no simulador
2. Clique em "Continuar com Google" ou "Continuar com Apple"
3. O Safari abrirá para autenticação
4. Após autenticar, o app deve receber o callback

**Verificar logs:**
- No Xcode Console, procure por:
  - `🔗 [AppDelegate] Deep link recebido`
  - `✅ [App] OAuth session established`

### 2. Deep Links

Para testar deep links manualmente:

```bash
# No terminal do Mac
xcrun simctl openurl booted "com-chefiapp-app://auth/callback?access_token=test"
```

### 3. Geolocalização

O simulador permite simular localização:
- `Debug → Location → Custom Location`
- Ou `Debug → Location → Apple`

---

## 🎨 Atalhos do Xcode

| Atalho | Ação |
|--------|------|
| `Cmd+R` | Executar app |
| `Cmd+B` | Build apenas |
| `Cmd+Shift+K` | Limpar build |
| `Cmd+.` | Parar execução |
| `Cmd+Shift+Y` | Mostrar/ocultar debug area |
| `Cmd+Shift+O` | Abrir rapidamente arquivo |

---

## 📊 Verificando Performance

### Instruments

1. No Xcode: `Product → Profile` (Cmd+I)
2. Selecione um template:
   - **Time Profiler** - Performance de CPU
   - **Allocations** - Uso de memória
   - **Network** - Requisições de rede

### Console Logs

No Xcode Console, procure por:
- `⚡️ Loading app at...`
- `🔗 [AppDelegate] Deep link recebido`
- `✅ [App] OAuth session established`
- Erros em vermelho

---

## 🐛 Debugging

### Breakpoints

1. Clique na margem esquerda do editor (ao lado do número da linha)
2. Um ponto azul aparecerá
3. Quando o código chegar ali, o Xcode pausará
4. Use `F6` para avançar linha por linha
5. Use `F7` para entrar em funções
6. Use `F8` para continuar execução

### Console Debug

No código Swift, use:
```swift
print("🔗 [AppDelegate] Debug message")
```

No código JavaScript/TypeScript, use:
```typescript
console.log('🔗 [App] Debug message');
```

---

## ✅ Checklist de Teste

Antes de testar, verifique:

- [ ] Build web feito (`npm run build`)
- [ ] Capacitor sincronizado (`npx cap sync ios`)
- [ ] Xcode aberto com workspace (`.xcworkspace`)
- [ ] Simulador selecionado
- [ ] Variáveis de ambiente configuradas (se necessário)

---

## 🚀 Próximos Passos

Após testar no simulador:

1. **Testar em dispositivo físico:**
   - Conectar iPhone via USB
   - Selecionar dispositivo no Xcode
   - Executar (requer Apple Developer account)

2. **Preparar para App Store:**
   - Configurar certificados
   - Configurar provisioning profiles
   - Ver guia: `docs/mobile/APP_STORE.md`

---

## 📚 Referências

- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [Xcode User Guide](https://developer.apple.com/documentation/xcode)
- [iOS Simulator Guide](https://developer.apple.com/documentation/xcode/running-your-app-in-the-simulator-or-on-a-device)

---

**Made with ❤️ by [goldmonkey.studio](https://goldmonkey.studio)**

