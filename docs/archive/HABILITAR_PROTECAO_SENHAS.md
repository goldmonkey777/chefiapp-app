# 🔒 Habilitar Proteção Contra Senhas Vazadas - Supabase Auth

**Data:** $(date)  
**Status:** ⚠️ **AÇÃO NECESSÁRIA**

---

## 📋 Resumo do Problema

A proteção contra senhas vazadas (Leaked Password Protection) está **desabilitada** no Supabase Auth. Isso permite que usuários usem senhas que aparecem em bancos de dados públicos de senhas comprometidas.

### O que isso significa?

- Usuários podem criar contas com senhas já comprometidas
- Aumenta o risco de **account takeover** (tomada de conta)
- Facilita ataques de **credential stuffing** (tentativa de login com credenciais vazadas)

### Por que é perigoso?

1. **Segurança**: Senhas comprometidas são frequentemente reutilizadas em múltiplos sites
2. **Account Takeover**: Atacantes podem usar senhas vazadas para acessar contas
3. **Credential Stuffing**: Ataques automatizados usando listas de senhas vazadas

---

## ✅ Solução: Habilitar Proteção no Supabase

### Passo 1: Acessar Configurações de Autenticação

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto: `mcmxniuokmvzuzqfnpnn`
3. No menu lateral, vá em **Authentication**
4. Clique em **Settings** (ou **Security**)

### Passo 2: Habilitar Leaked Password Protection

1. Procure pela seção **"Password Protection"** ou **"Leaked Password Protection"**
2. Encontre o toggle **"Enable leaked password protection"** ou **"HaveIBeenPwned integration"**
3. **Ative o toggle** (mude para ON/Enabled)
4. **Salve as alterações**

### Passo 3: Configurar Comportamento (Recomendado)

Escolha uma das opções:

#### Opção A: Bloquear (Recomendado - Mais Seguro)
- **Bloquear** senhas comprometidas completamente
- Usuário deve escolher outra senha
- Mensagem: "Esta senha aparece em uma violação de dados conhecida. Escolha outra senha."

#### Opção B: Avisar (Menos Restritivo)
- **Avisar** mas permitir usar a senha
- Usuário pode ignorar o aviso
- Menos seguro, mas melhor UX

**Recomendação:** Use **Bloquear** para máxima segurança.

---

## 🎨 Atualizar UI do App (Opcional mas Recomendado)

### Mensagem de Erro para Senha Comprometida

Atualize seus componentes de signup/login para mostrar mensagens claras:

```typescript
// Exemplo de mensagem de erro
if (error.message.includes('compromised') || error.message.includes('breach')) {
  setError('Esta senha aparece em uma violação de dados conhecida. Por favor, escolha uma senha mais segura.');
}
```

### Mensagem Sugerida em Português

```
"Esta senha foi encontrada em uma violação de dados conhecida. 
Por favor, escolha uma senha mais segura e única.

Dicas para uma senha segura:
• Use pelo menos 12 caracteres
• Combine letras, números e símbolos
• Não reutilize senhas de outros sites
• Considere usar um gerenciador de senhas"
```

---

## 🧪 Como Testar

### Teste 1: Tentar Senha Comprometida

1. Tente criar uma conta com senha conhecidamente comprometida:
   - `password123`
   - `12345678`
   - `qwerty`
   - `admin123`

2. **Resultado esperado:**
   - ✅ Senha deve ser **rejeitada** (se bloqueio ativado)
   - ✅ Mensagem de erro clara deve aparecer
   - ✅ Usuário não consegue criar conta

### Teste 2: Senha Legítima

1. Tente criar conta com senha forte:
   - `MinhaSenh@Segura123!`
   - `ChefIApp2024#XP`

2. **Resultado esperado:**
   - ✅ Conta criada com sucesso
   - ✅ Nenhum erro relacionado a senha comprometida

### Teste 3: Verificar Logs

1. No Supabase Dashboard → **Authentication** → **Logs**
2. Verifique se tentativas com senhas comprometidas aparecem
3. Confirme que a proteção está funcionando

---

## 📝 Checklist de Implementação

- [ ] Acessar Supabase Dashboard
- [ ] Navegar para Authentication → Settings
- [ ] Habilitar "Leaked Password Protection"
- [ ] Configurar comportamento (Bloquear/Avisar)
- [ ] Salvar alterações
- [ ] Testar com senha comprometida
- [ ] Testar com senha legítima
- [ ] Atualizar UI do app (opcional)
- [ ] Verificar logs de autenticação

---

## 🔒 Hardening Adicional (Recomendado)

### 1. Política de Senha Forte

Configure no Supabase Auth → Settings:

- **Mínimo de caracteres**: 12 (recomendado)
- **Complexidade**: Requer letras maiúsculas, minúsculas, números e símbolos
- **Não permitir**: Senhas comuns (password, 123456, etc.)

### 2. Multi-Factor Authentication (MFA)

Habilite MFA para usuários com privilégios elevados:

- **Owners**: Sempre requer MFA
- **Managers**: Recomendado MFA
- **Employees**: Opcional MFA

### 3. Rate Limiting

Configure limites de taxa para endpoints de autenticação:

- **Login**: Máximo 5 tentativas por minuto por IP
- **Signup**: Máximo 3 tentativas por minuto por IP
- **Password Reset**: Máximo 3 tentativas por hora por email

### 4. Monitoramento

Configure alertas para:

- Múltiplas tentativas de login falhadas
- Tentativas de senha comprometida
- Padrões suspeitos de credential stuffing

---

## 📚 Referências

- [Supabase Auth Security](https://supabase.com/docs/guides/auth/security)
- [HaveIBeenPwned API](https://haveibeenpwned.com/API/v3)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)

---

## 🎯 Próximos Passos

1. **Imediato**: Habilitar Leaked Password Protection no Supabase Dashboard
2. **Curto prazo**: Testar funcionalidade e atualizar UI do app
3. **Médio prazo**: Implementar hardening adicional (MFA, rate limiting)
4. **Longo prazo**: Monitorar e ajustar políticas conforme necessário

---

**Status**: ⚠️ **AÇÃO NECESSÁRIA** - Habilitar proteção no Supabase Dashboard

**Prioridade**: 🔴 **ALTA** - Segurança de autenticação

