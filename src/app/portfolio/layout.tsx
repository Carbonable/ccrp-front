'use client';

import ProtectedRoute from '@/components/authentication/ProtectedRoute'
import { useAuth } from "@/context/AuthContext";
import PortfolioNavigationTabs from '@/components/portfolio/Navigation';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>
  }
  
  return (
    <div className='mt-8'>
      <ProtectedRoute key={user ? user.username : 'loading_dashboard'}>
        <PortfolioNavigationTabs />
        <div>{children}</div>
      </ProtectedRoute>
      
    </div>
  )
}