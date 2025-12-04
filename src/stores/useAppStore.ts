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
import { supabase } from '../lib/supabase';

// Import modular actions
import { createTaskActions, TaskActions } from './actions/taskActions';
import { createUserActions, UserActions } from './actions/userActions';
import { createNotificationActions, NotificationActions } from './actions/notificationActions';
import { createActivityActions, ActivityActions } from './actions/activityActions';
import { createShiftActions, ShiftActions } from './actions/shiftActions';

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
  ActivityActions &
  ShiftActions;

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
        ...createShiftActions(set, get),

        // ========== AUTH ACTIONS ==========
        setCurrentUser: (user) => set({ currentUser: user }),
        setAuthenticated: (value) => set({ isAuthenticated: value }),

        // ========== COMPANY ACTIONS ==========
        setCompany: (company) => set({ company }),

        // ========== ACHIEVEMENT ACTIONS ==========
        unlockAchievement: async (userId, achievementId) => {
          const { userAchievements, achievements } = get();

          // 1. Check if already unlocked locally
          const alreadyUnlocked = userAchievements.some(
            ua => ua.userId === userId && ua.achievementId === achievementId
          );

          if (alreadyUnlocked) return;

          // 2. Check if achievement exists
          const achievement = achievements.find(a => a.id === achievementId);
          if (!achievement) return;

          try {
            // 3. Persist to Supabase
            // We use upsert to handle potential race conditions safely
            const { data, error } = await supabase
              .from('user_achievements')
              .upsert(
                {
                  user_id: userId,
                  achievement_id: achievementId,
                  unlocked_at: new Date().toISOString(),
                } as any, // Type assertion due to schema mismatch
                { onConflict: 'user_id, achievement_id' }
              )
              .select()
              .single();

            if (error) {
              console.error('Error unlocking achievement:', error);
              return;
            }

            if (!data) {
              console.error('No data returned from achievement unlock');
              return;
            }

            // 4. Update local state
            const newUserAchievement: UserAchievement = {
              id: (data as any).id,
              userId: (data as any).user_id,
              achievementId: (data as any).achievement_id,
              unlockedAt: new Date((data as any).unlocked_at),
            };

            set((state) => ({
              userAchievements: [...state.userAchievements, newUserAchievement]
            }));

            // 5. Rewards & Notifications
            // Add XP from achievement
            // Note: addXP is part of UserActions/ActivityActions
            if (get().addXP) {
              await get().addXP(userId, achievement.xp, `Conquista: ${achievement.name}`);
            }

            // Notify user
            // Note: addNotification is part of NotificationActions
            if (get().addNotification) {
              await get().addNotification({
                userId,
                type: 'achievement' as any,
                title: '🎉 Conquista Desbloqueada!',
                message: `Você desbloqueou: ${achievement.name} (+${achievement.xp} XP)`,
                read: false,
              });
            }

          } catch (err) {
            console.error('Unexpected error unlocking achievement:', err);
          }
        },

        checkAchievements: (userId) => {
          const state = get();
          const user = state.users.find(u => u.id === userId);
          if (!user) return;

          // Helper to check and unlock
          const check = (condition: boolean, achievementId: string) => {
            if (condition) {
              get().unlockAchievement(userId, achievementId);
            }
          };

          // --- 1. Task Achievements ---
          const completedTasks = state.tasks.filter(
            t => t.assignedTo === userId && t.status === 'done'
          );

          check(completedTasks.length >= 1, 'first-task');
          check(completedTasks.length >= 10, 'task-master-novice'); // 10 tasks
          check(completedTasks.length >= 50, 'task-master-expert'); // 50 tasks
          check(completedTasks.length >= 100, 'task-master-legend'); // 100 tasks

          // --- 2. Streak Achievements ---
          check(user.streak >= 3, 'streak-fire'); // 3 days
          check(user.streak >= 7, 'streak-blazing'); // 7 days
          check(user.streak >= 30, 'streak-legendary'); // 30 days

          // --- 3. Level Achievements ---
          check(user.level >= 5, 'level-5-club');
          check(user.level >= 10, 'level-10-elite');
          check(user.level >= 20, 'level-20-master');
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
