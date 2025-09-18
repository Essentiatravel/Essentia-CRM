"use client";

// Replit Auth integration - Updated AuthContext
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authFetch, isUnauthorizedError } from '../lib/authUtils';

interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use React Query to fetch user data only after component is mounted
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      try {
        const response = await authFetch('/api/auth/user');
        return await response.json();
      } catch (error) {
        if (error instanceof Error && isUnauthorizedError(error)) {
          // User is not authenticated, return null
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: mounted, // Only run query after component is mounted
  });

  // Show loading state during SSR
  if (!mounted) {
    return (
      <AuthContext.Provider value={{ 
        user: null, 
        login: () => {}, 
        logout: () => {}, 
        isLoading: true,
        isAuthenticated: false 
      }}>
        {children}
      </AuthContext.Provider>
    );
  }

  const login = () => {
    // Redirect to Replit Auth login endpoint
    window.location.href = '/api/login';
  };

  const logout = () => {
    // Redirect to Replit Auth logout endpoint
    window.location.href = '/api/logout';
  };

  return (
    <AuthContext.Provider value={{ 
      user: user || null, 
      login, 
      logout, 
      isLoading,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}