'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Notification, getMockNotifications } from '@/data/notifications';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const [notifications, setNotifications] = useState<Notification[]>(() => getMockNotifications(locale));

  useEffect(() => {
    setNotifications((prev) => {
      const translated = getMockNotifications(locale);
      const readById = new Map(prev.map((notification) => [notification.id, notification.read]));

      return translated.map((notification) => ({
        ...notification,
        read: readById.get(notification.id) ?? notification.read,
      }));
    });
  }, [locale]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
