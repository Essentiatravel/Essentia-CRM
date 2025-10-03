"use client";

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import GuiaSidebar from '@/components/guia-sidebar';
import GuiaMobileNav from '@/components/guia-mobile-nav';

export default function GuiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedTypes={['guia']}>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar para desktop */}
        <GuiaSidebar />
        
        {/* Mobile Navigation */}
        <GuiaMobileNav />

        {/* Main Content */}
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <main className="flex-1 p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}