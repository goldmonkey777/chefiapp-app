# 📱 Guia Completo de Submissão - Apple App Store & Google Play Store

**Data:** 29 de novembro de 2024
**App:** ChefIApp - Hospitality Intelligence
**Versão:** 1.0.0

---

# 🍎 PARTE 1: APPLE APP STORE (iOS)

## 📋 PRÉ-REQUISITOS

### 1. **Apple Developer Account** (OBRIGATÓRIO)
- **Custo:** $99 USD/ano
- **Link:** https://developer.apple.com/programs/enroll/
- **Documentos necessários:**
  - CPF/CNPJ (para Brasil)
  - Cartão de crédito internacional
  - Informações da empresa (se conta corporativa)

**PASSOS:**
1. Acesse https://developer.apple.com/programs/enroll/
2. Clique "Start Your Enrollment"
3. Escolha:
   - **Individual:** Para pessoa física ($99/ano)
   - **Organization:** Para empresa ($99/ano + DUNS number)
4. Preencha dados pessoais/empresariais
5. Aceite os termos e condições
6. Pague $99 USD (renovação anual automática)
7. **Aguarde aprovação: 24-48 horas**

### 2. **Certificados e Provisioning Profiles**

#### A. **Apple Developer Certificate (Certificado de Distribuição)**

**No Mac (com Xcode instalado):**

```bash
# 1. Abrir Keychain Access
# Applications > Utilities > Keychain Access

# 2. Menu: Keychain Access > Certificate Assistant > Request a Certificate from a Certificate Authority

# Preencher:
- User Email: seu-email@exemplo.com
- Common Name: Seu Nome ou Nome da Empresa
- CA Email: (deixar vazio)
- Request: Saved to disk
- Let me specify key pair information: (marcar)

# 3. Salvar o arquivo .certSigningRequest

# 4. Ir para Apple Developer Portal
# https://developer.apple.com/account/resources/certificates/list

# 5. Clicar no botão "+" para criar novo certificado

# 6. Selecionar:
- "Apple Distribution" (para App Store)

# 7. Upload do .certSigningRequest

# 8. Download do certificado (.cer)

# 9. Dar duplo clique no .cer para instalar no Keychain
```

#### B. **App ID (Identificador do App)**

```bash
# 1. Ir para App IDs
# https://developer.apple.com/account/resources/identifiers/list

# 2. Clicar no botão "+"

# 3. Selecionar "App IDs" > Continue

# 4. Selecionar "App" > Continue

# 5. Preencher:
- Description: ChefIApp - Hospitality Intelligence
- Bundle ID: com.chefiapp.hospitality (EXPLICIT)
  ⚠️ IMPORTANTE: Deve ser EXATAMENTE igual ao Bundle ID no Xcode

# 6. Capabilities (marcar conforme necessário):
  ✅ Push Notifications (se usar notificações)
  ✅ Sign In with Apple (se usar Apple Sign In)
  ✅ Associated Domains (se usar deep links)
  ✅ In-App Purchase (se vender dentro do app)

# 7. Clicar "Continue" > "Register"
```

#### C. **Provisioning Profile (Perfil de Provisionamento)**

```bash
# 1. Ir para Provisioning Profiles
# https://developer.apple.com/account/resources/profiles/list

# 2. Clicar no botão "+"

# 3. Selecionar "App Store" > Continue

# 4. Selecionar o App ID criado (com.chefiapp.hospitality)

# 5. Selecionar o certificado de distribuição criado

# 6. Nome do profile: ChefIApp App Store Profile

# 7. Download do .mobileprovision

# 8. Dar duplo clique para instalar no Xcode
```

---

## 🔧 CONFIGURAÇÃO NO XCODE

### 1. **Abrir Projeto no Xcode**

```bash
cd /Users/goldmonkey/Downloads/chefiapp---hospitality-intelligence
npm run mobile:open:ios
# ou
open ios/App/App.xcworkspace
```

### 2. **Configurações Gerais (General Tab)**

```
Selecionar projeto "App" no navigator (lado esquerdo)
Selecionar target "App"
Aba "General"

✅ Display Name: ChefIApp
✅ Bundle Identifier: com.chefiapp.hospitality
   ⚠️ CRÍTICO: Deve ser EXATAMENTE igual ao App ID criado

✅ Version: 1.0.0 (já configurado)
✅ Build: 1 (já configurado)

✅ Deployment Info:
   - iOS Deployment Target: 14.0 (ou superior)
   - iPhone, iPad (marcar dispositivos suportados)
   - Orientations: Portrait (recomendado para hospitality apps)

✅ App Icon:
   - Clicar em "AppIcon" > Adicionar ícones em todos os tamanhos
   - Usar https://appicon.co/ para gerar todos os tamanhos
```

### 3. **Signing & Capabilities (CRÍTICO)**

```
Aba "Signing & Capabilities"

⚠️ DESMARCAR "Automatically manage signing"

✅ Provisioning Profile:
   - Selecionar "ChefIApp App Store Profile" (criado anteriormente)

✅ Signing Certificate:
   - Selecionar "Apple Distribution: Seu Nome (TEAM_ID)"

✅ Team:
   - Selecionar sua equipe (mostra depois de criar Developer Account)

✅ Adicionar Capabilities (se necessário):
   + Push Notifications
   + Sign in with Apple
   + Associated Domains
```

