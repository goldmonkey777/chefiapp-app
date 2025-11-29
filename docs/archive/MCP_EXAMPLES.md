# ChefIApp™ - MCP Servers - Exemplos de Uso

## 🚀 GUIA PRÁTICO DE IMPLEMENTAÇÃO

Este guia mostra exemplos reais de como usar os 8 MCP Servers no ChefIApp™.

---

## 📦 IMPORTAÇÃO

```typescript
// Import completo
import { MCP } from './src/mcp';

// Ou imports específicos
import {
  generateShiftCalendar,
  validateCheckIn,
  generateCourse,
  calculateKPIs,
  translateText,
} from './src/mcp';
```

---

## 1️⃣ MCP_OPS - Operational Intelligence

### Exemplo 1: Gerar Calendário de Turnos

```typescript
import { MCP } from './src/mcp';

function setupCompanyShifts() {
  const calendar = MCP.ops.generateShiftCalendar(
    "08:00",  // Horário de abertura
    "22:00",  // Horário de fechamento
    2,        // 2 horas de limpeza
    "America/Sao_Paulo"
  );

  console.log(`📅 Turnos para ${calendar.date}:`);
  console.log(`Total de horas: ${calendar.totalHours}h\n`);

  calendar.shifts.forEach(shift => {
    console.log(`${shift.name}:`);
    console.log(`  ⏰ ${shift.startTime} - ${shift.endTime} (${shift.duration}min)`);
    console.log(`  📌 Tipo: ${shift.type}\n`);
  });
}

// Output:
// 📅 Turnos para 2025-11-28:
// Total de horas: 15.5h
//
// Abertura:
//   ⏰ 07:30 - 08:00 (30min)
//   📌 Tipo: opening
//
// Atendimento:
//   ⏰ 08:00 - 22:00 (840min)
//   📌 Tipo: service
// ...
```

### Exemplo 2: Validar Check-in com Geolocalização

```typescript
import { MCP } from './src/mcp';

async function performCheckIn(userId: string, companyId: string) {
  // Obter localização do usuário
  const userLocation = await getUserGPS(); // { latitude: -23.550520, longitude: -46.633308 }

  // Escanear QR Code da empresa
  const qrCode = JSON.stringify({
    companyId: "company-456",
    expectedShift: "service-2025-11-28"
  });

  const companyLocation = {
    latitude: -23.550500,
    longitude: -46.633300
  };

  const validation = MCP.ops.validateCheckIn(
    userId,
    companyId,
    "service-2025-11-28",
    userLocation,
    qrCode,
    companyLocation
  );

  if (validation.authorized) {
    console.log("✅ Check-in autorizado!");
    console.log(`📍 Distância: ${Math.round(validation.location.distance)}m`);
    console.log(`📋 Tarefas liberadas: ${validation.releasedTasks.length}`);

    // Liberar tarefas do dia
    validation.releasedTasks.forEach(taskId => {
      unlockTask(taskId);
    });
  } else {
    console.error("❌ Check-in negado:", validation.reason);
  }
}
```

### Exemplo 3: Enviar Notificação de Evento

```typescript
import { MCP } from './src/mcp';

function notifyLateCheckIn(userId: string, companyId: string, minutesLate: number) {
  const notification = MCP.ops.notifyShiftEvents(
    "late",
    userId,
    companyId,
    `Funcionário chegou ${minutesLate} minutos atrasado`
  );

  // Enviar para Slack
  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    body: JSON.stringify(notification.slack)
  });

  // Enviar Email
  await sendEmail(notification.email);
}
```

---

## 2️⃣ MCP_TRAINER - ChefIApp Academy

### Exemplo 1: Criar Curso Automaticamente

```typescript
import { MCP } from './src/mcp';

function createFoodSafetyCourse() {
  const course = MCP.trainer.generateCourse(
    "Segurança Alimentar - HACCP",
    "Curso completo sobre práticas de segurança alimentar e HACCP",
    "hospitality",
    "intermediate"
  );

  console.log(`📚 Curso criado: ${course.title}`);
  console.log(`⏱️  Duração estimada: ${course.estimatedHours}h`);
  console.log(`📖 ${course.modules.length} módulos\n`);

  course.modules.forEach((module, i) => {
    console.log(`Módulo ${i + 1}: ${module.title}`);
    console.log(`  📝 ${module.quiz.questions.length} questões`);
  });

  // Salvar no Supabase
  await supabase.from('courses').insert({
    id: course.id,
    title: course.title,
    description: course.description,
    industry: course.industry,
    difficulty: course.difficulty,
    estimated_hours: course.estimatedHours,
    modules: course.modules
  });
}
```

