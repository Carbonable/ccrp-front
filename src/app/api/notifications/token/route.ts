import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const NOTIFYD_URL = process.env.NOTIFYD_URL || 'https://notifyd.ctrlnz.com';
const NOTIFYD_API_KEY = process.env.NOTIFYD_API_KEY || '';

/**
 * GET /api/notifications/token
 *
 * Returns a notifyd subscriber JWT for the authenticated Clerk user.
 * The frontend uses this token for inbox REST + SSE calls.
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!NOTIFYD_API_KEY) {
    return NextResponse.json({ error: 'Notification service not configured' }, { status: 503 });
  }

  try {
    const res = await fetch(`${NOTIFYD_URL}/v1/auth/subscriber-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': NOTIFYD_API_KEY,
      },
      body: JSON.stringify({
        subscriber_id: userId,
        ttl_hours: 8,
      }),
    });

    if (!res.ok) {
      console.error(`[notifyd] token error: ${res.status}`, await res.text());
      return NextResponse.json({ error: 'Failed to get notification token' }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({
      token: data.token,
      subscriberId: data.subscriber_id,
      expiresAt: data.expires_at,
    });
  } catch (err) {
    console.error('[notifyd] token fetch error:', err);
    return NextResponse.json({ error: 'Notification service unavailable' }, { status: 503 });
  }
}
