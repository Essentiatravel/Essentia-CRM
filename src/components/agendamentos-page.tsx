"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Home,
  Calendar,
  CalendarDays,
  Users,
  Heart,
  DollarSign,
  LogOut,
  Plus,
  User,
  MapPin as Location,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import NovaTarefaModal, { type NovaTarefaData } from "./nova-tarefa-modal";
import { toast } from "sonner";

type Status = "em_progresso" | "pendente_cliente" | "confirmadas" | "concluidas" | "canceladas";

interface Tarefa {
  id: string;
  passeio_id: string;
  cliente_id: string | null;
  guia_id?: string | null;
  data_passeio: string;
  numero_pessoas: number;
  valor_total: number;
  valor_comissao: number;
  percentual_comissao?: number;
  status: Status;
  observacoes?: string | null;
  passeio_nome?: string | null;
  cliente_nome?: string | null;
  guia_nome?: string | null;
}

interface Passeio {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao: string;
  categoria: string;
}

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}

interface Guia {
  id: string;
  nome: string;
  email: string;
  especialidades: string[];
}

const ALLOWED_STATUSES: Status[] = [
  "em_progresso",
  "pendente_cliente",
  "confirmadas",
  "concluidas",
  "canceladas",
];

const toNumber = (value: unknown, fallback = 0): number => {
  const numeric = Number(value);
  return Number.isNaN(numeric) ? fallback : numeric;
};

const toStringOrNull = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  return String(value);
};

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map((item) => String(item)) : value.split(",").map((item) => item.trim());
    } catch {
      return value.split(",").map((item) => item.trim());
    }
  }

  return [];
};

const toStatus = (value: unknown): Status => {
  if (typeof value === "string") {
    const normalized = value as Status;
    if (ALLOWED_STATUSES.includes(normalized)) {
      return normalized;
    }

    switch (value) {
      case "pendente":
        return "pendente_cliente";
      case "concluido":
        return "concluidas";
      default:
        break;
    }
  }

  return "em_progresso";
};

const normalizePasseio = (passeio: any): Passeio => ({
  id: String(passeio?.id ?? ""),
  nome: String(passeio?.nome ?? "Passeio"),
  descricao: String(passeio?.descricao ?? ""),
  preco: toNumber(passeio?.preco, 0),
  duracao: String(passeio?.duracao ?? ""),
  categoria: String(passeio?.categoria ?? ""),
});

const normalizeCliente = (cliente: any): Cliente => ({
  id: String(cliente?.id ?? ""),
  nome: String(cliente?.nome ?? ""),
  email: String(cliente?.email ?? ""),
  telefone: String(cliente?.telefone ?? ""),
});

const normalizeGuia = (guia: any): Guia => ({
  id: String(guia?.id ?? ""),
  nome: String(guia?.nome ?? ""),
  email: String(guia?.email ?? ""),
  especialidades: toStringArray(guia?.especialidades),
});

const normalizeAgendamento = (
  agendamento: any,
  collections: { passeios: Passeio[]; clientes: Cliente[]; guias: Guia[] },
  fallbackIndex = 0,
): Tarefa => {
  const passeioId = String(agendamento?.passeio_id ?? agendamento?.passeioId ?? "");
  const clienteIdRaw = agendamento?.cliente_id ?? agendamento?.clienteId ?? null;
  const guiaIdRaw = agendamento?.guia_id ?? agendamento?.guiaId ?? null;

  const passeio = collections.passeios.find((p) => p.id === passeioId);
  const cliente = clienteIdRaw ? collections.clientes.find((c) => c.id === String(clienteIdRaw)) : undefined;
  const guia = guiaIdRaw ? collections.guias.find((g) => g.id === String(guiaIdRaw)) : undefined;

  return {
    id: String(agendamento?.id ?? `agendamento-${fallbackIndex}`),
    passeio_id: passeioId,
    cliente_id: clienteIdRaw ? String(clienteIdRaw) : null,
    guia_id: guiaIdRaw ? String(guiaIdRaw) : null,
    data_passeio: String(agendamento?.data_passeio ?? agendamento?.dataPasseio ?? ""),
    numero_pessoas: toNumber(agendamento?.numero_pessoas ?? agendamento?.numeroPessoas, 1),
    valor_total: toNumber(agendamento?.valor_total ?? agendamento?.valorTotal, 0),
    valor_comissao: toNumber(agendamento?.valor_comissao ?? agendamento?.valorComissao, 0),
    percentual_comissao: toNumber(agendamento?.percentual_comissao ?? agendamento?.percentualComissao, 30),
    status: toStatus(agendamento?.status),
    observacoes: toStringOrNull(agendamento?.observacoes),
    passeio_nome: passeio?.nome ?? toStringOrNull(agendamento?.passeio_nome),
    cliente_nome: cliente?.nome ?? toStringOrNull(agendamento?.cliente_nome),
    guia_nome: guia?.nome ?? toStringOrNull(agendamento?.guia_nome),
  };
};

