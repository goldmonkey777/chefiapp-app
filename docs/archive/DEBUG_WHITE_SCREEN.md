# 🐛 Debug: Tela Branca - Guia de Diagnóstico

## ✅ Correções Aplicadas

1. **Error Boundary** - Captura erros de renderização
2. **Logs de Debug** - Console.log em pontos críticos
3. **Tratamento de useAuth** - Não quebra se hook falhar
4. **Try/Catch** - Em todos os pontos críticos
5. **Fallbacks** - Para todos os casos de erro

---

## 🔍 Como Diagnosticar

### 1. Abra o Console do Xcode
```
Xcode → Window → Devices and Simulators → Selecione seu simulador → Open Console
```

### 2. Procure por estas mensagens:
- `[CompanyOnboarding] Rendered:` - Componente foi renderizado
- `Button clicked: Sou Dono/Gerente` - Botão foi clicado
- `Setting isCompanyOnboarding to true` - Estado foi atualizado
- `Rendering CompanyOnboarding component` - Componente está sendo renderizado

### 3. Se não aparecer nenhuma mensagem:
- O componente não está sendo renderizado
- Verifique se há erros antes disso no console

### 4. Se aparecer erro:
- Copie o erro completo
- Verifique a linha do erro
- Veja qual componente está falhando

---

## 🧪 Teste Manual

1. **Abra o app no simulador**
2. **Abra o Console do Xcode** (Window → Devices and Simulators)
3. **Clique em "Sou Dono/Gerente - Criar Empresa"**
4. **Observe o console:**
   - Deve aparecer: `Button clicked: Sou Dono/Gerente`
   - Deve aparecer: `Setting isCompanyOnboarding to true`
   - Deve aparecer: `Rendering CompanyOnboarding component`
   - Deve aparecer: `[CompanyOnboarding] Rendered:`

5. **Se aparecer erro:**
   - Copie o erro completo
   - Verifique qual componente está falhando
   - Veja se é um problema de importação

---

## 🔧 Possíveis Problemas

### Problema 1: Hook useAuth quebrando
**Sintoma:** Erro sobre "Rules of Hooks" ou "useAuth is not a function"
**Solução:** Já corrigido com try/catch

### Problema 2: Importação quebrada
**Sintoma:** Erro sobre módulo não encontrado
**Solução:** Verificar imports em `CompanyOnboarding.tsx`

### Problema 3: Componente retornando null
**Sintoma:** Tela branca sem erros
**Solução:** Verificar se `renderScreen()` está retornando algo

### Problema 4: CSS não carregando
**Sintoma:** Componente renderiza mas não aparece
**Solução:** Verificar se Tailwind está configurado

---

## 📝 Próximos Passos

1. **Teste no simulador** e observe o console
2. **Copie qualquer erro** que aparecer
3. **Verifique se as mensagens de debug aparecem**
4. **Me envie o erro completo** se houver

---

## 🎯 O que Esperar

Quando funcionar corretamente, você deve ver:
1. ✅ Botão clicado → Log no console
2. ✅ Estado atualizado → Log no console  
3. ✅ Componente renderizado → Log no console
4. ✅ Tela 1 (Welcome) aparecendo → Fundo azul com logo

Se não aparecer nada, há um erro antes do componente ser renderizado.

