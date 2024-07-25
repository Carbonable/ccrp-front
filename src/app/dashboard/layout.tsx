'use client';

import ProtectedRoute from '@/components/authentication/ProtectedRoute'
import { useAuth } from "@/context/AuthContext";
import DashboardNavigationTabs from "@/components/dashboard/Navigation";

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
        <DashboardNavigationTabs />
        <div>{children}</div>
      </ProtectedRoute>
      
    </div>
  )
}