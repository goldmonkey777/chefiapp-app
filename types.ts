export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
  OWNER = 'OWNER'
}

export enum TaskPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  avatar: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
  status: 'active' | 'offline' | 'break';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  xpReward: number;
  dueTime?: string;
  dueDate?: Date;
  assignedBy?: string;
  assignedTo?: string;
  estimatedTime?: string;
  startedAt?: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpBonus: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}