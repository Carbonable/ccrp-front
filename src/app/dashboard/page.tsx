'use client'

import ProtectedRoute from '@/components/authentication/ProtectedRoute'
import LogoutButton from '@/components/common/Logout'
import { useAuth } from '@/context/AuthContext'

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <ProtectedRoute key={user ? user.username : 'loading_dashboard'}>
      <div>
        <h1>Dashboard</h1>
        <p>Welcome, {user?.username}</p>
        <LogoutButton />
      </div>
    </ProtectedRoute>
  )
}