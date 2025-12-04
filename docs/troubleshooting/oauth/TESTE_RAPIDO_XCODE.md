# ⚡ Teste Rápido no Xcode - Passo a Passo Automatizado

**Guia rápido para testar o app imediatamente após abrir o Xcode**

---

## 🎯 O QUE JÁ FOI FEITO AUTOMATICAMENTE

✅ Build do projeto web concluído  
✅ Sincronização com Capacitor concluída  
✅ Xcode aberto automaticamente  

---

## 📱 AGORA NO XCODE (FAÇA ISSO):

### **1. Selecionar Simulador (5 segundos)**

1. No **topo do Xcode**, clique no dropdown ao lado do botão ▶️ Play
2. Selecione: **iPhone 15 Pro** (ou qualquer simulador disponível)
3. Aguarde o Xcode carregar o projeto

---

### **2. Executar o App (Cmd+R)**

1. Pressione **`Cmd+R`** (ou clique no botão ▶️ Play)
2. **Aguarde o build** (primeira vez pode levar 2-3 minutos)
3. O simulador abrirá automaticamente

---

### **3. Se Aparecer Pop-up de Certificado**

- **Cancele** o pop-up (não é necessário para simulador)
- O app continuará funcionando normalmente

---

### **4. Testar Login com Email/Senha**

Quando o app abrir no simulador:

#### **Opção A: Criar Conta Nova**

1. **Preencher formulário:**
   ```
   Nome: Funcionário Teste
   Email: funcionario@teste.com
   Senha: senha123
   Role: Funcionário (EMPLOYEE)
   ```

2. **Clicar em "Create Account"**

3. **Aguardar:**
   - Conta será criada no Supabase
   - Perfil será criado automaticamente
   - Você será redirecionado

#### **Opção B: Fazer Login (se já tem conta)**

1. **Clicar em "Already have an account? Sign in"**

2. **Preencher:**
   ```
   Email: seu@email.com
   Senha: sua_senha
   ```

3. **Clicar em "Sign In"**

---

### **5. Associar-se a uma Empresa**

Se você não tem empresa associada:

1. **Escolher "Entrar em uma Empresa"**

2. **Escolher método:**
   - **QR Code:** Escanear código (se tiver)
   - **Código:** Inserir código de convite (se tiver)

3. **OU criar empresa de teste:**
   - Escolher "Criar Minha Empresa"
   - Seguir o onboarding (8 telas)
   - Ou pular e testar depois

---

### **6. Dashboard do Funcionário**

Após associar-se a uma empresa, você verá:

✅ **Header:**
- Saudação: "Bom dia, [Seu Nome]! 👋"
- Botão de notificações (sino)
- Botão de configurações (engrenagem)

✅ **Card de Turno (Azul):**
- Status: "Turno Offline"
- Botão: "INICIAR TURNO"

✅ **Card de Progresso:**
- Nível: "Nível 1"
- XP: "0 XP"
- Barra de progresso

✅ **Navegação Inferior:**
- Início, Tarefas, Escala, Ranking, Conquistas, Perfil

---

## 🐛 SE ALGO DER ERRADO

### **Erro: "Could not build module 'Capacitor'**

**Solução:**
- Esses são warnings conhecidos
- O app ainda funciona normalmente
- Pode ignorar se o build completar

### **App não carrega / Tela branca**

**Solução:**
1. No Xcode: `Cmd+Shift+K` (Clean Build Folder)
2. Executar novamente: `Cmd+R`

### **Erro de autenticação**

**Solução:**
1. Verifique se signups estão habilitados no Supabase:
   - Dashboard → Authentication → Settings → User Signups
   - Habilite "Allow new users to sign up"

### **"Profile not found"**

**Solução:**
- O perfil deve ser criado automaticamente
- Se não criar, verifique logs no console do Xcode
- Procure por: `🔗 [ensureProfileExists]`

---

## 📊 VERIFICAR LOGS NO XCODE

No Xcode, abra o **Console** (Cmd+Shift+Y) e procure por:

✅ **Sucesso:**
```
✅ [useAuth] User authenticated successfully
🔗 [fetchProfile] Perfil carregado com sucesso!
🎯 [OnboardingAuth] User autenticado detectado
```

❌ **Erros:**
```
❌ [useAuth] Error...
❌ [fetchProfile] Erro ao buscar perfil...
```

---

## ⚡ ATALHOS ÚTEIS DO XCODE

| Atalho | Ação |
|--------|------|
| `Cmd+R` | Executar app |
| `Cmd+B` | Build apenas |
| `Cmd+Shift+K` | Limpar build |
| `Cmd+.` | Parar execução |
| `Cmd+Shift+Y` | Mostrar/ocultar console |

---

## ✅ CHECKLIST DE TESTE

Após executar o app, verifique:

- [ ] App abre no simulador
- [ ] Tela de login aparece
- [ ] Consigo criar conta ou fazer login
- [ ] Perfil é criado/carregado
- [ ] Dashboard do funcionário aparece
- [ ] Navegação inferior funciona
- [ ] Card de turno aparece
- [ ] Progresso (XP/Level) aparece

---

## 🎯 PRÓXIMOS TESTES

Depois de chegar ao dashboard:

1. **Testar Check-in:**
   - Clicar em "INICIAR TURNO"
   - Verificar geolocalização

2. **Testar Tarefas:**
   - Navegar para "Tarefas"
   - Ver lista de tarefas

3. **Testar Perfil:**
   - Navegar para "Perfil"
   - Ver estatísticas

---

**O Xcode já está aberto! Agora é só seguir os passos acima! 🚀**

