// ChefIApp™ - Zustand Global Store
// Based on MVP Blueprint v1.0
// This is the central state management for the entire application

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  User,
  Company,
  Task,
  Activity,
  Notification,
  Achievement,
  UserAchievement,
  TaskStatus,
  ShiftStatus,
  TaskPriority,
  NotificationType,
  ActivityType,
  Shift,
  ShiftType
} from '../lib/types';
import { calculateLevel, differenceInDays, uuid } from '../lib/utils';

// ============================================
// STATE INTERFACE
// ============================================

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;

  // Company
  company: Company | null;

  // Users
  users: User[];

  // Tasks
  tasks: Task[];

  // Shifts
  shifts: Shift[];

  // Activities
  activities: Activity[];

  // Notifications
  notifications: Notification[];

  // Achievements
  achievements: Achievement[];
  userAchievements: UserAchievement[];

  // UI State
  isLoading: boolean;
  error: string | null;

  // ============================================
  // ACTIONS
  // ============================================

  // Auth Actions
  setCurrentUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;

  // Company Actions
  setCompany: (company: Company | null) => void;
  createCompany: (name: string, type: string, ownerId: string) => Company;
  updateCompanyStats: (companyId: string) => void;

  // User Actions
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  removeUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
  getUsersByCompany: (companyId: string) => User[];
  getActiveUsers: (companyId: string) => User[];

  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
  getTasksByUser: (userId: string) => Task[];
  getTasksByCompany: (companyId: string) => Task[];
  getPendingTasks: (userId: string) => Task[];
  getInProgressTasks: (userId: string) => Task[];

  // Shift Actions
  addShift: (shift: Omit<Shift, 'id' | 'createdAt'>) => Shift;
  updateShift: (id: string, updates: Partial<Shift>) => void;
  removeShift: (id: string) => void;
  getShiftsByCompany: (companyId: string) => Shift[];
  getShiftsByUser: (userId: string) => Shift[];
  getShiftsByDate: (companyId: string, date: string) => Shift[];

  // Task Flow Actions
  startTask: (taskId: string, userId: string) => boolean;
  completeTask: (taskId: string, userId: string, photo: string, duration: number) => boolean;
  canStartTask: (taskId: string, userId: string) => { canStart: boolean; reason?: string };

  // Check-in/Check-out Actions
  checkIn: (userId: string, location?: { lat: number; lng: number }) => void;
  checkOut: (userId: string) => void;
  isUserActive: (userId: string) => boolean;

  // XP and Level Actions
  addXP: (userId: string, amount: number, reason: string) => void;
  updateLevel: (userId: string) => void;

  // Streak Actions
  updateStreak: (userId: string) => void;
  getStreakState: (streak: number) => { isOnFire: boolean; isBlazing: boolean; isLegendary: boolean };

  // Achievement Actions
  unlockAchievement: (userId: string, achievementId: string) => void;
  checkAchievements: (userId: string) => void;
  getUserAchievements: (userId: string) => UserAchievement[];

  // Notification Actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: (userId: string) => void;
  getUnreadNotifications: (userId: string) => Notification[];

  // Activity Actions
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  getActivitiesByUser: (userId: string) => Activity[];
  getRecentActivities: (companyId: string, limit?: number) => Activity[];

  // Ranking
  getLeaderboard: (companyId: string, limit?: number) => User[];
  getUserRank: (userId: string, companyId: string) => number;

  // Utility Actions
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  company: null,
  users: [],
  tasks: [],
  shifts: [],
  activities: [],
  notifications: [],
  achievements: [],
  userAchievements: [],
  isLoading: false,
  error: null,
};

