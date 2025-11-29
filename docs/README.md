# 📚 ChefIApp - Documentação Organizada

## 🚀 START HERE - Primeiros Passos

### Para Desenvolvedores
1. **[QUICKSTART.md](QUICKSTART.md)** - Comece aqui! Setup em 5 minutos
2. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Arquitetura do projeto
3. **[DEVELOPMENT.md](DEVELOPMENT.md)** - Guia de desenvolvimento

### Para Deployment
1. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy em produção
2. **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Configurar Supabase

---

## 📖 Índice Completo

### 🎯 Essenciais (Leia primeiro)
- **QUICKSTART.md** - Setup rápido do projeto
- **ARCHITECTURE.md** - Visão geral da arquitetura
- **API.md** - Referência de APIs e hooks
- **TROUBLESHOOTING.md** - Problemas comuns e soluções

### 🔧 Setup & Configuração
- **SUPABASE_SETUP.md** - Configuração completa do Supabase
- **OAUTH_SETUP.md** - Configurar Google/Apple OAuth
- **ENVIRONMENT.md** - Variáveis de ambiente
- **MOBILE_BUILD.md** - Build iOS e Android

### 💡 Guias de Features
- **ONBOARDING.md** - Sistema de onboarding
- **TASKS.md** - Sistema de tarefas
- **GAMIFICATION.md** - XP, níveis, conquistas
- **REALTIME.md** - Sincronização em tempo real
- **I18N.md** - Internacionalização

### 🏗️ Arquitetura & Código
- **STORE.md** - Zustand store e state management
- **HOOKS.md** - Custom hooks
- **COMPONENTS.md** - Biblioteca de componentes
- **TYPES.md** - Sistema de tipos TypeScript

### 🧪 Testing & QA
- **TESTING.md** - Guia de testes
- **QUALITY.md** - Padrões de qualidade
- **PERFORMANCE.md** - Otimização de performance

### 🚢 Deployment & Ops
- **DEPLOYMENT.md** - Deploy em produção
- **CI_CD.md** - Pipeline CI/CD
- **MONITORING.md** - Monitoramento e logs
- **SECURITY.md** - Boas práticas de segurança

### 📱 Mobile
- **IOS_BUILD.md** - Build para iOS
- **ANDROID_BUILD.md** - Build para Android
- **APP_STORE.md** - Submissão para App Store
- **PLAY_STORE.md** - Submissão para Play Store

---

## 🗂️ Estrutura de Documentação

```
docs/
├── README.md                 # Este arquivo - índice geral
│
├── QUICKSTART.md            # Setup rápido (5 min)
├── ARCHITECTURE.md          # Visão geral da arquitetura
├── DEVELOPMENT.md           # Guia de desenvolvimento
├── TROUBLESHOOTING.md       # Problemas comuns
│
├── setup/                   # Guias de configuração
│   ├── SUPABASE_SETUP.md
│   ├── OAUTH_SETUP.md
│   ├── ENVIRONMENT.md
│   └── MOBILE_BUILD.md
│
├── features/                # Documentação de features
│   ├── ONBOARDING.md
│   ├── TASKS.md
│   ├── GAMIFICATION.md
│   ├── REALTIME.md
│   └── I18N.md
│
├── architecture/            # Arquitetura e código
│   ├── STORE.md
│   ├── HOOKS.md
│   ├── COMPONENTS.md
│   └── TYPES.md
│
├── testing/                 # Testing e QA
│   ├── TESTING.md
│   ├── QUALITY.md
│   └── PERFORMANCE.md
│
├── deployment/              # Deploy e ops
│   ├── DEPLOYMENT.md
│   ├── CI_CD.md
│   ├── MONITORING.md
│   └── SECURITY.md
│
├── mobile/                  # Mobile específico
│   ├── IOS_BUILD.md
│   ├── ANDROID_BUILD.md
│   ├── APP_STORE.md
│   └── PLAY_STORE.md
│
└── archive/                 # Documentos obsoletos
    └── [arquivos antigos aqui]
```

---

## 🎯 Fluxo de Leitura Recomendado

### Para novos desenvolvedores:
1. QUICKSTART.md (5 min)
2. ARCHITECTURE.md (10 min)
3. DEVELOPMENT.md (15 min)
4. Explorar features/ conforme necessário

### Para deployment:
1. SUPABASE_SETUP.md
2. ENVIRONMENT.md
3. DEPLOYMENT.md
4. Escolher: IOS_BUILD.md ou ANDROID_BUILD.md

### Para contribuir:
1. DEVELOPMENT.md
2. COMPONENTS.md
3. TESTING.md
4. QUALITY.md

---

## 📝 Status dos Documentos

| Documento | Status | Última Atualização |
|-----------|--------|-------------------|
| QUICKSTART.md | ✅ Completo | 2024-11-29 |
| ARCHITECTURE.md | ✅ Completo | 2024-11-29 |
| SUPABASE_SETUP.md | ✅ Completo | 2024-11-29 |
| DEVELOPMENT.md | 🟡 Em progresso | 2024-11-29 |
| TESTING.md | 🔴 Pendente | - |

**Legenda:**
- ✅ Completo e atualizado
- 🟡 Em progresso ou parcialmente completo
- 🔴 Pendente ou desatualizado
- 🗑️ Obsoleto (ver archive/)

---

## 🔍 Busca Rápida

### Preciso configurar...
- **Supabase** → `setup/SUPABASE_SETUP.md`
- **OAuth** → `setup/OAUTH_SETUP.md`
- **Build mobile** → `setup/MOBILE_BUILD.md`

### Preciso implementar...
- **Nova tela** → `architecture/COMPONENTS.md`
- **Novo hook** → `architecture/HOOKS.md`
- **Nova feature** → `DEVELOPMENT.md`

### Preciso entender...
- **Como funciona X** → `features/X.md`
- **Por que faz Y** → `ARCHITECTURE.md`
- **Erro Z** → `TROUBLESHOOTING.md`

---

## 🤝 Contribuindo com Documentação

### Ao criar novo documento:
1. Escolher a pasta correta (setup/, features/, etc.)
2. Usar template apropriado
3. Adicionar ao índice deste README
4. Atualizar status

### Ao atualizar documento:
1. Marcar data de atualização
2. Adicionar na seção "Changelog" do documento
3. Atualizar status se necessário

---

## 📧 Suporte

Problemas com documentação?
- Abrir issue no GitHub
- Contatar time de desenvolvimento
- Ver TROUBLESHOOTING.md primeiro

---

Última atualização: 2024-11-29
Versão: 2.0
