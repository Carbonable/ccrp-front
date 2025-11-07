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

    // Set the token as an HTTP-only cookie
    cookies().set('token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800, // 7 days
    });

    // Decode the JWT to get user information
    const decodedToken = jwtDecode<User>(data.access_token);

    // Return user information (without the token)
    return {
      id: decodedToken.id,
      email: decodedToken.email,
      roles: decodedToken.roles,
    };
  } catch (error) {
    if (error instanceof Error) {
      // Rethrow the error with the same message
      throw error;
    } else {
      // If it's not an Error instance, throw a generic error
      throw new Error('An unexpected error occurred');
    }
  }
}

export async function logout() {
  cookies().delete('token');
}

export async function checkAuth() {
  const token = cookies().get('token')?.value;

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
  } catch (error) {
    throw new Error('Invalid token');
  }
}
