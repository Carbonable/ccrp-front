import { cookies } from 'next/headers';

export function getJwtToken(): string | null {
  const cookieStore = cookies();
  return cookieStore.get('token')?.value || null;
}