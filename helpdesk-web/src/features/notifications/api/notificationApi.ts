import { apiFetch } from '../../../lib/api';
import type { NotificationResponse } from '../types';

export async function getNotifications(): Promise<NotificationResponse[]> {
  return apiFetch<NotificationResponse[]>('/Notifications');
}

export async function getUnreadCount(): Promise<number> {
  const response = await apiFetch<{ count: number }>('/Notifications/unread-count');

  return response.count;
}

export async function markNotificationAsRead(id: number): Promise<void> {
  await apiFetch<void>(`/Notifications/${id}/read`, {
    method: 'PATCH',
  });
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await apiFetch<void>('/Notifications/read-all', {
    method: 'PATCH',
  });
}
