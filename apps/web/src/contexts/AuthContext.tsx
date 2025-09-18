"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  userType: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Primeiro tenta pegar do servidor
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const { user: userData } = await response.json();
          if (userData) {
            setUser(userData);
            setLoading(false);
            return;
          }
        }

        // Se não conseguir do servidor, tenta localStorage (para demo)
        const localUser = localStorage.getItem('auth-user');
        if (localUser) {
          const userData = JSON.parse(localUser);
          setUser(userData);
        }
      } catch (error) {
        console.log('User not authenticated');

        // Fallback para localStorage
        try {
          const localUser = localStorage.getItem('auth-user');
          if (localUser) {
            const userData = JSON.parse(localUser);
            setUser(userData);
          }
        } catch (e) {
          console.log('No local user data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = () => {
    const currentPath = window.location.pathname;
    window.location.href = `/api/auth/login?redirect=${encodeURIComponent(currentPath)}`;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('auth-user');
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('auth-user');
      setUser(null);
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}