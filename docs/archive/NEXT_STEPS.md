# 🚀 Próximos Passos - ChefIApp™

## ✅ O QUE JÁ ESTÁ PRONTO

- ✅ Onboarding da Empresa (8 telas) implementado
- ✅ OAuth (Google/Apple) configurado
- ✅ Deep linking configurado
- ✅ Safe area support (iOS notch)
- ✅ Design responsivo
- ✅ Integração com Supabase

---

## 🔴 PRÓXIMOS PASSOS CRÍTICOS

### 1. Executar Migration SQL no Supabase (5 min)

**Ação necessária:**

1. Acesse: https://supabase.com/dashboard → Seu Projeto → **SQL Editor**

2. Abra o arquivo: `supabase/migrations/005_company_onboarding_tables.sql`

3. Copie TODO o conteúdo do arquivo

4. Cole no SQL Editor do Supabase

5. Clique em **Run** ou pressione `Cmd+Enter`

**O que isso cria:**
- Tabela `companies`
- Tabela `sectors`
- Tabela `positions`
- Tabela `shifts`
- RLS Policies de segurança

**Verificar se funcionou:**
- Vá em **Table Editor**
- Deve aparecer as 4 novas tabelas

---

### 2. Criar Storage Bucket (2 min)

**Ação necessária:**

1. No Supabase Dashboard → **Storage**

2. Clique em **New bucket**

3. Configure:
   - **Name:** `company-assets`
   - **Public bucket:** ❌ Desmarcado (privado)
   - **File size limit:** 5 MB (ou mais se necessário)
   - **Allowed MIME types:** `image/*`

4. Clique em **Create bucket**

**Por que isso é necessário:**
- Upload de logos das empresas
- Sem isso, o upload de logo não funcionará

---

### 3. Configurar Variáveis de Ambiente (2 min)

**Verificar `.env.local`:**

```bash
cat .env.local
```

**Deve conter:**
```env
VITE_SUPABASE_URL=https://mcmxniuokmvzuzqfnpnn.supabase.co
VITE_SUPABASE_ANON_KEY=[SUA_CHAVE_AQUI]
```

**Se não tiver a chave:**
1. Acesse: https://supabase.com/dashboard → Seu Projeto → **Settings** → **API**
2. Copie a **anon/public key**
3. Cole no `.env.local`

---

### 4. Testar o Fluxo Completo (10 min)

**Passo a passo:**

1. **Build e sync:**
   ```bash
   npm run build
   npx cap sync ios
   ```

2. **Abrir no Xcode:**
   ```bash
   npx cap open ios
   ```

3. **No simulador:**
   - Faça login (ou crie conta)
   - Na tela de signup, procure o botão **"Sou Dono/Gerente - Criar Empresa"**
   - Clique nele
   - Complete as 8 telas do onboarding
   - Verifique se a empresa é criada
   - Verifique se você é redirecionado para OwnerDashboard

---

## 🟡 MELHORIAS OPCIONAIS

### 5. Implementar Presets Reais

**O que fazer:**
- Criar lógica para instalar tarefas pré-configuradas baseado no preset escolhido
- Checklists operacionais
- Rotinas de abertura/fechamento

**Arquivo:** `src/services/preset-installer.service.ts` (criar)

---

### 6. Gerar QR Code da Empresa

**O que fazer:**
- Após criar empresa, gerar QR code único
- Salvar QR no banco (`companies.qr_code`)
- Mostrar QR na tela de resumo (Tela 8)

**Componente já existe:** `src/components/QRCodeGenerator.tsx`

---

### 7. Melhorar Upload de Logo

**O que fazer:**
- Preview antes de salvar
- Crop/redimensionamento de imagem
- Validação de tamanho (max 2MB)
- Compressão automática

---

### 8. Integrar Mapa Real

**O que fazer:**
- Substituir campo de texto por mapa interativo
- Usar biblioteca de mapas (Leaflet ou Google Maps)
- PIN arrastável
- Geocoding reverso (endereço → coordenadas)

---

## 📋 CHECKLIST RÁPIDO

Execute na ordem:

- [ ] 1. Executar migration SQL (`005_company_onboarding_tables.sql`)
- [ ] 2. Criar bucket `company-assets` no Storage
- [ ] 3. Verificar `.env.local` tem `VITE_SUPABASE_ANON_KEY`
- [ ] 4. Build: `npm run build && npx cap sync ios`
- [ ] 5. Testar fluxo completo no simulador
- [ ] 6. Verificar se empresa é criada no Supabase
- [ ] 7. Verificar se redireciona para OwnerDashboard

---

## 🐛 TROUBLESHOOTING

### Problema: "relation 'companies' does not exist"
**Solução:** Execute a migration SQL no Supabase

### Problema: "bucket 'company-assets' not found"
**Solução:** Crie o bucket no Storage do Supabase

### Problema: "Missing Supabase environment variables"
**Solução:** Configure `.env.local` com as variáveis corretas

### Problema: Botão "Criar Empresa" não aparece
**Solução:** Verifique se está na tela de signup (não login)

---

## 📚 DOCUMENTAÇÃO

- **Onboarding Completo:** `COMPANY_ONBOARDING_COMPLETE.md`
- **Setup OAuth:** `SETUP_OAUTH.md`
- **Status Geral:** `IMPLEMENTATION_STATUS.md`

---

## ✅ APÓS COMPLETAR OS PASSOS

O app estará **100% funcional** para:
- ✅ Criar empresas completas
- ✅ Fazer login com Google/Apple
- ✅ Gerenciar funcionários
- ✅ Usar todos os dashboards

**Próximo passo lógico:** Testar e validar o fluxo completo!

