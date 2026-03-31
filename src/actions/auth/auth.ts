'use server';

import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  roles: string[];
}

export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${process.env.API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 404) {
        throw new Error('Invalid credentials');
      } else if (response.status >= 500) {
        throw new Error('Server error');
      } else {
        throw new Error('Login failed');
      }
    }

    const data = await response.json();

    if (!data.access_token) {
      throw new Error('Token not received from server');
    }

    const cookieStore = await cookies();

    cookieStore.set('token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800,
    });

    const decodedToken = jwtDecode<User>(data.access_token);

    return {
      id: decodedToken.id,
      email: decodedToken.email,
      roles: decodedToken.roles,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
}

export async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    throw new Error('Not authenticated');
  }

  try {
    const decodedToken = jwtDecode<User>(token);
    return {
      id: decodedToken.id,
      email: decodedToken.email,
      roles: decodedToken.roles,
    };
  } catch {
    throw new Error('Invalid token');
  }
}
