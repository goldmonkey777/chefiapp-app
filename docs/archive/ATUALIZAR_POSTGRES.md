# 🔒 Atualizar PostgreSQL - Aplicar Patches de Segurança

**Data:** $(date)  
**Status:** ⚠️ **AÇÃO NECESSÁRIA**

---

## 📋 Resumo do Problema

O projeto está rodando **PostgreSQL versão: supabase-postgres-17.4.1.064**

**Problema:** Existem **patches de segurança disponíveis** que não foram aplicados.

### Por que isso importa?

- **Segurança**: Vulnerabilidades não corrigidas podem ser exploradas
- **Estabilidade**: Patches incluem correções de bugs importantes
- **Conformidade**: Versões desatualizadas podem não atender requisitos de segurança
- **Risco**: Aumenta a superfície de ataque do banco de dados

---

## ✅ Solução: Atualizar PostgreSQL via Supabase

### Opção 1: Via Dashboard (Recomendado)

#### Passo 1: Acessar Configurações do Projeto

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto: `mcmxniuokmvzuzqfnpnn`
3. No menu lateral, vá em **Settings** (Configurações)
4. Clique em **Database** (Banco de Dados)

#### Passo 2: Verificar Versão Atual

1. Procure pela seção **"Database Version"** ou **"Postgres Version"**
2. Anote a versão atual: `supabase-postgres-17.4.1.064`
3. Verifique se há atualizações disponíveis

#### Passo 3: Aplicar Atualização

1. Se houver atualização disponível, você verá um botão **"Upgrade"** ou **"Update"**
2. Clique no botão de atualização
3. Revise as informações sobre a atualização
4. Confirme a atualização

#### Passo 4: Aguardar Conclusão

- A atualização pode levar alguns minutos
- O banco pode ficar temporariamente indisponível
- Você receberá uma notificação quando concluir

---

### Opção 2: Via CLI (Avançado)

```bash
# Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# Fazer login
supabase login

# Verificar versão atual
supabase db version

# Atualizar (se disponível via CLI)
supabase db upgrade
```

**Nota:** Nem todas as atualizações estão disponíveis via CLI. O Dashboard é mais confiável.

---

## 🔄 Checklist Pré-Atualização

### 1. Backup Completo

**CRÍTICO:** Faça backup antes de atualizar!

#### Via Dashboard:
1. Settings → Database → Backups
2. Clique em **"Create Backup"** ou **"Download Backup"**
3. Aguarde conclusão

#### Via CLI:
```bash
# Fazer dump completo
supabase db dump -f backup_antes_atualizacao.sql

# Ou usar pg_dump diretamente
pg_dump -h [SEU_HOST] -U postgres -d postgres > backup.sql
```

### 2. Verificar Extensões Instaladas

Execute no Supabase SQL Editor:

```sql
-- Listar todas as extensões instaladas
SELECT 
  extname as extension_name,
  extversion as version,
  n.nspname as schema
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
ORDER BY extname;
```

**Extensões comuns no projeto:**
- `postgis` - Extensão geoespacial
- `pgcrypto` - Funções criptográficas
- `pg_stat_statements` - Estatísticas de queries
- `pgroonga` - Busca full-text
- `vector` - Embeddings vetoriais
- `pg_cron` - Jobs agendados

### 3. Agendar Janela de Manutenção

- **Horário recomendado**: Período de baixo tráfego
- **Duração estimada**: 5-15 minutos
- **Avisar usuários**: Se aplicável, notifique sobre manutenção

### 4. Testar em Ambiente de Staging (Se disponível)

Se você tiver um projeto de staging:
1. Atualize o staging primeiro
2. Teste todas as funcionalidades críticas
3. Verifique compatibilidade das extensões
4. Depois atualize o produção

---

## ✅ Checklist Pós-Atualização

### 1. Verificar Versão Atualizada

```sql
-- Verificar versão do PostgreSQL
SELECT version();

-- Verificar versão específica do Supabase
SHOW server_version;
```

**Resultado esperado:** Versão mais recente que `17.4.1.064`

### 2. Verificar Extensões

```sql
-- Verificar se todas as extensões ainda estão instaladas
SELECT 
  extname as extension_name,
  extversion as version
FROM pg_extension
ORDER BY extname;
```

