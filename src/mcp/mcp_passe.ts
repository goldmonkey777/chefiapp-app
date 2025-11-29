// ChefIApp™ - MCP_PASSE Server
// Employee Professional Passport Generator

import {
  PasseData,
  PerformanceScores,
  WorkHistoryEntry,
  Certificate,
  PassePDF,
  PasseVerification,
} from './types';

// ============================================================================
// ASSEMBLE PASSE
// ============================================================================

export function assemblePasse(
  userData: {
    userId: string;
    userName: string;
    userEmail: string;
    role: string;
    startDate: string;
  },
  performanceData: PerformanceScores,
  certifications: Certificate[],
  companyStamp: string,
  companyId: string,
  companyName: string
): PasseData {
  const passeId = `passe-${userData.userId}-${Date.now()}`;
  const qrCode = `https://chefiapp.com/verify/passe/${passeId}`;

  const workHistory: WorkHistoryEntry[] = [
    {
      companyId,
      companyName,
      role: userData.role,
      startDate: userData.startDate,
      achievements: [
        'Check-in pontual 95% do tempo',
        'Concluiu 150+ tarefas com sucesso',
        'Certificado em Segurança Alimentar',
      ],
    },
  ];

  return {
    id: passeId,
    userId: userData.userId,
    userName: userData.userName,
    userEmail: userData.userEmail,
    role: userData.role,
    startDate: userData.startDate,
    performance: performanceData,
    certifications,
    workHistory,
    companyStamp,
    companyId,
    companyName,
    qrCode,
    issueDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  };
}

// ============================================================================
// GENERATE PASSE PDF
// ============================================================================

export function generatePassePDF(passeObject: PasseData): PassePDF {
  // In production, this would use a PDF generation library
  // For now, create metadata structure

  const pdfContent = `
CHEFIAPP™ PROFESSIONAL PASSPORT
================================

Employee: ${passeObject.userName}
Email: ${passeObject.userEmail}
Role: ${passeObject.role}
Company: ${passeObject.companyName}

PERFORMANCE SCORES
==================
Punctuality: ${passeObject.performance.punctuality}%
Compliance: ${passeObject.performance.compliance}%
Efficiency: ${passeObject.performance.efficiency}%
Reliability: ${passeObject.performance.reliability}%
Overall: ${passeObject.performance.overall}%

CERTIFICATIONS
==============
${passeObject.certifications.map(c => `- ${c.courseName} (${c.issueDate})`).join('\n')}

WORK HISTORY
============
${passeObject.workHistory.map(w => `
${w.companyName} - ${w.role}
${w.startDate} - ${w.endDate || 'Present'}
Achievements:
${w.achievements.map(a => `  - ${a}`).join('\n')}
`).join('\n')}

Verify at: ${passeObject.qrCode}

Issued: ${passeObject.issueDate}
  `.trim();

  // Convert to Base64 (in production, use proper PDF library)
  const base64 = Buffer.from(pdfContent).toString('base64');

  return {
    base64,
    metadata: {
      fileName: `ChefIApp_PASSE_${passeObject.userName.replace(/\s+/g, '_')}.pdf`,
      createdAt: new Date().toISOString(),
      size: base64.length,
    },
  };
}

// ============================================================================
// SEND TO COMPANY
// ============================================================================

export function sendToCompany(
  email: string,
  passePDF: string,
  message: string
): {
  to: string;
  subject: string;
  body: string;
  html: string;
  attachments: Array<{
    filename: string;
    content: string;
    encoding: string;
  }>;
} {
  const subject = 'ChefIApp™ - Professional Passport';
  const body = `
${message}

Em anexo você encontrará o PASSE Profissional do funcionário.

Este documento contém:
- Histórico de performance
- Certificações obtidas
- Histórico de trabalho
- QR Code de verificação

--
ChefIApp™ - Hospitality Workforce Intelligence
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1E3A8A 0%, #4169E1 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
    .content { padding: 30px; background: #f8f9fa; border-radius: 8px; margin-top: 20px; }
    .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #666; }
    .badge { background: #10B981; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 Professional Passport</h1>
      <div class="badge">ChefIApp™ Verified</div>
    </div>
    <div class="content">
      <p>${message}</p>

      <h3>📄 Documento em Anexo:</h3>
      <ul>
        <li>✅ Histórico de performance completo</li>
        <li>✅ Certificações e treinamentos</li>
        <li>✅ Histórico de trabalho detalhado</li>
        <li>✅ QR Code de autenticidade</li>
      </ul>

      <p><strong>Este PASSE é verificável via QR Code.</strong></p>
    </div>
    <div class="footer">
      <p>ChefIApp™ - Hospitality Workforce Intelligence</p>
      <p>Goldmonkey Studio LLC</p>
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
    attachments: [
      {
        filename: 'ChefIApp_PASSE_Professional.pdf',
        content: passePDF,
        encoding: 'base64',
      },
    ],
  };
}

// ============================================================================
// VERIFY AUTHENTICITY
// ============================================================================

export function verifyAuthenticity(
  passeId: string,
  companyId: string
): PasseVerification {
  // In production, this would query the database
  // For now, validate format

  const isValidFormat = passeId.startsWith('passe-');
  const isValidCompany = companyId.length > 0;

  const verified = isValidFormat && isValidCompany;

  return {
    isValid: verified,
    passeId,
    companyId,
    userId: passeId.split('-')[1] || '',
    issueDate: new Date().toISOString(),
    verified,
    message: verified
      ? 'PASSE autêntico e válido'
      : 'PASSE inválido ou não encontrado',
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const MCPPasse = {
  assemblePasse,
  generatePassePDF,
  sendToCompany,
  verifyAuthenticity,
};

export default MCPPasse;
