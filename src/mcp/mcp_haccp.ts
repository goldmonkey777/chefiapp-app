// ChefIApp™ - MCP_HACCP Server
// Food Safety & Legal Compliance

import {
  TemperatureValidation,
  HACCPCompliance,
  HACCPChecklistItem,
  HACCPReport,
  NonComplianceFlag,
  Incident,
} from './types';

// ============================================================================
// VALIDATE TEMPERATURE
// ============================================================================

export function validateTemperature(
  image: string,
  expectedRange: string,
  location: string
): TemperatureValidation {
  // In production, this would use GPT-Vision to detect temperature from image
  // For now, simulate detection

  const [min, max] = expectedRange.split('-').map(Number);

  // Simulate detected temperature (random between min-5 and max+5)
  const detectedValue = Math.random() * (max - min + 10) + (min - 5);
  const roundedValue = Math.round(detectedValue * 10) / 10;

  const isCompliant = roundedValue >= min && roundedValue <= max;
  const confidence = Math.random() * 0.3 + 0.7; // 70-100% confidence

  return {
    detectedValue: roundedValue,
    expectedRange: { min, max },
    isCompliant,
    location,
    imageUrl: image,
    timestamp: new Date().toISOString(),
    confidence,
  };
}

// ============================================================================
// CHECKLIST STATUS
// ============================================================================

export function checklistStatus(
  userId: string,
  companyId: string,
  date: string
): HACCPCompliance {
  // In production, fetch from database
  // For now, generate sample data

  const checklist: HACCPChecklistItem[] = [
    {
      id: 'temp-1',
      description: 'Temperatura da geladeira (0-5°C)',
      category: 'temperature',
      status: 'compliant',
      evidence: 'https://storage.com/temp-check-1.jpg',
      timestamp: `${date}T08:00:00Z`,
    },
    {
      id: 'temp-2',
      description: 'Temperatura do freezer (-18°C ou menos)',
      category: 'temperature',
      status: 'compliant',
      evidence: 'https://storage.com/temp-check-2.jpg',
      timestamp: `${date}T08:15:00Z`,
    },
    {
      id: 'clean-1',
      description: 'Limpeza das bancadas',
      category: 'cleaning',
      status: 'compliant',
      timestamp: `${date}T07:30:00Z`,
    },
    {
      id: 'storage-1',
      description: 'Organização e rotulagem de alimentos',
      category: 'storage',
      status: 'compliant',
      timestamp: `${date}T09:00:00Z`,
    },
    {
      id: 'prep-1',
      description: 'Higienização de utensílios',
      category: 'preparation',
      status: 'compliant',
      timestamp: `${date}T10:00:00Z`,
    },
    {
      id: 'service-1',
      description: 'Temperatura de alimentos servidos (>60°C)',
      category: 'service',
      status: 'pending',
      timestamp: `${date}T12:00:00Z`,
    },
  ];

  const criticalPoints = checklist.filter(
    (item) => item.category === 'temperature' || item.category === 'preparation'
  ).length;

  const criticalPointsMet = checklist.filter(
    (item) =>
      (item.category === 'temperature' || item.category === 'preparation') &&
      item.status === 'compliant'
  ).length;

  const compliantItems = checklist.filter((item) => item.status === 'compliant').length;
  const overallRate = Math.round((compliantItems / checklist.length) * 100);

  return {
    date,
    companyId,
    checklist,
    overallRate,
    criticalPoints,
    criticalPointsMet,
  };
}

// ============================================================================
// GENERATE HACCP REPORT
// ============================================================================

export function generateHaccpReport(
  companyId: string,
  companyName: string,
  dateRange: { start: string; end: string }
): HACCPReport {
  // In production, aggregate data from database
  // For now, generate sample report

  const incidents: Incident[] = [
    {
      id: 'incident-1',
      type: 'temperature',
      userId: 'user-123',
      companyId,
      description: 'Geladeira apresentou temperatura de 8°C',
      severity: 'high',
      correctiveAction: 'Equipamento foi ajustado e temperatura normalizada',
      status: 'resolved',
      createdAt: `${dateRange.start}T14:30:00Z`,
      resolvedAt: `${dateRange.start}T15:00:00Z`,
    },
  ];

  const recommendations = [
    'Implementar sistema de monitoramento automático de temperatura',
    'Realizar treinamento trimestral de HACCP para toda equipe',
    'Criar checklist digital para rastreabilidade completa',
    'Instalar alarmes em equipamentos de refrigeração',
  ];

  // Calculate compliance rate (90-98%)
  const complianceRate = Math.round(Math.random() * 8 + 90);

  return {
    companyId,
    companyName,
    dateRange,
    complianceRate,
    incidents,
    recommendations,
    generatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// FLAG NON-COMPLIANCE
// ============================================================================

export function flagNonCompliance(
  item: string,
  description: string
): NonComplianceFlag {
  // Determine severity based on keywords
  let severity: 'low' | 'medium' | 'high' | 'critical';
  let correctiveActions: string[];

  const lowerDesc = description.toLowerCase();

  if (
    lowerDesc.includes('temperatura') ||
    lowerDesc.includes('contaminação') ||
    lowerDesc.includes('segurança')
  ) {
    severity = 'critical';
    correctiveActions = [
      'Interromper uso/serviço imediatamente',
      'Isolar área/produto afetado',
      'Acionar supervisor imediatamente',
      'Documentar ocorrência com fotos',
      'Implementar ação corretiva',
      'Verificar conformidade após correção',
    ];
  } else if (lowerDesc.includes('higiene') || lowerDesc.includes('limpeza')) {
    severity = 'high';
    correctiveActions = [
      'Realizar limpeza profunda imediata',
      'Aplicar sanitizante aprovado',
      'Verificar procedimento de limpeza',
      'Registrar ação corretiva',
      'Re-treinar equipe se necessário',
    ];
  } else if (lowerDesc.includes('organização') || lowerDesc.includes('armazenamento')) {
    severity = 'medium';
    correctiveActions = [
      'Reorganizar área conforme PEPS (Primeiro que Entra, Primeiro que Sai)',
      'Rotular todos os itens com data',
      'Descartar itens vencidos',
      'Revisar procedimento de armazenamento',
    ];
  } else {
    severity = 'low';
    correctiveActions = [
      'Corrigir não-conformidade',
      'Documentar ação tomada',
      'Revisar procedimento',
    ];
  }

  // Set deadline based on severity
  const now = new Date();
  let deadline: Date;

  switch (severity) {
    case 'critical':
      deadline = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
      break;
    case 'high':
      deadline = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours
      break;
    case 'medium':
      deadline = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
      break;
    default:
      deadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
  }

  return {
    item,
    description,
    severity,
    correctiveActions,
    deadline: deadline.toISOString(),
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const MCPHACCP = {
  validateTemperature,
  checklistStatus,
  generateHaccpReport,
  flagNonCompliance,
};

export default MCPHACCP;
