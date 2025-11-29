// ChefIApp™ - useNotifications Hook
// In-app notification system with Supabase integration

import { useState, useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { supabase } from '../lib/supabase';
import { Notification, NotificationType } from '../lib/types';

export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  getUnread: () => Notification[];
  getByType: (type: NotificationType) => Notification[];
  refreshNotifications: () => Promise<void>;
}

export function useNotifications(userId: string): UseNotificationsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const {
    notifications: allNotifications,
    getUnreadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
  } = useAppStore();

  const notifications = allNotifications.filter(n => n.userId === userId);
  const unreadNotifications = getUnreadNotifications(userId);
  const unreadCount = unreadNotifications.length;

  // Sync notifications from Supabase
  const syncNotifications = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // TODO: Update Zustand store with Supabase data
      // This requires adding a setNotifications action to useAppStore
    } catch (err) {
      console.error('Error syncing notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Subscribe to realtime updates
  useEffect(() => {
    syncNotifications();

    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        () => {
          syncNotifications();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  // Mark single notification as read
  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;

      markNotificationAsRead(id);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;

      markAllNotificationsAsRead(userId);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      removeNotification(id);
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  // Get unread notifications
  const getUnread = () => {
    return unreadNotifications;
  };

  // Get notifications by type
  const getByType = (type: NotificationType) => {
    return notifications.filter(n => n.type === type);
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnread,
    getByType,
    refreshNotifications: syncNotifications
  };
}
