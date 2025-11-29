// ChefIApp™ - MCP_OPS Server
// Operational Intelligence for shifts, check-ins and agenda

import {
  ShiftCalendar,
  Shift,
  CheckInValidation,
  OperationalAgenda,
  OperationalTask,
  NotificationPayload,
} from './types';

// ============================================================================
// SHIFT CALENDAR GENERATION
// ============================================================================

export function generateShiftCalendar(
  openingTime: string,
  closingTime: string,
  cleaningHours: number,
  timezone: string,
  date?: string
): ShiftCalendar {
  const targetDate = date || new Date().toISOString().split('T')[0];

  const [openHour, openMin] = openingTime.split(':').map(Number);
  const [closeHour, closeMin] = closingTime.split(':').map(Number);

  const shifts: Shift[] = [];

  // Opening shift (30 min before opening)
  const openingShiftStart = `${String(openHour - 1).padStart(2, '0')}:30`;
  const openingShiftEnd = openingTime;
  shifts.push({
    id: `opening-${targetDate}`,
    name: 'Abertura',
    startTime: openingShiftStart,
    endTime: openingShiftEnd,
    type: 'opening',
    duration: 30,
  });

  // Service shift (opening to closing)
  const serviceDuration = (closeHour * 60 + closeMin) - (openHour * 60 + openMin);
  shifts.push({
    id: `service-${targetDate}`,
    name: 'Atendimento',
    startTime: openingTime,
    endTime: closingTime,
    type: 'service',
    duration: serviceDuration,
  });

  // Closing shift (closing time + 30 min)
  const closingShiftEnd = `${String(closeHour).padStart(2, '0')}:${String(closeMin + 30).padStart(2, '0')}`;
  shifts.push({
    id: `closing-${targetDate}`,
    name: 'Fechamento',
    startTime: closingTime,
    endTime: closingShiftEnd,
    type: 'closing',
    duration: 30,
  });

  // Cleaning shift
  const cleaningStart = closingShiftEnd;
  const cleaningEndHour = closeHour + cleaningHours;
  const cleaningEnd = `${String(cleaningEndHour).padStart(2, '0')}:${String(closeMin).padStart(2, '0')}`;
  shifts.push({
    id: `cleaning-${targetDate}`,
    name: 'Limpeza Profunda',
    startTime: cleaningStart,
    endTime: cleaningEnd,
    type: 'cleaning',
    duration: cleaningHours * 60,
  });

  const totalHours = shifts.reduce((sum, shift) => sum + shift.duration, 0) / 60;

  return {
    date: targetDate,
    shifts,
    timezone,
    totalHours,
  };
}

// ============================================================================
// CHECK-IN VALIDATION
// ============================================================================

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Haversine formula
  const R = 6371000; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export function validateCheckIn(
  userId: string,
  companyId: string,
  expectedShift: string,
  geoCoords: { latitude: number; longitude: number },
  qrCodeData: string,
  companyCoords: { latitude: number; longitude: number }
): CheckInValidation {
  // Parse QR Code
  let qrParsed: any;
  try {
    qrParsed = JSON.parse(qrCodeData);
  } catch {
    return {
      authorized: false,
      reason: 'QR Code inválido',
      releasedTasks: [],
      location: { isValid: false, distance: 0 },
      qrCode: { isValid: false, companyId: '' },
      shift: { isExpected: false, shiftId: '' },
    };
  }

  // Validate QR Code company
  const qrCodeValid = qrParsed.companyId === companyId;

  // Calculate distance
  const distance = calculateDistance(
    geoCoords.latitude,
    geoCoords.longitude,
    companyCoords.latitude,
    companyCoords.longitude
  );

  const locationValid = distance <= 100; // 100 meters tolerance

  // Validate shift
  const shiftValid = qrParsed.expectedShift === expectedShift;

  const authorized = qrCodeValid && locationValid && shiftValid;

  let reason = '';
  if (!qrCodeValid) reason = 'QR Code não pertence a esta empresa';
  else if (!locationValid)
    reason = `Você está a ${Math.round(distance)}m da empresa (máximo: 100m)`;
  else if (!shiftValid) reason = 'Turno não corresponde ao esperado';
  else reason = 'Check-in autorizado';

  // Release tasks if authorized
  const releasedTasks = authorized
    ? ['task-1', 'task-2', 'task-3'] // Would fetch from database
    : [];

  return {
    authorized,
    reason,
    releasedTasks,
    location: {
      isValid: locationValid,
      distance,
    },
    qrCode: {
      isValid: qrCodeValid,
      companyId: qrParsed.companyId || '',
    },
    shift: {
      isExpected: shiftValid,
      shiftId: expectedShift,
    },
  };
}

