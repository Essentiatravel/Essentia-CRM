"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Calendar, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function GuiaNav() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { href: '/guia', label: 'Dashboard', icon: Calendar },
    { href: '/guia/perfil', label: 'Perfil', icon: User },
    { href: '/guia/configuracoes', label: 'Configurações', icon: Settings },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-900">Dashboard do Guia</h1>
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
          <Button variant="outline" onClick={logout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </nav>
  );
}




