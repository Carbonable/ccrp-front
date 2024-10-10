'use client';
import { useAuth } from '@/components/auth/AuthProvider';
import { GreenButton } from '@/components/common/Button';
import { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='mx-auto w-1/2'>
      <div className='text-2xl text-center'>Welcome !</div>
      <form onSubmit={handleSubmit} className='mt-12'>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={`w-full rounded-xl border border-opacityLight-10 bg-opacityLight-5 px-3 py-3 text-left outline-0 focus:border-neutral-300`}
            required
            disabled={isLoading}
          />
        </div>
        <div className='mt-4'>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={`w-full rounded-xl border border-opacityLight-10 bg-opacityLight-5 px-3 py-3 text-left outline-0 focus:border-neutral-300`}
            required
            disabled={isLoading}
          />
        </div>
        {error && (
          <div className='mt-4 text-red-500 text-sm text-left'>
            {error}
          </div>
        )}
        <div className='mt-4'>
          <GreenButton 
            className='w-full' 
            type='submit' 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </GreenButton>
        </div>
      </form>
    </div>
  );
};

export default Login;
