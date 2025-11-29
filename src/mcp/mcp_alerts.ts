// ChefIApp™ - MCP_ALERTS Server
// Incident Detection and Alert Dispatching

import { Incident, SlackPayload, SlackBlock, EmailPayload } from './types';

// ============================================================================
// DETECT INCIDENT
// ============================================================================

export function detectIncident(
  type: 'delay' | 'task_failure' | 'temperature' | 'urgent' | 'safety' | 'equipment',
  userId: string,
  companyId: string,
  description: string
): Incident {
  const incidentId = `incident-${Date.now()}`;

  // Determine severity based on type
  let severity: 'low' | 'medium' | 'high' | 'critical';
  let correctiveAction: string;

  switch (type) {
    case 'safety':
      severity = 'critical';
      correctiveAction = 'Interromper operações imediatamente e acionar supervisor';
      break;
    case 'temperature':
      severity = 'high';
      correctiveAction = 'Verificar equipamento e registrar temperatura corrigida';
      break;
    case 'urgent':
      severity = 'high';
      correctiveAction = 'Priorizar resolução imediata com gerente';
      break;
    case 'task_failure':
      severity = 'medium';
      correctiveAction = 'Revisar procedimento e tentar novamente';
      break;
    case 'equipment':
      severity = 'medium';
      correctiveAction = 'Acionar manutenção e usar equipamento backup';
      break;
    case 'delay':
      severity = 'low';
      correctiveAction = 'Ajustar cronograma e informar equipe';
      break;
    default:
      severity = 'medium';
      correctiveAction = 'Avaliar situação e tomar ação apropriada';
  }

  return {
    id: incidentId,
    type,
    userId,
    companyId,
    description,
    severity,
    correctiveAction,
    status: 'open',
    createdAt: new Date().toISOString(),
  };
}

// ============================================================================
// SEND SLACK ALERT
// ============================================================================

export function sendSlackAlert(
  channel: string,
  message: string,
  incident?: Incident
): SlackPayload {
  const blocks: SlackBlock[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: incident ? `🚨 ${incident.severity.toUpperCase()} ALERT` : '🔔 Notification',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: message,
      },
    },
  ];

  if (incident) {
    blocks.push({
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Type:*\n${incident.type}`,
        },
        {
          type: 'mrkdwn',
          text: `*Severity:*\n${incident.severity}`,
        },
        {
          type: 'mrkdwn',
          text: `*Status:*\n${incident.status}`,
        },
        {
          type: 'mrkdwn',
          text: `*Company:*\n${incident.companyId}`,
        },
      ],
    });

    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Corrective Action:*\n${incident.correctiveAction}`,
      },
    });
  }

  return {
    channel,
    text: message,
    blocks,
  };
}

// ============================================================================
// SEND EMAIL ALERT
// ============================================================================

export function sendEmailAlert(
  email: string,
  subject: string,
  body: string,
  incident?: Incident
): EmailPayload {
  let html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .alert-critical { background: #DC2626; color: white; }
    .alert-high { background: #F59E0B; color: white; }
    .alert-medium { background: #3B82F6; color: white; }
    .alert-low { background: #6B7280; color: white; }
    .header { padding: 30px; border-radius: 8px; text-align: center; }
    .content { padding: 30px; background: #f8f9fa; border-radius: 8px; margin-top: 20px; }
    .incident-details { background: white; padding: 20px; border-radius: 8px; margin-top: 15px; }
    .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #666; }
    .action-box { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header ${incident ? `alert-${incident.severity}` : 'alert-medium'}">
      <h1>🚨 ${subject}</h1>
    </div>
    <div class="content">
      <p>${body}</p>
  `;

  if (incident) {
    html += `
      <div class="incident-details">
        <h3>Incident Details:</h3>
        <p><strong>ID:</strong> ${incident.id}</p>
        <p><strong>Type:</strong> ${incident.type}</p>
        <p><strong>Severity:</strong> ${incident.severity.toUpperCase()}</p>
        <p><strong>Status:</strong> ${incident.status}</p>
        <p><strong>Description:</strong> ${incident.description}</p>
        <p><strong>Created:</strong> ${incident.createdAt}</p>
      </div>

      <div class="action-box">
        <h4>⚡ Corrective Action Required:</h4>
        <p>${incident.correctiveAction}</p>
      </div>
    `;
  }

  html += `
    </div>
    <div class="footer">
      <p>ChefIApp™ - Hospitality Workforce Intelligence</p>
      <p>This is an automated alert. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return {
    to: email,
    subject,
    body,
    html,
  };
}

// ============================================================================
// LOG INCIDENT
// ============================================================================

export function logIncident(incidentObject: Incident): {
  success: boolean;
  incidentId: string;
  message: string;
  timestamp: string;
} {
  // In production, this would save to database
  // For now, return confirmation

  return {
    success: true,
    incidentId: incidentObject.id,
    message: `Incident ${incidentObject.id} logged successfully`,
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const MCPAlerts = {
  detectIncident,
  sendSlackAlert,
  sendEmailAlert,
  logIncident,
};

export default MCPAlerts;
