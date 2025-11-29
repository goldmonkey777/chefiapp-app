// ChefIApp™ - User Actions with Supabase Integration
import { supabase } from '../../lib/supabase';
import { User, ShiftStatus, ActivityType, UserRole, Sector, AuthMethod } from '../../lib/types';
import { calculateLevel, differenceInDays } from '../../lib/utils';

// Supabase row type from profiles table
interface ProfileRow {
  id: string;
  name: string;
  email: string | null;
  role: UserRole;
  company_id: string | null;
  sector: Sector | null;
  xp: number;
  level: number;
  streak: number;
  shift_status: ShiftStatus;
  last_check_in: string | null;
  last_check_out: string | null;
  profile_photo: string | null;
  created_at: string;
  auth_method: AuthMethod;
}

export interface UserActions {
  // Sync users from Supabase
  syncUsers: (companyId: string) => Promise<void>;

  // User CRUD
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  removeUser: (id: string) => void;

  // Query users
  getUserById: (id: string) => User | undefined;
  getUsersByCompany: (companyId: string) => User[];
  getActiveUsers: (companyId: string) => User[];

  // Check-in/Check-out
  checkIn: (userId: string, location?: { lat: number; lng: number }) => Promise<void>;
  checkOut: (userId: string) => Promise<void>;
  isUserActive: (userId: string) => boolean;

  // XP and Level
  addXP: (userId: string, amount: number, reason: string) => Promise<void>;
  updateLevel: (userId: string) => Promise<void>;

  // Streak
  updateStreak: (userId: string) => Promise<void>;
  getStreakState: (streak: number) => { isOnFire: boolean; isBlazing: boolean; isLegendary: boolean };
}

type SetState = (fn: (state: any) => Partial<any>) => void;
type GetState = () => any;