const columns: { id: Status; title: string }[] = [
  { id: "em_progresso", title: "Em Progresso" },
  { id: "pendente_cliente", title: "Pendente Cliente" },
  { id: "confirmadas", title: "Confirmadas" },
  { id: "concluidas", title: "Concluídas" },
  { id: "canceladas", title: "Canceladas" },
];

const getStatusColor = (status: string) => {
  const colors = {
    "em_progresso": "text-purple-600 bg-purple-50",
    "pendente_cliente": "text-yellow-600 bg-yellow-50",
    "confirmadas": "text-green-600 bg-green-50",
    "concluidas": "text-blue-600 bg-blue-50",
    "canceladas": "text-red-600 bg-red-50"
  };
  return colors[status as keyof typeof colors] || colors.em_progresso;
};

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
            { icon: Calendar, label: "Agendamentos", href: "/admin/agendamentos", active: true },
            { icon: CalendarDays, label: "Calendário Global", href: "/admin/calendario" },
            { icon: Users, label: "Guias", href: "/admin/guias" },
            { icon: Heart, label: "Clientes", href: "/admin/clientes" },
            { icon: MapPin, label: "Passeios", href: "/admin/passeios" },
            { icon: DollarSign, label: "Financeiro", href: "/admin/financeiro" },
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

const TaskCard: React.FC<{ 
  tarefa: Tarefa; 
  index: number; 
  onEdit: (tarefa: Tarefa) => void;
  onAprovar: (id: string) => void;
  onRemover: (id: string) => void;
}> = ({ tarefa, index, onEdit, onAprovar, onRemover }) => (
  <Draggable draggableId={tarefa.id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`bg-white rounded-lg border p-4 mb-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
          snapshot.isDragging ? 'shadow-lg' : ''
        }`}
        style={{
          width: '400px',
          minHeight: '200px',
          ...provided.draggableProps.style,
        }}
        onClick={() => onEdit(tarefa)}
      >
        <div className="flex items-start justify-between mb-2">
          <Badge className={`${getStatusColor(tarefa.status)} border-0 text-xs`}>
            {tarefa.status.replace('_', ' ')}
          </Badge>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(tarefa);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
            {tarefa.status !== 'confirmadas' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onAprovar(tarefa.id);
                }}
                title="Aprovar e enviar para calendário"
              >
                <Calendar className="h-3 w-3" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                onRemover(tarefa.id);
              }}
              title="Remover agendamento"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <h3 className="font-medium text-gray-900 mb-2">{tarefa.passeio_nome || 'Passeio não encontrado'}</h3>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-3 w-3" />
            <span>{tarefa.cliente_nome || 'Sem cliente definido'}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Location className="h-3 w-3" />
            <span>{tarefa.guia_nome || 'Sem guia definido'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-3 w-3" />
            <span>{tarefa.data_passeio ? new Date(tarefa.data_passeio).toLocaleDateString('pt-BR') : 'Data não definida'}</span>
          </div>
          
          <div className="text-sm font-medium text-gray-900">
            R$ {(tarefa.valor_total || 0).toFixed(2)}
          </div>
        </div>

        {tarefa.observacoes && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {tarefa.observacoes}
          </p>
        )}

        <div className="flex justify-between text-xs text-gray-500">
          <span>{tarefa.numero_pessoas || 1} pessoa(s)</span>
          <span className="text-green-600 font-medium">
            Comissão: R$ {(tarefa.valor_comissao || 0).toFixed(2)}
          </span>
        </div>
      </div>
    )}
  </Draggable>
);

const AgendamentosPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTarefa, setEditingTarefa] = useState<Tarefa | null>(null);
  const [agendamentos, setAgendamentos] = useState<Tarefa[]>([]);
  const [passeios, setPasseios] = useState<Passeio[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [guias, setGuias] = useState<Guia[]>([]);
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(true);
  const [loadingPasseios, setLoadingPasseios] = useState(true);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [loadingGuias, setLoadingGuias] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPasseios = async (): Promise<Passeio[]> => {
    setLoadingPasseios(true);
    try {
      const response = await fetch('/api/passeios');
      if (!response.ok) {
        throw new Error('Falha ao carregar passeios');
      }
      const payload = await response.json();
      const mapped: Passeio[] = (Array.isArray(payload) ? payload : []).map(normalizePasseio);
      setPasseios(mapped);
      return mapped;
    } catch (error) {
      console.error('Erro ao carregar passeios:', error);
      toast.error('Não foi possível carregar os passeios.');
      setPasseios([]);
      return [];
    } finally {
      setLoadingPasseios(false);
    }
  };

  const fetchClientes = async (): Promise<Cliente[]> => {
    setLoadingClientes(true);
    try {
      const response = await fetch('/api/clientes');
      if (!response.ok) {
        throw new Error('Falha ao carregar clientes');
      }
      const payload = await response.json();
      const mapped: Cliente[] = (Array.isArray(payload) ? payload : []).map(normalizeCliente);
      setClientes(mapped);
      return mapped;
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast.error('Não foi possível carregar os clientes.');
      setClientes([]);
      return [];
    } finally {
      setLoadingClientes(false);
    }
  };

  const fetchGuias = async (): Promise<Guia[]> => {
    setLoadingGuias(true);
    try {
      const response = await fetch('/api/guias');
      if (!response.ok) {
        throw new Error('Falha ao carregar guias');
      }
      const payload = await response.json();
      const mapped: Guia[] = (Array.isArray(payload) ? payload : []).map(normalizeGuia);
      setGuias(mapped);
      return mapped;
    } catch (error) {
      console.error('Erro ao carregar guias:', error);
      toast.error('Não foi possível carregar os guias.');
      setGuias([]);
      return [];
    } finally {
      setLoadingGuias(false);
    }
  };

  const fetchAgendamentos = async (
    passeiosData: Passeio[] = passeios,
    clientesData: Cliente[] = clientes,
    guiasData: Guia[] = guias,
  ) => {
    setLoadingAgendamentos(true);
    try {
      const response = await fetch('/api/agendamentos', {
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (!response.ok) {
        throw new Error('Falha ao carregar agendamentos');
      }
      const payload = await response.json();
      const normalized: Tarefa[] = (Array.isArray(payload) ? payload : []).map((item: any, index: number) =>
        normalizeAgendamento(item, { passeios: passeiosData, clientes: clientesData, guias: guiasData }, index),
      );
      setAgendamentos(normalized);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      toast.error('Não foi possível carregar os agendamentos.');
      setAgendamentos([]);
    } finally {
      setLoadingAgendamentos(false);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [passeiosData, clientesData, guiasData] = await Promise.all([
          fetchPasseios(),
          fetchClientes(),
          fetchGuias(),
        ]);
        await fetchAgendamentos(passeiosData, clientesData, guiasData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetchAgendamentos = async () => {
    await fetchAgendamentos(passeios, clientes, guias);
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination || destination.droppableId === source.droppableId) {
      return;
    }

    const novoStatus = destination.droppableId as Status;

    try {
      setAgendamentos(prev =>
        prev.map(tarefa =>
          tarefa.id === draggableId ? { ...tarefa, status: novoStatus } : tarefa,
        ),
      );

      const response = await fetch(`/api/agendamentos/${draggableId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || 'Falha ao atualizar status');
      }

      toast.success('Status atualizado com sucesso.');
      await refetchAgendamentos();
    } catch (error) {
      console.error('Erro ao atualizar status do agendamento:', error);
      toast.error('Não foi possível atualizar o status.');
      await refetchAgendamentos();
    }
  };

  const getTarefasByStatus = (status: Status) => {
    return agendamentos.filter(agendamento => agendamento.status === status);
  };

  const buildPayloadFromModal = (data: NovaTarefaData) => ({
    passeioId: data.passeioId,
    clienteId: data.clienteId ?? null,
    guiaId: data.guiaId ?? null,
    dataPasseio: data.data,
    numeroPessoas: Number(data.numeroPessoas ?? 1),
    observacoes: data.observacoes ?? null,
    percentualComissao: data.comissaoPercentual,
  });

  const handleNovaTarefa = async (data: NovaTarefaData) => {
    if (!data?.passeioId || !data?.data) {
      toast.error('Selecione um passeio e informe a data.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/agendamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildPayloadFromModal(data)),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Falha ao criar agendamento.');
      }

      setAgendamentos(prev => [...prev, payload]);
      toast.success('Agendamento criado com sucesso.');
      setIsModalOpen(false);
      setEditingTarefa(null);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao criar agendamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditarTarefa = async (data: NovaTarefaData) => {
    if (!editingTarefa) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/agendamentos/${editingTarefa.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildPayloadFromModal(data)),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Falha ao atualizar agendamento.');
      }

      setAgendamentos(prev => prev.map(tarefa => (tarefa.id === payload.id ? payload : tarefa)));
      toast.success('Agendamento atualizado com sucesso.');
      setIsModalOpen(false);
      setEditingTarefa(null);
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar agendamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (tarefa: Tarefa) => {
    setEditingTarefa(tarefa);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) {
      return;
    }
    setIsModalOpen(false);
    setEditingTarefa(null);
  };

  const handleAprovarAgendamento = async (agendamentoId: string) => {
    try {
      const response = await fetch(`/api/agendamentos/${agendamentoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'confirmadas' as Status }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Falha ao aprovar agendamento.');
      }

      setAgendamentos(prev => prev.map(tarefa => (tarefa.id === payload.id ? payload : tarefa)));
      toast.success('Agendamento confirmado.');
    } catch (error) {
      console.error('Erro ao aprovar agendamento:', error);
      toast.error('Não foi possível aprovar o agendamento.');
    }
  };

  const handleRemoverAgendamento = async (agendamentoId: string) => {
    try {
      const response = await fetch(`/api/agendamentos/${agendamentoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || 'Falha ao remover agendamento.');
      }

      setAgendamentos(prev => prev.filter(tarefa => tarefa.id !== agendamentoId));
      toast.success('Agendamento removido com sucesso.');
    } catch (error) {
      console.error('Erro ao remover agendamento:', error);
      toast.error('Não foi possível remover o agendamento.');
    }
  };

  if (loadingAgendamentos || loadingPasseios || loadingClientes || loadingGuias) {
    return (
      <div className="min-h-screen bg-gray-50 lg:pl-10">
        <Sidebar user={user} onLogout={logout} />
        <div className="flex items-center justify-center px-4 py-10 lg:py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Carregando agendamentos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 lg:pl-10">
        <Sidebar user={user} onLogout={logout} />

        <div className="pl-2 pr-3 sm:pl-4 sm:pr-4 lg:pl-3 lg:pr-8 xl:pl-4 xl:pr-10 py-4 lg:py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Agendamentos
              </h1>
              <p className="text-gray-600 mt-1">
                Sistema Kanban para gerenciar o fluxo de trabalho.
              </p>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                setEditingTarefa(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </div>
          
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {columns.map((column) => (
                <div key={column.id} className="flex-shrink-0">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="font-semibold text-gray-900">{column.title}</h2>
                    <Badge variant="secondary" className="text-xs">
                      {getTarefasByStatus(column.id).length}
                    </Badge>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-screen w-96 p-2 rounded-lg transition-colors ${
                          snapshot.isDraggingOver ? 'bg-gray-100' : 'bg-transparent'
                        }`}
                      >
                        {getTarefasByStatus(column.id).map((tarefa, index) => (
                          <TaskCard 
                            key={tarefa.id} 
                            tarefa={tarefa} 
                            index={index} 
                            onEdit={handleEditClick}
                            onAprovar={handleAprovarAgendamento}
                            onRemover={handleRemoverAgendamento}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>

      <NovaTarefaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingTarefa ? handleEditarTarefa : handleNovaTarefa}
        passeios={passeios}
        clientes={clientes}
        guias={guias}
        editingTarefa={editingTarefa}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default AgendamentosPage;
