import { auth } from '@clerk/nextjs/server';
import jwt from 'jsonwebtoken';

export async function getJwtToken(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET not configured');
    return null;
  }

  // Sign a short-lived token for the backend API
  return jwt.sign(
    { id: userId, roles: ['admin'] },
    secret,
    { expiresIn: '5m' },
  );
}
