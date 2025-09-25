"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  MapPin,
  Clock,
  DollarSign,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Home,
  Calendar,
  CalendarDays,
  Users,
  Heart,
  LogOut,
} from "lucide-react";
import AdminMobileNav from "./admin-mobile-nav";
import AddTourModal from "./add-tour-modal";

interface Tour {
  id: string;
  name: string;
  location: string;
  price: number;
  duration: number;
  status: string;
  type: string;
}

// Dados mockados dos passeios
const mockTours: Tour[] = [
  {
    id: "1",
    name: "City Tour Histórico",
    location: "Centro Histórico",
    price: 150.00,
    duration: 4,
    status: "Ativo",
    type: "Histórico",
  },
  {
    id: "2",
    name: "Aventura na Natureza",
    location: "Parque Nacional",
    price: 280.00,
    duration: 8,
    status: "Ativo",
    type: "Aventura",
  },
  {
    id: "3",
    name: "Tour Gastronômico",
    location: "Distrito Gastronômico",
    price: 200.00,
    duration: 5,
    status: "Ativo",
    type: "Gastronômico",
  },
  {
    id: "4",
    name: "Passeio Cultural",
    location: "Bairro Cultural",
    price: 180.00,
    duration: 6,
    status: "Ativo",
    type: "Cultural",
  },
  {
    id: "5",
    name: "Vida Noturna Premium",
    location: "Centro de Entretenimento",
    price: 250.00,
    duration: 6,
    status: "Ativo",
    type: "Romântico",
  },
  {
    id: "6",
    name: "Tour pelo Centro Histórico",
    location: "Centro Histórico",
    price: 75.00,
    duration: 3,
    status: "Ativo",
    type: "Histórico",
  },
  {
    id: "7",
    name: "Aventura na Floresta",
    location: "Parque Nacional",
    price: 120.00,
    duration: 6,
    status: "Ativo",
    type: "Natureza",
  },
  {
    id: "8",
    name: "Tour Gastronômico",
    location: "Mercado Central",
    price: 95.00,
    duration: 4,
    status: "Ativo",
    type: "Gastronômico",
  },
];

// Componente da barra lateral
const Sidebar: React.FC = () => (
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
          {[
            { icon: "Home", label: "Dashboard", active: false, href: "/admin" },
            { icon: "Calendar", label: "Agendamentos", active: false, href: "/admin/agendamentos" },
            { icon: "CalendarDays", label: "Calendário Global", active: false, href: "/admin/calendario" },
            { icon: "Users", label: "Guias", active: false, href: "/admin/guias" },
            { icon: "Heart", label: "Clientes", active: false, href: "/admin/clientes" },
            { icon: "MapPin", label: "Passeios", active: true, href: "/admin/passeios" },
            { icon: "DollarSign", label: "Financeiro", active: false, href: "/admin/financeiro" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
                             {item.icon === "Home" && <Home className="h-4 w-4" />}
               {item.icon === "Calendar" && <Calendar className="h-4 w-4" />}
               {item.icon === "CalendarDays" && <CalendarDays className="h-4 w-4" />}
               {item.icon === "Users" && <Users className="h-4 w-4" />}
               {item.icon === "Heart" && <Heart className="h-4 w-4" />}
               {item.icon === "MapPin" && <MapPin className="h-4 w-4" />}
               {item.icon === "DollarSign" && <DollarSign className="h-4 w-4" />}
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Perfil do usuário */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">E</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">ELISSON UZUAL</p>
            <p className="text-xs text-gray-600">uzualelisson@gmail.com</p>
          </div>
        </div>
                 <Button variant="outline" size="sm" className="w-full">
           <LogOut className="h-4 w-4 mr-2" />
           Sair
         </Button>
      </div>
    </div>
  </div>
);

// Componente do dropdown de ações
const ActionDropdown: React.FC<{ tour: Tour }> = ({ tour }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Fechar dropdown quando clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative dropdown-container">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 p-0"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
          <div className="py-1">
            <button 
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                console.log("Visualizar passeio:", tour.id);
                setIsOpen(false);
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </button>
            <button 
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                console.log("Editar passeio:", tour.id);
                setIsOpen(false);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </button>
            <button 
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              onClick={() => {
                console.log("Excluir passeio:", tour.id);
                setIsOpen(false);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ManageToursPage() {
  const [isAddTourModalOpen, setIsAddTourModalOpen] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar passeios do banco
  React.useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('/api/passeios');
        if (response.ok) {
          const data = await response.json();
          const formattedTours: Tour[] = data.map((passeio: any) => ({
            id: passeio.id,
            name: passeio.nome,
            location: passeio.categoria,
            price: passeio.preco,
            duration: parseInt(passeio.duracao.replace('h', '')),
            status: passeio.ativo ? 'Ativo' : 'Inativo',
            type: passeio.categoria,
          }));
          setTours(formattedTours);
        }
      } catch (error) {
        console.error('Erro ao carregar passeios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const handleAddTour = async (tourData: any) => {
    try {
      const response = await fetch('/api/passeios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tourData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Passeio criado:', result);
        // Recarregar a página para mostrar o novo passeio
        window.location.reload();
      } else {
        console.error('Erro ao criar passeio');
      }
    } catch (error) {
      console.error('Erro ao criar passeio:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Navegação mobile */}
      <AdminMobileNav 
        userName="ELISSON UZUAL" 
        userEmail="uzualelisson@gmail.com"
        onLogout={() => window.location.href = '/api/logout'} 
      />
      
      {/* Barra lateral */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="flex-1 lg:ml-64 ml-0">
        <div className="p-4 lg:p-8">
          {/* Cabeçalho */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Gerenciar Passeios
            </h1>
            <p className="text-gray-600 mt-2">
              Adicione, edite e organize todos os passeios oferecidos.
            </p>
          </div>

          {/* Botão Novo Passeio */}
          <div className="flex justify-end mb-6">
            <Button
              onClick={() => setIsAddTourModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Passeio
            </Button>
          </div>

          {/* Tabela de Passeios */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando passeios...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Passeio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Local
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Preço
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duração
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tours.map((tour) => (
                        <tr key={tour.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {tour.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {tour.type}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">
                                {tour.location}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-900">
                                R$ {tour.price.toFixed(2)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-900">
                                {tour.duration}h
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              variant="secondary" 
                              className={`${
                                tour.status === "Ativo" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {tour.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <ActionDropdown tour={tour} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal para adicionar passeio */}
      <AddTourModal
        isOpen={isAddTourModalOpen}
        onClose={() => setIsAddTourModalOpen(false)}
        onSubmit={handleAddTour}
      />
    </div>
  );
}
