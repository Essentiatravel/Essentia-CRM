"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  X,
  Home,
  Calendar,
  CalendarDays,
  Users,
  Heart,
  MapPin,
  DollarSign,
  LogOut,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileNavProps {
  userName: string;
  userEmail: string;
}

export const AdminMobileNav: React.FC<MobileNavProps> = ({
  userName,
  userEmail,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: Calendar, label: "Agendamentos" },
    { icon: CalendarDays, label: "Calendário Global" },
    { icon: Users, label: "Guias" },
    { icon: Heart, label: "Clientes" },
    { icon: MapPin, label: "Passeios" },
    { icon: DollarSign, label: "Financeiro" },
  ];

  return (
    <>
      {/* Botão do menu mobile */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay do menu mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Menu mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-64 bg-white z-50 lg:hidden"
          >
            <div className="p-6 h-full flex flex-col">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-8">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg text-gray-900">
                    TourGuide CRM
                  </h1>
                  <p className="text-sm text-gray-600">Administrador</p>
                </div>
              </div>

              {/* Navegação */}
              <div className="flex-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Navegação
                </h3>
                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <a
                      key={item.label}
                      href="#"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        item.active
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Perfil do usuário */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {userName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {userName}
                    </p>
                    <p className="text-xs text-gray-600">{userEmail}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminMobileNav;

