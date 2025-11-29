// ChefIApp™ - MCP Server Types
// Types for all 8 Model Context Protocol Servers

// ============================================================================
// MCP_OPS - Operational Intelligence
// ============================================================================

export interface ShiftCalendar {
  date: string;
  shifts: Shift[];
  timezone: string;
  totalHours: number;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  type: 'opening' | 'service' | 'closing' | 'cleaning';
  duration: number;
}

export interface CheckInValidation {
  authorized: boolean;
  reason: string;
  releasedTasks: string[];
  location: {
    isValid: boolean;
    distance: number;
  };
  qrCode: {
    isValid: boolean;
    companyId: string;
  };
  shift: {
    isExpected: boolean;
    shiftId: string;
  };
}

export interface OperationalAgenda {
  userId: string;
  date: string;
  shift: Shift;
  tasks: OperationalTask[];
  totalTaskCount: number;
}

export interface OperationalTask {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  priority: 'low' | 'medium' | 'high';
  sector: string;
}

export interface NotificationPayload {
  slack: {
    channel: string;
    text: string;
    blocks: any[];
  };
  email: {
    to: string;
    subject: string;
    body: string;
    html: string;
  };
}

// ============================================================================
// MCP_TRAINER - ChefIApp Academy
// ============================================================================

export interface Course {
  id: string;
  title: string;
  description: string;
  industry: 'hospitality' | 'restaurant' | 'hotel' | 'catering' | 'general';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  modules: CourseModule[];
  estimatedHours: number;
  createdAt: string;
}

export interface CourseModule {
  id: string;
  title: string;
  content: string;
  quiz: Quiz;
  order: number;
}

export interface Quiz {
  questions: QuizQuestion[];
  passingScore: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ExamResult {
  userId: string;
  courseId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  feedback: string;
  certificateId?: string;
  completedAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseName: string;
  issueDate: string;
  expiryDate?: string;
  qrCode: string;
}

export interface IndustryTrend {
  topic: string;
  description: string;
  relevance: number;
  sources: string[];
  updatedAt: string;
}

// ============================================================================
// MCP_PASSE - Professional Passport
// ============================================================================

export interface PasseData {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  startDate: string;
  performance: PerformanceScores;
  certifications: Certificate[];
  workHistory: WorkHistoryEntry[];
  companyStamp: string;
  companyId: string;
  companyName: string;
  qrCode: string;
  issueDate: string;
  lastUpdated: string;
}

export interface PerformanceScores {
  punctuality: number;
  compliance: number;
  efficiency: number;
  reliability: number;
  overall: number;
}

export interface WorkHistoryEntry {
  companyId: string;
  companyName: string;
  role: string;
  startDate: string;
  endDate?: string;
  achievements: string[];
}

export interface PassePDF {
  base64: string;
  metadata: {
    fileName: string;
    createdAt: string;
    size: number;
  };
}

export interface PasseVerification {
  isValid: boolean;
  passeId: string;
  companyId: string;
  userId: string;
  issueDate: string;
  verified: boolean;
  message: string;
}

// ============================================================================
// MCP_ALERTS - Incident Detection & Alerts
// ============================================================================

export interface Incident {
  id: string;
  type: 'delay' | 'task_failure' | 'temperature' | 'urgent' | 'safety' | 'equipment';
  userId: string;
  companyId: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  correctiveAction: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
}

export interface SlackPayload {
  channel: string;
  text: string;
  blocks: SlackBlock[];
  attachments?: any[];
}

export interface SlackBlock {
  type: string;
  text?: {
    type: string;
    text: string;
  };
  fields?: any[];
}

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  html: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: string;
  encoding: string;
}

// ============================================================================
// MCP_HACCP - Food Safety & Compliance
// ============================================================================

export interface TemperatureValidation {
  detectedValue: number;
  expectedRange: {
    min: number;
    max: number;
  };
  isCompliant: boolean;
  location: string;
  imageUrl: string;
  timestamp: string;
  confidence: number;
}

export interface HACCPCompliance {
  date: string;
  companyId: string;
  checklist: HACCPChecklistItem[];
  overallRate: number;
  criticalPoints: number;
  criticalPointsMet: number;
}

