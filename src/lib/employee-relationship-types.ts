// ChefIApp™ - Employee ↔ Company Relationship Types
// Three-layer architecture: User → EmployeeProfile → PASSE

import { UserRole, Sector } from './types';

// ============================================================================
// LAYER 1: USER (The Real Person)
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  profile_photo?: string;
  language: 'pt' | 'en' | 'es' | 'fr' | 'de' | 'it';

  // Global career metrics (across all companies)
  global_xp: number;
  global_level: number;
  global_rank: number;

  // Multi-company support
  multi_company_enabled: boolean;
  is_owner: boolean;
  is_manager: boolean;

  created_at: string;
  updated_at: string;
}

// ============================================================================
// LAYER 2: EMPLOYEE PROFILE (The Relationship)
// ============================================================================

export interface EmployeeProfile {
  id: string;
  user_id: string;
  company_id: string;

  // Role in this company
  role: UserRole;
  job_role: string; // kitchen, service, cleaning, etc
  sector: Sector;

  // Company-specific gamification
  xp: number;
  level: number;
  streak: number;
  last_check_in: string | null;
  last_check_out: string | null;

  // Performance metrics (company-specific)
  punctuality_score: number;
  compliance_score: number;
  efficiency_score: number;
  reliability_score: number;

  // Employment status
  employment_status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  hired_at: string;
  terminated_at?: string;

  // Onboarding
  onboarding_completed: boolean;
  joined_via: 'qr_code' | 'invite_link' | 'manager_added';
  onboarded_by?: string; // user_id of manager who added

  created_at: string;
  updated_at: string;
}

// ============================================================================
// LAYER 3: PASSE (Lifetime Career Passport)
// ============================================================================

export interface Passe {
  id: string;
  user_id: string;

  // Global career metrics
  total_xp_earned: number;
  weighted_xp: number; // Prevents job-hopping advantage
  global_level: number;
  global_rank: number;

  // Work history
  companies_worked: CompanyHistoryEntry[];

  // Certificates
  certificates: PasseCertificate[];

  // Achievements (global)
  global_achievements: PasseAchievement[];

  // Skills
  skills: PasseSkill[];

  // Performance summary
  performance_summary: PassePerformanceSummary;

  // Verification
  passe_qr_code: string;
  passe_signature: string;
  verification_url: string;
  last_exported_at?: string;

  created_at: string;
  updated_at: string;
}

export interface CompanyHistoryEntry {
  company_id: string;
  company_name: string;
  country_code: string;
  role: UserRole;
  job_role: string;
  sector: Sector;
  start_date: string;
  end_date?: string; // null if still working
  xp_earned: number;
  level_reached: number;
  performance_summary: {
    punctuality: number;
    compliance: number;
    efficiency: number;
    reliability: number;
  };
  achievements_earned: number;
  certificates_obtained: number;
}

export interface PasseCertificate {
  id: string;
  type: 'haccp' | 'prl' | 'allergen' | 'legionella' | 'custom';
  name: string;
  issued_by: string;
  issue_date: string;
  expiry_date?: string;
  verification_code: string;
  verified: boolean;
}

export interface PasseAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
  company_id?: string; // null if global achievement
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface PasseSkill {
  name: string;
  proficiency: number; // 1-5
  verified: boolean;
  verified_by?: string;
  hours_practiced: number;
  acquired_at: string;
}

export interface PassePerformanceSummary {
  total_tasks_completed: number;
  total_check_ins: number;
  total_work_hours: number;
  average_punctuality: number;
  average_compliance: number;
  average_efficiency: number;
  average_reliability: number;
  perfect_days: number;
  longest_streak: number;
}

// ============================================================================
// ONBOARDING
// ============================================================================

export interface OnboardingRequest {
  user_id: string;
  company_id: string;
  method: 'qr_code' | 'invite_link' | 'manager_added';

  // QR code specific
  qr_data?: string;
  gps_coordinates?: { latitude: number; longitude: number };

  // Invite link specific
  invite_token?: string;

  // Manager added specific
  assigned_role?: UserRole;
  assigned_sector?: Sector;
  assigned_by?: string;

  // Common
  device_info?: DeviceInfo;
}

export interface OnboardingResponse {
  success: boolean;
  employee_profile?: EmployeeProfile;
  passe?: Passe;
  company_context?: CompanyContext;
  error?: string;
}

export interface CompanyContext {
  company_id: string;
  company_name: string;
  country_code: string;

  // Auto-loaded settings
  language: string;
  timezone: string;
  currency: string;

  // Legal compliance modules
  legal_modules: LegalModule[];

  // Default tasks
  default_tasks: DefaultTask[];

  // Company settings
  check_in_radius_meters: number;
  allow_remote_check_in: boolean;
  require_photo_proof: boolean;
}

export interface LegalModule {
  code: string; // 'haccp', 'prl', 'allergen', etc
  name: string;
  description: string;
  required: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'annual';
  auto_generated_tasks: string[];
}

export interface DefaultTask {
  title: string;
  description: string;
  sector: Sector;
  frequency: 'daily' | 'weekly' | 'monthly';
  estimated_duration: number;
  xp_reward: number;
  priority: 'low' | 'medium' | 'high';
}

// ============================================================================
// FRAUD DETECTION
// ============================================================================

export interface TaskMetadata {
  id: string;
  task_id: string;
  user_id: string;
  company_id: string;

  // Timing analysis
  expected_duration_minutes: number;
  actual_duration_minutes: number;
  completion_speed_ratio: number; // actual/expected
  completed_at_unusual_time: boolean;
  completion_timestamp: string;

  // Location verification
  gps_coordinates?: { latitude: number; longitude: number };
  distance_from_company_meters: number;
  gps_accuracy_meters: number;
  gps_spoofing_detected: boolean;
  location_verified: boolean;

  // Photo proof analysis
  photo_url?: string;
  photo_exif_data?: Record<string, any>;
  photo_timestamp?: string;
  photo_similarity_score: number; // 0-1 (compared to previous photos)
  photo_reused: boolean;
  photo_from_screen: boolean;

  // Device info
  device_info: DeviceInfo;

  // Fraud analysis
  is_outlier: boolean;
  deviation_score: number; // 0-1
  fraud_flags: FraudFlag[];

  created_at: string;
}

export interface CheckInMetadata {
  id: string;
  check_in_id: string;
  user_id: string;
  company_id: string;

  // Location verification
  gps_coordinates: { latitude: number; longitude: number };
  gps_accuracy_meters: number;
  distance_from_company_meters: number;
  gps_speed_kmh: number;
  location_verified: boolean;

  // Network verification
  ip_address: string;
  wifi_network?: string;
  network_matches_company: boolean;

  // Timing
  check_in_timestamp: string;
  previous_check_in_timestamp?: string;
  time_since_last_check_in_minutes?: number;
  too_frequent: boolean;

  // Device info
  device_info: DeviceInfo;

  // Fraud analysis
  is_outlier: boolean;
  deviation_score: number;
  fraud_flags: FraudFlag[];

  created_at: string;
}

export interface UserRiskScore {
  id: string;
  user_id: string;
  company_id: string;

  // Risk scores (0-100)
  overall_risk_score: number;
  location_risk_score: number;
  timing_risk_score: number;
  photo_risk_score: number;
  behavioral_risk_score: number;

  // Trust level
  trust_level: 'trusted' | 'monitor' | 'suspicious' | 'review_required';

  // Flags
  total_fraud_flags: number;
  recent_flags: FraudFlag[];
  requires_manual_review: boolean;

  // History
  risk_history: RiskHistoryEntry[];

  last_calculated_at: string;
  created_at: string;
  updated_at: string;
}

export interface DeviceInfo {
  device_id: string;
  device_model: string;
  os: string;
  os_version: string;
  app_version: string;
  browser?: string;
  user_agent?: string;
}

export interface FraudFlag {
  code?: string;
  type: 'speed' | 'location' | 'timing' | 'photo' | 'device' | 'behavioral';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detected_at: string;
  auto_detected: boolean;
}

export interface RiskHistoryEntry {
  date: string;
  overall_score: number;
  flags_count: number;
  notes?: string;
}

// ============================================================================
// MULTI-COMPANY (EMPIRE VIEW)
// ============================================================================

export interface EmpireView {
  owner_id: string;
  companies: CompanySummary[];
  total_companies: number;
  total_employees: number;
  total_xp_generated: number;
  global_performance_score: number;
  alerts: EmpireAlert[];
}

export interface CompanySummary {
  company_id: string;
  company_name: string;
  country_code: string;
  total_employees: number;
  active_employees: number;
  total_xp: number;
  average_performance: number;
  compliance_rate: number;
  critical_alerts: number;
}

export interface EmpireAlert {
  company_id: string;
  company_name: string;
  type: 'fraud' | 'compliance' | 'performance' | 'urgent';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  requires_action: boolean;
}

// ============================================================================
// QR CODE
// ============================================================================

export interface CompanyQRCodeData {
  company_id: string;
  company_name: string;
  country_code: string;
  gps_coordinates: { latitude: number; longitude: number };
  check_in_radius_meters: number;
  signature: string; // HMAC-SHA256
  issued_at: string;
  expires_at?: string;
}

export interface InviteLink {
  company_id: string;
  token: string; // JWT
  expires_at: string;
  max_uses?: number;
  current_uses: number;
  assigned_role?: UserRole;
  assigned_sector?: Sector;
  created_by: string;
  created_at: string;
}
