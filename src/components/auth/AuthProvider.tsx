'use client';

import React, { createContext, useContext } from 'react';
import { useUser, useAuth as useClerkAuth, useOrganization } from '@clerk/nextjs';

interface User {
  id: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  organizationId: string | null;
  organizationName: string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerkAuth();
  const { organization } = useOrganization();

  const user: User | null = clerkUser
    ? {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        roles: (clerkUser.publicMetadata?.roles as string[]) || ['admin'],
      }
    : null;

  const login = async () => {};

  const logout = async () => {
    await signOut();
  };

  const isAdmin = () => {
    return user?.roles?.includes('admin') ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: !isLoaded,
        login,
        logout,
        isAdmin,
        organizationId: organization?.id ?? null,
        organizationName: organization?.name ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
