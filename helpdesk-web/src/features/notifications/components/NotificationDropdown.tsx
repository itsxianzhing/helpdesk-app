import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router';

import type { NotificationResponse } from '../types';

interface NotificationDropdownProps {
  notifications: NotificationResponse[];
  unreadCount: number;
  isLoading: boolean;
  isAdmin: boolean;
  onMarkAsRead: (id: number) => Promise<void>;
  onMarkAllAsRead: () => Promise<void>;
  onClose: () => void;
}

function formatNotificationDate(date: string) {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

function NotificationDropdown({
  notifications,
  unreadCount,
  isLoading,
  isAdmin,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}: NotificationDropdownProps) {
  const navigate = useNavigate();

  async function handleNotificationClick(notification: NotificationResponse) {
    if (!notification.isRead) {
      await onMarkAsRead(notification.id);
    }

    if (notification.entityType === 'Ticket' && notification.entityId !== null) {
      const path = isAdmin
        ? `/admin/tickets/${notification.entityId}`
        : `/tickets/${notification.entityId}`;

      onClose();
      navigate(path);
    }
  }

  async function handleMarkAllAsRead() {
    await onMarkAllAsRead();
  }

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-lg border bg-background shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <p className="text-sm font-semibold">Notifications</p>

          {unreadCount > 0 && <p className="text-xs text-muted-foreground">{unreadCount} unread</p>}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="text-xs font-medium text-primary hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
            <Bell size={20} className="mb-2 text-muted-foreground" />

            <p className="text-sm text-muted-foreground">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
            <Bell size={20} className="mb-2 text-muted-foreground" />

            <p className="text-sm font-medium">No notifications</p>

            <p className="mt-1 text-xs text-muted-foreground">You're all caught up.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => void handleNotificationClick(notification)}
              className={`w-full border-b px-4 py-3 text-left transition-colors hover:bg-muted ${
                !notification.isRead ? 'bg-muted/40' : ''
              }`}
            >
              <div className="flex gap-3">
                {/* Unread indicator */}
                <div className="flex w-2 shrink-0 justify-center">
                  {!notification.isRead && (
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{notification.title}</p>

                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {notification.message}
                  </p>

                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {formatNotificationDate(notification.createdAt)}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationDropdown;
