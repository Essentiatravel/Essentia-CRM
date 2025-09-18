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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // Simple fetch without React Query for now
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.log('User not authenticated');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

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
      user, 
      login, 
      logout, 
      isLoading,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}