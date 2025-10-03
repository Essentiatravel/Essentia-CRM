"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Calendar,
  MapPin,
  DollarSign,
  LogOut,
  User,
  Settings,
  Clock,
  Star,
} from "lucide-react";
import { usePathname } from 'next/navigation';

export const GuiaSidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const pathname = usePathname();

  const navigationItems = [
    { icon: BarChart3, label: "Dashboard", href: "/guia" },
    { icon: Calendar, label: "Meus Agendamentos", href: "/guia/agendamentos" },
    { icon: Clock, label: "Histórico", href: "/guia/historico" },
    { icon: DollarSign, label: "Comissões", href: "/guia/comissoes" },
    { icon: Star, label: "Avaliações", href: "/guia/avaliacoes" },
    { icon: User, label: "Perfil", href: "/guia/perfil" },
    { icon: Settings, label: "Configurações", href: "/guia/configuracoes" },
  ];

  return (
    <div className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
          <div className="p-2 bg-green-600 rounded-lg flex-shrink-0">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-bold text-base text-gray-900 truncate">TourGuide CRM</h1>
            <p className="text-xs text-gray-600 truncate">Guia Turístico</p>
          </div>
        </div>

        {/* Navegação */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
            Navegação
          </h3>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-green-700' : 'text-gray-500'}`} />
                  <span className="truncate">{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Status Atual
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Avaliação:</span>
              <span className="font-medium text-green-600">4.8 ⭐</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Este mês:</span>
              <span className="font-medium text-blue-600">12 passeios</span>
            </div>
          </div>
        </div>

        {/* Perfil do usuário */}
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-white">
                {user?.nome?.charAt(0)?.toUpperCase() || 'G'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.nome || 'Guia'}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {user?.email || 'guia@turguide.com'}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-center hover:bg-gray-100" 
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuiaSidebar;