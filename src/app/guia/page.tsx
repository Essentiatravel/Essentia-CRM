"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, DollarSign, Star, Clock, MapPin, Phone } from 'lucide-react';

interface GuiaStats {
  totalAgendamentos: number;
  agendamentosMes: number;
  receitaMes: number;
  avaliacaoMedia: number;
  totalAvaliacoes: number;
}

interface Agendamento {
  id: string;
  passeio_nome: string;
  cliente_nome: string;
  cliente_telefone: string;
  data_passeio: string;
  horario_inicio: string;
  horario_fim: string;
  numero_pessoas: number;
  valor_total: number;
  valor_comissao: number;
  status: string;
  observacoes?: string;
}

interface DashboardData {
  stats: GuiaStats;
  agendamentos: {
    pendentes: Agendamento[];
    confirmados: Agendamento[];
    emAndamento: Agendamento[];
    concluidos: Agendamento[];
    cancelados: Agendamento[];
  };
}

export default function GuiaDashboard() {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/guia/dashboard?guiaId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados quando o componente montar
  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'pendente': { label: 'Pendente', variant: 'secondary' as const },
      'confirmadas': { label: 'Confirmado', variant: 'default' as const },
      'em_progresso': { label: 'Em Andamento', variant: 'default' as const },
      'concluido': { label: 'Concluído', variant: 'default' as const },
      'cancelado': { label: 'Cancelado', variant: 'destructive' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Erro ao carregar dados do dashboard</p>
          <Button onClick={fetchDashboardData} className="mt-4">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard do Guia</h1>
        <p className="text-gray-600">
          Bem-vindo, {user?.nome}! Aqui você pode acompanhar seus agendamentos e comissões.
        </p>
      </div>

      {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Passeios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.totalAgendamentos}</div>
              <p className="text-xs text-muted-foreground">
                Passeios concluídos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.agendamentosMes}</div>
              <p className="text-xs text-muted-foreground">
                Passeios agendados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita do Mês</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(dashboardData.stats.receitaMes)}</div>
              <p className="text-xs text-muted-foreground">
                Comissões recebidas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.stats.avaliacaoMedia.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.stats.totalAvaliacoes} avaliações
              </p>
            </CardContent>
          </Card>
        </div>

      {/* Agendamentos por Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Próximos Passeios */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Passeios</CardTitle>
              <CardDescription>
                Passeios confirmados e em andamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...dashboardData.agendamentos.confirmados, ...dashboardData.agendamentos.emAndamento]
                  .slice(0, 5)
                  .map((agendamento) => (
                    <div key={agendamento.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{agendamento.passeio_nome}</h4>
                        {getStatusBadge(agendamento.status)}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(agendamento.data_passeio)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {agendamento.horario_inicio} - {agendamento.horario_fim}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {agendamento.numero_pessoas} pessoas
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {agendamento.cliente_nome}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {agendamento.cliente_telefone}
                        </div>
                        <div className="font-medium text-green-600">
                          Comissão: {formatCurrency(agendamento.valor_comissao)}
                        </div>
                      </div>
                    </div>
                  ))}
                {[...dashboardData.agendamentos.confirmados, ...dashboardData.agendamentos.emAndamento].length === 0 && (
                  <p className="text-gray-500 text-center py-4">Nenhum passeio próximo</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Passeios Pendentes */}
          <Card>
            <CardHeader>
              <CardTitle>Passeios Pendentes</CardTitle>
              <CardDescription>
                Aguardando confirmação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.agendamentos.pendentes.slice(0, 5).map((agendamento) => (
                  <div key={agendamento.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{agendamento.passeio_nome}</h4>
                      {getStatusBadge(agendamento.status)}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(agendamento.data_passeio)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {agendamento.horario_inicio} - {agendamento.horario_fim}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {agendamento.numero_pessoas} pessoas
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {agendamento.cliente_nome}
                      </div>
                      <div className="font-medium text-blue-600">
                        Valor Total: {formatCurrency(agendamento.valor_total)}
                      </div>
                    </div>
                  </div>
                ))}
                {dashboardData.agendamentos.pendentes.length === 0 && (
                  <p className="text-gray-500 text-center py-4">Nenhum passeio pendente</p>
                )}
              </div>
            </CardContent>
          </Card>
      </div>
    </>
  );
}
