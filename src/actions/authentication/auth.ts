'use server'

import { cookies } from 'next/headers'

export async function login(username: string, password: string) {
  const BACKEND_URL = process.env.API_URL;

  if (BACKEND_URL === undefined) {
    throw new Error('No backend setup');
  }

  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const userData = await response.json();
  cookies().set('user', JSON.stringify(userData), { httpOnly: true });
  return userData;
}

export async function logout() {
  cookies().delete('user');
}

export async function getUserToken() {
  const userCookie = cookies().get('user');
  return userCookie ? JSON.parse(userCookie.value) : null;
}

export async function getUserData() {
  const BACKEND_URL = process.env.API_URL;

  if (BACKEND_URL === undefined) {
    throw new Error('No backend setup');
  }
  const token = await getUserToken();
  const response = await fetch(`${BACKEND_URL}/user/profile`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json' ,
      Authorization: `Bearer ${token.access_token}`
    },
  })

  if (!response.ok) {
    return null;
  }

  const userData = await response.json();
  return userData;
}