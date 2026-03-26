let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getJwtToken(): Promise<string | null> {
  // Return cached token if still valid (with 30s buffer)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.token;
  }

  const apiUrl = process.env.API_URL;
  const email = process.env.BACKEND_ADMIN_EMAIL || 'infra@carbonable.io';
  const password = process.env.BACKEND_ADMIN_PASSWORD || 'admin';

  if (!apiUrl) {
    console.error('API_URL not configured');
    return null;
  }

  try {
    const res = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      console.error(`Backend login failed: ${res.status}`);
      return null;
    }

    const data = await res.json();
    const token = data.access_token;

    // Cache for ~55 minutes (backend tokens expire in 1h)
    cachedToken = { token, expiresAt: Date.now() + 55 * 60 * 1000 };

    return token;
  } catch (error) {
    console.error('Backend login error:', error);
    return null;
  }
}
