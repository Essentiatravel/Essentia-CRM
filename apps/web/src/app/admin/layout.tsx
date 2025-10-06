"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin-sidebar';
import AdminMobileNav from '@/components/admin-mobile-nav';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login?redirect=/admin');
      return;
    }

    if (user.userType !== 'admin') {
      // Redirecionar para área correta
      if (user.userType === 'guia') {
        router.push('/guia');
      } else if (user.userType === 'cliente') {
        router.push('/cliente');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || user.userType !== 'admin') {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Navegação mobile */}
      <AdminMobileNav
        userName={user?.nome || 'Administrador'}
        userEmail={user?.email || 'admin@turguide.com'}
        userType={user?.userType}
        onLogout={logout}
      />

      {/* Barra lateral */}
      <AdminSidebar />

      {/* Conteúdo principal */}
      <div className="flex-1 lg:ml-64 ml-0 overflow-auto">
        <div className="h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
