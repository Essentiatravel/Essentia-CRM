"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  nome: string;
  userType: 'admin' | 'guia' | 'cliente';
  telefone?: string;
  endereco?: string;
  data_nascimento?: string;
  cpf?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchUser = async () => {
      try {
        // Primeiro tenta pegar do servidor
        const response = await fetch('/api/auth/me', {
          credentials: 'include' // Importante para cookies no Replit
        });
        if (response.ok) {
          const { user: userData } = await response.json();
          if (userData) {
            setUser(userData);
            setLoading(false);
            return;
          }
        }

        // Se não conseguir do servidor, tenta localStorage (para demo)
        if (typeof window !== 'undefined') {
          const localUser = localStorage.getItem('auth-user');
          if (localUser) {
            const userData = JSON.parse(localUser);
            setUser(userData);
          }
        }
      } catch (error) {
        console.log('User not authenticated');

        // Fallback para localStorage
        try {
          if (typeof window !== 'undefined') {
            const localUser = localStorage.getItem('auth-user');
            if (localUser) {
              const userData = JSON.parse(localUser);
              setUser(userData);
            }
          }
        } catch (e) {
          console.log('No local user data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isClient]);

  const login = () => {
    if (typeof window === 'undefined') return;
    const currentPath = window.location.pathname;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  };

  const logout = async () => {
    try {
      if (typeof window === 'undefined') return;

      // Primeiro remove localmente
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-user');
      }
      setUser(null);

      // Então chama a API (mesmo que falhe, o logout local já aconteceu)
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include' // Importante para cookies no Replit
      });

      // Redireciona para home
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Mesmo com erro na API, já fizemos logout local
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
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