**Ação:** Confirme que todas as extensões estão presentes e nas versões esperadas.

### 3. Testar Funcionalidades Críticas

#### Autenticação
- [ ] Criar nova conta
- [ ] Fazer login
- [ ] Resetar senha
- [ ] OAuth (Google/Apple)

#### RLS Policies
- [ ] Verificar acesso a dados
- [ ] Testar políticas de leitura
- [ ] Testar políticas de escrita

#### Triggers
- [ ] Verificar trigger `on_auth_user_created`
- [ ] Testar criação de perfil automático

#### Funções
- [ ] Testar `increment_xp`
- [ ] Testar `handle_new_user`

#### Queries Críticas
- [ ] Listar empresas
- [ ] Listar tarefas
- [ ] Listar check-ins
- [ ] Listar atividades

### 4. Verificar Logs

1. Dashboard → Logs → Postgres Logs
2. Verificar se há erros após atualização
3. Monitorar por algumas horas

### 5. Verificar Performance

```sql
-- Verificar estatísticas de queries
SELECT 
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

---

## 🔍 Verificação de Compatibilidade de Extensões

### Extensões Críticas para Verificar

#### 1. PostGIS
```sql
-- Verificar versão do PostGIS
SELECT PostGIS_version();
```

#### 2. pgcrypto
```sql
-- Testar função criptográfica
SELECT crypt('test', gen_salt('bf'));
```

#### 3. vector
```sql
-- Verificar extensão vector
SELECT * FROM pg_extension WHERE extname = 'vector';
```

#### 4. pg_cron
```sql
-- Verificar jobs agendados
SELECT * FROM cron.job;
```

---

## ⚠️ Se Não Puder Atualizar Imediatamente

### Mitigações Temporárias

1. **Restringir Acesso**
   - Revisar políticas RLS
   - Limitar conexões de rede
   - Revisar permissões de roles

2. **Monitorar Logs**
   - Dashboard → Logs → Postgres Logs
   - Procurar por atividades suspeitas
   - Configurar alertas

3. **Aplicar Atualização o Quanto Antes**
   - Agendar atualização no próximo período de baixo tráfego
   - Preparar backup antes

---

## 📝 Notas Importantes

### ⚠️ Não Faça Isso

- ❌ **NÃO** tente fazer patch manual do PostgreSQL
- ❌ **NÃO** atualize sem fazer backup primeiro
- ❌ **NÃO** ignore incompatibilidades de extensões

### ✅ Faça Isso

- ✅ Use o Dashboard do Supabase para atualizar
- ✅ Faça backup completo antes
- ✅ Teste em staging primeiro (se possível)
- ✅ Verifique extensões após atualização
- ✅ Monitore logs após atualização

---

## 🎯 Próximos Passos Recomendados

### Imediato (Hoje)
1. [ ] Fazer backup completo do banco
2. [ ] Verificar extensões instaladas
3. [ ] Agendar janela de manutenção

### Curto Prazo (Esta Semana)
1. [ ] Aplicar atualização do PostgreSQL
2. [ ] Verificar compatibilidade de extensões
3. [ ] Testar funcionalidades críticas
4. [ ] Monitorar logs e performance

### Médio Prazo (Este Mês)
1. [ ] Configurar backups automáticos regulares
2. [ ] Criar processo de atualização documentado
3. [ ] Configurar monitoramento de segurança
4. [ ] Revisar políticas RLS regularmente

---

## 📚 Referências

- [Supabase Database Updates](https://supabase.com/docs/guides/platform/upgrades)
- [PostgreSQL Release Notes](https://www.postgresql.org/docs/current/release.html)
- [Supabase Status Page](https://status.supabase.com/)

---

## 🔧 Comandos Úteis

### Verificar Versão Atual
```sql
SELECT version();
```

### Listar Extensões
```sql
SELECT extname, extversion FROM pg_extension ORDER BY extname;
```

### Verificar Configurações
```sql
SHOW ALL;
```

### Verificar Conexões Ativas
```sql
SELECT count(*) FROM pg_stat_activity;
```

---

**Status**: ⚠️ **AÇÃO NECESSÁRIA** - Atualizar PostgreSQL no Supabase Dashboard

**Prioridade**: 🔴 **ALTA** - Segurança do banco de dados

**Tempo estimado**: 15-30 minutos (incluindo testes)

