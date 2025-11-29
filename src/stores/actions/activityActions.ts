// ChefIApp™ - Activity Actions with Supabase Integration
import { supabase } from '../../lib/supabase';
import { Activity, ActivityType } from '../../lib/types';

export interface ActivityActions {
  // Sync activities
  syncActivities: (companyId: string) => Promise<void>;

  // CRUD
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => Promise<void>;

  // Query
  getActivitiesByUser: (userId: string) => Activity[];
  getRecentActivities: (companyId: string, limit?: number) => Activity[];
}

export const createActivityActions = (set: any, get: any): ActivityActions => ({
  // ========== SYNC ACTIVITIES ==========
  syncActivities: async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      if (data) {
        const activities: Activity[] = data.map((row: any) => ({
          id: row.id,
          userId: row.user_id,
          companyId: row.company_id,
          type: row.type as ActivityType,
          description: row.description,
          xpChange: row.xp_change || 0,
          createdAt: new Date(row.created_at),
        }));

        set({ activities });
      }
    } catch (err) {
      console.error('Error syncing activities:', err);
    }
  },

  // ========== ADD ACTIVITY ==========
  addActivity: async (activityData) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          user_id: activityData.userId,
          company_id: activityData.companyId,
          type: activityData.type,
          description: activityData.description,
          xp_change: activityData.xpChange,
        })
        .select()
        .single();

      if (error) throw error;

      const activity: Activity = {
        id: data.id,
        userId: data.user_id,
        companyId: data.company_id,
        type: data.type,
        description: data.description,
        xpChange: data.xp_change,
        createdAt: new Date(data.created_at),
      };

      set((state: any) => ({
        activities: [...state.activities, activity]
      }));
    } catch (err) {
      console.error('Error adding activity:', err);
    }
  },

  // ========== QUERY ==========
  getActivitiesByUser: (userId) => {
    return get().activities
      .filter((a: Activity) => a.userId === userId)
      .sort((a: Activity, b: Activity) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  getRecentActivities: (companyId, limit = 10) => {
    return get().activities
      .filter((a: Activity) => a.companyId === companyId)
      .sort((a: Activity, b: Activity) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  },
});
