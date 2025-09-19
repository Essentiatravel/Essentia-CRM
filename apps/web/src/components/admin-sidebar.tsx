"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CalendarDays,
  Users,
  Heart,
  MapPin,
  DollarSign,
  LogOut,
  Home,
  User,
} from "lucide-react";
import { usePathname } from 'next/navigation';

export const AdminSidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const pathname = usePathname();

  const navigationItems = [
    { icon: Home, label: "Dashboard", href: "/admin" },
    { icon: Calendar, label: "Agendamentos", href: "/admin/agendamentos" },
    { icon: CalendarDays, label: "Calendário Global", href: "/admin/calendario" },
    { icon: User, label: "Usuários", href: "/admin/usuarios" },
    { icon: Users, label: "Guias", href: "/admin/guias" },
    { icon: Heart, label: "Clientes", href: "/admin/clientes" },
    { icon: MapPin, label: "Passeios", href: "/admin/passeios" },
    { icon: DollarSign, label: "Financeiro", href: "/admin/financeiro" },
  ];

  return (
    <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="p-2 bg-blue-600 rounded-lg">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">TourGuide CRM</h1>
            <p className="text-sm text-gray-600">Administrador</p>
          </div>
        </div>

        {/* Navegação */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Navegação
          </h3>
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Perfil do usuário */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {user?.nome?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user?.nome || 'Administrador'}
              </p>
              <p className="text-xs text-gray-600">
                {user?.email || 'admin@turguide.com'}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;