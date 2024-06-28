'use client'

import ProtectedRoute from '@/components/authentication/ProtectedRoute'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <ProtectedRoute>
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {user?.username}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    </ProtectedRoute>
  )
}