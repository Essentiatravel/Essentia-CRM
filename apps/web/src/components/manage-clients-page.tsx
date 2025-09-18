"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Home,
  Calendar,
  CalendarDays,
  Users,
  Heart,
  DollarSign,
  LogOut,
  Search,
  Star,
  TrendingUp,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
} from "lucide-react";
import AdminMobileNav from "./admin-mobile-nav";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  origin: string;
  status: string;
  interests: string[];
  type: "lead" | "client";
}

// Dados mockados dos leads
const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Lucas Almeida",
    email: "lucas.almeida@tourguide.com",
    phone: "+55 11 91234-5678",
    origin: "referral",
    status: "converted",
    interests: ["História", "Cultura"],
    type: "lead",
  },
  {
    id: "2",
    name: "Carla Moreira",
    email: "carla.moreira@tourguide.com",
    phone: "+55 21 92345-6789",
    origin: "referral",
    status: "converted",
    interests: ["Gastronomia", "Vinhos"],
    type: "lead",
  },
  {
    id: "3",
    name: "Rafael Santos",
    email: "rafael.santos@tourguide.com",
    phone: "+55 85 93456-7890",
    origin: "website",
    status: "converted",
    interests: ["Aventura", "Natureza"],
    type: "lead",
  },
  {
    id: "4",
    name: "Beatriz Ferreira",
    email: "beatriz.ferreira@tourguide.com",
    phone: "+55 31 94567-8901",
    origin: "referral",
    status: "converted",
    interests: ["História", "Arquitetura"],
    type: "lead",
  },
  {
    id: "5",
    name: "Diego Costa",
    email: "diego.costa@tourguide.com",
    phone: "+55 47 95678-9012",
    origin: "social_media",
    status: "converted",
    interests: ["Cultura", "Gastronomia"],
    type: "lead",
  },
  {
    id: "6",
    name: "Patricia Alves",
    email: "patricia.alves@tourguide.com",
    phone: "+55 11 96789-0123",
    origin: "website",
    status: "converted",
    interests: ["Romântico", "História"],
    type: "lead",
  },
  {
    id: "7",
    name: "Marcos Silva",
    email: "marcos.silva@tourguide.com",
    phone: "+55 21 97890-1234",
    origin: "referral",
    status: "converted",
    interests: ["Aventura", "Esportes"],
    type: "lead",
  },
  {
    id: "8",
    name: "Ana Paula",
    email: "ana.paula@tourguide.com",
    phone: "+55 85 98901-2345",
    origin: "social_media",
    status: "converted",
    interests: ["Cultura", "Arte"],
    type: "lead",
  },
  {
    id: "9",
    name: "Roberto Lima",
    email: "roberto.lima@tourguide.com",
    phone: "+55 31 99012-3456",
    origin: "website",
    status: "converted",
    interests: ["Gastronomia", "História"],
    type: "lead",
  },
  {
    id: "10",
    name: "Fernanda Costa",
    email: "fernanda.costa@tourguide.com",
    phone: "+55 47 90123-4567",
    origin: "referral",
    status: "converted",
    interests: ["Natureza", "Fotografia"],
    type: "lead",
  },
  {
    id: "11",
    name: "Carlos Eduardo",
    email: "carlos.eduardo@tourguide.com",
    phone: "+55 11 91234-5679",
    origin: "website",
    status: "converted",
    interests: ["História", "Arquitetura"],
    type: "lead",
  },
  {
    id: "12",
    name: "Juliana Santos",
    email: "juliana.santos@tourguide.com",
    phone: "+55 21 92345-6780",
    origin: "social_media",
    status: "converted",
    interests: ["Cultura", "Gastronomia"],
    type: "lead",
  },
  {
    id: "13",
    name: "Ricardo Oliveira",
    email: "ricardo.oliveira@tourguide.com",
    phone: "+55 85 93456-7891",
    origin: "referral",
    status: "converted",
    interests: ["Aventura", "Esportes"],
    type: "lead",
  },
  {
    id: "14",
    name: "Mariana Silva",
    email: "mariana.silva@tourguide.com",
    phone: "+55 31 94567-8902",
    origin: "website",
    status: "converted",
    interests: ["Romântico", "História"],
    type: "lead",
  },
  {
    id: "15",
    name: "Thiago Almeida",
    email: "thiago.almeida@tourguide.com",
    phone: "+55 47 95678-9013",
    origin: "social_media",
    status: "converted",
    interests: ["Natureza", "Fotografia"],
    type: "lead",
  },
  {
    id: "16",
    name: "Camila Ferreira",
    email: "camila.ferreira@tourguide.com",
    phone: "+55 11 96789-0124",
    origin: "referral",
    status: "converted",
    interests: ["Gastronomia", "Vinhos"],
    type: "lead",
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
            { icon: "Heart", label: "Clientes", active: true, href: "/admin/clientes" },
            { icon: "MapPin", label: "Passeios", active: false, href: "/admin/passeios" },
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
const ActionDropdown: React.FC<{ lead: Lead }> = ({ lead }) => {
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
                console.log("Visualizar lead:", lead.id);
                setIsOpen(false);
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </button>
            <button 
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                console.log("Editar lead:", lead.id);
                setIsOpen(false);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </button>
            <button 
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              onClick={() => {
                console.log("Excluir lead:", lead.id);
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

export default function ManageClientsPage() {
  const [activeTab, setActiveTab] = useState<"clients" | "leads">("leads");
  const [searchTerm, setSearchTerm] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar clientes do banco
  React.useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clientes');
        if (response.ok) {
          const data = await response.json();
          const formattedLeads: Lead[] = data.map((cliente: any) => ({
            id: cliente.id,
            name: cliente.nome,
            email: cliente.email,
            phone: cliente.telefone,
            origin: 'website', // Mock origin
            status: 'converted', // Mock status
            interests: cliente.preferencias ? JSON.parse(cliente.preferencias) : [],
            type: 'lead' as const,
          }));
          setLeads(formattedLeads);
        }
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Filtrar leads baseado no termo de busca
  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular métricas
  const totalClients = leads.filter(lead => lead.type === "client").length;
  const totalLeads = leads.filter(lead => lead.type === "lead").length;
  const convertedLeads = leads.filter(lead => lead.status === "converted").length;
  const newLeadsThisMonth = 2; // Mock data

  // Obter origem colorida
  const getOriginColor = (origin: string) => {
    switch (origin) {
      case "referral":
        return "bg-green-100 text-green-800";
      case "website":
        return "bg-blue-100 text-blue-800";
      case "social_media":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Obter status colorido
  const getStatusColor = (status: string) => {
    switch (status) {
      case "converted":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Navegação mobile */}
      <AdminMobileNav userName="ELISSON UZUAL" userEmail="uzualelisson@gmail.com" />
      
      {/* Barra lateral */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="flex-1 lg:ml-64 ml-0">
        <div className="p-4 lg:p-8">
          {/* Cabeçalho */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Gerenciar Clientes & Leads
            </h1>
            <p className="text-gray-600 mt-2">
              Visualize seus clientes ativos e leads em potencial.
            </p>
          </div>

          {/* Barra de busca */}
          <div className="flex justify-end mb-6">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome ou email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Cards de métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                    <p className="text-2xl font-bold text-gray-900">{totalClients}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-100">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                    <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-100">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Leads Convertidos</p>
                    <p className="text-2xl font-bold text-gray-900">{convertedLeads}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-100">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Novos Leads (Mês)</p>
                    <p className="text-2xl font-bold text-gray-900">{newLeadsThisMonth}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-100">
                    <Plus className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("clients")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "clients"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Clientes ({totalClients})
                </button>
                <button
                  onClick={() => setActiveTab("leads")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "leads"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Leads ({totalLeads})
                </button>
              </nav>
            </div>
          </div>

          {/* Tabela */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lead
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contato
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Origem
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interesses
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-blue-600">
                                {lead.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {lead.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                Lead potencial
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-900">
                              <Mail className="h-4 w-4 text-gray-400 mr-2" />
                              {lead.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="h-4 w-4 text-gray-400 mr-2" />
                              {lead.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant="secondary" 
                            className={getOriginColor(lead.origin)}
                          >
                            {lead.origin}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant="secondary" 
                            className={getStatusColor(lead.status)}
                          >
                            {lead.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {lead.interests.slice(0, 2).map((interest, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                            {lead.interests.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{lead.interests.length - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <ActionDropdown lead={lead} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
