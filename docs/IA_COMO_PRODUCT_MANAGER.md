# 🤖 Como Transformar IA no seu Product Manager

## 📋 Índice
1. [Introdução](#introdução)
2. [Configuração Inicial](#configuração-inicial)
3. [Prompts Efetivos](#prompts-efetivos)
4. [Workflow Diário](#workflow-diário)
5. [Casos de Uso](#casos-de-uso)
6. [Ferramentas e Integração](#ferramentas-e-integração)

---

## 🎯 Introdução

A IA pode ser seu Product Manager pessoal, ajudando em:
- ✅ Priorização de features
- ✅ Análise de mercado
- ✅ Definição de roadmap
- ✅ Escrita de PRDs (Product Requirement Documents)
- ✅ Análise de métricas e KPIs
- ✅ Gestão de backlog
- ✅ Comunicação com stakeholders

---

## ⚙️ Configuração Inicial

### 1. **Criar Contexto do Produto**

Crie um arquivo `.claude/product-context.md`:

```markdown
# ChefIApp - Contexto do Produto

## Visão
Plataforma de inteligência para hospitalidade que revoluciona gestão de restaurantes.

## Missão
Aumentar eficiência operacional em 40% e engajamento de equipe em 60%.

## Público-Alvo
- **Primário**: Donos de restaurantes (5-50 funcionários)
- **Secundário**: Gerentes e chefs
- **Terciário**: Garçons e equipe operacional

## Problemas que Resolvemos
1. Falta de visibilidade em operações
2. Baixo engajamento de funcionários
3. Gestão ineficiente de tarefas
4. Comunicação fragmentada

## Métricas-Chave (North Star)
- **Primary**: MAU (Monthly Active Users)
- **Secondary**: Task Completion Rate
- **Tertiary**: Employee Engagement Score

## Concorrentes
- Toast POS
- Square for Restaurants
- Lightspeed

## Diferencial
Gamificação + IA + Simplicidade móvel-first
```

### 2. **Configurar Prompts Customizados**

Crie comandos slash em `.claude/commands/`:

**`/roadmap`** - Gerar roadmap
```markdown
Atue como Product Manager sênior.

Contexto: Leia product-context.md

Tarefa:
1. Analise features atuais no backlog
2. Priorize usando RICE (Reach, Impact, Confidence, Effort)
3. Crie roadmap trimestral
4. Identifique dependências
5. Sugira quick wins

Formato de saída:
- Q1, Q2, Q3, Q4
- Cada feature com: impacto esperado, esforço, métricas
```

**`/prd`** - Escrever PRD
```markdown
Atue como Product Manager.

Gere PRD (Product Requirement Document) completo para: [FEATURE]

Estrutura:
1. **Objetivo**: Por que estamos fazendo isso?
2. **Problema**: Qual dor estamos resolvendo?
3. **Solução**: Como vamos resolver?
4. **Usuários Impactados**: Quem se beneficia?
5. **Requisitos Funcionais**: O que deve fazer?
6. **Requisitos Não-Funcionais**: Performance, segurança
7. **Métricas de Sucesso**: Como medir impacto?
8. **Riscos**: O que pode dar errado?
9. **Dependências**: O que precisa estar pronto?
10. **Timeline**: Quanto tempo estimamos?
```

**`/analyze-feature`** - Analisar viabilidade
```markdown
Atue como Product Manager + Engenheiro.

Analise a feature: [DESCRIÇÃO]

Forneça:
1. **Viabilidade Técnica** (1-5)
2. **Impacto no Usuário** (1-5)
3. **Esforço Estimado** (horas/dias)
4. **Riscos Técnicos**
5. **Dependências**
6. **Recomendação**: Fazer agora / Depois / Nunca

Use dados do codebase atual.
```

**`/competitive-analysis`** - Análise competitiva
```markdown
Atue como Product Analyst.

Analise como [CONCORRENTE] resolve [PROBLEMA].

Compare com nossa abordagem no ChefIApp.

Estrutura:
1. Como eles fazem
2. Pontos fortes
3. Pontos fracos
4. O que podemos aprender
5. Como podemos fazer melhor
```

---

## 💬 Prompts Efetivos

### Para Priorização

```
Atue como Product Manager.

Temos estas features no backlog:
1. [Feature A]
2. [Feature B]
3. [Feature C]

Priorize usando RICE Framework:
- Reach: Quantos usuários impacta? (1-1000+)
- Impact: Qual impacto? (0.25 = mínimo, 3 = massivo)
- Confidence: Quão confiante? (10-100%)
- Effort: Quantos person-months? (0.5-10+)

Score RICE = (Reach × Impact × Confidence) / Effort

Forneça:
1. Score RICE de cada feature
2. Ranking final
3. Justificativa
4. Quick wins (alto impacto, baixo esforço)
```

### Para Definir Roadmap

```
Atue como Head of Product.

Contexto:
- Temos [X] features no backlog
- Equipe: [Y] desenvolvedores
- Prazo: 3 meses
- Objetivo: Aumentar retenção em 20%

Crie roadmap trimestral:
1. Mês 1: [Features]
2. Mês 2: [Features]
3. Mês 3: [Features]

Para cada mês:
- Features principais
- Métricas de sucesso
- Riscos
- Dependências

Considere:
- Capacidade da equipe
- Dependências técnicas
- Impacto no usuário
- Quick wins
```

### Para Escrever User Stories

```
Atue como Product Owner.

Feature: [DESCRIÇÃO]

Escreva User Stories no formato:

**Como** [tipo de usuário]
**Eu quero** [ação]
**Para que** [benefício]

**Critérios de Aceitação:**
- [ ] Dado que [contexto]
- [ ] Quando [ação]
- [ ] Então [resultado esperado]

**Estimativa:** [Story Points 1-13]

Gere 3-5 User Stories para esta feature.
```

### Para Análise de Métricas

```
Atue como Product Analyst.

Métricas atuais:
- MAU: [valor]
- Retention D7: [valor]
- Task Completion Rate: [valor]

Analise:
1. O que está indo bem?
2. O que está indo mal?
3. Quais hipóteses explicam os números?
4. Quais experimentos devemos rodar?
5. Qual feature priorizar para melhorar métricas?

Use dados e seja específico.
```

---

## 📅 Workflow Diário

### Segunda-feira: Planning

```bash
# 1. Revisar backlog
/analyze-backlog

# 2. Priorizar features
/prioritize-features

# 3. Planejar sprint
Atue como Scrum Master.

Planeje sprint de 2 semanas:
- Features priorizadas: [lista]
- Capacidade da equipe: [horas disponíveis]
- Débito técnico: [pendências]

Defina:
1. Sprint Goal
2. Features do sprint
3. Tarefas técnicas
4. Buffer para imprevistos (20%)
```

### Terça-quarta: Desenvolvimento

```bash
# Apoio técnico
Atue como Product Manager + Tech Lead.

Estou implementando [FEATURE].

Me ajude com:
1. Decisões de produto durante dev
2. Trade-offs técnicos
3. Mudanças de escopo
4. Bloqueios e soluções
```

### Quinta: Review

```bash
# Revisar progresso
Atue como Product Manager.

Features completadas esta semana:
- [Feature 1]
- [Feature 2]

Analise:
1. Atendeu critérios de aceitação?
2. Qualidade está boa?
3. Métricas de sucesso definidas?
4. Pronto para produção?

Sugira melhorias ou aprovação.
```

### Sexta: Retrospectiva

```bash
Atue como Facilitador de Retrospectiva.

Sprint completado:
- ✅ Completado: [features]
- ⏳ Em progresso: [features]
- ❌ Bloqueado: [features]

Conduza retrospectiva:
1. O que foi bem?
2. O que pode melhorar?
3. Action items para próxima sprint
4. Aprendizados
```

---

## 📚 Casos de Uso

### Caso 1: Decidir Próxima Feature

**Prompt:**
```
Atue como Product Manager estratégico.

Temos 3 opções para próxima feature:

1. **Sistema de Pedidos Mobile**
   - Garçons fazem pedidos pelo celular
   - Impacto: Alto (todos garçons usariam)
   - Esforço: 3 semanas

2. **Analytics Dashboard para Donos**
   - Visualizar métricas de negócio
   - Impacto: Médio (só donos usariam)
   - Esforço: 2 semanas

3. **Gamificação de Tarefas**
   - Sistema de XP e levels
   - Impacto: Alto (todos funcionários)
   - Esforço: 4 semanas

Qual priorizar? Por quê?

Considere:
- North Star Metric (MAU)
- Feedback de clientes
- Diferencial competitivo
- Viabilidade técnica
```

### Caso 2: Escrever PRD Completo

**Prompt:**
```
Atue como Product Manager sênior.

Escreva PRD completo para:
"Sistema de Check-in/Check-out de Turnos com QR Code"

Problema:
- Funcionários esquecem de bater ponto
- Dono não tem visibilidade de presença
- Fraudes em marcação de horário

Solução desejada:
- QR Code único para empresa
- Funcionário escaneia ao chegar/sair
- Dashboard para dono ver quem está presente

Gere PRD completo seguindo template padrão.
```

### Caso 3: Analisar Feedback de Usuários

**Prompt:**
```
Atue como Product Analyst.

Recebemos este feedback:

"O app é legal mas demora muito pra carregar.
Às vezes trava quando tento completar uma tarefa.
Seria legal ter notificações push quando alguém me marca."

Analise:
1. Categorize os problemas (UX, Performance, Feature Request)
2. Priorize (P0-P2)
3. Sugira soluções técnicas
4. Estime esforço
5. Recomende quando fazer

Seja específico e técnico.
```

### Caso 4: Planejamento de Release

**Prompt:**
```
Atue como Release Manager.

Próxima release v2.0 em 1 mês.

Features completadas:
- Sistema de tarefas gamificado
- Chat entre equipe
- Analytics básico

Features em progresso:
- Sistema de pedidos mobile (70%)
- Notificações push (40%)

O que incluir na release?

Forneça:
1. Features da v2.0
2. Features para v2.1
3. Plano de comunicação
4. Riscos e mitigações
5. Rollout strategy (todos vs beta)
```

---

## 🛠️ Ferramentas e Integração

### 1. **GitHub Issues como Backlog**

Crie template `.github/ISSUE_TEMPLATE/feature.md`:

```markdown
---
name: Feature Request
about: Proposta de nova feature
title: '[FEATURE] '
labels: 'feature'
---

## 🎯 Objetivo
Por que queremos isso?

## 👤 Usuário
Quem se beneficia?

## 📋 Descrição
Como deve funcionar?

## ✅ Critérios de Aceitação
- [ ] Critério 1
- [ ] Critério 2

## 📊 Métricas de Sucesso
Como medir impacto?

## 🔢 RICE Score
- Reach: [1-1000+]
- Impact: [0.25-3]
- Confidence: [0-100%]
- Effort: [person-months]
- **Score**: [(R×I×C)/E]

## 🚧 Riscos
O que pode dar errado?
```

### 2. **Automação com IA**

Crie script `scripts/ai-pm-assistant.sh`:

```bash
#!/bin/bash

# AI Product Manager Assistant

case "$1" in
  prioritize)
    echo "Analisando backlog..."
    # Ler issues do GitHub
    gh issue list --label feature --json title,body > /tmp/backlog.json

    # Enviar para IA priorizar
    echo "Atue como PM. Priorize usando RICE: $(cat /tmp/backlog.json)" | ai-cli
    ;;

  prd)
    echo "Gerando PRD para: $2"
    # Gerar PRD usando IA
    echo "Atue como PM. Gere PRD para: $2" | ai-cli > "docs/prd-$2.md"
    ;;

  analyze)
    echo "Analisando métricas..."
    # Buscar métricas do analytics
    # Enviar para IA analisar
    ;;

  *)
    echo "Uso: $0 {prioritize|prd|analyze}"
    exit 1
esac
```

### 3. **Integração com Analytics**

```typescript
// src/lib/ai-pm-analytics.ts

export async function askAIAboutMetrics(metrics: Metrics) {
  const prompt = `
    Atue como Product Analyst.

    Métricas desta semana:
    - MAU: ${metrics.mau}
    - Retention D7: ${metrics.retentionD7}%
    - Task Completion: ${metrics.taskCompletion}%
    - Avg Session Time: ${metrics.avgSessionTime}min

    Analise e recomende ações.
  `;

  return await callAI(prompt);
}
```

---

## 📈 Métricas para Avaliar seu "AI PM"

Meça efetividade da IA como PM:

1. **Velocidade de Decisão**
   - Antes: X dias para priorizar
   - Com IA: Y horas

2. **Qualidade de PRDs**
   - PRDs completos: %
   - PRDs com feedback: %

3. **Acurácia de Estimativas**
   - Estimativas corretas: %
   - Desvio médio: ±X%

4. **Satisfação da Equipe**
   - Survey mensal: 1-5
   - Clareza de requisitos: %

---

## 🎓 Dicas Avançadas

### 1. **Contexto Incremental**

Construa contexto ao longo do tempo:

```
# Sessão 1
Atue como PM. Contexto: [adiciona product-context.md]

# Sessão 2
Continue como PM. Lembre-se do roadmap que definimos.
Agora analise feedback: [feedback]

# Sessão 3
Ainda como PM do ChefIApp. Baseado no roadmap e feedback,
revise prioridades.
```

### 2. **Decisões Baseadas em Dados**

```
Atue como Product Data Analyst.

Temos 2 hipóteses:

H1: Adicionar gamificação vai aumentar engagement
- Métricas baseline: [dados]
- Experimento: A/B test em 20% usuários
- Duração: 2 semanas

H2: Simplificar onboarding vai reduzir churn
- Métricas baseline: [dados]
- Experimento: A/B test em 30% novos usuários
- Duração: 1 semana

Qual priorizar? Como desenhar experimento?
```

### 3. **Comunicação com Stakeholders**

```
Atue como Product Communicator.

Escreva email para stakeholders sobre:
- Decisão de adiar Feature X
- Razão: Priorizar Feature Y (maior impacto)
- Impacto no roadmap

Tom: Profissional, transparente, data-driven
Tamanho: 2 parágrafos
```

---

## 🚀 Exemplo Completo: Sprint Planning

```
# 1. Revisar Backlog
/analyze-backlog

# 2. Priorizar
Atue como Product Manager.

Backlog atual:
1. Sistema de pedidos mobile (HIGH)
2. Analytics dashboard (MEDIUM)
3. Notificações push (HIGH)
4. Integração com POS (LOW)
5. Chat interno (MEDIUM)

Equipe: 2 devs × 80h/sprint

Priorize e planeje sprint usando:
- RICE Score
- Dependências técnicas
- Capacidade da equipe
- Buffer 20% para imprevistos

# 3. Escrever User Stories
Para cada feature priorizada, gere User Stories.

# 4. Definir Métricas
Para cada feature, defina como medir sucesso.

# 5. Comunicar
Escreva email de sprint kick-off para equipe.
```

---

## 📝 Conclusão

Com estes prompts e workflows, a IA se torna um Product Manager 24/7 que:

✅ Nunca esquece contexto
✅ Sempre baseado em dados
✅ Prioriza objetivamente
✅ Documenta tudo
✅ Disponível sempre

**Próximos Passos:**
1. Configure product-context.md
2. Crie comandos slash customizados
3. Integre com GitHub Issues
4. Teste workflow por 1 sprint
5. Refine baseado em resultados

---

**Criado por:** goldmonkey.studio
**Última atualização:** 2025-12-03
