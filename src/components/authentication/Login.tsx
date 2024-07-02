'use client'

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import PrimaryButton from '../common/Button';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      window.location.href = '/dashboard';
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLogin(true);
      await login(username, password);
      setIsLogin(false);
    } catch (error) {
      setIsLogin(false);
      console.error('Login error:', error);
      setError('Login failed');
    }
  }

  const closeError = () => {
    setError('');
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className='text-center rounded-lg border border-opacityLight-10 bg-opacityLight-5 p-4'
    >
      <div className='uppercase text-lg font-light'>
        Sign in
      </div>
      <div className='mt-8 text-left'>
        <div className="text-sm text-neutral-300 pl-1">Username</div>
        <input
          type="string"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className='input-common mt-1'
        />
        <div className="text-sm text-neutral-300 mt-6 pl-1">Password</div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className='input-common mt-1'
        />
      </div>
      {error && 
        <div className='bg-red-500 mt-4 py-2 rounded-lg text-sm text-neutral-50 relative'>
          {error}
          <div className='absolute right-2 top-1 text-xs cursor-pointer' onClick={closeError}>
            x
          </div>
        </div>
      }
      <div className='mt-8 w-full'>
        <PrimaryButton
          type="submit"
          isLoading={isLogin}
          className='w-full'
        >
          Login
        </PrimaryButton>
      </div>
    </form>
  )
}

export default LoginForm;