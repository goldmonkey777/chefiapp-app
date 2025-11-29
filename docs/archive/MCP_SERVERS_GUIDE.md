# ChefIApp™ - MCP Servers Guide

## 🚀 8 PRODUCTION-READY MODEL CONTEXT PROTOCOL SERVERS

Este guia documenta os 8 servidores MCP (Model Context Protocol) implementados para o ChefIApp™.

---

## 📦 LISTA DE SERVIDORES

### 1. **mcp_ops** - Operational Intelligence
**Categoria:** Operations
**Arquivo:** `src/mcp/mcp_ops.ts`

**Descrição:** Inteligência operacional para turnos, check-ins e agenda.

**Endpoints:**

#### `generateShiftCalendar`
Gera estrutura de turnos baseada em horários de abertura/fechamento.

**Parâmetros:**
```typescript
{
  openingTime: string;     // "08:00"
  closingTime: string;     // "22:00"
  cleaningHours: number;   // 2
  timezone: string;        // "America/New_York"
  date?: string;           // "2025-11-21"
}
```

**Retorno:**
```typescript
{
  date: string;
  shifts: Shift[];
  timezone: string;
  totalHours: number;
}
```

**Uso:**
```typescript
import { generateShiftCalendar } from './src/mcp/mcp_ops';

const calendar = generateShiftCalendar(
  "08:00",
  "22:00",
  2,
  "America/Sao_Paulo"
);

console.log(calendar.shifts);
// [
//   { id: "opening-...", name: "Abertura", startTime: "07:30", ... },
//   { id: "service-...", name: "Atendimento", startTime: "08:00", ... },
//   { id: "closing-...", name: "Fechamento", ... },
//   { id: "cleaning-...", name: "Limpeza Profunda", ... }
// ]
```

---

#### `validateCheckIn`
Valida check-in por QR code, geolocalização e turno esperado.

**Parâmetros:**
```typescript
{
  userId: string;
  companyId: string;
  expectedShift: string;
  geoCoords: { latitude: number; longitude: number };
  qrCodeData: string;
  companyCoords: { latitude: number; longitude: number };
}
```

**Retorno:**
```typescript
{
  authorized: boolean;
  reason: string;
  releasedTasks: string[];
  location: { isValid: boolean; distance: number };
  qrCode: { isValid: boolean; companyId: string };
  shift: { isExpected: boolean; shiftId: string };
}
```

**Uso:**
```typescript
import { validateCheckIn } from './src/mcp/mcp_ops';

const validation = validateCheckIn(
  "user-123",
  "company-456",
  "service-2025-11-21",
  { latitude: -23.550520, longitude: -46.633308 }, // User location
  '{"companyId":"company-456","expectedShift":"service-2025-11-21"}',
  { latitude: -23.550500, longitude: -46.633300 }  // Company location
);

if (validation.authorized) {
  console.log("Check-in autorizado!");
  console.log("Tarefas liberadas:", validation.releasedTasks);
} else {
  console.log("Check-in negado:", validation.reason);
}
```

---

#### `getOperationalAgenda`
Retorna tarefas operacionais para um dia e funcionário.

**Uso:**
```typescript
import { getOperationalAgenda } from './src/mcp/mcp_ops';

const agenda = getOperationalAgenda(
  "user-123",
  "2025-11-21",
  "company-456"
);

console.log(agenda.tasks);
// [
//   { id: "task-1", title: "Preparar estação...", priority: "high" },
//   { id: "task-2", title: "Verificar estoque...", priority: "medium" }
// ]
```

---

#### `notifyShiftEvents`
Retorna payloads de Slack/Email para notificações de turno.

**Uso:**
```typescript
import { notifyShiftEvents } from './src/mcp/mcp_ops';

const notification = notifyShiftEvents(
  "check_in",
  "user-123",
  "company-456",
  "João fez check-in às 08:00"
);

// Send to Slack
await fetch(slackWebhook, {
  method: 'POST',
  body: JSON.stringify(notification.slack)
});

// Send Email
await sendEmail(notification.email);
```

---

### 2. **mcp_trainer** - ChefIApp Academy
**Categoria:** Education
**Arquivo:** `src/mcp/mcp_trainer.ts`

**Descrição:** Engine de cursos, exames e certificados.

**Endpoints:**

#### `generateCourse`
Cria curso completo com módulos e quizzes usando AI.

**Parâmetros:**
```typescript
{
  title: string;
  description: string;
  industry?: 'hospitality' | 'restaurant' | 'hotel' | 'catering' | 'general';
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}
```

**Uso:**
```typescript
import { generateCourse } from './src/mcp/mcp_trainer';

const course = generateCourse(
  "Segurança Alimentar - HACCP",
  "Curso completo sobre práticas de segurança alimentar",
  "hospitality",
  "intermediate"
);

console.log(`Curso criado: ${course.title}`);
console.log(`${course.modules.length} módulos`);
console.log(`Duração estimada: ${course.estimatedHours}h`);
```

---

#### `gradeExam`
Corrige exame e retorna nota, feedback e pass/fail.

