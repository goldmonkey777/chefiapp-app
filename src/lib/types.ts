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

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'createdAt'>;
        Update: Partial<Omit<User, 'id' | 'createdAt'>>;
      };
      companies: {
        Row: Company;
        Insert: Omit<Company, 'id' | 'createdAt' | 'totalEmployees' | 'activeEmployees'>;
        Update: Partial<Omit<Company, 'id' | 'createdAt'>>;
      };
      tasks: {
        Row: Task;
        Insert: Omit<Task, 'id' | 'createdAt'>;
        Update: Partial<Omit<Task, 'id' | 'createdAt'>>;
      };
      check_ins: {
        Row: CheckIn;
        Insert: Omit<CheckIn, 'id' | 'createdAt'>;
        Update: Partial<Omit<CheckIn, 'id' | 'createdAt'>>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'createdAt'>;
        Update: Partial<Omit<Notification, 'id' | 'createdAt'>>;
      };
      activities: {
        Row: Activity;
        Insert: Omit<Activity, 'id' | 'createdAt'>;
        Update: Partial<Omit<Activity, 'id' | 'createdAt'>>;
      };
      achievements: {
        Row: Achievement;
        Insert: Omit<Achievement, 'createdAt'>;
        Update: Partial<Omit<Achievement, 'id' | 'createdAt'>>;
      };
      user_achievements: {
        Row: UserAchievement;
        Insert: Omit<UserAchievement, 'id' | 'unlockedAt'>;
        Update: Partial<Omit<UserAchievement, 'id'>>;
      };
    };
  };
}
