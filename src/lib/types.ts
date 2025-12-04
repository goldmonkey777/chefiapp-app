// ChefIApp™ - Official TypeScript Types
// Based on MVP Blueprint v1.0

// ============================================
// ENUMS
// ============================================

export enum UserRole {
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  OWNER = 'owner'
}

export enum Sector {
  KITCHEN = 'kitchen',
  SERVICE = 'service',
  BAR = 'bar',
  RECEPTION = 'reception',
  CLEANING = 'cleaning',
  MAINTENANCE = 'maintenance'
}

export enum ShiftStatus {
  OFFLINE = 'offline',
  ACTIVE = 'active',
  BREAK = 'break'
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  DONE = 'done'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum AuthMethod {
  GOOGLE = 'google',
  APPLE = 'apple',
  MAGIC_LINK = 'magic_link',
  QR_CODE = 'qr_code'
}

export enum CompanyType {
  HOTEL = 'hotel',
  RESTAURANT = 'restaurant',
  BAR = 'bar',
  BEACH_CLUB = 'beach_club',
  OTHER = 'other'
}

export enum NotificationType {
  TASK_ASSIGNED = 'task_assigned',
  TASK_COMPLETED = 'task_completed',
  ACHIEVEMENT = 'achievement',
  SYSTEM = 'system'
}

export enum ActivityType {
  CHECK_IN = 'check_in',
  CHECK_OUT = 'check_out',
  TASK_COMPLETED = 'task_completed',
  XP_GAINED = 'xp_gained',
  LEVEL_UP = 'level_up',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked'
}

export enum ShiftType {
  OPENING = 'opening',
  SERVICE = 'service',
  CLOSING = 'closing',
  CLEANING = 'cleaning',
  CUSTOM = 'custom'
}

// ============================================
// INTERFACES
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  sector: Sector;
  xp: number;
  level: number;
  streak: number;
  shiftStatus: ShiftStatus;
  lastCheckIn: Date | null;
  lastCheckOut: Date | null;
  profilePhoto: string;
  createdAt: Date;
  authMethod: AuthMethod;
}

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  qrCode: string;
  ownerId: string;
  createdAt: Date;
  totalEmployees: number;
  activeEmployees: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  companyId: string;
  assignedTo: string;
  createdBy: string;
  status: TaskStatus;
  priority: TaskPriority;
  xpReward: number;
  startedAt: Date | null;
  completedAt: Date | null;
  photoProof: string | null;
  duration: number | null; // em segundos
  createdAt: Date;
}

export interface Shift {
  id: string;
  companyId: string;
  name: string;
  type: ShiftType;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  date: string;      // YYYY-MM-DD
  assignedTo?: string; // User ID (optional)
  sector?: Sector;
  createdAt: Date;
}

export interface CheckIn {
  id: string;
  userId: string;
  companyId: string;
  checkInTime: Date;
  checkOutTime: Date | null;
  locationLat: number | null;
  locationLng: number | null;
  duration: number | null; // em segundos
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface Activity {
  id: string;
  userId: string;
  companyId: string;
  type: ActivityType;
  description: string;
  xpChange: number;
  createdAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
  triggerType: string;
  triggerValue: number | null;
  createdAt: Date;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

// ============================================
// HELPER TYPES
// ============================================

export interface StreakState {
  streak: number;
  isOnFire: boolean;    // 3+ dias
  isBlazing: boolean;   // 7+ dias
  isLegendary: boolean; // 30+ dias
}

export interface TaskValidation {
  canStart: boolean;
  reason?: string;
}

export interface XPGainResult {
  baseXP: number;
  speedBonus: number;
  photoBonus: number;
  totalXP: number;
}

export interface LevelUpResult {
  oldLevel: number;
  newLevel: number;
  leveledUp: boolean;
}

// ============================================
// DATABASE TYPES (Supabase)
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// DB-specific interfaces (snake_case to match Supabase schema)
export interface UserDB {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company_id: string;
  sector: Sector;
  xp: number;
  level: number;
  streak: number;
  shift_status: ShiftStatus;
  last_check_in: string | null;
  last_check_out: string | null;
  profile_photo: string;
  created_at: string;
  auth_method: AuthMethod;
}

export interface CompanyDB {
  id: string;
  name: string;
  type: CompanyType;
  qr_code: string;
  owner_id: string;
  created_at: string;
  total_employees: number;
  active_employees: number;
}

export interface TaskDB {
  id: string;
  title: string;
  description: string;
  company_id: string;
  assigned_to: string;
  created_by: string;
  status: TaskStatus;
  priority: TaskPriority;
  xp_reward: number;
  started_at: string | null;
  completed_at: string | null;
  photo_proof: string | null;
  duration: number | null;
  created_at: string;
}

export interface CheckInDB {
  id: string;
  user_id: string;
  company_id: string;
  check_in_time: string;
  check_out_time: string | null;
  location_lat: number | null;
  location_lng: number | null;
  duration: number | null;
  created_at: string;
}

export interface ActivityDB {
  id: string;
  user_id: string;
  company_id: string;
  type: ActivityType;
  description: string;
  xp_change: number;
  created_at: string;
}

export interface AchievementDB {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
  trigger_type: string;
  trigger_value: number | null;
  created_at: string;
}

export interface UserAchievementDB {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface NotificationDB {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: UserDB;
        Insert: Omit<UserDB, 'id' | 'created_at'>;
        Update: Partial<Omit<UserDB, 'id' | 'created_at'>>;
      };
      companies: {
        Row: CompanyDB;
        Insert: Omit<CompanyDB, 'id' | 'created_at' | 'total_employees' | 'active_employees'>;
        Update: Partial<Omit<CompanyDB, 'id' | 'created_at'>>;
      };
      tasks: {
        Row: TaskDB;
        Insert: Omit<TaskDB, 'id' | 'created_at'>;
        Update: Partial<Omit<TaskDB, 'id' | 'created_at'>>;
      };
      check_ins: {
        Row: CheckInDB;
        Insert: Omit<CheckInDB, 'id' | 'created_at'>;
        Update: Partial<Omit<CheckInDB, 'id' | 'created_at'>>;
      };
      notifications: {
        Row: NotificationDB;
        Insert: Omit<NotificationDB, 'id' | 'created_at'>;
        Update: Partial<Omit<NotificationDB, 'id' | 'created_at'>>;
      };
      activities: {
        Row: ActivityDB;
        Insert: Omit<ActivityDB, 'id' | 'created_at'>;
        Update: Partial<Omit<ActivityDB, 'id' | 'created_at'>>;
      };
      achievements: {
        Row: AchievementDB;
        Insert: Omit<AchievementDB, 'id' | 'created_at'>;
        Update: Partial<Omit<AchievementDB, 'id' | 'created_at'>>;
      };
      user_achievements: {
        Row: UserAchievementDB;
        Insert: Omit<UserAchievementDB, 'id'> & { unlocked_at?: string };
        Update: Partial<Omit<UserAchievementDB, 'id'>>;
      };
    };
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  };
}
