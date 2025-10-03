"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsClient, formatCurrency } from "@/lib/format-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  User, 
  Users, 
  DollarSign,
  Clock,
  Home,
  CalendarDays,
  Users as UsersIcon,
  Heart,
  MapPin as MapPinIcon,
  DollarSign as DollarSignIcon,
  LogOut
} from "lucide-react";

interface Agendamento {
  id: string;
  passeio_nome?: string;
  cliente_nome?: string;
  guia_nome?: string;
  data_passeio: string;
  horario_inicio?: string;
  horario_fim?: string;
  numero_pessoas: number;
  valor_total: number;
  observacoes?: string;
  status: string;
}

const Sidebar: React.FC<{ user: any; onLogout: () => Promise<void> }> = ({ user, onLogout }) => (
  <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0">
    <div className="p-6">
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-blue-600 rounded-lg">
          <MapPin className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-gray-900">TourGuide CRM</h1>
          <p className="text-sm text-gray-600">Administrador</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          NAVEGAÇÃO
        </h3>
        <nav className="space-y-2">
          {[
            { icon: Home, label: "Dashboard", href: "/admin" },
            { icon: Calendar, label: "Agendamentos", href: "/admin/agendamentos" },
            { icon: CalendarDays, label: "Calendário Global", href: "/admin/calendario", active: true },
            { icon: UsersIcon, label: "Guias", href: "/admin/guias" },
            { icon: Heart, label: "Clientes", href: "/admin/clientes" },
            { icon: MapPinIcon, label: "Passeios", href: "/admin/passeios" },
            { icon: DollarSignIcon, label: "Financeiro", href: "/admin/financeiro" },
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
              <item.icon className="h-4 w-4" />
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {user?.nome?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{user?.nome || 'Administrador'}</p>
            <p className="text-xs text-gray-600">{user?.email || 'admin@turguide.com'}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  </div>
);

const CalendarioGlobal: React.FC = () => {
  const { user, logout } = useAuth();
  const isClient = useIsClient();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 1, 1)); // Fevereiro 2025
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar agendamentos confirmados
  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
        
        const response = await fetch('/api/agendamentos', {
          signal: controller.signal,
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          
          // Filtrar apenas agendamentos confirmados
          const confirmados = data.filter((agendamento: Agendamento) => 
            agendamento.status === 'confirmadas'
          );
          setAgendamentos(confirmados);
        } else {
          console.error('Erro na resposta da API:', response.status);
          setAgendamentos([]);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.error('Timeout ao carregar agendamentos do calendário');
        } else {
          console.error('Erro ao carregar agendamentos:', error);
        }
        setAgendamentos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgendamentos();
  }, []);

  // Navegação do calendário
  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Gerar dias do mês
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Adicionar dias vazios do início
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Adicionar dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Obter eventos para um dia específico
  const getEventsForDay = (date: Date) => {
    return agendamentos.filter(agendamento => {
      const eventDate = new Date(agendamento.data_passeio);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Formatar hora
  const formatTime = (time?: string) => {
    if (!time) return '';
    return time.slice(0, 5); // Remove segundos
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  }).replace(/^\w/, c => c.toUpperCase());

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar user={user} onLogout={logout} />
        <div className="flex-1 lg:ml-64 ml-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Carregando calendário...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} onLogout={logout} />
      
      <div className="flex-1 lg:ml-64 ml-0">
        <div className="p-4 lg:p-8">
          {/* Cabeçalho */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Calendário Global
              </h1>
              <p className="text-gray-600 mt-1">
                Visualize todos os agendamentos confirmados em um calendário unificado.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={goToToday}>
                Hoje
              </Button>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                variant="outline" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.location.href = '/admin/agendamentos'}
              >
                Gerenciar Agendamentos
              </Button>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total de Agendamentos</p>
                    <p className="text-xl font-bold text-gray-900">{agendamentos.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total de Pessoas</p>
                    <p className="text-xl font-bold text-gray-900">
                      {agendamentos.reduce((sum, agendamento) => sum + agendamento.numero_pessoas, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Passeios Únicos</p>
                    <p className="text-xl font-bold text-gray-900">
                      {new Set(agendamentos.map(a => a.passeio_nome)).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Valor Total</p>
                    <p className="text-xl font-bold text-gray-900">
                      R$ {agendamentos.reduce((sum, agendamento) => sum + agendamento.valor_total, 0).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendário */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center text-xl font-semibold">
                {monthName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Cabeçalho dos dias da semana */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* Grade do calendário */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  const events = day ? getEventsForDay(day) : [];
                  const isToday = isClient && day ? day.toDateString() === new Date().toDateString() : false;
                  const isCurrentMonth = day ? day.getMonth() === currentDate.getMonth() : false;

                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] p-2 border border-gray-200 ${
                        isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
                      } ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}`}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-medium mb-1 ${
                            isToday ? 'text-blue-600' : ''
                          }`}>
                            {day.getDate()}
                          </div>
                          
                          <div className="space-y-1">
                            {events.map(evento => (
                              <div
                                key={evento.id}
                                className="bg-blue-100 border border-blue-200 rounded p-1 text-xs cursor-pointer hover:bg-blue-200 transition-colors"
                                title={`${evento.passeio_nome} - ${evento.cliente_nome} - ${evento.guia_nome}`}
                              >
                                <div className="font-medium text-blue-800 truncate">
                                  {evento.passeio_nome}
                                </div>
                                <div className="text-blue-600 truncate">
                                  {evento.cliente_nome}
                                </div>
                                {evento.horario_inicio && (
                                  <div className="text-blue-500 text-xs">
                                    {formatTime(evento.horario_inicio)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Lista de eventos do mês */}
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos Confirmados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agendamentos
                  .sort((a, b) => new Date(a.data_passeio).getTime() - new Date(b.data_passeio).getTime())
                  .map(agendamento => (
                    <div
                      key={agendamento.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {new Date(agendamento.data_passeio).getDate()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(agendamento.data_passeio).toLocaleDateString('pt-BR', { month: 'short' })}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-gray-900">{agendamento.passeio_nome || 'Passeio não definido'}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {agendamento.cliente_nome || 'Cliente não definido'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {agendamento.guia_nome || 'Guia não definido'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {agendamento.numero_pessoas} pessoa(s)
                            </span>
                            {agendamento.horario_inicio && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(agendamento.horario_inicio)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-medium text-green-600">
                          {formatCurrency(agendamento.valor_total)}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Confirmado
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export { CalendarioGlobal };
