/**
 * notifyd client for CCRP frontend.
 *
 * Uses the notifyd REST + SSE API for in-app notifications.
 * Requires NEXT_PUBLIC_NOTIFYD_URL and a subscriber JWT from the backend.
 */

const NOTIFYD_URL = process.env.NEXT_PUBLIC_NOTIFYD_URL || 'https://notifyd.ctrlnz.com';

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

interface UnreadCountResponse {
  unread_count: number;
}

interface StreamTicketResponse {
  ticket: string;
  expires_in_seconds: number;
}

function headers(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

/** Fetch paginated inbox for a subscriber */
export async function fetchInbox(
  subscriberId: string,
  token: string,
  opts?: { limit?: number; offset?: number; filter?: string },
): Promise<InboxResponse> {
  const params = new URLSearchParams();
  if (opts?.limit) params.set('limit', String(opts.limit));
  if (opts?.offset) params.set('offset', String(opts.offset));
  if (opts?.filter) params.set('filter', opts.filter);

  const res = await fetch(
    `${NOTIFYD_URL}/v1/inbox/${subscriberId}?${params}`,
    { headers: headers(token), cache: 'no-store' },
  );
  if (!res.ok) throw new Error(`notifyd inbox: ${res.status}`);
  return res.json();
}

/** Get unread count for badge */
export async function fetchUnreadCount(
  subscriberId: string,
  token: string,
): Promise<number> {
  const res = await fetch(
    `${NOTIFYD_URL}/v1/inbox/${subscriberId}/unread-count`,
    { headers: headers(token), cache: 'no-store' },
  );
  if (!res.ok) throw new Error(`notifyd unread: ${res.status}`);
  const data: UnreadCountResponse = await res.json();
  return data.unread_count;
}

/** Mark a single notification as read */
export async function markRead(
  subscriberId: string,
  notificationId: string,
  token: string,
): Promise<void> {
  await fetch(
    `${NOTIFYD_URL}/v1/inbox/${subscriberId}/${notificationId}`,
    {
      method: 'PATCH',
      headers: headers(token),
      body: JSON.stringify({ read: true }),
    },
  );
}

/** Mark all as read */
export async function markAllRead(
  subscriberId: string,
  token: string,
): Promise<void> {
  await fetch(
    `${NOTIFYD_URL}/v1/inbox/${subscriberId}/read-all`,
    { method: 'POST', headers: headers(token) },
  );
}

/** Get a one-time SSE ticket (avoids JWT in query params) */
async function getStreamTicket(
  subscriberId: string,
  token: string,
): Promise<string> {
  const res = await fetch(
    `${NOTIFYD_URL}/v1/inbox/${subscriberId}/stream-ticket`,
    { method: 'POST', headers: headers(token) },
  );
  if (!res.ok) throw new Error(`notifyd ticket: ${res.status}`);
  const data: StreamTicketResponse = await res.json();
  return data.ticket;
}

/**
 * Subscribe to realtime SSE events.
 * Returns an EventSource and a cleanup function.
 */
export async function subscribeSSE(
  subscriberId: string,
  token: string,
  onMessage: (event: MessageEvent) => void,
): Promise<() => void> {
  const ticket = await getStreamTicket(subscriberId, token);
  const es = new EventSource(
    `${NOTIFYD_URL}/v1/inbox/${subscriberId}/stream?token=${ticket}`,
  );
  es.onmessage = onMessage;
  es.onerror = () => {
    // Auto-reconnect is handled by EventSource
    console.warn('[notifyd] SSE connection error, reconnecting...');
  };
  return () => es.close();
}