### 4. **Adicionar Localizations (Idiomas)**

```
Selecionar projeto "App" (raiz)
Aba "Info"
Seção "Localizations"

Clicar no botão "+"

Adicionar:
✅ Portuguese (pt)
✅ Spanish (es)
✅ French (fr)
✅ German (de)
✅ Italian (it)

Para cada idioma:
- Marcar "InfoPlist.strings" (já criamos anteriormente)
- Finish
```

### 5. **Build Settings**

```
Aba "Build Settings"
Procurar por "Code Signing"

✅ Code Signing Identity:
   - Debug: Apple Development
   - Release: Apple Distribution

✅ Code Signing Style: Manual

✅ Provisioning Profile:
   - Release: ChefIApp App Store Profile

Procurar por "Versioning"

✅ Current Project Version: 1
✅ Marketing Version: 1.0.0
```

---

## 📦 GERAR BUILD PARA APP STORE

### 1. **Configurar Scheme para Release**

```
No Xcode:
1. Product > Scheme > Edit Scheme...
2. Selecionar "Run" no lado esquerdo
3. Build Configuration: Release
4. Close
```

### 2. **Arquivar (Archive) o App**

```
No Xcode:
1. Selecionar "Any iOS Device (arm64)" no topo
   (NÃO selecionar simulador!)

2. Product > Archive
   (ou Command + Shift + B)

3. Aguardar o build completar (5-15 minutos)

4. Quando terminar, abre a janela "Organizer"
```

### 3. **Upload para App Store Connect**

```
Na janela "Organizer" (Archives):

1. Selecionar o arquivo mais recente
2. Clicar "Distribute App"
3. Selecionar "App Store Connect" > Next
4. Selecionar "Upload" > Next
5. Opções de distribuição:
   ✅ Upload app's symbols (para crash reports)
   ✅ Manage Version and Build Number (automático)
   🚫 Strip Swift symbols (deixar desmarcado)
6. Next
7. Selecionar certificado e provisioning profile (automático)
8. Next
9. Review: Verificar tudo está correto
10. Upload

⏱️ Aguardar upload (5-30 minutos dependendo da internet)

✅ Quando terminar: "Upload Successful"
```

---

## 🌐 APP STORE CONNECT (CRÍTICO)

### 1. **Criar App no App Store Connect**

```
1. Acessar https://appstoreconnect.apple.com/
2. Login com Apple Developer Account
3. Clicar "My Apps"
4. Clicar no botão "+" > "New App"

Preencher:
✅ Platforms: iOS
✅ Name: ChefIApp - Hospitality Intelligence
   (máximo 30 caracteres)
✅ Primary Language: Portuguese (Brazil) ou English (U.S.)
✅ Bundle ID: Selecionar "com.chefiapp.hospitality"
✅ SKU: chefiapp-ios-001 (identificador único interno)
✅ User Access: Full Access (ou limitado)

5. Clicar "Create"
```

### 2. **Preencher Informações do App**

#### **2.1. App Information (Informações do App)**

```
Seção "General Information"

✅ Name: ChefIApp
✅ Subtitle (opcional): Hospitality Intelligence
   (máximo 30 caracteres)

✅ Category:
   - Primary: Business
   - Secondary: Productivity

✅ Content Rights:
   ( ) Contains third-party content
   (•) Does not contain third-party content

✅ Age Rating: Clicar "Edit"
   - Responder questionário
   - ChefIApp é 4+ (sem conteúdo adulto)

Seção "App Store Promotion" (opcional)
- Promotional Text: Texto que pode ser atualizado sem nova versão
```

#### **2.2. Pricing and Availability (Preço e Disponibilidade)**

```
✅ Price Schedule:
   - Selecionar "Free" (grátis)
   - Ou selecionar preço se for pago

✅ Availability:
   - (•) Available in all territories
   - Ou selecionar países específicos

✅ App Distribution Methods:
   ✅ Public (na App Store)
   🚫 Private (apenas para organizações)

✅ Pre-Order (opcional):
   - Permite que usuários façam pré-venda
```

#### **2.3. App Privacy (Privacidade) - OBRIGATÓRIO**

```
⚠️ CRÍTICO: Desde iOS 14, é obrigatório declarar coleta de dados

Clicar "Get Started" em "App Privacy"

Perguntas:

1️⃣ "Does your app or third-party partners collect data from this app?"
   (•) Yes (ChefIApp coleta dados de usuários)

2️⃣ Tipos de dados coletados (marcar conforme ChefIApp):

   ✅ Contact Info:
      - Name (para criar perfil)
      - Email (para autenticação)
      - Phone Number (opcional, se coletar)

   ✅ User Content:
      - Photos (se usuário faz upload de foto de perfil)
      - Other User Content (dados de check-in, tasks, etc.)

   ✅ Identifiers:
      - User ID (Supabase auth)
      - Device ID (se usar analytics)

   ✅ Usage Data (se usar analytics):
      - Product Interaction
      - App Interactions

3️⃣ Para cada tipo de dado, especificar:

   ✅ Purpose (Finalidade):
      - App Functionality (funcionalidade do app)
      - Analytics (se aplicável)
      - Product Personalization (personalização)

   ✅ Linked to User? (Vinculado ao usuário?)
      (•) Yes - dados identificam o usuário

   ✅ Used for Tracking? (Usado para rastreamento?)
      ( ) Yes (se usar ads/tracking)
      (•) No (se não usar)

4️⃣ Review e Submit
```

