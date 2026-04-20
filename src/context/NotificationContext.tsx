'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { DEMO_NOTIFICATIONS, type DemoNotification, type NotificationType } from '@/lib/demo-notifications';

export type { NotificationType };

/** Map demo type → dropdown style key (keeps existing TYPE_CONFIG working) */
type DropdownType = 'project' | 'stock' | 'critical' | 'update' | 'deadline' | 'review';

export function iconToType(icon: string): DropdownType {
  const map: Record<string, DropdownType> = {
    '🎯': 'update',
    '📊': 'review',
    '🔄': 'project',
    '⚠️': 'critical',
    '📦': 'stock',
    '✅': 'update',
    '✓': 'review',
    '🔔': 'project',
    '🆕': 'project',
  };
  return map[icon] || 'update';
}

export interface InboxNotification {
  id: string;
  body: string;
  icon: string;
  url: string | null;
  data: Record<string, unknown> | null;
  is_read: boolean;
  read_at: string | null;
  is_todo: boolean;
  created_at: string;
}

const STORAGE_KEY = 'ccpm-notifications-read';

function getReadSet(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function persistReadSet(readSet: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...readSet]));
  } catch {
    // localStorage unavailable
  }
}

function demoToInbox(demo: DemoNotification, readSet: Set<string>): InboxNotification {
  const createdAt = new Date(Date.now() - demo.hoursAgo * 60 * 60 * 1000);
  const isRead = readSet.has(demo.id);
  return {
    id: demo.id,
    body: `${demo.title}\n${demo.body}`,
    icon: demo.icon,
    url: demo.href,
    data: { title: demo.title, description: demo.body },
    is_read: isRead,
    read_at: isRead ? new Date().toISOString() : null,
    is_todo: false,
    created_at: createdAt.toISOString(),
  };
}

interface NotificationContextType {
  notifications: InboxNotification[];
  unreadCount: number;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  loading: boolean;
  error: string | null;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [readSet, setReadSet] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Load read state from localStorage on mount
  useEffect(() => {
    setReadSet(getReadSet());
    setLoading(false);
  }, []);

  const notifications = DEMO_NOTIFICATIONS.map((d) => demoToInbox(d, readSet));
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = useCallback((id: string) => {
    setReadSet((prev) => {
      const next = new Set(prev);
      next.add(id);
      persistReadSet(next);
      return next;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setReadSet(() => {
      const next = new Set(DEMO_NOTIFICATIONS.map((d) => d.id));
      persistReadSet(next);
      return next;
    });
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllAsRead, markAsRead, loading, error: null }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
