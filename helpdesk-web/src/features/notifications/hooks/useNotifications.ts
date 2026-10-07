import { useCallback, useEffect, useState } from 'react';

import {
  getNotifications,
  getUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../api/notificationApi';

import { startNotificationHub, stopNotificationHub } from '../services/notificationHub';

import type { NotificationResponse } from '../types';

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);

      const [notificationData, count] = await Promise.all([getNotifications(), getUnreadCount()]);

      setNotifications(notificationData);
      setUnreadCount(count);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();

    void startNotificationHub(
      (notification) => {
        setNotifications((current) => {
          if (current.some((item) => item.id === notification.id)) {
            return current;
          }

          return [notification, ...current];
        });

        if (!notification.isRead) {
          setUnreadCount((current) => current + 1);
        }
      },
      async () => {
        await loadNotifications();
      },
    );

    return () => {
      void stopNotificationHub();
    };
  }, [loadNotifications]);

  const markAsRead = useCallback(
    async (id: number) => {
      const notification = notifications.find((item) => item.id === id);

      if (!notification || notification.isRead) {
        return;
      }

      await markNotificationAsRead(id);

      setNotifications((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                isRead: true,
                readAt: new Date().toISOString(),
              }
            : item,
        ),
      );

      setUnreadCount((current) => Math.max(0, current - 1));
    },
    [notifications],
  );

  const markAllAsRead = useCallback(async () => {
    if (unreadCount === 0) {
      return;
    }

    await markAllNotificationsAsRead();

    const now = new Date().toISOString();

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        isRead: true,
        readAt: notification.readAt ?? now,
      })),
    );

    setUnreadCount(0);
  }, [unreadCount]);

  return {
    notifications,
    unreadCount,
    isLoading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
  };
}