#### **2.4. App Review Information (Informações para Revisão)**

```
⚠️ CRÍTICO: Apple vai testar o app - forneça credenciais de teste!

✅ Sign-in required:
   (•) Yes - usuários precisam fazer login

✅ Demo Account (OBRIGATÓRIO):
   Username: demo@chefiapp.com
   Password: Demo@2024!

   ⚠️ CRIAR CONTA DE TESTE FUNCIONAL ANTES DE SUBMETER!

✅ Contact Information:
   First Name: Seu Nome
   Last Name: Sobrenome
   Phone Number: +351 912 345 678 (com código do país)
   Email: contato@chefiapp.com

✅ Notes (opcional mas recomendado):
   """
   ChefIApp is a hospitality workforce management app.

   To test:
   1. Login with demo account
   2. Explore employee dashboard
   3. Test check-in/check-out
   4. View tasks and achievements

   The app uses Google Sign-In and Apple Sign-In for authentication.
   Camera and photo library permissions are used for profile photos.
   Location permission is used to show nearby locations (optional).

   Thank you for reviewing!
   """

✅ Attachment (se necessário):
   - Upload de documentos/screenshots extras
```

### 3. **Preparar Screenshots (OBRIGATÓRIO)**

#### **Tamanhos Necessários:**

```
iPhone (OBRIGATÓRIO - pelo menos 1 tamanho):

✅ iPhone 6.9" Display (iPhone 16 Pro Max, 15 Pro Max):
   - 3024 x 6926 pixels (portrait)
   - Ou 6926 x 3024 pixels (landscape)

✅ iPhone 6.7" Display (iPhone 16 Plus, 15 Plus, 14 Plus):
   - 2778 x 6018 pixels

✅ iPhone 6.5" Display (iPhone 11 Pro Max, XS Max):
   - 2688 x 5808 pixels

✅ iPhone 5.5" Display (iPhone 8 Plus, 7 Plus):
   - 2208 x 4928 pixels (DEPRECATED mas ainda aceito)

iPad (OPCIONAL mas recomendado):

✅ iPad Pro (6th Gen) 12.9-inch Display:
   - 2732 x 3648 pixels

✅ iPad Pro (2nd Gen) 12.9-inch Display:
   - 2732 x 3648 pixels
```

#### **Como Capturar Screenshots:**

```bash
# 1. No Xcode, rodar app em simuladores específicos:

# iPhone 6.9" (ou maior disponível)
1. Xcode > Window > Devices and Simulators
2. Simulators > Add (+)
3. Selecionar "iPhone 15 Pro Max" ou "iPhone 16 Pro Max"
4. Rodar app (Command + R)

# 2. Capturar screenshots no simulador:
Command + S (salva em ~/Desktop)

# 3. Ou usar Device > Screenshot no Simulator menu

# 4. Capturar pelo menos 3-10 screenshots mostrando:
   ✅ Tela de login
   ✅ Dashboard principal
   ✅ Funcionalidade de check-in/out
   ✅ Lista de tarefas
   ✅ Perfil do usuário
   ✅ Rankings/achievements
```

#### **Ferramentas para Criar Screenshots Bonitos:**

```
🎨 Opções gratuitas/pagas:

1. Figma (gratuito):
   - Criar mockups com screenshots
   - Adicionar texto, backgrounds, etc.

2. Screenshot.rocks (gratuito):
   - https://screenshot.rocks/
   - Adiciona molduras de dispositivos

3. Previewed (gratuito/pago):
   - https://previewed.app/
   - Templates profissionais

4. AppLaunchpad (pago):
   - https://theapplaunchpad.com/
   - Templates para App Store

⚠️ IMPORTANTE:
- NÃO incluir mockups de dispositivos (apenas conteúdo)
- NÃO ultrapassar tamanhos especificados
- Screenshots devem mostrar app REAL, não protótipos
```

### 4. **Adicionar Screenshots no App Store Connect**

```
Em "App Store" > "1.0.0 Prepare for Submission"

Seção "App Previews and Screenshots"

Para cada tamanho de tela:
1. Arrastar screenshots (PNG ou JPG)
2. Ordem: Screenshots aparecem na ordem que você adicionar
3. Mínimo: 3 screenshots
4. Máximo: 10 screenshots

✅ Adicionar para cada idioma (PT, EN, ES, FR, DE, IT)
   - Ou usar "Use screenshots from Portuguese (Brazil)" para outros idiomas
```

### 5. **Preencher Descrições (por idioma)**

#### **Inglês (English - U.S.)**

```
✅ Name: ChefIApp
✅ Subtitle: Hospitality Intelligence

✅ Promotional Text (opcional, 170 chars):
Track shifts, complete tasks, and excel in hospitality service with ChefIApp.

✅ Description (4000 chars max):
[Usar descrição do STORE_LISTINGS_INTERNATIONAL.md - Inglês]

ChefIApp™ - Hospitality Workforce Intelligence

Transform your daily work in hotels and restaurants into achievements, track your professional progress, and excel in hospitality service.

🏨 DESIGNED FOR HOSPITALITY PROFESSIONALS
- Hotels, Resorts, Restaurants, Cafés
- All departments: Reception, Kitchen, Service, Housekeeping
- Real-time team coordination

✨ KEY FEATURES
...
[Copiar descrição completa do arquivo STORE_LISTINGS_INTERNATIONAL.md]

✅ Keywords (100 chars max, separados por vírgula):
hospitality,hotel,restaurant,workforce,staff,tasks,checkin,teamwork,service,employee
```