// ============================================
// STORE CREATION
// ============================================

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // ========== AUTH ACTIONS ==========

        setCurrentUser: (user) => set({ currentUser: user }),

        setAuthenticated: (value) => set({ isAuthenticated: value }),

        // ========== COMPANY ACTIONS ==========

        setCompany: (company) => set({ company }),

        createCompany: (name, type, ownerId) => {
          const newCompany: Company = {
            id: uuid(),
            name,
            type: type as any,
            qrCode: `com-chefiapp-app://join/${uuid()}`,
            ownerId,
            createdAt: new Date(),
            totalEmployees: 0,
            activeEmployees: 0,
          };

          set({ company: newCompany });
          return newCompany;
        },

        updateCompanyStats: (companyId) => {
          const { users, company } = get();
          if (company?.id !== companyId) return;

          const totalEmployees = users.filter(u => u.companyId === companyId).length;
          const activeEmployees = users.filter(
            u => u.companyId === companyId && u.shiftStatus === ShiftStatus.ACTIVE
          ).length;

          set({
            company: { ...company, totalEmployees, activeEmployees }
          });
        },

        // ========== USER ACTIONS ==========

        addUser: (user) => set((state) => ({
          users: [...state.users, user]
        })),

        updateUser: (id, updates) => set((state) => ({
          users: state.users.map(u => u.id === id ? { ...u, ...updates } : u)
        })),

        removeUser: (id) => set((state) => ({
          users: state.users.filter(u => u.id !== id)
        })),

        getUserById: (id) => {
          return get().users.find(u => u.id === id);
        },

        getUsersByCompany: (companyId) => {
          return get().users.filter(u => u.companyId === companyId);
        },

        getActiveUsers: (companyId) => {
          return get().users.filter(
            u => u.companyId === companyId && u.shiftStatus === ShiftStatus.ACTIVE
          );
        },

        // ========== TASK ACTIONS ==========

        addTask: (taskData) => {
          const newTask: Task = {
            ...taskData,
            id: uuid(),
            createdAt: new Date(),
          } as Task;

          set((state) => ({ tasks: [...state.tasks, newTask] }));

          // Add notification for assigned user
          get().addNotification({
            userId: taskData.assignedTo,
            type: NotificationType.TASK_ASSIGNED,
            title: 'Nova tarefa',
            message: `Você recebeu: ${taskData.title}`,
            read: false,
          });

          // Add activity
          get().addActivity({
            userId: taskData.assignedTo,
            companyId: taskData.companyId,
            type: ActivityType.TASK_COMPLETED,
            description: `Tarefa atribuída: ${taskData.title}`,
            xpChange: 0,
          });

          return newTask;
        },

        updateTask: (id, updates) => set((state) => ({
          tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
        })),

        removeTask: (id) => set((state) => ({
          tasks: state.tasks.filter(t => t.id !== id)
        })),

        getTaskById: (id) => {
          return get().tasks.find(t => t.id === id);
        },

        getTasksByUser: (userId) => {
          return get().tasks.filter(t => t.assignedTo === userId);
        },

        getTasksByCompany: (companyId) => {
          return get().tasks.filter(t => t.companyId === companyId);
        },

        getPendingTasks: (userId) => {
          return get().tasks.filter(
            t => t.assignedTo === userId && t.status === TaskStatus.PENDING
          );
        },

        getInProgressTasks: (userId) => {
          return get().tasks.filter(
            t => t.assignedTo === userId && t.status === TaskStatus.IN_PROGRESS
          );
        },

        // ========== SHIFT ACTIONS ==========

        addShift: (shiftData) => {
          const newShift: Shift = {
            ...shiftData,
            id: uuid(),
            createdAt: new Date(),
          };

          set((state) => ({ shifts: [...state.shifts, newShift] }));
          return newShift;
        },

        updateShift: (id, updates) => set((state) => ({
          shifts: state.shifts.map(s => s.id === id ? { ...s, ...updates } : s)
        })),

        removeShift: (id) => set((state) => ({
          shifts: state.shifts.filter(s => s.id !== id)
        })),

        getShiftsByCompany: (companyId) => {
          return get().shifts.filter(s => s.companyId === companyId);
        },

        getShiftsByUser: (userId) => {
          return get().shifts.filter(s => s.assignedTo === userId);
        },

        getShiftsByDate: (companyId, date) => {
          return get().shifts.filter(s => s.companyId === companyId && s.date === date);
        },

        // ========== TASK FLOW ACTIONS ==========

        canStartTask: (taskId, userId) => {
          const task = get().getTaskById(taskId);
          const user = get().getUserById(userId);

          if (!task) return { canStart: false, reason: 'Tarefa não encontrada' };
          if (!user) return { canStart: false, reason: 'Usuário não encontrado' };

          // Check if user is active
          if (user.shiftStatus !== ShiftStatus.ACTIVE) {
            return { canStart: false, reason: 'Inicie o turno primeiro' };
          }

          // Check if task is already done
          if (task.status === TaskStatus.DONE) {
            return { canStart: false, reason: 'Tarefa já concluída' };
          }

          // Check if task is in progress by another user
          if (task.status === TaskStatus.IN_PROGRESS && task.assignedTo !== userId) {
            return { canStart: false, reason: 'Tarefa já está sendo executada' };
          }

          return { canStart: true };
        },

        startTask: (taskId, userId) => {
          const validation = get().canStartTask(taskId, userId);

          if (!validation.canStart) {
            get().setError(validation.reason || 'Não é possível iniciar a tarefa');
            return false;
          }

          get().updateTask(taskId, {
            status: TaskStatus.IN_PROGRESS,
            startedAt: new Date(),
          });

          return true;
        },

        completeTask: (taskId, userId, photo, duration) => {
          const task = get().getTaskById(taskId);
          const user = get().getUserById(userId);

          if (!task || !user) return false;
          if (task.status !== TaskStatus.IN_PROGRESS) return false;

          // Calculate XP
          let totalXP = task.xpReward;

          // Speed bonus: +20 XP if < 5 minutes
          if (duration < 300) totalXP += 20;

          // Photo bonus: +10 XP
          totalXP += 10;

          // Update task
          get().updateTask(taskId, {
            status: TaskStatus.DONE,
            completedAt: new Date(),
            photoProof: photo,
            duration,
          });

          // Add XP
          get().addXP(userId, totalXP, `Tarefa: ${task.title}`);

          // Notify manager/owner
          get().addNotification({
            userId: task.createdBy,
            type: NotificationType.TASK_COMPLETED,
            title: 'Tarefa concluída',
            message: `${user.name} completou: ${task.title}`,
            read: false,
          });

          // Check for achievements
          get().checkAchievements(userId);

          return true;
        },

        // ========== CHECK-IN/CHECK-OUT ACTIONS ==========

        checkIn: (userId, location) => {
          const user = get().getUserById(userId);
          if (!user) return;

          // Update streak
          get().updateStreak(userId);

          // Update user status
          get().updateUser(userId, {
            shiftStatus: ShiftStatus.ACTIVE,
            lastCheckIn: new Date(),
          });

          // Add activity
          get().addActivity({
            userId,
            companyId: user.companyId,
            type: ActivityType.CHECK_IN,
            description: 'Iniciou turno',
            xpChange: 0,
          });

          // Update company stats
          get().updateCompanyStats(user.companyId);

          // Check achievements
          get().checkAchievements(userId);
        },

        checkOut: (userId) => {
          const user = get().getUserById(userId);
          if (!user) return;

          // Update user status
          get().updateUser(userId, {
            shiftStatus: ShiftStatus.OFFLINE,
            lastCheckOut: new Date(),
          });

          // Add activity
          get().addActivity({
            userId,
            companyId: user.companyId,
            type: ActivityType.CHECK_OUT,
            description: 'Finalizou turno',
            xpChange: 0,
          });

          // Update company stats
          get().updateCompanyStats(user.companyId);
        },

        isUserActive: (userId) => {
          const user = get().getUserById(userId);
          return user?.shiftStatus === ShiftStatus.ACTIVE;
        },

        // ========== XP AND LEVEL ACTIONS ==========

        addXP: (userId, amount, reason) => {
          const user = get().getUserById(userId);
          if (!user) return;

          const newXP = user.xp + amount;

          // Update user XP
          get().updateUser(userId, { xp: newXP });

          // Update level
          get().updateLevel(userId);

          // Add activity
          get().addActivity({
            userId,
            companyId: user.companyId,
            type: ActivityType.XP_GAINED,
            description: `+${amount} XP: ${reason}`,
            xpChange: amount,
          });
        },

        updateLevel: (userId) => {
          const user = get().getUserById(userId);
          if (!user) return;

          const oldLevel = user.level;
          const newLevel = calculateLevel(user.xp);

          if (newLevel > oldLevel) {
            get().updateUser(userId, { level: newLevel });

            // Add activity
            get().addActivity({
              userId,
              companyId: user.companyId,
              type: ActivityType.LEVEL_UP,
              description: `Subiu para nível ${newLevel}!`,
              xpChange: 0,
            });

            // Check for level achievements
            if (newLevel === 5) get().unlockAchievement(userId, 'nivel-5');
            if (newLevel === 10) get().unlockAchievement(userId, 'nivel-10');
          }
        },

        // ========== STREAK ACTIONS ==========

        updateStreak: (userId) => {
          const user = get().getUserById(userId);
          if (!user) return;

          const now = new Date();
          const lastCheckIn = user.lastCheckIn;

          if (!lastCheckIn) {
            // First check-in ever
            get().updateUser(userId, { streak: 1 });
            return;
          }

          const daysSinceLastCheckIn = differenceInDays(now, lastCheckIn);

          if (daysSinceLastCheckIn === 1) {
            // Consecutive check-in
            const newStreak = user.streak + 1;
            get().updateUser(userId, { streak: newStreak });

            // Check for streak achievements
            if (newStreak === 7) get().unlockAchievement(userId, 'primeira-semana');
            if (newStreak === 30) get().unlockAchievement(userId, 'perfeccionista');
          } else if (daysSinceLastCheckIn > 1) {
            // Streak broken
            get().updateUser(userId, { streak: 1 });
          }
          // If same day (daysSinceLastCheckIn === 0), maintain streak
        },

        getStreakState: (streak) => ({
          isOnFire: streak >= 3,
          isBlazing: streak >= 7,
          isLegendary: streak >= 30,
        }),

        // ========== ACHIEVEMENT ACTIONS ==========

        unlockAchievement: (userId, achievementId) => {
          const { userAchievements, achievements } = get();

          // Check if already unlocked
          const alreadyUnlocked = userAchievements.some(
            ua => ua.userId === userId && ua.achievementId === achievementId
          );

          if (alreadyUnlocked) return;

          // Find achievement
          const achievement = achievements.find(a => a.id === achievementId);
          if (!achievement) return;

          // Unlock
          const newUserAchievement: UserAchievement = {
            id: uuid(),
            userId,
            achievementId,
            unlockedAt: new Date(),
          };

          set((state) => ({
            userAchievements: [...state.userAchievements, newUserAchievement]
          }));

          // Add XP from achievement
          get().addXP(userId, achievement.xp, `Conquista: ${achievement.name}`);

          // Notify user
          get().addNotification({
            userId,
            type: NotificationType.ACHIEVEMENT,
            title: '🎉 Conquista desbloqueada!',
            message: achievement.name,
            read: false,
          });

          // Add activity
          const user = get().getUserById(userId);
          if (user) {
            get().addActivity({
              userId,
              companyId: user.companyId,
              type: ActivityType.ACHIEVEMENT_UNLOCKED,
              description: `Conquistou: ${achievement.name}`,
              xpChange: achievement.xp,
            });
          }
        },

        checkAchievements: (userId) => {
          const user = get().getUserById(userId);
          if (!user) return;

          // Example achievement checks (expand based on Blueprint)
          // This should be expanded with all 9 official achievements
        },

        getUserAchievements: (userId) => {
          return get().userAchievements.filter(ua => ua.userId === userId);
        },

        // ========== NOTIFICATION ACTIONS ==========

        addNotification: (notificationData) => {
          const newNotification: Notification = {
            ...notificationData,
            id: uuid(),
            createdAt: new Date(),
          };

          set((state) => ({
            notifications: [...state.notifications, newNotification]
          }));
        },

        removeNotification: (id) => set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        })),

        markNotificationAsRead: (id) => set((state) => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          )
        })),

        markAllNotificationsAsRead: (userId) => set((state) => ({
          notifications: state.notifications.map(n =>
            n.userId === userId ? { ...n, read: true } : n
          )
        })),

        getUnreadNotifications: (userId) => {
          return get().notifications.filter(n => n.userId === userId && !n.read);
        },

        // ========== ACTIVITY ACTIONS ==========

        addActivity: (activityData) => {
          const newActivity: Activity = {
            ...activityData,
            id: uuid(),
            createdAt: new Date(),
          };

          set((state) => ({
            activities: [...state.activities, newActivity]
          }));
        },

        getActivitiesByUser: (userId) => {
          return get().activities
            .filter(a => a.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        },

        getRecentActivities: (companyId, limit = 10) => {
          return get().activities
            .filter(a => a.companyId === companyId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, limit);
        },

        // ========== RANKING ACTIONS ==========

        getLeaderboard: (companyId, limit = 10) => {
          return get().users
            .filter(u => u.companyId === companyId)
            .sort((a, b) => b.xp - a.xp)
            .slice(0, limit);
        },

        getUserRank: (userId, companyId) => {
          const leaderboard = get().users
            .filter(u => u.companyId === companyId)
            .sort((a, b) => b.xp - a.xp);

          return leaderboard.findIndex(u => u.id === userId) + 1;
        },

        // ========== UTILITY ACTIONS ==========

        setLoading: (value) => set({ isLoading: value }),

        setError: (error) => set({ error }),

        reset: () => set(initialState),
      }),
      {
        name: 'chefiapp-storage',
        partialize: (state) => ({
          currentUser: state.currentUser,
          isAuthenticated: state.isAuthenticated,
          company: state.company,
          achievements: state.achievements,
        }),
      }
    ),
    { name: 'ChefIApp Store' }
  )
);
