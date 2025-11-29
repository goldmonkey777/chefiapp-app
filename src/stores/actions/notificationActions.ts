// ChefIApp™ - Notification Actions with Supabase Integration
import { supabase } from '../../lib/supabase';
import { Notification, NotificationType } from '../../lib/types';
import { uuid } from '../../lib/utils';

export interface NotificationActions {
  // Sync notifications
  syncNotifications: (userId: string) => Promise<void>;

  // CRUD
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: (userId: string) => Promise<void>;

  // Query
  getUnreadNotifications: (userId: string) => Notification[];
}

export const createNotificationActions = (set: any, get: any): NotificationActions => ({
  // ========== SYNC NOTIFICATIONS ==========
  syncNotifications: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      if (data) {
        const notifications: Notification[] = data.map((row: any) => ({
          id: row.id,
          userId: row.user_id,
          type: row.type as NotificationType,
          title: row.title,
          message: row.message,
          read: row.read,
          createdAt: new Date(row.created_at),
        }));

        set({ notifications });
      }
    } catch (err) {
      console.error('Error syncing notifications:', err);
    }
  },

  // ========== ADD NOTIFICATION ==========
  addNotification: async (notificationData) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: notificationData.userId,
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          read: notificationData.read,
        })
        .select()
        .single();

      if (error) throw error;

      const notification: Notification = {
        id: data.id,
        userId: data.user_id,
        type: data.type,
        title: data.title,
        message: data.message,
        read: data.read,
        createdAt: new Date(data.created_at),
      };

      set((state: any) => ({
        notifications: [...state.notifications, notification]
      }));
    } catch (err) {
      console.error('Error adding notification:', err);
    }
  },

  // ========== REMOVE NOTIFICATION ==========
  removeNotification: async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state: any) => ({
        notifications: state.notifications.filter((n: Notification) => n.id !== id)
      }));
    } catch (err) {
      console.error('Error removing notification:', err);
    }
  },

  // ========== MARK AS READ ==========
  markNotificationAsRead: async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;

      set((state: any) => ({
        notifications: state.notifications.map((n: Notification) =>
          n.id === id ? { ...n, read: true } : n
        )
      }));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  },

  // ========== MARK ALL AS READ ==========
  markAllNotificationsAsRead: async (userId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;

      set((state: any) => ({
        notifications: state.notifications.map((n: Notification) =>
          n.userId === userId ? { ...n, read: true } : n
        )
      }));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  },

  // ========== QUERY ==========
  getUnreadNotifications: (userId) => {
    return get().notifications.filter((n: Notification) => n.userId === userId && !n.read);
  },
});
