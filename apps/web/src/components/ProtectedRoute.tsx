"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedTypes?: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  allowedTypes = ['admin'],
  redirectTo = '/'
}: ProtectedRouteProps) {
  const { user, loading, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Se não está logado, inicia o processo de login
        login();
        return;
      }

      // Verificar se o tipo de usuário está permitido
      if (user.userType && !allowedTypes.includes(user.userType)) {
        // Redirecionar para o dashboard apropriado
        if (user.userType === 'admin') {
          router.push('/admin');
        } else if (user.userType === 'guia') {
          router.push('/guia');
        } else if (user.userType === 'cliente') {
          router.push('/cliente');
        } else {
          router.push(redirectTo);
        }
        return;
      }
    }
  }, [user, loading, login, allowedTypes, redirectTo, router]);

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  // Se o usuário não tem o tipo permitido, não renderiza
  if (user.userType && !allowedTypes.includes(user.userType)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}