// ============================================================================
// OPERATIONAL AGENDA
// ============================================================================

export function getOperationalAgenda(
  userId: string,
  date: string,
  companyId: string
): OperationalAgenda {
  // In production, this would fetch from database
  // For now, generate sample data

  const shift: Shift = {
    id: `service-${date}`,
    name: 'Atendimento',
    startTime: '08:00',
    endTime: '16:00',
    type: 'service',
    duration: 480,
  };

  const tasks: OperationalTask[] = [
    {
      id: 'task-1',
      title: 'Preparar estação de trabalho',
      description: 'Organizar equipamentos e verificar temperatura',
      estimatedTime: 15,
      priority: 'high',
      sector: 'Cozinha',
    },
    {
      id: 'task-2',
      title: 'Verificar estoque',
      description: 'Contar ingredientes e registrar faltantes',
      estimatedTime: 20,
      priority: 'medium',
      sector: 'Estoque',
    },
    {
      id: 'task-3',
      title: 'Limpar área de prep',
      description: 'Sanitizar bancadas e utensílios',
      estimatedTime: 10,
      priority: 'high',
      sector: 'Cozinha',
    },
    {
      id: 'task-4',
      title: 'Organizar mise en place',
      description: 'Preparar ingredientes pré-processados',
      estimatedTime: 30,
      priority: 'medium',
      sector: 'Cozinha',
    },
  ];

  return {
    userId,
    date,
    shift,
    tasks,
    totalTaskCount: tasks.length,
  };
}

// ============================================================================
// NOTIFICATION PAYLOADS
// ============================================================================

export function notifyShiftEvents(
  eventType: 'check_in' | 'check_out' | 'late' | 'early' | 'task_complete' | 'incident',
  userId: string,
  companyId: string,
  message: string
): NotificationPayload {
  const timestamp = new Date().toISOString();

  // Slack payload
  const slackPayload = {
    channel: '#operations',
    text: message,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `🔔 ${eventType.replace('_', ' ').toUpperCase()}`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: message,
        },
        fields: [
          {
            type: 'mrkdwn',
            text: `*User:*\n${userId}`,
          },
          {
            type: 'mrkdwn',
            text: `*Company:*\n${companyId}`,
          },
          {
            type: 'mrkdwn',
            text: `*Time:*\n${timestamp}`,
          },
        ],
      },
    ],
  };

  // Email payload
  const emailSubject = `ChefIApp™ - ${eventType.replace('_', ' ')}`;
  const emailBody = `
${message}

Details:
- User ID: ${userId}
- Company ID: ${companyId}
- Timestamp: ${timestamp}

--
ChefIApp™ - Hospitality Workforce Intelligence
  `.trim();

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1E3A8A 0%, #4169E1 100%); color: white; padding: 20px; border-radius: 8px; }
    .content { padding: 20px; background: #f8f9fa; border-radius: 8px; margin-top: 20px; }
    .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🔔 ${eventType.replace('_', ' ').toUpperCase()}</h2>
    </div>
    <div class="content">
      <p>${message}</p>
      <hr>
      <p><strong>User ID:</strong> ${userId}</p>
      <p><strong>Company ID:</strong> ${companyId}</p>
      <p><strong>Timestamp:</strong> ${timestamp}</p>
    </div>
    <div class="footer">
      <p>ChefIApp™ - Hospitality Workforce Intelligence</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return {
    slack: slackPayload,
    email: {
      to: 'manager@company.com', // Would be fetched from database
      subject: emailSubject,
      body: emailBody,
      html: emailHtml,
    },
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const MCPOps = {
  generateShiftCalendar,
  validateCheckIn,
  getOperationalAgenda,
  notifyShiftEvents,
};

export default MCPOps;