#### **Português (Portuguese - Brazil)**

```
✅ Name: ChefIApp
✅ Subtitle: Inteligência para Hotelaria

✅ Promotional Text:
Registe turnos, complete tarefas e destaque-se no serviço de hotelaria.

✅ Description:
[Usar descrição do STORE_LISTINGS_INTERNATIONAL.md - Português]

ChefIApp™ - Inteligência para Equipas de Hotelaria

Transforme o seu trabalho diário em hotéis e restaurantes em conquistas, acompanhe o seu progresso profissional e destaque-se no serviço de hotelaria.

🏨 CONCEBIDO PARA PROFISSIONAIS DE HOTELARIA
...
[Copiar descrição completa]

✅ Keywords:
hotelaria,hotel,restaurante,equipa,staff,tarefas,turno,servico,funcionario,trabalho
```

**Repetir para: ES, FR, DE, IT**

### 6. **Configurar Build**

```
Seção "Build"

✅ Selecionar o build que você enviou (Upload)
   - Aparece depois de ~30 min do upload
   - Versão: 1.0.0 (1)

⚠️ Se não aparecer:
   - Aguardar mais tempo (até 1 hora)
   - Verificar emails da Apple (pode ter erro)
   - Verificar "Activity" tab
```

### 7. **Export Compliance (Criptografia)**

```
⚠️ OBRIGATÓRIO responder sobre criptografia

Pergunta: "Does your app use encryption?"

Se ChefIApp usa HTTPS (sim, Supabase usa):

(•) Yes, my app uses encryption

Próxima pergunta:
"Is your app exempt from U.S. export compliance requirements?"

✅ Marcar: "Your app qualifies for exemption because..."
   Reason: "Uses standard encryption (HTTPS)"

Ou responder "No" e preencher:
- Export Compliance Documentation
- Encryption Registration (ERN) number (se tiver)

Para apps que usam apenas HTTPS padrão:
✅ Geralmente qualifica para exemption
```

### 8. **Advertising Identifier (IDFA)**

```
Pergunta: "Does this app use the Advertising Identifier (IDFA)?"

Se ChefIApp NÃO usa ads/tracking:
( ) Yes
(•) No

Se usar analytics (Firebase, etc.):
(•) Yes
   ✅ Marcar: "Attribute this app installation to a previously served advertisement"
   ✅ Marcar: "Attribute an action taken within this app to a previously served advertisement"
```

---

## 🚀 SUBMETER PARA REVISÃO

### 1. **Revisão Final**

```
Verificar TUDO:

✅ App Information: Completo
✅ Pricing: Configurado
✅ Privacy: Declarado
✅ App Review Information: Credenciais de teste fornecidas
✅ Screenshots: Adicionados (mínimo 3)
✅ Description: Preenchida em todos os idiomas
✅ Build: Selecionado
✅ Export Compliance: Respondido
✅ IDFA: Respondido
✅ Age Rating: 4+
✅ Content Rights: Sem conteúdo de terceiros
```

### 2. **Clicar "Submit for Review"**

```
1. App Store > Version 1.0.0
2. Botão azul "Submit for Review" (topo direito)
3. Confirmar todas as informações
4. Submit

✅ Status muda para "Waiting for Review"
```

---

## ⏱️ TIMELINE DE APROVAÇÃO (Apple)

```
📊 Tempo médio de revisão da Apple:

✅ Waiting for Review: 1-3 dias
✅ In Review: 1-24 horas (geralmente 2-6 horas)
✅ Pending Developer Release: Aprovado! (você escolhe quando lançar)

⚠️ Rejection (se rejeitado):
- Apple envia email explicando motivo
- Você corrige e resubmete
- Nova revisão: 1-3 dias

📈 Total estimado: 2-7 dias do submit à aprovação
```

---

## 📧 NOTIFICAÇÕES

Apple envia emails para:

✅ Build processado com sucesso
✅ Build pronto para submissão (após validação)
✅ App em revisão ("In Review")
✅ App aprovado ("Ready for Sale")
❌ App rejeitado (com explicação detalhada)
⚠️ Metadata rejeitado (screenshots, descrição, etc.)

---

## 🐛 PROBLEMAS COMUNS E SOLUÇÕES

### 1. **"Missing Provisioning Profile"**

```
Solução:
1. Verificar que Bundle ID no Xcode = App ID no Developer Portal
2. Recriar Provisioning Profile
3. Download e instalar no Xcode
4. Clean Build (Shift + Command + K)
5. Archive novamente
```

### 2. **"App Specific Password Required"**

```
Solução:
1. Ir para appleid.apple.com
2. Sign in > Security > App-Specific Passwords
3. Generate new password
4. Copiar senha
5. No Xcode: Accounts > Apple ID > Manage Certificates > App-Specific Password
```

### 3. **"Screenshot Size Invalid"**

```
Solução:
1. Verificar tamanhos exatos (3024x6926, 2778x6018, etc.)
2. NÃO redimensionar screenshots - capturar no simulador correto
3. Usar ferramentas como "screenshot.rocks" com templates corretos
```

