import { cookies } from 'next/headers';

export async function getJwtToken(): Promise<string | null> {
  const cookieStore = cookies();
  return cookieStore.get('token')?.value || null;
}