export const createUserActions = (set: SetState, get: GetState): UserActions => ({
  // ========== SYNC USERS ==========
  syncUsers: async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', companyId);

      if (error) throw error;

      if (data) {
        const users: User[] = data.map((row: ProfileRow) => ({
          id: row.id,
          name: row.name,
          email: row.email || '',
          role: row.role,
          companyId: row.company_id,
          sector: row.sector,
          xp: row.xp || 0,
          level: row.level || 1,
          streak: row.streak || 0,
          shiftStatus: row.shift_status || 'offline',
          lastCheckIn: row.last_check_in ? new Date(row.last_check_in) : null,
          lastCheckOut: row.last_check_out ? new Date(row.last_check_out) : null,
          profilePhoto: row.profile_photo || '',
          createdAt: new Date(row.created_at),
          authMethod: row.auth_method,
        }));

        set({ users });
      }
    } catch (err) {
      console.error('Error syncing users:', err);
      set({ error: 'Erro ao sincronizar usuários' });
    }
  },

  // ========== USER CRUD ==========
  addUser: (user) => set((state: any) => ({
    users: [...state.users, user]
  })),

  updateUser: async (id, updates) => {
    try {
      const dbUpdates: any = {};
      if (updates.xp !== undefined) dbUpdates.xp = updates.xp;
      if (updates.level !== undefined) dbUpdates.level = updates.level;
      if (updates.streak !== undefined) dbUpdates.streak = updates.streak;
      if (updates.shiftStatus) dbUpdates.shift_status = updates.shiftStatus;
      if (updates.lastCheckIn) dbUpdates.last_check_in = updates.lastCheckIn.toISOString();
      if (updates.lastCheckOut) dbUpdates.last_check_out = updates.lastCheckOut.toISOString();

      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      set((state: any) => ({
        users: state.users.map((u: User) => u.id === id ? { ...u, ...updates } : u)
      }));

      // Update current user if it's the same
      const currentUser = get().currentUser;
      if (currentUser && currentUser.id === id) {
        set({ currentUser: { ...currentUser, ...updates } });
      }
    } catch (err: any) {
      console.error('Error updating user:', err);
      set({ error: err.message || 'Erro ao atualizar usuário' });
    }
  },

  removeUser: (id) => set((state: any) => ({
    users: state.users.filter((u: User) => u.id !== id)
  })),

  // ========== QUERY USERS ==========
  getUserById: (id) => {
    return get().users.find((u: User) => u.id === id);
  },

  getUsersByCompany: (companyId) => {
    return get().users.filter((u: User) => u.companyId === companyId);
  },

  getActiveUsers: (companyId) => {
    return get().users.filter(
      (u: User) => u.companyId === companyId && u.shiftStatus === ShiftStatus.ACTIVE
    );
  },

  // ========== CHECK-IN/CHECK-OUT ==========
  checkIn: async (userId, location) => {
    const user = get().getUserById(userId);
    if (!user) return;

    // Update streak
    await get().updateStreak(userId);

    // Update user status
    await get().updateUser(userId, {
      shiftStatus: ShiftStatus.ACTIVE,
      lastCheckIn: new Date(),
    });

    // Create check-in record
    try {
      const { error } = await supabase
        .from('check_ins')
        .insert({
          user_id: userId,
          company_id: user.companyId,
          check_in_time: new Date().toISOString(),
          location_lat: location?.lat,
          location_lng: location?.lng,
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error creating check-in:', err);
    }

    // Add activity
    const { addActivity } = get();
    addActivity({
      userId,
      companyId: user.companyId,
      type: ActivityType.CHECK_IN,
      description: 'Iniciou turno',
      xpChange: 0,
    });

    // Check achievements
    const { checkAchievements } = get();
    checkAchievements(userId);
  },

  checkOut: async (userId) => {
    const user = get().getUserById(userId);
    if (!user) return;

    // Update user status
    await get().updateUser(userId, {
      shiftStatus: ShiftStatus.OFFLINE,
      lastCheckOut: new Date(),
    });

    // Update check-in record
    try {
      const { error } = await supabase
        .from('check_ins')
        .update({
          check_out_time: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .is('check_out_time', null)
        .order('check_in_time', { ascending: false })
        .limit(1);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating check-out:', err);
    }

    // Add activity
    const { addActivity } = get();
    addActivity({
      userId,
      companyId: user.companyId,
      type: ActivityType.CHECK_OUT,
      description: 'Finalizou turno',
      xpChange: 0,
    });
  },

  isUserActive: (userId) => {
    const user = get().getUserById(userId);
    return user?.shiftStatus === ShiftStatus.ACTIVE;
  },

  // ========== XP AND LEVEL ==========
  addXP: async (userId, amount, reason) => {
    const user = get().getUserById(userId);
    if (!user) return;

    const newXP = user.xp + amount;

    await get().updateUser(userId, { xp: newXP });
    await get().updateLevel(userId);

    // Add activity
    const { addActivity } = get();
    addActivity({
      userId,
      companyId: user.companyId,
      type: ActivityType.XP_GAINED,
      description: `+${amount} XP: ${reason}`,
      xpChange: amount,
    });
  },

  updateLevel: async (userId) => {
    const user = get().getUserById(userId);
    if (!user) return;

    const oldLevel = user.level;
    const newLevel = calculateLevel(user.xp);

    if (newLevel > oldLevel) {
      await get().updateUser(userId, { level: newLevel });

      // Add activity
      const { addActivity } = get();
      addActivity({
        userId,
        companyId: user.companyId,
        type: ActivityType.LEVEL_UP,
        description: `Subiu para nível ${newLevel}!`,
        xpChange: 0,
      });

      // Check for level achievements
      const { unlockAchievement } = get();
      if (newLevel === 5) unlockAchievement(userId, 'nivel-5');
      if (newLevel === 10) unlockAchievement(userId, 'nivel-10');
    }
  },

  // ========== STREAK ==========
  updateStreak: async (userId) => {
    const user = get().getUserById(userId);
    if (!user) return;

    const now = new Date();
    const lastCheckIn = user.lastCheckIn;

    if (!lastCheckIn) {
      await get().updateUser(userId, { streak: 1 });
      return;
    }

    const daysSinceLastCheckIn = differenceInDays(now, lastCheckIn);

    if (daysSinceLastCheckIn === 1) {
      const newStreak = user.streak + 1;
      await get().updateUser(userId, { streak: newStreak });

      // Check for streak achievements
      const { unlockAchievement } = get();
      if (newStreak === 7) unlockAchievement(userId, 'primeira-semana');
      if (newStreak === 30) unlockAchievement(userId, 'perfeccionista');
    } else if (daysSinceLastCheckIn > 1) {
      await get().updateUser(userId, { streak: 1 });
    }
  },

  getStreakState: (streak) => ({
    isOnFire: streak >= 3,
    isBlazing: streak >= 7,
    isLegendary: streak >= 30,
  }),
});
