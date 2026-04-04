import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createNotifydClient } from 'notifyd-sdk';

const NOTIFYD_URL = process.env.NOTIFYD_URL || 'https://notifyd.ctrlnz.com';
const NOTIFYD_API_KEY = process.env.NOTIFYD_API_KEY || '';

/**
 * GET /api/notifications/token
 *
 * Returns a notifyd subscriber JWT for the authenticated Clerk user.
 * Auto-creates the subscriber in notifyd on first call (upsert).
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!NOTIFYD_API_KEY) {
    return NextResponse.json({ error: 'Notification service not configured' }, { status: 503 });
  }

  const notifyd = createNotifydClient({
    url: NOTIFYD_URL,
    apiKey: NOTIFYD_API_KEY,
  });

  try {
    const user = await currentUser();

    void notifyd.upsertSubscriber({
      id: userId,
      email: user?.emailAddresses?.[0]?.emailAddress,
      firstName: user?.firstName || undefined,
      lastName: user?.lastName || undefined,
    }).catch(() => undefined);

    const token = await notifyd.createSubscriberToken({
      subscriberId: userId,
      ttlHours: 8,
    });

    return NextResponse.json({
      token: token.token,
      subscriberId: token.subscriberId,
      expiresAt: token.expiresAt,
    });
  } catch (err) {
    console.error('[notifyd] token fetch error:', err);
    return NextResponse.json({ error: 'Notification service unavailable' }, { status: 503 });
  }
}