### 4. **"Privacy Policy URL Required"**

```
Solução:
1. Hospedar política de privacidade em URL público
   - Exemplo: https://chefiapp.com/privacy-policy
   - Ou usar GitHub Pages (grátis)
2. Adicionar URL em App Store Connect > App Privacy
```

### 5. **"Demo Account Not Working"**

```
Solução:
1. Criar conta de teste REAL no app
2. Verificar email/senha funcionam
3. Testar login 3x antes de submeter
4. Deixar conta ativa (não deletar!)
```

---

## ✅ CHECKLIST FINAL - APPLE APP STORE

- [ ] Apple Developer Account criado e pago ($99/ano)
- [ ] Certificado de distribuição criado e instalado
- [ ] App ID criado (com.chefiapp.hospitality)
- [ ] Provisioning Profile criado e instalado
- [ ] Xcode configurado (Bundle ID, Signing, Capabilities)
- [ ] Localizations adicionadas no Xcode (6 idiomas)
- [ ] Build gerado (Archive) com sucesso
- [ ] Upload para App Store Connect realizado
- [ ] App criado no App Store Connect
- [ ] App Information preenchido
- [ ] Pricing & Availability configurado
- [ ] App Privacy declarado
- [ ] Screenshots capturados (mínimo 3, ideal 10)
- [ ] Descrições em 6 idiomas preenchidas
- [ ] Keywords otimizados
- [ ] App Review Information com credenciais de teste
- [ ] Build selecionado
- [ ] Export Compliance respondido
- [ ] IDFA respondido
- [ ] Submitted for Review
- [ ] Aguardando aprovação (2-7 dias)

---

# 🤖 PARTE 2: GOOGLE PLAY STORE (Android)

## 📋 PRÉ-REQUISITOS

### 1. **Google Play Console Account**

```
✅ Custo: $25 USD (pagamento único, vitalício)
✅ Link: https://play.google.com/console/signup

PASSOS:
1. Acessar https://play.google.com/console/signup
2. Login com Google Account
3. Selecionar:
   - Individual (pessoa física)
   - Organization (empresa - requer dados empresariais)
4. Preencher informações:
   - Nome completo ou nome da empresa
   - Endereço
   - Telefone
5. Aceitar termos e condições
6. Pagar $25 USD (cartão de crédito ou PayPal)
7. Verificação de identidade (pode levar 1-2 dias)
```

### 2. **Verificação de Identidade (Novo desde 2023)**

```
⚠️ Google Play agora exige verificação de identidade

Documentos aceitos:
✅ Passaporte
✅ Carteira de identidade (RG)
✅ Carteira de motorista (CNH)

Processo:
1. Google envia email solicitando verificação
2. Upload de documento (foto ou scan)
3. Selfie (foto do rosto)
4. Aguardar revisão (24-48 horas)
5. ✅ Conta aprovada
```

---

## 📦 GERAR BUILD PARA GOOGLE PLAY

### 1. **Keystore** (JÁ CRIADO!)

```
✅ Você já tem o keystore criado:
   Localização: android/app/my-upload-key.keystore
   Senha: ChefIApp2024!
   Alias: my-key-alias

⚠️ BACKUP DO KEYSTORE:
   Esse arquivo é CRÍTICO - se perder, não pode mais atualizar o app!

   Copiar para local seguro:
   - Cloud (Google Drive, Dropbox)
   - HD externo
   - Password manager
```

### 2. **Gerar Android App Bundle (AAB)**

```bash
# 1. Build web
export PATH="/Users/goldmonkey/.nvm/versions/node/v22.18.0/bin:$PATH"
npm run build

# 2. Sync Capacitor
npx cap sync android

# 3. Gerar AAB assinado
cd android
./gradlew bundleRelease

# ✅ AAB gerado em:
# android/app/build/outputs/bundle/release/app-release.aab

# 4. Verificar tamanho
ls -lh app/build/outputs/bundle/release/app-release.aab
# Esperado: ~5-8 MB
```

### 3. **Verificar AAB (Opcional mas Recomendado)**

```bash
# Usar bundletool do Google
# Download: https://github.com/google/bundletool/releases

# Validar AAB
java -jar bundletool.jar validate --bundle=app/build/outputs/bundle/release/app-release.aab

# ✅ Output esperado: "The APK is valid."

# Estimar tamanho de download
java -jar bundletool.jar get-size total --bundle=app/build/outputs/bundle/release/app-release.aab

# Exemplo:
# MIN,MAX
# 4.5MB,5.2MB
```

---

## 🌐 GOOGLE PLAY CONSOLE

### 1. **Criar App**

```
1. Acessar https://play.google.com/console/
2. Clicar "Create app"

Preencher:
✅ App name: ChefIApp - Hospitality Intelligence
   (máximo 30 caracteres)
✅ Default language: Portuguese (Brazil) ou English (United States)
✅ App or game: App
✅ Free or paid: Free
✅ Declarations:
   ✅ Developer Program Policies
   ✅ U.S. export laws

3. Clicar "Create app"
```

### 2. **Dashboard - Tarefas Obrigatórias**

Após criar, você verá o Dashboard com tarefas:

#### **TASK 1: Set up your app**

##### **2.1. App access**

