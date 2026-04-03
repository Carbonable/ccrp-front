'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import {
  fetchInbox,
  fetchUnreadCount,
  markRead as apiMarkRead,
  markAllRead as apiMarkAllRead,
  subscribeSSE,
  InboxNotification,
} from '@/lib/notifyd';

// Re-export the type under the legacy name used by the dropdown
export type { InboxNotification as Notification };

// Map notifyd icon field → UI type for styling
export type NotificationType = 'project' | 'stock' | 'critical' | 'update' | 'deadline' | 'review';

export function iconToType(icon: string): NotificationType {
  const map: Record<string, NotificationType> = {
    alert: 'critical',
    'alert-triangle': 'critical',
    stock: 'stock',
    'trending-down': 'stock',
    calendar: 'deadline',
    clock: 'deadline',
    check: 'update',
    'check-circle': 'update',
    upload: 'update',
    'file-text': 'review',
    eye: 'review',
    bell: 'project',
    folder: 'project',
    plus: 'project',
  };
  return map[icon] || 'update';
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

interface TokenData {
  token: string;
  subscriberId: string;
  expiresAt: string;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<InboxNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tokenRef = useRef<TokenData | null>(null);
  const sseCleanupRef = useRef<(() => void) | null>(null);

  // Fetch subscriber token from our API route
  const getToken = useCallback(async (): Promise<TokenData | null> => {
    // Reuse if not expired (with 5min buffer)
    if (tokenRef.current) {
      const exp = new Date(tokenRef.current.expiresAt).getTime();
      if (Date.now() < exp - 5 * 60 * 1000) {
        return tokenRef.current;
      }
    }

    try {
      const res = await fetch('/api/notifications/token');
      if (!res.ok) {
        if (res.status === 401) return null; // Not logged in
        throw new Error(`Token fetch: ${res.status}`);
      }
      const data: TokenData = await res.json();
      tokenRef.current = data;
      return data;
    } catch (err) {
      console.warn('[notifications] token error:', err);
      return null;
    }
  }, []);

  // Load inbox + unread count
  const loadInbox = useCallback(async () => {
    const auth = await getToken();
    if (!auth) {
      setLoading(false);
      return;
    }

    try {
      const [inbox, count] = await Promise.all([
        fetchInbox(auth.subscriberId, auth.token, { limit: 30 }),
        fetchUnreadCount(auth.subscriberId, auth.token),
      ]);
      setNotifications(inbox.items);
      setUnreadCount(count);
      setError(null);
    } catch (err) {
      console.warn('[notifications] load error:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // Setup SSE realtime
  const setupSSE = useCallback(async () => {
    const auth = await getToken();
    if (!auth) return;

    try {
      const cleanup = await subscribeSSE(
        auth.subscriberId,
        auth.token,
        (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'count_update') {
              setUnreadCount(data.unread_count);
            }
            if (data.type === 'new_notification') {
              // Prepend new notification and refresh count
              loadInbox();
            }
          } catch {
            // Ignore parse errors (keepalive pings etc)
          }
        },
      );
      sseCleanupRef.current = cleanup;
    } catch (err) {
      console.warn('[notifications] SSE error:', err);
    }
  }, [getToken, loadInbox]);

  useEffect(() => {
    loadInbox();
    setupSSE();

    return () => {
      sseCleanupRef.current?.();
    };
  }, [loadInbox, setupSSE]);

  const markAllAsRead = useCallback(async () => {
    const auth = await getToken();
    if (!auth) return;

    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
    setUnreadCount(0);

    try {
      await apiMarkAllRead(auth.subscriberId, auth.token);
    } catch {
      // Revert on error
      loadInbox();
    }
  }, [getToken, loadInbox]);

  const markAsRead = useCallback(
    async (id: string) => {
      const auth = await getToken();
      if (!auth) return;

      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));

      try {
        await apiMarkRead(auth.subscriberId, id, auth.token);
      } catch {
        loadInbox();
      }
    },
    [getToken, loadInbox],
  );

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, markAsRead, loading, error }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
