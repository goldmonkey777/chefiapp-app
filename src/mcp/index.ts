// ChefIApp™ - MCP Servers Index
// Central export for all 8 MCP servers

// ============================================================================
// MCP_OPS - Operational Intelligence
// ============================================================================
export {
  MCPOps,
  generateShiftCalendar,
  validateCheckIn,
  getOperationalAgenda,
  notifyShiftEvents,
} from './mcp_ops';

// ============================================================================
// MCP_TRAINER - ChefIApp Academy
// ============================================================================
export {
  MCPTrainer,
  generateCourse,
  gradeExam,
  generateCertificate,
  updateCourseWithTrends,
} from './mcp_trainer';

// ============================================================================
// MCP_PASSE - Professional Passport
// ============================================================================
export {
  MCPPasse,
  assemblePasse,
  generatePassePDF,
  sendToCompany,
  verifyAuthenticity,
} from './mcp_passe';

// ============================================================================
// MCP_ALERTS - Incident Detection & Alerts
// ============================================================================
export {
  MCPAlerts,
  detectIncident,
  sendSlackAlert,
  sendEmailAlert,
  logIncident,
} from './mcp_alerts';

// ============================================================================
// MCP_HACCP - Food Safety & Compliance
// ============================================================================
export {
  MCPHACCP,
  validateTemperature,
  checklistStatus,
  generateHaccpReport,
  flagNonCompliance,
} from './mcp_haccp';

// ============================================================================
// MCP_SCORES - Performance KPIs & Ranking
// ============================================================================
export {
  MCPScores,
  calculateKPIs,
  generateRanking,
  weeklyEvolution,
  smartRecommendations,
} from './mcp_scores';

// ============================================================================
// MCP_LANGUAGE - Translation & Localization
// ============================================================================
export {
  MCPLanguage,
  translateText,
  detectLanguage,
  internationalizeUI,
  autoGlossary,
} from './mcp_language';

// ============================================================================
// MCP_AUTOMATOR - Automation Engine
// ============================================================================
export {
  MCPAutomator,
  dailyReport,
  syncData,
  runNightlyMaintenance,
  scheduleTask,
  createAutomationSuite,
  CRON_PATTERNS,
  AUTOMATION_JOBS,
} from './mcp_automator';

// ============================================================================
// TYPES - All TypeScript Definitions
// ============================================================================
export * from './types';

// ============================================================================
// MCP CLIENT CONFIGURATION
// ============================================================================
export const MCP_CONFIG = {
  servers: {
    ops: {
      name: 'mcp_ops',
      description: 'Operational intelligence for shifts, check-ins and agenda',
      category: 'operations',
      baseUrl: '/api/mcp/ops',
      enabled: true,
    },
    trainer: {
      name: 'mcp_trainer',
      description: 'ChefIApp Academy engine for courses, exams and certificates',
      category: 'education',
      baseUrl: '/api/mcp/trainer',
      enabled: true,
    },
    passe: {
      name: 'mcp_passe',
      description: 'Employee professional passport generator',
      category: 'identity',
      baseUrl: '/api/mcp/passe',
      enabled: true,
    },
    alerts: {
      name: 'mcp_alerts',
      description: 'Incident detection and alert dispatching',
      category: 'monitoring',
      baseUrl: '/api/mcp/alerts',
      enabled: true,
    },
    haccp: {
      name: 'mcp_haccp',
      description: 'Food safety & legal compliance',
      category: 'compliance',
      baseUrl: '/api/mcp/haccp',
      enabled: true,
    },
    scores: {
      name: 'mcp_scores',
      description: 'Performance KPIs and ranking intelligence',
      category: 'analytics',
      baseUrl: '/api/mcp/scores',
      enabled: true,
    },
    language: {
      name: 'mcp_language',
      description: 'Automatic translations and terminology standardization',
      category: 'localization',
      baseUrl: '/api/mcp/language',
      enabled: true,
    },
    automator: {
      name: 'mcp_automator',
      description: 'Cron-like automation engine',
      category: 'automation',
      baseUrl: '/api/mcp/automator',
      enabled: true,
    },
  },
  defaultTimeout: 30000,
  retryAttempts: 3,
};

// ============================================================================
// UNIFIED MCP CLIENT
// ============================================================================

/**
 * ChefIApp™ MCP Client
 *
 * Unified interface to all 8 MCP servers
 *
 * @example
 * ```typescript
 * import { MCP } from './src/mcp';
 *
 * // Generate shift calendar
 * const shifts = MCP.ops.generateShiftCalendar("08:00", "22:00", 2, "America/Sao_Paulo");
 *
 * // Create course
 * const course = MCP.trainer.generateCourse("Food Safety", "HACCP training");
 *
 * // Calculate KPIs
 * const kpis = MCP.scores.calculateKPIs(50, 60, 15, 95);
 *
 * // Translate text
 * const translation = MCP.language.translateText("Hello", "en", "pt");
 * ```
 */
export const MCP = {
  ops: {
    generateShiftCalendar,
    validateCheckIn,
    getOperationalAgenda,
    notifyShiftEvents,
  },
  trainer: {
    generateCourse,
    gradeExam,
    generateCertificate,
    updateCourseWithTrends,
  },
  passe: {
    assemblePasse,
    generatePassePDF,
    sendToCompany,
    verifyAuthenticity,
  },
  alerts: {
    detectIncident,
    sendSlackAlert,
    sendEmailAlert,
    logIncident,
  },
  haccp: {
    validateTemperature,
    checklistStatus,
    generateHaccpReport,
    flagNonCompliance,
  },
  scores: {
    calculateKPIs,
    generateRanking,
    weeklyEvolution,
    smartRecommendations,
  },
  language: {
    translateText,
    detectLanguage,
    internationalizeUI,
    autoGlossary,
  },
  automator: {
    dailyReport,
    syncData,
    runNightlyMaintenance,
    scheduleTask,
    createAutomationSuite,
    CRON_PATTERNS,
    AUTOMATION_JOBS,
  },
};

// ============================================================================
// VERSION INFO
// ============================================================================

export const MCP_VERSION = '1.0.0';
export const MCP_BUILD_DATE = '2025-11-28';

export default MCP;