```
Pergunta: "Is your app restricted to users who are part of a closed test, or users you invite?"

(•) No, my app does not require special access

Ou se tem área restrita:

(•) Yes, my app is restricted

Fornecer:
- Username: demo@chefiapp.com
- Password: Demo@2024!
- Instructions: "Login with provided credentials to access all features"

✅ Save
```

##### **2.2. Ads**

```
Pergunta: "Does your app contain ads?"

Se ChefIApp NÃO tem anúncios:
(•) No, my app does not contain ads

Se tem:
(•) Yes, my app contains ads

✅ Save
```

##### **2.3. Content rating**

```
⚠️ OBRIGATÓRIO - Classificação etária IARC

1. Clicar "Start questionnaire"
2. Preencher email de contato
3. Selecionar categoria:
   - (•) Utility, Productivity, Communication, or Other

4. Responder questionário (exemplos para ChefIApp):

   Q: Does your app depict violence?
   A: (•) No

   Q: Does your app contain sexual content?
   A: (•) No

   Q: Does your app contain crude humor?
   A: (•) No

   Q: Does your app allow users to interact or exchange information?
   A: (•) Yes (chat, teamwork features)

   Q: Does your app share user's physical location?
   A: ( ) Yes (se usar GPS)
       (•) No (se não usar)

   Q: Can users purchase physical goods?
   A: (•) No

5. Submit questionnaire

✅ Resultado esperado: Everyone (PEGI 3, ESRB Everyone)
✅ Save
```

##### **2.4. Target audience**

```
1. Select target age groups:
   ✅ 18 and over (app é para profissionais)

2. Does your app appeal to children?
   (•) No

✅ Save
```

##### **2.5. News app**

```
Pergunta: "Is your app a news app?"
(•) No

✅ Save
```

##### **2.6. COVID-19 contact tracing and status apps**

```
Pergunta: "Is your app a COVID-19 contact tracing or status app?"
(•) No

✅ Save
```

##### **2.7. Data safety**

```
⚠️ CRÍTICO - Similar à App Privacy da Apple

1. Clicar "Start"

2. Does your app collect or share user data?
   (•) Yes

3. Tipos de dados coletados (marcar conforme ChefIApp):

   ✅ Personal info:
      - Name
      - Email address
      - Phone number (se coletar)

   ✅ Photos and videos (se permitir upload de foto perfil):
      - Photos

   ✅ App activity:
      - App interactions (check-ins, tasks)
      - In-app search history (se aplicável)

   ✅ App info and performance:
      - Crash logs
      - Diagnostics

   ✅ Device or other IDs:
      - Device ID (para analytics)

4. Para cada tipo de dado, especificar:

   ✅ Data usage:
      - App functionality (principal)
      - Analytics (se aplicável)
      - Personalization (personalização)

   ✅ Data handling:
      - (•) Data is encrypted in transit (HTTPS - Supabase usa)
      - (•) Users can request data deletion
      - ( ) Data is not collected (dependendo do dado)

   ✅ Is data optional or required?
      - Name: Required
      - Email: Required
      - Photos: Optional

5. Review summary
6. Submit

✅ Save
```

##### **2.8. Government apps**

```
Pergunta: "Is this a government app?"
(•) No

✅ Save
```

##### **2.9. Financial features**

```
Pergunta: "Does your app facilitate financial transactions?"
(•) No (a menos que ChefIApp processe pagamentos)

✅ Save
```

---

#### **TASK 2: Store settings**

##### **2.10. App category**

```
✅ App category: Business
✅ Tags (opcional): Productivity, Workplace, Hospitality

✅ Save
```

##### **2.11. Store listing contact details**

```
✅ Email: contato@chefiapp.com
✅ Phone (opcional): +351 912 345 678
✅ Website (opcional): https://chefiapp.com

⚠️ IMPORTANTE: Email será exibido publicamente na Play Store

✅ Save
```

##### **2.12. External marketing**

```
Pergunta: "Do you want to opt in to marketing emails from Google Play?"
( ) Yes
(•) No (recomendado se não quiser emails)

✅ Save
```

---

### 3. **Store Listing (Main Store Listing)**

```
Navegação: Grow > Store presence > Main store listing
```

#### **3.1. App details**

```
✅ App name: ChefIApp

✅ Short description (80 chars):
Transform hotel & restaurant work into achievements. Track shifts & tasks!

✅ Full description (4000 chars):
[Usar descrição do STORE_LISTINGS_INTERNATIONAL.md - Inglês]

ChefIApp™ - Hospitality Workforce Intelligence

Transform your daily work in hotels and restaurants into achievements, track your professional progress, and excel in hospitality service.

🏨 DESIGNED FOR HOSPITALITY PROFESSIONALS
...
[Copiar descrição completa]

✅ Save
```

#### **3.2. Graphics (OBRIGATÓRIO)**

```
⚠️ TAMANHOS EXATOS REQUERIDOS

📱 Phone screenshots (OBRIGATÓRIO - mínimo 2, máximo 8):
   - 16:9 aspect ratio
   - Mínimo: 320px
   - Máximo: 3840px
   - Recomendado: 1080 x 1920 pixels (portrait)

📋 7-inch tablet screenshots (OPCIONAL mas recomendado):
   - 16:9 aspect ratio
   - Recomendado: 1200 x 1920 pixels

📋 10-inch tablet screenshots (OPCIONAL):
   - 16:9 aspect ratio
   - Recomendado: 1600 x 2560 pixels

🎨 Feature graphic (OBRIGATÓRIO):
   - 1024 x 500 pixels (EXATO)
   - JPG ou PNG (24-bit)
   - Sem transparência
   - Banner horizontal com logo + tagline

🔷 App icon (OPCIONAL - já vem do APK/AAB):
   - 512 x 512 pixels
   - PNG (32-bit)
   - Transparência permitida
```

