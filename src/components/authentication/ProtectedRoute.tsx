"use client";

import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return <div>Loading... Please wait.</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;