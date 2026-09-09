import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type NotificationType = "success" | "error";

interface Notification {
  message: string;
  type: NotificationType;
}

interface NotificationContextValue {
  showNotification: (
    message: string,
    type: NotificationType,
  ) => void;
}

const NotificationContext =
  createContext<NotificationContextValue | undefined>(
    undefined,
  );

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({
  children,
}: NotificationProviderProps) {
  const [notification, setNotification] =
    useState<Notification | null>(null);

  const showNotification = useCallback(
    (message: string, type: NotificationType) => {
      setNotification({
        message,
        type,
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
    },
    [],
  );

  return (
    <NotificationContext.Provider
      value={{ showNotification }}
    >
      {children}

      {notification && (
        <div className="fixed right-4 top-20 z-50 w-full max-w-sm">
          <div
            role="alert"
            className={`rounded-lg border bg-card px-4 py-3 text-sm shadow-lg ${
              notification.type === "success"
                ? "border-green-500/30 text-green-700 dark:text-green-400"
                : "border-destructive/30 text-destructive"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <p>{notification.message}</p>

              <button
                type="button"
                onClick={() => setNotification(null)}
                className="shrink-0 text-xs opacity-70 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification must be used within NotificationProvider",
    );
  }

  return context;
}