'use server';

export async function resetDatabase() {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    throw new Error('API_URL is not defined');
  }

  const response = await fetch(`${apiUrl}/db/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to reset database: ${response.status}`);
  }

  return response.json();
}
