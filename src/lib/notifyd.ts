import { createNotifydClient, type InboxNotification as NotifydInboxNotification } from 'notifyd-sdk';

const NOTIFYD_URL = process.env.NEXT_PUBLIC_NOTIFYD_URL || 'https://notifyd.ctrlnz.com';

function getClient(token: string) {
  return createNotifydClient({
    url: NOTIFYD_URL,
    subscriberToken: token,
  });
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

export interface InboxResponse {
  items: InboxNotification[];
  total: number;
  limit: number;
  offset: number;
}

function mapNotification(notification: NotifydInboxNotification): InboxNotification {
  return {
    id: notification.id,
    body: notification.body,
    icon: notification.icon,
    url: notification.url,
    data: notification.data,
    is_read: notification.isRead,
    read_at: notification.readAt,
    is_todo: notification.isTodo,
    created_at: notification.createdAt,
  };
}

/** Fetch paginated inbox for a subscriber */
export async function fetchInbox(
  subscriberId: string,
  token: string,
  opts?: { limit?: number; offset?: number; filter?: string },
): Promise<InboxResponse> {
  const response = await getClient(token).getInbox(subscriberId, opts);
  return {
    items: response.items.map(mapNotification),
    total: response.total,
    limit: response.limit,
    offset: response.offset,
  };
}

/** Get unread count for badge */
export async function fetchUnreadCount(
  subscriberId: string,
  token: string,
): Promise<number> {
  return getClient(token).getUnreadCount(subscriberId);
}

/** Mark a single notification as read */
export async function markRead(
  subscriberId: string,
  notificationId: string,
  token: string,
): Promise<void> {
  await getClient(token).markRead(subscriberId, notificationId);
}

/** Mark all as read */
export async function markAllRead(
  subscriberId: string,
  token: string,
): Promise<void> {
  await getClient(token).markAllRead(subscriberId);
}

/**
 * Subscribe to realtime SSE events.
 * Returns a cleanup function.
 */
export async function subscribeSSE(
  subscriberId: string,
  token: string,
  onMessage: (event: MessageEvent) => void,
): Promise<() => void> {
  const stream = await getClient(token).openInboxStream(subscriberId, {
    onMessage: (event) => onMessage({ data: event.data } as MessageEvent),
    onError: () => {
      console.warn('[notifyd] SSE connection error, reconnecting...');
    },
  });

  return stream.close;
}