### Exemplo 2: Corrigir Exame e Emitir Certificado

```typescript
import { MCP } from './src/mcp';

async function submitExam(userId: string, courseId: string, userAnswers: number[]) {
  // Buscar respostas corretas do curso
  const { data: course } = await supabase
    .from('courses')
    .select('modules')
    .eq('id', courseId)
    .single();

  const correctAnswers = course.modules.flatMap(m =>
    m.quiz.questions.map(q => q.correctAnswer)
  );

  // Corrigir exame
  const result = MCP.trainer.gradeExam(
    userId,
    courseId,
    userAnswers,
    correctAnswers
  );

  console.log(`📊 Resultado do Exame:`);
  console.log(`   Nota: ${result.score}%`);
  console.log(`   Acertos: ${result.correctAnswers}/${result.totalQuestions}`);
  console.log(`   Status: ${result.passed ? '✅ APROVADO' : '❌ REPROVADO'}`);

  if (result.passed) {
    // Gerar certificado
    const user = await getUser(userId);
    const certificate = MCP.trainer.generateCertificate(
      user.name,
      course.title,
      new Date().toISOString()
    );

    console.log(`\n🏆 Certificado emitido!`);
    console.log(`   ID: ${certificate.id}`);
    console.log(`   QR Code: ${certificate.qrCode}`);

    // Salvar certificado
    await supabase.from('certificates').insert(certificate);
  }

  return result;
}
```

---

## 3️⃣ MCP_PASSE - Professional Passport

### Exemplo: Gerar PASSE Completo

```typescript
import { MCP } from './src/mcp';

async function generateEmployeePASSE(userId: string) {
  const user = await getUser(userId);
  const company = await getCompany(user.companyId);
  const certificates = await getUserCertificates(userId);

  // Calcular performance
  const kpis = MCP.scores.calculateKPIs(
    user.tasksCompleted,
    user.tasksTotal,
    user.averageTaskTime,
    user.attendanceRate
  );

  // Montar PASSE
  const passe = MCP.passe.assemblePasse(
    {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      role: user.role,
      startDate: user.createdAt
    },
    kpis,
    certificates,
    company.logoUrl,
    company.id,
    company.name
  );

  console.log(`📋 PASSE Profissional gerado!`);
  console.log(`   ID: ${passe.id}`);
  console.log(`   Performance Overall: ${passe.performance.overall}%`);
  console.log(`   Certificações: ${passe.certifications.length}`);

  // Gerar PDF
  const pdf = MCP.passe.generatePassePDF(passe);
  console.log(`📄 PDF gerado (${pdf.metadata.size} bytes)`);

  // Preparar email para envio
  const emailPayload = MCP.passe.sendToCompany(
    "manager@restaurant.com",
    pdf.base64,
    `PASSE Profissional de ${user.name} para sua análise.`
  );

  await sendEmail(emailPayload);
}
```

---

## 4️⃣ MCP_ALERTS - Incident Detection

### Exemplo: Detectar e Alertar Incidente

```typescript
import { MCP } from './src/mcp';

async function handleTemperatureAlert(userId: string, companyId: string, temp: number) {
  // Detectar incidente
  const incident = MCP.alerts.detectIncident(
    "temperature",
    userId,
    companyId,
    `Geladeira apresentou temperatura de ${temp}°C (esperado: 0-5°C)`
  );

  console.log(`🚨 Incidente detectado!`);
  console.log(`   Tipo: ${incident.type}`);
  console.log(`   Severidade: ${incident.severity}`);
  console.log(`   Ação Corretiva: ${incident.correctiveAction}`);

  // Enviar alerta no Slack
  const slackPayload = MCP.alerts.sendSlackAlert(
    "#operations",
    `⚠️ ALERTA: Temperatura fora do padrão!`,
    incident
  );

  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    body: JSON.stringify(slackPayload)
  });

  // Enviar email para gerente
  const emailPayload = MCP.alerts.sendEmailAlert(
    "manager@restaurant.com",
    `🚨 ALERTA CRÍTICO: Temperatura`,
    `Um incidente de temperatura foi detectado.`,
    incident
  );

  await sendEmail(emailPayload);

  // Registrar incidente
  const confirmation = MCP.alerts.logIncident(incident);
  console.log(`✅ Incidente registrado: ${confirmation.incidentId}`);
}
```

