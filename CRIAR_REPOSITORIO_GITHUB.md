# 📦 Criar Repositório GitHub para ChefIApp

**Guia completo para criar e configurar o repositório GitHub**

---

## 📋 Pré-requisitos

- ✅ Conta GitHub criada
- ✅ Git instalado no seu Mac
- ✅ Projeto ChefIApp pronto

---

## 🚀 Passo a Passo

### 1. Criar Repositório no GitHub

1. **Acesse:** https://github.com/new
2. **Preencha:**
   - **Repository name:** `chefiapp-hospitality-intelligence`
   - **Description:** `ChefIApp™ - Hospitality Workforce Intelligence Platform`
   - **Visibility:** 
     - ✅ **Public** (se quiser compartilhar)
     - ✅ **Private** (se quiser manter privado)
   - **NÃO marque:**
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license
3. **Clique em:** "Create repository"

---

### 2. Configurar Git Local (se ainda não configurado)

```bash
# Configurar seu nome e email (se ainda não fez)
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

---

### 3. Inicializar Git no Projeto (se ainda não inicializado)

```bash
cd /Users/goldmonkey/Downloads/chefiapp---hospitality-intelligence

# Verificar se já é um repositório Git
git status

# Se não for, inicializar:
git init
```

---

### 4. Adicionar Arquivos ao Git

```bash
# Adicionar todos os arquivos (exceto os ignorados pelo .gitignore)
git add .

# Verificar o que será commitado
git status
```

---

### 5. Fazer Primeiro Commit

```bash
git commit -m "Initial commit: ChefIApp - Hospitality Intelligence Platform

- OAuth integration (Google, Apple)
- Company onboarding flow
- Employee dashboard
- Manager dashboard
- Owner dashboard
- Supabase integration
- Deep linking configured
- iOS/Android support"
```

---

### 6. Conectar com GitHub

```bash
# Adicionar remote do GitHub (substitua SEU_USUARIO pelo seu username)
git remote add origin https://github.com/SEU_USUARIO/chefiapp-hospitality-intelligence.git

# Verificar se foi adicionado
git remote -v
```

---

### 7. Fazer Push para GitHub

```bash
# Renomear branch principal para main (se necessário)
git branch -M main

# Fazer push
git push -u origin main
```

**Se pedir autenticação:**
- Use seu **Personal Access Token** (não sua senha)
- Ou configure SSH keys

---

## 🔐 Autenticação GitHub

### Opção 1: Personal Access Token (Mais Fácil)

1. **Acesse:** https://github.com/settings/tokens
2. **Clique em:** "Generate new token" → "Generate new token (classic)"
3. **Preencha:**
   - **Note:** `ChefIApp Local Development`
   - **Expiration:** Escolha um prazo
   - **Scopes:** Marque `repo` (todos os sub-itens)
4. **Clique em:** "Generate token"
5. **Copie o token** (você só verá uma vez!)
6. **Use o token como senha** quando o Git pedir

### Opção 2: SSH Keys (Mais Seguro)

```bash
# Gerar SSH key
ssh-keygen -t ed25519 -C "seu.email@exemplo.com"

# Copiar chave pública
cat ~/.ssh/id_ed25519.pub

# Adicionar no GitHub:
# 1. Acesse: https://github.com/settings/keys
# 2. Clique em "New SSH key"
# 3. Cole a chave pública
# 4. Salve

# Usar SSH URL ao invés de HTTPS:
git remote set-url origin git@github.com:SEU_USUARIO/chefiapp-hospitality-intelligence.git
```

---

## 📝 Arquivos Importantes para Commit

### ✅ Deve ser commitado:
- ✅ Todo o código fonte (`src/`)
- ✅ Configurações (`package.json`, `tsconfig.json`, etc.)
- ✅ Documentação (`*.md`)
- ✅ Scripts (`scripts/`)
- ✅ Configurações do Supabase (`supabase/`)
- ✅ `.gitignore`
- ✅ `README.md`

### ❌ NÃO deve ser commitado:
- ❌ `.env.local` (contém chaves secretas)
- ❌ `.env` (se contém secrets)
- ❌ `node_modules/`
- ❌ `dist/`
- ❌ `ios/Pods/`
- ❌ `ios/App/build/`
- ❌ Arquivos de backup

---

## 🔍 Verificar .gitignore

Certifique-se de que o `.gitignore` inclui:

```gitignore
# Environment variables
.env
.env.local
.env.*.local

# Dependencies
node_modules/
ios/Pods/
ios/App/build/

# Build outputs
dist/
build/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Capacitor
.capacitor/
```

---

## 📋 Comandos Úteis

### Ver status do repositório:
```bash
git status
```

### Ver histórico de commits:
```bash
git log --oneline
```

### Adicionar arquivos específicos:
```bash
git add arquivo1.ts arquivo2.ts
```

### Fazer commit:
```bash
git commit -m "Mensagem descritiva do que foi feito"
```

### Fazer push:
```bash
git push
```

### Ver branches:
```bash
git branch
```

### Criar nova branch:
```bash
git checkout -b nome-da-branch
```

---

## 🎯 Próximos Passos Após Criar Repositório

1. ✅ Criar README.md com instruções
2. ✅ Adicionar LICENSE (se necessário)
3. ✅ Configurar GitHub Actions (CI/CD)
4. ✅ Adicionar badges no README
5. ✅ Criar issues para tarefas futuras
6. ✅ Configurar branch protection (se necessário)

---

## 🆘 Problemas Comuns

### Erro: "remote origin already exists"
```bash
# Remover remote existente
git remote remove origin

# Adicionar novamente
git remote add origin https://github.com/SEU_USUARIO/chefiapp-hospitality-intelligence.git
```

### Erro: "failed to push some refs"
```bash
# Fazer pull primeiro
git pull origin main --allow-unrelated-histories

# Depois fazer push
git push -u origin main
```

### Erro de autenticação
- Use Personal Access Token ao invés de senha
- Ou configure SSH keys

---

## ✅ Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Git inicializado localmente
- [ ] `.gitignore` configurado corretamente
- [ ] Arquivos adicionados ao Git
- [ ] Primeiro commit feito
- [ ] Remote do GitHub adicionado
- [ ] Push feito com sucesso
- [ ] README.md criado
- [ ] Autenticação configurada

---

**Status**: 📋 **PRONTO PARA CRIAR REPOSITÓRIO!**

Siga os passos acima e me avise quando terminar! 🚀