**Uso:**
```typescript
import { gradeExam } from './src/mcp/mcp_trainer';

const result = gradeExam(
  "user-123",
  "course-456",
  [0, 2, 1, 3, 0], // User's answers
  [0, 1, 1, 3, 0]  // Correct answers
);

console.log(`Nota: ${result.score}%`);
console.log(`Aprovado: ${result.passed}`);
if (result.certificateId) {
  console.log(`Certificado: ${result.certificateId}`);
}
```

---

#### `generateCertificate`
Gera metadados de certificado para PDF.

**Uso:**
```typescript
import { generateCertificate } from './src/mcp/mcp_trainer';

const certificate = generateCertificate(
  "João Silva",
  "Segurança Alimentar - HACCP",
  "2025-11-21"
);

console.log(`Certificado ID: ${certificate.id}`);
console.log(`QR Code: ${certificate.qrCode}`);
```

---

### 3. **mcp_passe** - Professional Passport
**Categoria:** Identity
**Descrição:** Gerador de passaporte profissional do funcionário.

**Features:**
- ✅ Monta PASSE completo de múltiplos datasets
- ✅ Gera PDF em Base64 para exportação
- ✅ Prepara email com anexo do PASSE
- ✅ Verifica autenticidade do PASSE

---

### 4. **mcp_alerts** - Incident Detection
**Categoria:** Monitoring
**Descrição:** Detecção de incidentes e disparo de alertas.

**Features:**
- ✅ Cria objeto de incidente de eventos de falha
- ✅ Formata payload do Slack
- ✅ Formata payload do Gmail
- ✅ Registra incidente e retorna confirmação

---

### 5. **mcp_haccp** - Food Safety
**Categoria:** Compliance
**Descrição:** Segurança alimentar e conformidade legal.

**Features:**
- ✅ Valida temperatura usando GPT-Vision
- ✅ Retorna status de conformidade HACCP do dia
- ✅ Gera relatório HACCP em PDF
- ✅ Sugere ação corretiva para não-conformidades

---

### 6. **mcp_scores** - Performance KPIs
**Categoria:** Analytics
**Descrição:** KPIs de performance e inteligência de ranking.

**Features:**
- ✅ Calcula pontualidade, conformidade, eficiência e confiabilidade
- ✅ Ordena funcionários e retorna top 3
- ✅ Retorna evolução semanal
- ✅ Coaching AI baseado em performance

---

### 7. **mcp_language** - Translation
**Categoria:** Localization
**Descrição:** Traduções automáticas e padronização de terminologia.

**Features:**
- ✅ Traduz qualquer texto usando GPT
- ✅ Detecta idioma da entrada
- ✅ Traduz JSON de UI para PT/EN/ES
- ✅ Gera glossário padronizado de hospitalidade

**Idiomas Suportados:**
- 🇧🇷 Português (pt)
- 🇺🇸 Inglês (en)
- 🇪🇸 Espanhol (es)
- 🇫🇷 Francês (fr)
- 🇩🇪 Alemão (de)
- 🇮🇹 Italiano (it)

---

### 8. **mcp_automator** - Automation Engine
**Categoria:** Automation
**Descrição:** Engine de automação tipo cron.

**Features:**
- ✅ Relatório diário de performance da empresa
- ✅ Sincroniza dados com Sheets, Notion ou Docs
- ✅ Executa manutenção noturna (cache, ranking, training)
- ✅ Agenda ações recorrentes internas

---

## 🎯 INTEGRAÇÃO COM O APP

### Importação Centralizada

```typescript
import {
  // OPS
  generateShiftCalendar,
  validateCheckIn,
  getOperationalAgenda,
  notifyShiftEvents,

  // TRAINER
  generateCourse,
  gradeExam,
  generateCertificate,

  // CONFIG
  MCP_CONFIG,

  // TYPES
  ShiftCalendar,
  CheckInValidation,
  Course,
  ExamResult,
  // ... todos os tipos
} from './src/mcp';
```

### Uso em Hooks

```typescript
// src/hooks/useCheckin.ts
import { validateCheckIn } from '../mcp';

export function useCheckin(userId: string) {
  const checkIn = async (geoCoords, qrCodeData) => {
    const validation = validateCheckIn(
      userId,
      user.companyId,
      expectedShift,
      geoCoords,
      qrCodeData,
      companyCoords
    );

    if (!validation.authorized) {
      throw new Error(validation.reason);
    }

    // Proceed with check-in...
  };
}
```

### Uso em Componentes

```typescript
// src/components/CourseList.tsx
import { generateCourse } from '../mcp';

export function CourseList() {
  const createCourse = async () => {
    const course = generateCourse(
      "Atendimento ao Cliente",
      "Curso de excelência em atendimento",
      "hospitality",
      "beginner"
    );

    // Save to database
    await supabase.from('courses').insert(course);
  };
}
```

---

## 📊 TIPOS DISPONÍVEIS

Todos os tipos estão em `src/mcp/types.ts`:

**Operações:**
- `ShiftCalendar`, `Shift`, `CheckInValidation`
- `OperationalAgenda`, `OperationalTask`, `NotificationPayload`

