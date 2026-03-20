'use client';

import React, { createContext, useContext } from 'react';
import { useUser, useAuth as useClerkAuth, useOrganization } from '@clerk/nextjs';

interface User {
  id: string;
  email: string;
  roles: string[];
}

interface Organization {
  id: string;
  name: string;
  slug: string | null;
  role: string | undefined;
}

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isOrgAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerkAuth();
  const { organization: clerkOrg, membership } = useOrganization();

  const user: User | null = clerkUser
    ? {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        roles: (clerkUser.publicMetadata?.roles as string[]) || ['admin'],
      }
    : null;

  const organization: Organization | null = clerkOrg
    ? {
        id: clerkOrg.id,
        name: clerkOrg.name,
        slug: clerkOrg.slug,
        role: membership?.role,
      }
    : null;

  const login = async () => {};

  const logout = async () => {
    await signOut();
  };

  const isAdmin = () => {
    return user?.roles?.includes('admin') ?? false;
  };

  const isOrgAdmin = () => {
    return membership?.role === 'org:admin';
  };

  return (
    <AuthContext.Provider value={{ user, organization, loading: !isLoaded, login, logout, isAdmin, isOrgAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