export interface HACCPChecklistItem {
  id: string;
  description: string;
  category: 'temperature' | 'cleaning' | 'storage' | 'preparation' | 'service';
  status: 'compliant' | 'non_compliant' | 'pending';
  evidence?: string;
  timestamp: string;
}

export interface HACCPReport {
  companyId: string;
  companyName: string;
  dateRange: {
    start: string;
    end: string;
  };
  complianceRate: number;
  incidents: Incident[];
  recommendations: string[];
  generatedAt: string;
}

export interface NonComplianceFlag {
  item: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  correctiveActions: string[];
  deadline: string;
  responsible?: string;
}

// ============================================================================
// MCP_SCORES - Performance KPIs & Ranking
// ============================================================================

export interface PerformanceKPIs {
  punctuality: number;
  compliance: number;
  efficiency: number;
  reliability: number;
  overall: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface Ranking {
  companyId: string;
  employees: RankedEmployee[];
  top3: RankedEmployee[];
  generatedAt: string;
}

export interface RankedEmployee {
  userId: string;
  userName: string;
  rank: number;
  score: number;
  kpis: PerformanceKPIs;
  badge?: 'gold' | 'silver' | 'bronze';
}

export interface WeeklyEvolution {
  userId: string;
  weeks: WeeklyData[];
  trend: 'improving' | 'stable' | 'declining';
  improvementRate: number;
  graphData: number[];
}

export interface WeeklyData {
  weekNumber: number;
  startDate: string;
  endDate: string;
  score: number;
  tasksCompleted: number;
}

export interface SmartRecommendation {
  category: 'punctuality' | 'efficiency' | 'compliance' | 'reliability';
  priority: 'low' | 'medium' | 'high';
  action: string;
  expectedImpact: string;
  estimatedTime: string;
}

// ============================================================================
// MCP_LANGUAGE - Translation & Localization
// ============================================================================

export type SupportedLanguage = 'pt' | 'en' | 'es' | 'fr' | 'de' | 'it';

export interface TranslationResult {
  original: string;
  translated: string;
  fromLang: SupportedLanguage;
  toLang: SupportedLanguage;
  confidence: number;
}

export interface LanguageDetection {
  text: string;
  detectedLanguage: SupportedLanguage;
  confidence: number;
  alternatives: Array<{
    language: SupportedLanguage;
    confidence: number;
  }>;
}

export interface InternationalizedUI {
  pt: Record<string, string>;
  en: Record<string, string>;
  es: Record<string, string>;
  fr?: Record<string, string>;
  de?: Record<string, string>;
  it?: Record<string, string>;
}

export interface GlossaryTerm {
  term: string;
  translations: Record<SupportedLanguage, string>;
  context: string;
  category: string;
}

// ============================================================================
// MCP_AUTOMATOR - Automation Engine
// ============================================================================

export interface DailyReport {
  companyId: string;
  companyName: string;
  date: string;
  performance: {
    tasksCompleted: number;
    tasksTotal: number;
    averageEfficiency: number;
    employeesActive: number;
  };
  haccp: {
    complianceRate: number;
    incidents: number;
  };
  incidents: Incident[];
  generatedAt: string;
}

export interface SyncResult {
  target: 'sheets' | 'notion' | 'docs' | 'drive';
  success: boolean;
  recordsSynced: number;
  syncedAt: string;
  errors?: string[];
}

export interface MaintenanceResult {
  success: boolean;
  duration: number;
  operations: {
    cacheCleaning: boolean;
    rankingUpdate: boolean;
    trainingPreGeneration: boolean;
  };
  executedAt: string;
}

export interface ScheduledTask {
  id: string;
  name: string;
  cronPattern: string;
  task: string;
  nextRun: string;
  lastRun?: string;
  enabled: boolean;
}

// ============================================================================
// MCP Client Configuration
// ============================================================================

export interface MCPServerConfig {
  name: string;
  description: string;
  category: string;
  baseUrl: string;
  apiKey?: string;
  enabled: boolean;
}

export interface MCPClientConfig {
  servers: Record<string, MCPServerConfig>;
  defaultTimeout: number;
  retryAttempts: number;
}
