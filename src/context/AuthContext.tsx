'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { login as loginAction, logout as logoutAction, getUserToken, getUserData } from '@/actions/authentication/auth'
import { User } from '@/types/user';


interface AuthContextType {
  user: User | null,
  login: (username: string, password: string) => Promise<void>,
  logout: () => Promise<void>,
  loading: boolean,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await getUserToken();
      if (token) {
        try {
          const userData = await getUserData();
          setUser(userData);
        } catch (error) {
          console.error('Login error:', error)
          setUser(null);
        }
        
      }
      setLoading(false);
    }
    fetchUser()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      await loginAction(username, password);
      const userData = await getUserData();
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    await logoutAction()
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}