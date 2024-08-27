'use server';

export async function getDmrvData(slug: string) {
  const DMRV_API = process.env.DMRV_API;

  if (DMRV_API === undefined) {
    throw new Error('No backend setup');
  }

  const response = await fetch(`${DMRV_API}/${slug}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    return null;
  }

  const dmrvData = await response.json();
  return dmrvData;
}