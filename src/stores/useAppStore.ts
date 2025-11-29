// ChefIApp™ - Zustand Global Store v2.0
// Modular architecture with Supabase integration

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
  Shift,
} from '../lib/types';

// Import modular actions
import { createTaskActions, TaskActions } from './actions/taskActions';
import { createUserActions, UserActions } from './actions/userActions';
import { createNotificationActions, NotificationActions } from './actions/notificationActions';
import { createActivityActions, ActivityActions } from './actions/activityActions';

// ============================================
// STATE INTERFACE
// ============================================

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;

  // Company
  company: Company | null;

  // Data
  users: User[];
  tasks: Task[];
  shifts: Shift[];
  activities: Activity[];
  notifications: Notification[];
  achievements: Achievement[];
  userAchievements: UserAchievement[];

  // UI State
  isLoading: boolean;
  error: string | null;

  // ============================================
  // BASIC ACTIONS
  // ============================================

  // Auth Actions
  setCurrentUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;

  // Company Actions
  setCompany: (company: Company | null) => void;

  // Achievement Actions
  unlockAchievement: (userId: string, achievementId: string) => Promise<void>;
  checkAchievements: (userId: string) => void;
  getUserAchievements: (userId: string) => UserAchievement[];

  // Ranking
  getLeaderboard: (companyId: string, limit?: number) => User[];
  getUserRank: (userId: string, companyId: string) => number;

  // Utility Actions
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// Combine with modular actions
type CombinedState = AppState &
  TaskActions &
  UserActions &
  NotificationActions &
  ActivityActions;

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

export const useAppStore = create<CombinedState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Inject modular actions
        ...createTaskActions(set, get),
        ...createUserActions(set, get),
        ...createNotificationActions(set, get),
        ...createActivityActions(set, get),

        // ========== AUTH ACTIONS ==========
        setCurrentUser: (user) => set({ currentUser: user }),
        setAuthenticated: (value) => set({ isAuthenticated: value }),

        // ========== COMPANY ACTIONS ==========
        setCompany: (company) => set({ company }),

        // ========== ACHIEVEMENT ACTIONS ==========
        unlockAchievement: async (userId, achievementId) => {
          const { userAchievements, achievements } = get();

          const alreadyUnlocked = userAchievements.some(
            ua => ua.userId === userId && ua.achievementId === achievementId
          );

          if (alreadyUnlocked) return;

          const achievement = achievements.find(a => a.id === achievementId);
          if (!achievement) return;

          // TODO: Save to Supabase
          const newUserAchievement: UserAchievement = {
            id: crypto.randomUUID(),
            userId,
            achievementId,
            unlockedAt: new Date(),
          };

          set((state) => ({
            userAchievements: [...state.userAchievements, newUserAchievement]
          }));

          // Add XP from achievement
          await get().addXP(userId, achievement.xp, `Conquista: ${achievement.name}`);

          // Notify user
          await get().addNotification({
            userId,
            type: 'achievement' as any,
            title: '🎉 Conquista desbloqueada!',
            message: achievement.name,
            read: false,
          });
        },

        checkAchievements: (userId) => {
          // TODO: Implement achievement checks based on user stats
          const user = get().getUserById(userId);
          if (!user) return;

          // Example: Tasks completed
          const completedTasks = get().tasks.filter(
            t => t.assignedTo === userId && t.status === 'done'
          );

          if (completedTasks.length >= 10) {
            get().unlockAchievement(userId, 'first-10-tasks');
          }
        },

        getUserAchievements: (userId) => {
          return get().userAchievements.filter(ua => ua.userId === userId);
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
        name: 'chefiapp-storage-v2',
        partialize: (state) => ({
          currentUser: state.currentUser,
          isAuthenticated: state.isAuthenticated,
          company: state.company,
        }),
      }
    ),
    { name: 'ChefIApp Store v2' }
  )
);

// Export singleton instance for direct access
export default useAppStore;