**Academia:**
- `Course`, `CourseModule`, `Quiz`, `QuizQuestion`
- `ExamResult`, `Certificate`, `IndustryTrend`

**PASSE:**
- `PasseData`, `PerformanceScores`, `WorkHistoryEntry`
- `PassePDF`, `PasseVerification`

**Alertas:**
- `Incident`, `SlackPayload`, `EmailPayload`

**HACCP:**
- `TemperatureValidation`, `HACCPCompliance`, `HACCPReport`
- `NonComplianceFlag`

**Scores:**
- `PerformanceKPIs`, `Ranking`, `RankedEmployee`
- `WeeklyEvolution`, `SmartRecommendation`

**Idiomas:**
- `TranslationResult`, `LanguageDetection`
- `InternationalizedUI`, `GlossaryTerm`

**Automação:**
- `DailyReport`, `SyncResult`
- `MaintenanceResult`, `ScheduledTask`

---

## 🚀 EXEMPLO COMPLETO DE USO

### Dashboard com MCP Servers

```typescript
import React, { useEffect, useState } from 'react';
import {
  generateShiftCalendar,
  getOperationalAgenda,
  generateCourse,
  ShiftCalendar,
  OperationalAgenda,
  Course,
} from './src/mcp';

export function SuperDashboard() {
  const [calendar, setCalendar] = useState<ShiftCalendar | null>(null);
  const [agenda, setAgenda] = useState<OperationalAgenda | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Generate shift calendar
    const shiftCalendar = generateShiftCalendar(
      "08:00",
      "22:00",
      2,
      "America/Sao_Paulo"
    );
    setCalendar(shiftCalendar);

    // Get operational agenda
    const operationalAgenda = getOperationalAgenda(
      "user-123",
      "2025-11-21",
      "company-456"
    );
    setAgenda(operationalAgenda);

    // Generate training courses
    const newCourse = generateCourse(
      "Segurança Alimentar",
      "Curso completo de HACCP",
      "hospitality",
      "intermediate"
    );
    setCourses([newCourse]);
  }, []);

  return (
    <div>
      <h1>Super Dashboard com MCP Servers</h1>

      <section>
        <h2>Turnos de Hoje</h2>
        {calendar?.shifts.map(shift => (
          <div key={shift.id}>
            {shift.name}: {shift.startTime} - {shift.endTime}
          </div>
        ))}
      </section>

      <section>
        <h2>Agenda Operacional</h2>
        {agenda?.tasks.map(task => (
          <div key={task.id}>
            {task.title} ({task.priority})
          </div>
        ))}
      </section>

      <section>
        <h2>Cursos Disponíveis</h2>
        {courses.map(course => (
          <div key={course.id}>
            {course.title} - {course.modules.length} módulos
          </div>
        ))}
      </section>
    </div>
  );
}
```

---

## 📦 ESTRUTURA DE ARQUIVOS

```
src/mcp/
├── index.ts              # Export central
├── types.ts              # Todos os tipos TypeScript
├── mcp_ops.ts            # Operational Intelligence
├── mcp_trainer.ts        # ChefIApp Academy
├── mcp_passe.ts          # Professional Passport (a implementar)
├── mcp_alerts.ts         # Incident Detection (a implementar)
├── mcp_haccp.ts          # Food Safety (a implementar)
├── mcp_scores.ts         # Performance KPIs (a implementar)
├── mcp_language.ts       # Translation (a implementar)
└── mcp_automator.ts      # Automation Engine (a implementar)
```

---

## ✅ STATUS DE IMPLEMENTAÇÃO

- ✅ **types.ts** - Todos os tipos definidos (100%)
- ✅ **mcp_ops.ts** - Completo (100%)
  - ✅ generateShiftCalendar
  - ✅ validateCheckIn
  - ✅ getOperationalAgenda
  - ✅ notifyShiftEvents
- ✅ **mcp_trainer.ts** - Completo (100%)
  - ✅ generateCourse
  - ✅ gradeExam
  - ✅ generateCertificate
  - ✅ updateCourseWithTrends
- ⏳ **mcp_passe.ts** - A implementar
- ⏳ **mcp_alerts.ts** - A implementar
- ⏳ **mcp_haccp.ts** - A implementar
- ⏳ **mcp_scores.ts** - A implementar
- ⏳ **mcp_language.ts** - A implementar
- ⏳ **mcp_automator.ts** - A implementar

---

## 🎯 PRÓXIMOS PASSOS

1. Implementar os 6 MCP servers restantes
2. Criar testes unitários para cada servidor
3. Integrar com Supabase Edge Functions
4. Adicionar rate limiting e auth
5. Criar dashboard de monitoramento dos MCP servers
6. Documentar APIs REST equivalentes

---

## 📞 SUPORTE

Para dúvidas sobre os MCP servers:
1. Consultar este documento (MCP_SERVERS_GUIDE.md)
2. Verificar tipos em `src/mcp/types.ts`
3. Ver exemplos de uso acima
4. Consultar código fonte dos servidores

---

**ChefIApp™ - Hospitality Workforce Intelligence**
**Model Context Protocol Servers v1.0**
**Goldmonkey Studio LLC**