**Como Criar Feature Graphic:**

```
Ferramentas:
1. Canva (gratuito): https://canva.com
   - Template: 1024 x 500 px
   - Adicionar logo + texto "ChefIApp - Hospitality Intelligence"
   - Background: Azul degradê (tema do app)

2. Figma (gratuito): https://figma.com
   - Criar frame 1024 x 500
   - Design profissional

3. Photoshop / GIMP
   - Dimensões exatas: 1024 x 500
```

#### **3.3. Traduções (Localizations)**

```
Para adicionar idiomas:

1. Clicar "Add language" (ou "Translate")
2. Selecionar idiomas:
   ✅ Portuguese (Brazil) - pt-BR
   ✅ Spanish - es
   ✅ French - fr
   ✅ German - de
   ✅ Italian - it

3. Para cada idioma, preencher:
   - App name (mesmo em todos)
   - Short description (traduzida)
   - Full description (usar STORE_LISTINGS_INTERNATIONAL.md)
   - Screenshots (mesmos ou traduzidos)

✅ Save cada idioma
```

---

### 4. **Upload do AAB**

```
Navegação: Release > Production > Create new release

Ou testar antes em:
- Internal testing (até 100 testers)
- Closed testing (até 2000 testers)
- Open testing (ilimitado)

Recomendado: Internal testing primeiro!
```

#### **4.1. Internal Testing (Recomendado para primeiro upload)**

```
1. Navegação: Release > Testing > Internal testing
2. Clicar "Create new release"

3. Upload AAB:
   - Arrastar app-release.aab
   - Ou clicar "Upload" e selecionar arquivo
   - Aguardar upload (~1-5 min)

4. ✅ Upload completo quando aparecer:
   - Version code: 1
   - Version name: 1.0.0
   - Size: ~5 MB
   - Supported devices: ~15,000 devices

5. Release name: v1.0.0 - Initial Release

6. Release notes (opcional para internal):
   - English: "Initial release for internal testing"
   - Portuguese: "Versão inicial para testes internos"

7. Adicionar testers:
   - Clicar "Testers" tab
   - Criar lista de emails
   - Adicionar: seu-email@gmail.com, equipe@exemplo.com
   - Salvar

8. Review release

9. Clicar "Start rollout to Internal testing"

✅ Aguardar processamento (5-30 min)

10. Testar no dispositivo:
    - Testers receberão link via email
    - Ou acessar link direto da console
    - Instalar e testar funcionalidades

⚠️ TESTAR TUDO antes de ir para Production!
```

#### **4.2. Production Release**

```
Depois de testar em Internal testing:

1. Navegação: Release > Production
2. Clicar "Create new release"
3. Upload AAB (mesmo arquivo ou novo)
4. Release name: v1.0.0 - Public Launch
5. Release notes (POR IDIOMA):

   English:
   """
   🎉 Welcome to ChefIApp!

   ✨ Features:
   • Track your shifts with check-in/check-out
   • Complete daily tasks and earn achievements
   • Real-time team coordination
   • Multi-language support (6 languages)
   • Dark mode compatible

   🏨 Perfect for hospitality professionals in hotels, restaurants, and cafés.

   Thank you for using ChefIApp!
   """

   Portuguese (Brazil):
   """
   🎉 Bem-vindo ao ChefIApp!

   ✨ Funcionalidades:
   • Registe os seus turnos com check-in/check-out
   • Complete tarefas diárias e ganhe conquistas
   • Coordenação de equipa em tempo real
   • Suporte multi-idioma (6 idiomas)
   • Compatível com modo escuro

   🏨 Perfeito para profissionais de hotelaria em hotéis, restaurantes e cafés.

   Obrigado por usar o ChefIApp!
   """

   [Repetir para ES, FR, DE, IT]

6. Review release
7. Clicar "Start rollout to Production"

⚠️ ATENÇÃO: Rollout options:
   - Pode começar com 1%, 5%, 10% de usuários (staged rollout)
   - Ou 100% (todos os países)

   Recomendado para primeiro lançamento: 100%

8. Confirmar

✅ Status: "Pending publication"
```

---

## ⏱️ TIMELINE DE APROVAÇÃO (Google Play)

```
📊 Processo de revisão do Google Play:

✅ Upload do AAB: 5-30 minutos (processamento)
✅ Pending publication: 1-3 dias (revisão automática + manual)
✅ Under review: Algumas horas (revisão manual se necessário)
✅ Published: APROVADO! App na loja

⚠️ Rejection (se rejeitado):
- Google envia email explicando motivo
- Você corrige e faz novo release
- Nova revisão: 1-2 dias

📈 Total estimado: 2-5 dias do submit à publicação

⚡ MAIS RÁPIDO QUE APPLE (geralmente)
```

---

## 📧 NOTIFICAÇÕES

Google Play envia emails para:

