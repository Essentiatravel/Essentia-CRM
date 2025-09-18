"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedTypes?: ('admin' | 'guia' | 'cliente')[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedTypes = ['admin', 'guia', 'cliente'],
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo);
        return;
      }

      if (!allowedTypes.includes(user.tipo)) {
        // Redirecionar para o dashboard apropriado do usuário
        if (user.tipo === 'admin') {
          router.push('/admin');
        } else if (user.tipo === 'guia') {
          router.push('/guia');
        } else if (user.tipo === 'cliente') {
          router.push('/cliente');
        }
        return;
      }
    }
  }, [user, loading, router, allowedTypes, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (!user || !allowedTypes.includes(user.tipo)) {
    return null;
  }

  return <>{children}</>;
}