---

## 5️⃣ MCP_HACCP - Food Safety

### Exemplo: Validar Temperatura com Foto

```typescript
import { MCP } from './src/mcp';

async function checkFridgeTemperature(imageUrl: string) {
  const validation = MCP.haccp.validateTemperature(
    imageUrl,
    "0-5",  // Faixa esperada: 0-5°C
    "Geladeira Principal"
  );

  console.log(`🌡️  Temperatura Detectada: ${validation.detectedValue}°C`);
  console.log(`📊 Confiança: ${Math.round(validation.confidence * 100)}%`);
  console.log(`✅ Conforme: ${validation.isCompliant ? 'SIM' : 'NÃO'}`);

  if (!validation.isCompliant) {
    // Criar não-conformidade
    const flag = MCP.haccp.flagNonCompliance(
      "Temperatura da geladeira",
      `Temperatura detectada: ${validation.detectedValue}°C (esperado: 0-5°C)`
    );

    console.log(`\n⚠️  NÃO-CONFORMIDADE`);
    console.log(`   Severidade: ${flag.severity}`);
    console.log(`   Prazo: ${flag.deadline}`);
    console.log(`\n   Ações Corretivas:`);
    flag.correctiveActions.forEach((action, i) => {
      console.log(`   ${i + 1}. ${action}`);
    });
  }
}
```

---

## 6️⃣ MCP_SCORES - Performance KPIs

### Exemplo: Calcular KPIs e Gerar Ranking

```typescript
import { MCP } from './src/mcp';

async function generateCompanyRanking(companyId: string) {
  const employees = await getCompanyEmployees(companyId);

  const employeesWithKPIs = employees.map(emp => ({
    userId: emp.id,
    userName: emp.name,
    kpis: MCP.scores.calculateKPIs(
      emp.tasksCompleted,
      emp.totalTasks,
      emp.averageTime,
      emp.attendance
    )
  }));

  const ranking = MCP.scores.generateRanking(employeesWithKPIs, companyId);

  console.log(`🏆 RANKING DA EMPRESA\n`);

  ranking.top3.forEach((emp, i) => {
    const medal = ['🥇', '🥈', '🥉'][i];
    console.log(`${medal} #${emp.rank} - ${emp.userName}`);
    console.log(`   Score: ${emp.score}%`);
    console.log(`   Pontualidade: ${emp.kpis.punctuality}%`);
    console.log(`   Conformidade: ${emp.kpis.compliance}%`);
    console.log(`   Eficiência: ${emp.kpis.efficiency}%\n`);
  });

  return ranking;
}
```

### Exemplo: Recomendações Inteligentes

```typescript
import { MCP } from './src/mcp';

async function getPersonalizedRecommendations(userId: string) {
  const user = await getUser(userId);

  const kpis = MCP.scores.calculateKPIs(
    user.tasksCompleted,
    user.totalTasks,
    user.averageTime,
    user.attendance
  );

  const recommendations = MCP.scores.smartRecommendations(kpis, userId);

  console.log(`💡 Recomendações para ${user.name}:\n`);

  recommendations.forEach((rec, i) => {
    const priority = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
    console.log(`${priority} ${i + 1}. ${rec.action}`);
    console.log(`   Categoria: ${rec.category}`);
    console.log(`   Impacto esperado: ${rec.expectedImpact}`);
    console.log(`   Tempo estimado: ${rec.estimatedTime}\n`);
  });
}
```

---

## 7️⃣ MCP_LANGUAGE - Translation

### Exemplo: Traduzir Interface

```typescript
import { MCP } from './src/mcp';