✅ AAB processado com sucesso
✅ App em revisão ("Under review")
✅ App aprovado e publicado ("Published")
❌ App rejeitado (com explicação detalhada)
⚠️ Violação de políticas
📊 Relatórios mensais de desempenho

---

## 🐛 PROBLEMAS COMUNS E SOLUÇÕES

### 1. **"Missing keystore password"**

```
Erro: Keystore não foi encontrado ou senha incorreta

Solução:
1. Verificar android/gradle.properties:
   MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
   MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
   MYAPP_UPLOAD_STORE_PASSWORD=ChefIApp2024!
   MYAPP_UPLOAD_KEY_PASSWORD=ChefIApp2024!

2. Verificar que keystore existe:
   ls android/app/my-upload-key.keystore

3. Limpar build:
   cd android
   ./gradlew clean
   ./gradlew bundleRelease
```

### 2. **"Permission denied: ./gradlew"**

```
Erro: Permissão negada para executar gradlew

Solução:
chmod +x android/gradlew
cd android
./gradlew bundleRelease
```

### 3. **"App Bundle contains forbidden permissions"**

```
Erro: AAB contém permissões proibidas

Solução:
1. Verificar AndroidManifest.xml
2. Remover permissões desnecessárias
3. Comum: WRITE_EXTERNAL_STORAGE (não necessário para API 29+)
4. Rebuild
```

### 4. **"Feature graphic size invalid"**

```
Erro: Feature graphic não está 1024x500

Solução:
1. DEVE ser EXATAMENTE 1024 x 500 pixels
2. NÃO redimensionar depois - criar no tamanho certo
3. Verificar:
   file feature-graphic.png
   # Deve mostrar: PNG image data, 1024 x 500
```

### 5. **"Screenshot aspect ratio invalid"**

```
Erro: Screenshots não estão 16:9

Solução:
1. Usar tamanhos recomendados:
   - 1080 x 1920 (portrait)
   - 1920 x 1080 (landscape)
2. Capturar no emulador com resolução correta
3. NÃO redimensionar - pode quebrar aspect ratio
```

---

## ✅ CHECKLIST FINAL - GOOGLE PLAY STORE

- [ ] Google Play Console account criado e pago ($25)
- [ ] Verificação de identidade completa
- [ ] Keystore criado e backup feito (CRÍTICO!)
- [ ] AAB gerado (app-release.aab)
- [ ] App criado no Google Play Console
- [ ] App access configurado
- [ ] Ads declaration respondido
- [ ] Content rating completo (IARC)
- [ ] Target audience definido
- [ ] Data safety declarado
- [ ] App category selecionado (Business)
- [ ] Store listing contact details preenchido
- [ ] Main store listing completo (descrições)
- [ ] Screenshots adicionados (mínimo 2)
- [ ] Feature graphic criado (1024x500)
- [ ] Traduções em 6 idiomas
- [ ] AAB testado em Internal testing
- [ ] Production release criado
- [ ] Release notes em todos os idiomas
- [ ] Submitted for production
- [ ] Aguardando aprovação (2-5 dias)

---

# 🎯 RESUMO FINAL

## ⏱️ TIMELINE TOTAL ESTIMADO

```
🍎 APPLE APP STORE:
Setup: 2-3 dias (Developer Account + Certificados)
Build & Upload: 1-2 horas
Aprovação: 2-7 dias
TOTAL: 5-12 dias

🤖 GOOGLE PLAY STORE:
Setup: 1-2 dias (Play Console + Verificação)
Build & Upload: 30 min - 1 hora
Aprovação: 2-5 dias
TOTAL: 3-8 dias

📱 AMBAS AS LOJAS: ~10-20 dias do início ao fim
```

## 💰 CUSTOS TOTAIS

```
🍎 Apple: $99/ano (renovação automática)
🤖 Google: $25 único (vitalício)

TOTAL PRIMEIRO ANO: $124
TOTAL ANOS SEGUINTES: $99/ano (apenas Apple)
```

## 🔥 DICAS FINAIS

### **Para Apple:**
✅ Fornecer credenciais de teste funcionais
✅ Screenshots de alta qualidade (10 é melhor que 3)
✅ Responder questionários com honestidade
✅ Privacy Policy URL pública e acessível
✅ Testar tudo antes de submeter

### **Para Google:**
✅ Fazer backup do keystore (CRÍTICO!)
✅ Testar em Internal testing primeiro
✅ Feature graphic profissional (primeira impressão)
✅ Data safety completo e honesto
✅ Screenshots em 16:9 aspect ratio

### **Ambas:**
✅ Descrições otimizadas com keywords
✅ Traduções profissionais (não Google Translate!)
✅ Ícone de alta qualidade
✅ Release notes descritivas e amigáveis
✅ Monitorar emails diariamente durante revisão

---

## 📞 SUPORTE

### **Apple:**
- Developer Support: https://developer.apple.com/contact/
- App Review: Via App Store Connect
- Phone: 1-800-MY-APPLE (apenas alguns países)

### **Google:**
- Play Console Help: https://support.google.com/googleplay/android-developer/
- Email: Via Play Console > Help & Feedback
- Forum: https://support.google.com/googleplay/android-developer/community

---

**Boa sorte com o lançamento do ChefIApp! 🚀**

**Desenvolvido com ❤️ para a indústria hoteleira global** 🌍🏨
