"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import AdminSidebar from '@/components/admin-sidebar';
import AdminMobileNav from '@/components/admin-mobile-nav';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout, user } = useAuth();

  return (
    <ProtectedRoute allowedTypes={['admin']}>
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
    </ProtectedRoute>
  );
}