function internationalizeApp() {
  const uiStrings = {
    welcome: "Welcome to ChefIApp",
    login: "Login",
    dashboard: "Dashboard",
    tasks: "Tasks",
    profile: "Profile",
    logout: "Logout"
  };

  const translations = MCP.language.internationalizeUI(uiStrings);

  console.log('🇧🇷 Português:', translations.pt);
  console.log('🇺🇸 English:', translations.en);
  console.log('🇪🇸 Español:', translations.es);
}

// Output:
// 🇧🇷 Português: { welcome: 'Bem-vindo ao ChefIApp', ... }
// 🇺🇸 English: { welcome: 'Welcome to ChefIApp', ... }
// 🇪🇸 Español: { welcome: 'Bienvenido a ChefIApp', ... }
```

---

## 8️⃣ MCP_AUTOMATOR - Automation

### Exemplo: Configurar Automações

```typescript
import { MCP } from './src/mcp';

function setupCompanyAutomation(companyId: string) {
  // Criar suite de automações
  const tasks = MCP.automator.createAutomationSuite(companyId);

  console.log(`⚙️  Suite de Automação Configurada:\n`);

  tasks.forEach(task => {
    console.log(`📋 ${task.name}`);
    console.log(`   Padrão: ${task.cronPattern}`);
    console.log(`   Próxima execução: ${task.nextRun}\n`);
  });

  // Salvar no banco
  await supabase.from('scheduled_tasks').insert(tasks);
}

// Executar relatório diário
function generateDailyCompanyReport(companyId: string, companyName: string) {
  const report = MCP.automator.dailyReport(
    companyId,
    companyName,
    new Date().toISOString().split('T')[0]
  );

  console.log(`📊 RELATÓRIO DIÁRIO - ${report.date}\n`);
  console.log(`Performance:`);
  console.log(`  Tarefas: ${report.performance.tasksCompleted}/${report.performance.tasksTotal}`);
  console.log(`  Eficiência: ${report.performance.averageEfficiency}%`);
  console.log(`  Funcionários ativos: ${report.performance.employeesActive}\n`);
  console.log(`HACCP:`);
  console.log(`  Conformidade: ${report.haccp.complianceRate}%`);
  console.log(`  Incidentes: ${report.haccp.incidents}\n`);

  return report;
}
```

---

## 🎯 EXEMPLO COMPLETO: WORKFLOW DIÁRIO

```typescript
import { MCP } from './src/mcp';

async function dailyWorkflow(companyId: string) {
  console.log('🌅 INICIANDO WORKFLOW DIÁRIO\n');

  // 1. Gerar calendário de turnos
  const calendar = MCP.ops.generateShiftCalendar("08:00", "22:00", 2, "America/Sao_Paulo");
  console.log(`✅ Turnos gerados: ${calendar.shifts.length}`);

  // 2. Verificar conformidade HACCP
  const haccp = MCP.haccp.checklistStatus("system", companyId, new Date().toISOString().split('T')[0]);
  console.log(`✅ HACCP: ${haccp.overallRate}% conformidade`);

  // 3. Atualizar ranking
  const employees = await getEmployees(companyId);
  const ranking = MCP.scores.generateRanking(
    employees.map(e => ({ userId: e.id, userName: e.name, kpis: e.kpis })),
    companyId
  );
  console.log(`✅ Ranking atualizado - Top: ${ranking.top3[0].userName}`);

  // 4. Gerar relatório diário
  const report = MCP.automator.dailyReport(companyId, "My Restaurant", new Date().toISOString().split('T')[0]);
  console.log(`✅ Relatório gerado: ${report.performance.tasksCompleted} tarefas concluídas`);

  // 5. Enviar notificações
  const notification = MCP.ops.notifyShiftEvents(
    "check_in",
    "system",
    companyId,
    `Relatório diário pronto: ${report.performance.averageEfficiency}% eficiência média`
  );
  await sendEmail(notification.email);
  console.log(`✅ Notificações enviadas`);

  console.log('\n🎉 WORKFLOW CONCLUÍDO!');
}
```

---

## 📞 SUPORTE

Para mais informações:
- Ver `MCP_SERVERS_GUIDE.md` para documentação completa
- Ver `src/mcp/types.ts` para todas as interfaces TypeScript
- Ver código fonte dos servidores em `src/mcp/`

---

**ChefIApp™ - Hospitality Workforce Intelligence**
**MCP Servers v1.0.0**
**Goldmonkey Studio LLC**
